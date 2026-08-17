<script setup>
import { computed, ref } from 'vue'
import { useBooks } from './composables/useBooks.js'
import AppHeader from './components/AppHeader.vue'
import RecordForm from './components/RecordForm.vue'
import RecordList from './components/RecordList.vue'
import AppFooter from './components/AppFooter.vue'
import AppModal from './components/AppModal.vue'
import ToastStack from './components/ToastStack.vue'

// ---- Update these two to match your submission ----
const STUDENT_NAME = 'Khyle G. Dela Cruz'
const STUDENT_SECTION = 'BSCS 3-A'
// -----------------------------------------------------

const { books, addBook, updateBook, deleteBook, setStatus } = useBooks()

/* ---------------- Search ---------------- */
const searchQuery = ref('')

const filteredBooks = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return books.value
  return books.value.filter((book) =>
    [book.id, book.title, book.author, book.category, book.status]
      .join(' ')
      .toLowerCase()
      .includes(q)
  )
})

/* ---------------- Stats ---------------- */
const stats = computed(() => ({
  total: books.value.length,
  available: books.value.filter((b) => b.status === 'Available').length,
  borrowed: books.value.filter((b) => b.status === 'Borrowed').length,
  maintenance: books.value.filter((b) => b.status === 'Under Maintenance').length,
}))

/* ---------------- Toasts ---------------- */
const toasts = ref([])
let toastSeq = 0

function pushToast(message, type = 'success') {
  const id = ++toastSeq
  toasts.value.push({ id, message, type })
  setTimeout(() => dismissToast(id), 3500)
}

function dismissToast(id) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

/* ---------------- Add ---------------- */
function handleAdd(payload) {
  const book = addBook(payload)
  pushToast(`"${book.title}" was added to the catalog.`, 'success')
}

/* ---------------- Edit (modal) ---------------- */
const editingBook = ref(null)
const isEditModalOpen = ref(false)

function openEditModal(book) {
  editingBook.value = book
  isEditModalOpen.value = true
}

function closeEditModal() {
  isEditModalOpen.value = false
  editingBook.value = null
}

function handleEditSubmit(payload) {
  if (!editingBook.value) return
  updateBook(editingBook.value.id, payload)
  pushToast(`"${payload.title}" was updated.`, 'success')
  closeEditModal()
}

/* ---------------- Delete (confirm) ---------------- */
const bookPendingDelete = ref(null)

function requestDelete(book) {
  bookPendingDelete.value = book
}

function cancelDelete() {
  bookPendingDelete.value = null
}

function confirmDelete() {
  if (!bookPendingDelete.value) return
  const { id, title } = bookPendingDelete.value
  deleteBook(id)
  pushToast(`"${title}" was removed from the catalog.`, 'error')
  bookPendingDelete.value = null
}

/* ---------------- Check: mark returned / maintenance done (confirm) ---------------- */
const bookPendingCheck = ref(null)

function requestCheck(book) {
  bookPendingCheck.value = book
}

function cancelCheck() {
  bookPendingCheck.value = null
}

function confirmCheck() {
  if (!bookPendingCheck.value) return
  const { id, title } = bookPendingCheck.value
  setStatus(id, 'Available')
  pushToast(`"${title}" is now marked Available.`, 'success')
  bookPendingCheck.value = null
}

const checkPrompt = computed(() => {
  if (!bookPendingCheck.value) return { verb: '', question: '' }
  const isBorrowed = bookPendingCheck.value.status === 'Borrowed'
  return {
    verb: isBorrowed ? 'Confirm return' : 'Confirm maintenance complete',
    question: isBorrowed
      ? `Has "${bookPendingCheck.value.title}" been returned? It will be marked Available.`
      : `Is maintenance finished for "${bookPendingCheck.value.title}"? It will be marked Available.`,
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader
      :total="stats.total"
      :available="stats.available"
      :borrowed="stats.borrowed"
      :maintenance="stats.maintenance"
    />

    <main class="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col gap-6">
      <!-- Add form -->
      <section class="card-surface p-5 sm:p-6">
        <h2 class="font-display text-lg font-semibold text-charcoal mb-1">Add a New Book</h2>
        <p class="text-sm text-muted mb-5">Fill in the details below to add a title to the catalog.</p>
        <RecordForm mode="add" @submit="handleAdd" />
      </section>

      <!-- Search + list -->
      <section class="card-surface p-5 sm:p-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h2 class="font-display text-lg font-semibold text-charcoal">Book Catalog</h2>
            <p class="text-sm text-muted mt-0.5">
              Showing {{ filteredBooks.length }} of {{ stats.total }}
              {{ stats.total === 1 ? 'record' : 'records' }}
            </p>
          </div>
          <div class="relative w-full sm:w-72">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" stroke-linecap="round" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by title, author, category, ID…"
              class="field-input pl-9"
            />
            <button
              v-if="searchQuery"
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 icon-btn h-6 w-6"
              aria-label="Clear search"
              @click="searchQuery = ''"
            >
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <RecordList
          :books="filteredBooks"
          :has-any-books="stats.total > 0"
          @edit="openEditModal"
          @delete="requestDelete"
          @check="requestCheck"
        />
      </section>
    </main>

    <AppFooter :student-name="STUDENT_NAME" :section="STUDENT_SECTION" />

    <!-- Edit popup -->
    <AppModal v-if="isEditModalOpen" title="Edit Book" @close="closeEditModal">
      <div class="mb-4 flex items-center gap-2">
        <span class="id-chip">{{ editingBook?.id }}</span>
        <span class="text-xs text-muted">Editing this record</span>
      </div>
      <RecordForm mode="edit" :book="editingBook" @submit="handleEditSubmit" @cancel="closeEditModal" />
    </AppModal>

    <!-- Delete confirmation -->
    <AppModal v-if="bookPendingDelete" title="Delete Book" @close="cancelDelete">
      <p class="text-sm text-charcoal leading-relaxed">
        Are you sure you want to delete
        <span class="font-semibold">"{{ bookPendingDelete.title }}"</span>
        ({{ bookPendingDelete.id }})? This action cannot be undone.
      </p>
      <div class="mt-5 flex flex-wrap gap-3">
        <button type="button" class="btn btn-danger btn-confirm-danger" @click="confirmDelete">
          Yes, delete it
        </button>
        <button type="button" class="btn btn-secondary" @click="cancelDelete">Cancel</button>
      </div>
    </AppModal>

    <!-- Check / mark-available confirmation -->
    <AppModal v-if="bookPendingCheck" :title="checkPrompt.verb" @close="cancelCheck">
      <p class="text-sm text-charcoal leading-relaxed">{{ checkPrompt.question }}</p>
      <div class="mt-5 flex flex-wrap gap-3">
        <button type="button" class="btn btn-primary" @click="confirmCheck">Yes, mark Available</button>
        <button type="button" class="btn btn-secondary" @click="cancelCheck">Cancel</button>
      </div>
    </AppModal>

    <ToastStack :toasts="toasts" @dismiss="dismissToast" />
  </div>
</template>
