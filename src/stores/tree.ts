import { defineStore, storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useProjectsStore } from './projects';
import { useRoute, useRouter } from 'vue-router';
import { format } from 'quasar';
import type { References } from 'src/types/references';

const ProjectsStore = useProjectsStore();
const { project } = storeToRefs(ProjectsStore);

const { capitalize } = format;

export const useTreeStore = defineStore('TreeStore', () => {
  const route = useRoute();
  const router = useRouter();
  const treeProjectView = computed(() => {
    const referencesString = Object.keys(project.value!.references) as Array<keyof References>;
    // if you are a routing menu
    const useRouteOnClick = route?.name === 'references';

    const formatTree = referencesString.map((refLabel) => {
      return {
        label: capitalize(refLabel),
        selectable: useRouteOnClick,
        handler: async (node: string) => {
          useRouteOnClick
            ? await router.push({ name: 'references-type', params: { type: refLabel } })
            : null;
        },
        children: project.value!.references[refLabel]?.lists.map((theRef) => {
          return {
            id: theRef.id,
            type: refLabel,
            label: theRef.title,
            selectable: true,
            handler: async (node: string) => {
              // if menu go to the route clicked else it's where I want to register the quote
              useRouteOnClick
                ? await router.push({
                    name: 'quotes-id',
                    params: { type: refLabel, id: theRef.id },
                  })
                : console.log(node);
            },
          };
        }),
      };
    });

    return [
      {
        label: 'References',
        selectable: false,
        children: formatTree.sort((a, b) => a.label.localeCompare(b.label)),
      },
    ];
  });

  return { treeProjectView };
});
