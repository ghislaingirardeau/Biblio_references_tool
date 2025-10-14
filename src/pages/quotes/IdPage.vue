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
      <q-item
        clickable
        v-ripple
        v-for="quote in quotes"
        :key="quote.id!"
        class="flex-col md:!flex-row items-start"
      >
        <q-item-section @click="modalEdit(quote, true)" class="!flex-grow">
          <q-item-label>
            <div :class="{ 'truncate-2-lines': !isQuoteExpanded }" v-html="quote.content"></div>
          </q-item-label>
          <q-item-label caption
            >Pages: {{ quote.page }}
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
            </q-chip></q-item-label
          >

          <!-- <q-item-label v-if="quote.tag?.length" caption
            >tag: {{ quote.tag.join('-') }}</q-item-label
          > -->
        </q-item-section>
        <q-item-section class="flex-none">
          <div class="flex">
            <q-btn
              dense
              flat
              round
              color="primary"
              :icon="mdiContentCopy"
              @click="copy(quote.content!.replace(/<[^>]+>/g, ''))"
            />

            <q-btn dense flat round color="primary" icon="edit" @click="modalEdit(quote, false)" />
            <q-btn
              dense
              flat
              round
              color="primary"
              icon="delete"
              @click="askConfirmation(quote.id!)"
            />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <div v-else>No quote saved !</div>
    <EditModal
      v-model:showEditModal="showEditModal"
      v-model:selectedQuote="selectedQuote!"
      @confirm-edit="confirmEdit"
      :isReadonly="ModalReference.isReadonly"
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
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useClipboard } from '@vueuse/core';

const QuotesStore = useQuotesStore();
const ModalReference = useModalReferenceStore();

const { text, copy, copied, isSupported } = useClipboard();

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
  ModalReference.isReadonly = modeReadonly;
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
