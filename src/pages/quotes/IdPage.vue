<template>
  <q-page class="p-2">
    <q-list v-if="quotes && quotes.length" bordered separator>
      <q-item clickable v-ripple v-for="quote in quotes" :key="quote.id!">
        <q-item-section @click="modalEdit(quote, true)">
          <q-item-label>
            <div class="truncate-2-lines" v-html="quote.content"></div>
          </q-item-label>
          <q-item-label caption
            >pages: {{ quote.page }}
            <q-chip
              v-for="tag in quote.tag"
              :key="tag"
              size="sm"
              outline
              square
              color="primary"
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
        <q-item-section avatar>
          <div class="flex">
            <q-btn dense flat round icon="edit" @click="modalEdit(quote, false)" />
            <q-btn dense flat round icon="delete" @click="askConfirmation(quote.id!)" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <EditModal
      v-model:showEditModal="showEditModal"
      v-model:selectedQuote="selectedQuote!"
      @confirm-edit="confirmEdit"
      :isReadonly="ModalReference.isReadonly"
    />
    <ConfirmModal v-model:showConfirmModal="showConfirmModal" @confirm-delete="deleteQuote" />
  </q-page>
</template>

<script setup lang="ts">
import ConfirmModal from 'src/components/ConfirmModal.vue';
import EditModal from 'src/components/EditModal.vue';
import { useModalReferenceStore } from 'src/stores/modalReferences';
import { useQuotesStore } from 'src/stores/quotes';
import type { Quote } from 'src/types/references';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const QuotesStore = useQuotesStore();
const ModalReference = useModalReferenceStore();

const route = useRoute();
const showEditModal = ref(false);
const selectedQuote = ref<Quote | null>(null);
const showConfirmModal = ref(false);
const selectedQuoteId = ref<null | string>(null);

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

function deleteQuote() {
  selectedQuoteId.value
    ? QuotesStore.removeQuote(
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
