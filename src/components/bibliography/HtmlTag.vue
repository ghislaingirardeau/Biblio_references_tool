<script lang="ts">
import { h } from 'vue';

const DynamicHtmlTag = (props: { tag: string }, context: { attrs: any; slots: string }) => {
  return h(`${props.tag}`, context.attrs, context.slots);
};

DynamicHtmlTag.props = ['tag'];

export default DynamicHtmlTag;
</script>
