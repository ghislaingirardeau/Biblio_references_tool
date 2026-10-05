<template>
  <q-page class="p-2">
    <q-toggle
      v-if="quotes && quotes.length && !loadingQuotes"
      v-model="isQuoteExpanded"
      color="primary"
      label="Expand quote"
      left-label
    />
    <ElementFromExtension />

    <div v-if="quotes && quotes.length" class="row q-col-gutter-md q-pa-md">
      <div v-if="loadingQuotes" class="col-12 flex justify-center">
        <q-spinner color="primary" size="3em" />
      </div>

      <div v-else class="col-12 col-md-4" v-for="(quote, index) in quotes" :key="quote.id!">
        <q-card class="full-height flex flex-col justify-between">
          <q-card-section>
            <div
              :class="{ 'truncate-2-lines': !isQuoteExpanded }"
              ref="quote-content"
              v-html="quote.content"
              class="mb-2"
            ></div>

            <div class="my-2">
              <span class="text-h7 italic mr-2">P. {{ quote.page }}</span>

              <q-chip
                v-for="tag in quote.tag"
                :key="tag"
                size="sm"
                outline
                square
                color="secondary"
                text-color="white"
                icon="bookmark"
              >
                {{ tag }}
              </q-chip>
            </div>
          </q-card-section>

          <q-card-actions class="border-t-2 border-indigo-500">
            <q-btn
              dense
              flat
              round
              color="primary"
              :icon="mdiContentCopy"
              @click.stop="copyQuote(index)"
            >
              <q-tooltip :class="{ 'bg-green': copied }" :offset="[10, 10]">
                {{ copied ? 'Copied in clipboard' : 'Copy' }}
              </q-tooltip>
            </q-btn>

            <q-btn
              dense
              flat
              round
              color="primary"
              icon="edit"
              @click.stop="modalEdit(quote, false)"
            >
              <q-tooltip class="" :offset="[10, 10]"> Edit </q-tooltip>
            </q-btn>
            <q-btn
              :loading="removingQuote"
              :disable="removingQuote"
              dense
              flat
              round
              color="primary"
              icon="delete"
              @click.stop="askConfirmation(quote.id!)"
            >
              <q-tooltip class="" :offset="[10, 10]"> Remove </q-tooltip>
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div v-else>No quote saved !</div>

    <AddWidget />

    <EditModal
      v-model:showEditModal="showEditModal"
      v-model:selectedQuote="selectedQuote!"
      @confirm-edit="confirmEdit"
      :isReadonly="isReadonly"
    />

    <ConfirmModal v-model:showConfirmModal="showConfirmModal" @confirm="deleteQuote">
      <template v-slot:message> Are you sure to delete this quote ? </template>
    </ConfirmModal>
  </q-page>
</template>

<script setup lang="ts">
/* TODO
- not possible to add or click on extraction from extension (use inner loading quasar) ?
*/

import { mdiContentCopy } from '@quasar/extras/mdi-v7';
import ConfirmModal from 'src/components/ConfirmModal.vue';
import EditModal from 'src/components/EditModal.vue';
import { useModalReferenceStore } from 'src/stores/modalReferences';
import { useQuotesStore } from 'src/stores/quotes';
import type { Quote } from 'src/types/references';
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import { useRoute } from 'vue-router';
import { useClipboard, useTemplateRefsList } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import AddWidget from 'src/components/AddWidget.vue';
import ElementFromExtension from 'src/components/ExtractFromExtension/ElementFromExtension.vue';
import { isElectron } from 'src/utils/useElectron';

const QuotesStore = useQuotesStore();
const { loadingQuotes, removingQuote } = storeToRefs(QuotesStore);
const ModalReference = useModalReferenceStore();
const { isReadonly } = storeToRefs(ModalReference);

const { copy, copied } = useClipboard();

const route = useRoute();
const showEditModal = ref(false);
const selectedQuote = ref<Quote | null>(null);
const showConfirmModal = ref(false);
const selectedQuoteId = ref<null | string>(null);
const isQuoteExpanded = ref(true);
const quoteContent = useTemplateRef<HTMLDivElement[]>('quote-content');

const quotes = computed(() => {
  if (Array.isArray(QuotesStore.filteredQuotes)) {
    return QuotesStore.filteredQuotes as Quote[];
  }
  return QuotesStore.quotes ?? [];
});

async function copyQuote(index: number) {
  const quote = quoteContent.value![index]!.outerText;
  if (quote) await copy(quote);
}

function askConfirmation(id: string) {
  showConfirmModal.value = true;
  selectedQuoteId.value = id;
}

async function deleteQuote() {
  selectedQuoteId.value
    ? await QuotesStore.removeQuote(route.params.id as string, selectedQuoteId.value)
    : null;
  selectedQuoteId.value = null;
}

function modalEdit(quote: Quote, modeReadonly: boolean) {
  isReadonly.value = modeReadonly;
  showEditModal.value = true;
  selectedQuote.value = quote;
}

function confirmEdit() {
  selectedQuote.value = null;
}

onMounted(async () => {
  await QuotesStore.loadQuotes(route.params.id as string);
});
</script>

<style scoped lang="scss">
:deep() {
  .truncate-2-lines {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 3em; /* Adjust based on line-height */
    & p {
      margin-bottom: 8px;
    }
  }
}
</style>
