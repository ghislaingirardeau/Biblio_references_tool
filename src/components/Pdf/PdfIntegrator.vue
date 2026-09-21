<template>
  <div class="row q-col-gutter-md q-pa-md">
    <!-- 1. ZONE DE SÉLECTION DU FICHIER -->
    <div class="col-12" v-if="!pdfFileUrl">
      <q-file
        v-model="pickedFile"
        label="Drag or drop PDF File"
        outlined
        accept=".pdf"
        @update:model-value="onFileChange"
        lazy-rules
      >
        <template v-slot:prepend>
          <q-icon name="picture_as_pdf" color="primary" />
        </template>
      </q-file>
    </div>

    <!-- 2. ESPACE DE TRAVAIL UNIQUE APRÈS RECEPTION -->
    <template v-else>
      <!-- COLONNE GAUCHE : LECTEUR PDF -->
      <div class="col-12 col-md-8">
        <q-card outlined>
          <q-card-section class="row items-center justify-between q-py-xs bg-grey-2">
            <div class="row items-center q-gap-sm">
              <q-btn
                flat
                round
                icon="chevron_left"
                :disabled="currentPage <= 1"
                @click="changePage(-1)"
              />
              <span class="text-subtitle2">Page</span>
              <q-input
                v-model="currentPage"
                class="ml-2"
                dense
                borderless
                :max="totalPages"
                min="1"
                type="number"
                :style="{ width: '2.5rem' }"
                @blur="changePage(currentPage, true)"
                @keyup.enter="$event.target.blur()"
              /><span class="text-subtitle2">/ {{ totalPages }}</span>

              <q-btn
                flat
                round
                icon="chevron_right"
                :disabled="currentPage >= totalPages"
                @click="changePage(1)"
              />
            </div>
            <q-btn
              flat
              color="negative"
              icon="delete"
              label="Changer de document"
              @click="resetPdf"
            />
          </q-card-section>

          <q-card-section
            class="scroll-area flex justify-center q-pa-md bg-grey-3"
            style="max-height: 100vh; overflow-y: auto"
          >
            <!-- Conteneur global du PDF avec capture de sélection à la fin du geste de souris -->
            <div
              ref="pdfContainer"
              class="pdf-page-container"
              @mouseup="handleTextSelection"
              @touchend="handleTextSelection"
            >
              <!-- Rendu de l'image -->
              <canvas ref="pdfCanvas"></canvas>
              <!-- Couche interactive pour le texte -->
              <div ref="textContainer" class="text-layer"></div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- COLONNE DROITE : INTÉGRATION LOGIQUE -->
      <div class="col-12 col-md-4">
        <q-card outlined class="full-height">
          <q-card-section class="col q-pt-md">
            <q-input
              v-model="extractedText"
              type="textarea"
              outlined
              label="Text selected"
              rows="2"
              placeholder="Overline the text with the mouse to add"
            />
          </q-card-section>
          <q-card-section>
            <TreeProjectView />
          </q-card-section>

          <q-card-actions class="q-pa-md bg-grey-1">
            <q-btn
              color="positive"
              label="Save"
              icon="add_task"
              :loading="isSavingQuote"
              :disabled="!extractedText"
              @click="integrateTextToApp"
            />
          </q-card-actions>
        </q-card>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onBeforeUnmount } from 'vue';
import type { PDFDocumentProxy, PageViewport } from 'pdfjs-dist';
import TreeProjectView from 'src/components/TreeProjectView.vue';
import { storeToRefs } from 'pinia';
import { useTreeStore } from 'src/stores/tree.js';
import { useQuotesStore } from 'src/stores/quotes.js';
import type { Quote } from 'src/types/references.js';

const treeStore = useTreeStore();
const { textToExtractIn } = storeToRefs(treeStore);
const QuotesStore = useQuotesStore();

// Typage strict pour Quasar et les éléments HTML
const pickedFile = ref<File | null>(null);
const pdfFileUrl = ref<string | null>(null);
const currentPage = ref<number>(1);

const totalPages = ref<number>(0);
const extractedText = ref<string>('');
const isSavingQuote = ref(false);

const pdfCanvas = ref<HTMLCanvasElement | null>(null);
const pdfContainer = ref<HTMLDivElement | null>(null);
const textContainer = ref<HTMLDivElement | null>(null);

// Variable stockant l'instance globale du document PDF décodé
let pdfDoc: PDFDocumentProxy | null = null;

// Gestionnaire du changement de fichier local
const onFileChange = async (file: File | null) => {
  if (file) {
    // Évite les fuites mémoires si un fichier existait déjà
    if (pdfFileUrl.value) URL.revokeObjectURL(pdfFileUrl.value);

    pdfFileUrl.value = URL.createObjectURL(file);
    currentPage.value = 1;
    extractedText.value = '';
    await initPdfEngine();
  }
};

