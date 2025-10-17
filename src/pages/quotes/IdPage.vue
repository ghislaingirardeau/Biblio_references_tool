<template>
  <q-page class="p-2">
    <q-toggle
      v-if="quotes && quotes.length"
      v-model="isQuoteExpanded"
      color="primary"
      label="Expand quote"
      left-label
    />
    <q-list v-if="quotes && quotes.length" bordered separator>
      <q-item clickable v-ripple v-for="(quote, index) in quotes" :key="quote.id!">
        <q-item-section @click="modalEdit(quote, true)" class="w-full">
          <q-item-label class="w-full">
            <div
              :class="{ 'truncate-2-lines': !isQuoteExpanded }"
              class="quote-content"
              v-html="quote.content"
            ></div>
          </q-item-label>
          <q-item-label class="flex items-center justify-between">
            <div>
              <span class="mr-4">Pages: {{ quote.page }}</span>
            </div>
            <div>
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
                dense
                flat
                round
                color="primary"
                icon="delete"
                @click.stop="askConfirmation(quote.id!)"
              >
                <q-tooltip class="" :offset="[10, 10]"> Remove </q-tooltip>
              </q-btn>
            </div>
          </q-item-label>

          <q-item-label
            ><q-chip
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
            </q-chip></q-item-label
          >
        </q-item-section>
      </q-item>
    </q-list>

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

const QuotesStore = useQuotesStore();
const ModalReference = useModalReferenceStore();
const { isReadonly } = storeToRefs(ModalReference);

const { copy, copied } = useClipboard();

const route = useRoute();
const showEditModal = ref(false);
const selectedQuote = ref<Quote | null>(null);
const showConfirmModal = ref(false);
const selectedQuoteId = ref<null | string>(null);
const isQuoteExpanded = ref(true);

const quotes = computed(() => {
  if (Array.isArray(QuotesStore.filteredQuotes)) {
    return QuotesStore.filteredQuotes as Quote[];
  }
  return QuotesStore.quotes ?? [];
});

async function copyQuote(index: number) {
  const quote = document.querySelectorAll('.quote-content')[index]?.querySelector('p')?.outerText;
  if (quote) await copy(quote);
}

function askConfirmation(id: string) {
  showConfirmModal.value = true;
  selectedQuoteId.value = id;
}

async function deleteQuote() {
  selectedQuoteId.value
    ? await QuotesStore.removeQuote(
        route.params.type as string,
        route.params.id as string,
        selectedQuoteId.value,
      )
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

onMounted(() => {
  QuotesStore.findQuotes(route.params.type as string, route.params.id as string);
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
