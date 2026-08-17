<script setup>
defineProps({
  books: { type: Array, required: true },
  hasAnyBooks: { type: Boolean, required: true },
})

const emit = defineEmits(['edit', 'delete', 'check'])

function badgeClass(status) {
  if (status === 'Available') return 'badge-available'
  if (status === 'Borrowed') return 'badge-borrowed'
  return 'badge-maintenance'
}

function checkLabel(status) {
  return status === 'Borrowed' ? 'Mark returned' : 'Mark complete'
}
</script>

<template>
  <div>
    <!-- Empty states -->
    <div v-if="!hasAnyBooks" class="animate-in flex flex-col items-center justify-center text-center py-16 px-6">
      <div class="h-14 w-14 rounded-2xl bg-paper-warm flex items-center justify-center mb-4">
        <svg class="h-7 w-7 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <p class="font-display text-lg font-semibold text-charcoal">The catalog is empty</p>
      <p class="text-sm text-muted mt-1 max-w-sm">Add your first book using the form above to get started.</p>
    </div>

    <div v-else-if="books.length === 0" class="animate-in flex flex-col items-center justify-center text-center py-16 px-6">
      <div class="h-14 w-14 rounded-2xl bg-paper-warm flex items-center justify-center mb-4">
        <svg class="h-7 w-7 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" stroke-linecap="round" />
        </svg>
      </div>
      <p class="font-display text-lg font-semibold text-charcoal">No matching books</p>
      <p class="text-sm text-muted mt-1 max-w-sm">Try a different title, author, category, or Book ID.</p>
    </div>

    <!-- Desktop table -->
    <div v-else class="hidden md:block overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-left text-[0.7rem] uppercase tracking-wide text-muted border-b border-ink-900/10">
            <th class="py-3 pr-3 font-semibold">Book ID</th>
            <th class="py-3 pr-3 font-semibold">Title</th>
            <th class="py-3 pr-3 font-semibold">Author</th>
            <th class="py-3 pr-3 font-semibold">Category</th>
            <th class="py-3 pr-3 font-semibold">Status</th>
            <th class="py-3 pr-0 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="book in books"
            :key="book.id"
            class="border-b border-ink-900/[0.06] last:border-0 hover:bg-paper-warm/60 transition-colors animate-in"
          >
            <td class="py-3 pr-3"><span class="id-chip">{{ book.id }}</span></td>
            <td class="py-3 pr-3 font-medium text-charcoal max-w-[16rem] truncate" :title="book.title">{{ book.title }}</td>
            <td class="py-3 pr-3 text-muted max-w-[12rem] truncate" :title="book.author">{{ book.author }}</td>
            <td class="py-3 pr-3 text-muted">{{ book.category }}</td>
            <td class="py-3 pr-3">
              <span class="badge" :class="badgeClass(book.status)">{{ book.status }}</span>
            </td>
            <td class="py-3 pr-0">
              <div class="flex items-center justify-end gap-1">
                <button
                  v-if="book.status !== 'Available'"
                  type="button"
                  class="icon-btn"
                  :title="checkLabel(book.status)"
                  :aria-label="checkLabel(book.status)"
                  @click="emit('check', book)"
                >
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
                <button type="button" class="icon-btn" title="Edit" aria-label="Edit book" @click="emit('edit', book)">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 20h9" stroke-linecap="round" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
                <button type="button" class="icon-btn icon-btn-danger" title="Delete" aria-label="Delete book" @click="emit('delete', book)">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18" stroke-linecap="round" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-.87 14.14A2 2 0 0 1 16.14 22H7.86a2 2 0 0 1-2-1.86L5 6" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile cards -->
    <ul v-if="books.length > 0" class="md:hidden flex flex-col gap-3">
      <li
        v-for="book in books"
        :key="book.id"
        class="animate-in card-surface p-4"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <span class="id-chip">{{ book.id }}</span>
            <p class="font-display font-semibold text-charcoal mt-1.5 truncate">{{ book.title }}</p>
            <p class="text-sm text-muted truncate">{{ book.author }}</p>
          </div>
          <span class="badge shrink-0" :class="badgeClass(book.status)">{{ book.status }}</span>
        </div>
        <div class="mt-3 flex items-center justify-between">
          <span class="text-xs text-muted">{{ book.category }}</span>
          <div class="flex items-center gap-1">
            <button
              v-if="book.status !== 'Available'"
              type="button"
              class="icon-btn"
              :aria-label="checkLabel(book.status)"
              @click="emit('check', book)"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <button type="button" class="icon-btn" aria-label="Edit book" @click="emit('edit', book)">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20h9" stroke-linecap="round" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <button type="button" class="icon-btn icon-btn-danger" aria-label="Delete book" @click="emit('delete', book)">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18" stroke-linecap="round" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-.87 14.14A2 2 0 0 1 16.14 22H7.86a2 2 0 0 1-2-1.86L5 6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