// Initialisation asynchrone sécurisée du moteur PDF.js
const initPdfEngine = async () => {
  if (!pdfFileUrl.value) return;

  try {
    // 1. Import dynamique exclusif côté client pour contourner le SSR Nuxt
    const pdfjsLib = await import('pdfjs-dist');

    // 2. Assignation de l'URL du Web Worker géré par le bundler Vite
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.mjs',
      import.meta.url,
    ).toString();

    // 3. Extraction du document binaire
    const loadingTask = pdfjsLib.getDocument({ url: pdfFileUrl.value });
    pdfDoc = await loadingTask.promise;
    totalPages.value = pdfDoc.numPages;

    // 4. Lancement du rendu de la première page
    await renderPage(currentPage.value);
  } catch (error) {
    console.error('Erreur lors du traitement binaire du PDF:', error);
  }
};

// Moteur de rendu graphique et textuel coordonné
const renderPage = async (pageNumber: number) => {
  if (!pdfDoc) return;

  try {
    const pdfjsLib = await import('pdfjs-dist');
    const page = await pdfDoc.getPage(pageNumber);

    // Échelle d'affichage (1.5 offre un excellent ratio netteté/performance)
    const scale = 1.5;
    const viewport: PageViewport = page.getViewport({ scale });

    // Attente de la mise à jour des Refs HTML par le DOM de Vue
    await nextTick();

    const canvas = pdfCanvas.value;
    const container = pdfContainer.value;
    const tLayer = textContainer.value;

    if (!canvas || !container || !tLayer) return;

    // Ajustement dimensionnel obligatoire du Canvas parent
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    container.style.width = `${viewport.width}px`;
    container.style.height = `${viewport.height}px`;

    // Étape A : Rendu visuel dans le Canvas
    const renderContext = {
      canvasContext: context,
      canvas,
      viewport: viewport,
    };
    await page.render(renderContext).promise;

    // Étape B : Rendu structurel de la text-layer (sélectionnable)
    const textContent = await page.getTextContent();

    tLayer.innerHTML = ''; // Reset complet de la page précédente
    tLayer.style.width = `${viewport.width}px`;
    tLayer.style.height = `${viewport.height}px`;

    const textLayer = new pdfjsLib.TextLayer({
      textContentSource: textContent,
      container: tLayer,
      viewport: viewport,
    });
    await textLayer.render();
  } catch (error) {
    console.error('Erreur lors du rendu de la page:', error);
  }
};

// Capture universelle de la sélection native du navigateur
const handleTextSelection = () => {
  const selection = window.getSelection();
  if (selection) {
    const text = selection.toString().trim();
    if (text.length > 0) {
      extractedText.value = text;
    }
  }
};

// Changement de page
const changePage = async (direction: number, isRandom: boolean = false) => {
  const targetPage = isRandom ? Number(direction) : currentPage.value + direction;
  if (targetPage >= 1 && targetPage <= totalPages.value) {
    currentPage.value = targetPage;
    await renderPage(currentPage.value);
  }
};

// Reset de la vue
const resetPdf = () => {
  if (pdfFileUrl.value) URL.revokeObjectURL(pdfFileUrl.value);
  pickedFile.value = null;
  pdfFileUrl.value = null;
  extractedText.value = '';
  pdfDoc = null;
};

// Envoi vers la reference demandée
const integrateTextToApp = async () => {
  if (!textToExtractIn.value) return;

  // Format the quote
  const newQuote = {
    id: Date.now().toString(),
    page: currentPage.value.toString(),
    content: extractedText.value,
    tag: null,
  } as Quote;

  // Save to the right place according to the tree selected
  isSavingQuote.value = true;
  await QuotesStore.addQuote(
    textToExtractIn.value?.type,
    textToExtractIn.value?.referenceId,
    newQuote,
  );
  isSavingQuote.value = false;
  textToExtractIn.value = null;
};

// Nettoyage de sécurité lors du démontage du composant
onBeforeUnmount(() => {
  if (pdfFileUrl.value) URL.revokeObjectURL(pdfFileUrl.value);
});
</script>

<style scoped lang="scss">
/* CSS FONDAMENTAL pour fusionner parfaitement le visuel et l'interactivité */
.pdf-page-container {
  position: relative;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  background-color: white;
}

.pdf-page-container canvas {
  display: block;
}

/* La couche de texte invisible calquée au pixel près au-dessus du canvas */
.text-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  opacity: 0.25; /* Rends la surbrillance bleue de sélection visible à l'écran */
  line-height: 1;
}

/* Éléments internes générés dynamiquement par le script renderTextLayer de Mozilla */
:deep(.text-layer span) {
  color: transparent;
  position: absolute;
  white-space: pre;
  cursor: text;
  transform-origin: 0% 0%;
}

/* Customisation esthétique de la couleur de sélection */
:deep(.text-layer ::selection) {
  background: rgba(var(--q-primary), 0.3);
}
</style>
