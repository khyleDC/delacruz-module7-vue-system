<script setup>
import { ref, computed } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import RecordForm from './components/RecordForm.vue'
import RecordList from './components/RecordList.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import ToastMessage from './components/ToastMessage.vue'
import { useBooks } from './composables/useBooks'

const { books, addBook, updateBook, deleteBook } = useBooks()

const searchQuery = ref('')
const editingBook = ref(null)
const deleteTarget = ref(null)
const toast = ref(null)
let toastTimer = null

function showToast(type, text) {
  toast.value = { type, text }
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.value = null
  }, 3200)
}

const filteredBooks = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return books.value
  return books.value.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.status.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q)
  )
})

const statusCounts = computed(() => {
  const counts = { Available: 0, Borrowed: 0, 'Under Maintenance': 0 }
  for (const book of books.value) {
    counts[book.status] = (counts[book.status] ?? 0) + 1
  }
  return counts
})

function handleSubmit(data) {
  if (editingBook.value) {
    updateBook(editingBook.value.id, data)
    showToast('success', `"${data.title}" was updated.`)
    editingBook.value = null
  } else {
    addBook(data)
    showToast('success', `"${data.title}" was added to the catalog.`)
  }
}

function startEdit(book) {
  editingBook.value = book
}

function cancelEdit() {
  editingBook.value = null
}

function requestDelete(book) {
  deleteTarget.value = book
}

function confirmDelete() {
  const book = deleteTarget.value
  deleteBook(book.id)
  showToast('success', `"${book.title}" was removed from the catalog.`)
  if (editingBook.value?.id === book.id) editingBook.value = null
  deleteTarget.value = null
}

function cancelDelete() {
  deleteTarget.value = null
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-paper">
    <AppHeader />

    <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      <!-- Description -->
      <section class="mb-8 max-w-3xl">
        <p class="text-ink-soft text-base sm:text-lg leading-relaxed">
          Keep track of every title on the shelf. Add new acquisitions, update availability, and search the catalog in
          real time — everything here is saved automatically to this browser.
        </p>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
        <RecordForm :key="editingBook?.id ?? 'new'" :editing-book="editingBook" @submit="handleSubmit" @cancel="cancelEdit" />

        <div class="min-w-0">
          <!-- Search + record count -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <label class="relative flex-1 max-w-md">
              <span class="sr-only">Search the catalog</span>
              <svg viewBox="0 0 24 24" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft/60" fill="none" aria-hidden="true">
                <path d="m21 21-4.34-4.34M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <input
                v-model="searchQuery"
                type="search"
                placeholder="Search by title, author, category, or ID"
                class="w-full rounded-lg border border-paper-dim bg-white pl-9 pr-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-spine transition-colors"
              />
            </label>
            <p class="text-sm text-ink-soft font-medium whitespace-nowrap">
              Showing <span class="text-ink font-semibold">{{ filteredBooks.length }}</span> of
              <span class="text-ink font-semibold">{{ books.length }}</span> {{ books.length === 1 ? 'book' : 'books' }}
            </p>
          </div>

          <!-- Status summary -->
          <div class="flex flex-wrap gap-2 mb-5">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-sage-bg text-sage px-3 py-1 text-xs font-medium">
              <span class="w-1.5 h-1.5 rounded-full bg-sage" /> Available &middot; {{ statusCounts.Available }}
            </span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-bg text-amber px-3 py-1 text-xs font-medium">
              <span class="w-1.5 h-1.5 rounded-full bg-amber" /> Borrowed &middot; {{ statusCounts.Borrowed }}
            </span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-rust-bg text-rust px-3 py-1 text-xs font-medium">
              <span class="w-1.5 h-1.5 rounded-full bg-rust" /> Under Maintenance &middot; {{ statusCounts['Under Maintenance'] }}
            </span>
          </div>

          <RecordList :books="filteredBooks" :is-filtered="!!searchQuery.trim()" @edit="startEdit" @delete="requestDelete" />
        </div>
      </div>
    </main>

    <AppFooter />

    <ConfirmDialog v-if="deleteTarget" :book="deleteTarget" @confirm="confirmDelete" @cancel="cancelDelete" />
    <ToastMessage :toast="toast" @dismiss="toast = null" />
  </div>
</template>
