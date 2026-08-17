<script setup>
const props = defineProps({
  books: { type: Array, required: true },
  isFiltered: { type: Boolean, default: false },
})
const emit = defineEmits(['edit', 'delete'])

const STATUS_STYLES = {
  Available: { badge: 'bg-sage-bg text-sage', dot: 'bg-sage', border: 'border-sage' },
  Borrowed: { badge: 'bg-amber-bg text-amber', dot: 'bg-amber', border: 'border-amber' },
  'Under Maintenance': { badge: 'bg-rust-bg text-rust', dot: 'bg-rust', border: 'border-rust' },
}

function statusStyle(status) {
  return STATUS_STYLES[status] ?? { badge: 'bg-paper-dim text-ink-soft', dot: 'bg-ink-soft', border: 'border-ink-soft' }
}
</script>

<template>
  <div class="bg-white rounded-2xl border border-paper-dim shadow-sm overflow-hidden">
    <!-- Empty state -->
    <div v-if="books.length === 0" class="px-6 py-16 text-center">
      <div class="mx-auto w-12 h-12 rounded-full bg-paper-dim flex items-center justify-center mb-4">
        <svg viewBox="0 0 24 24" class="w-6 h-6 text-ink-soft" fill="none" aria-hidden="true">
          <path d="M4 5.5C4 4.67 4.67 4 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13ZM20 5.5c0-.83-.67-1.5-1.5-1.5H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5v-13Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
        </svg>
      </div>
      <p class="font-display text-base font-semibold text-spine-dark">
        {{ isFiltered ? 'No books match your search' : 'The catalog is empty' }}
      </p>
      <p class="text-sm text-ink-soft mt-1">
        {{ isFiltered ? 'Try a different title, author, or category.' : 'Add your first book using the form.' }}
      </p>
    </div>

    <template v-else>
      <!-- Desktop table -->
      <table class="hidden md:table w-full text-sm">
        <thead>
          <tr class="bg-spine text-white/90 text-xs uppercase tracking-wide">
            <th class="text-left font-semibold px-5 py-3">ID</th>
            <th class="text-left font-semibold px-5 py-3">Title</th>
            <th class="text-left font-semibold px-5 py-3">Author</th>
            <th class="text-left font-semibold px-5 py-3">Category</th>
            <th class="text-left font-semibold px-5 py-3">Status</th>
            <th class="text-right font-semibold px-5 py-3">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-paper-dim">
          <tr
            v-for="book in books"
            :key="book.id"
            class="border-l-4 hover:bg-paper/70 transition-colors"
            :class="statusStyle(book.status).border"
          >
            <td class="px-5 py-3 font-mono text-xs text-ink-soft">{{ book.id }}</td>
            <td class="px-5 py-3 font-medium text-ink">{{ book.title }}</td>
            <td class="px-5 py-3 text-ink-soft">{{ book.author }}</td>
            <td class="px-5 py-3 text-ink-soft">{{ book.category }}</td>
            <td class="px-5 py-3">
              <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium" :class="statusStyle(book.status).badge">
                <span class="w-1.5 h-1.5 rounded-full" :class="statusStyle(book.status).dot" />
                {{ book.status }}
              </span>
            </td>
            <td class="px-5 py-3">
              <div class="flex items-center justify-end gap-1">
                <button
                  type="button"
                  class="p-1.5 rounded-md text-spine hover:bg-spine/10 transition-colors focus:outline-none"
                  :aria-label="`Edit ${book.title}`"
                  @click="emit('edit', book)"
                >
                  <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" aria-hidden="true">
                    <path d="M4 20h4l10.5-10.5a2 2 0 0 0 0-2.83l-1.17-1.17a2 2 0 0 0-2.83 0L4 16v4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  class="p-1.5 rounded-md text-rust hover:bg-rust/10 transition-colors focus:outline-none"
                  :aria-label="`Delete ${book.title}`"
                  @click="emit('delete', book)"
                >
                  <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" aria-hidden="true">
                    <path d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Mobile cards -->
      <ul class="md:hidden divide-y divide-paper-dim">
        <li
          v-for="book in books"
          :key="book.id"
          class="p-4 border-l-4"
          :class="statusStyle(book.status).border"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="font-medium text-ink truncate">{{ book.title }}</p>
              <p class="text-sm text-ink-soft truncate">{{ book.author }}</p>
            </div>
            <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium shrink-0" :class="statusStyle(book.status).badge">
              <span class="w-1.5 h-1.5 rounded-full" :class="statusStyle(book.status).dot" />
              {{ book.status }}
            </span>
          </div>
          <div class="mt-2 flex items-center justify-between">
            <div class="text-xs text-ink-soft space-x-2">
              <span class="font-mono">{{ book.id }}</span>
              <span>&middot;</span>
              <span>{{ book.category }}</span>
            </div>
            <div class="flex items-center gap-1">
              <button
                type="button"
                class="p-1.5 rounded-md text-spine hover:bg-spine/10 transition-colors focus:outline-none"
                :aria-label="`Edit ${book.title}`"
                @click="emit('edit', book)"
              >
                <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" aria-hidden="true">
                  <path d="M4 20h4l10.5-10.5a2 2 0 0 0 0-2.83l-1.17-1.17a2 2 0 0 0-2.83 0L4 16v4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                class="p-1.5 rounded-md text-rust hover:bg-rust/10 transition-colors focus:outline-none"
                :aria-label="`Delete ${book.title}`"
                @click="emit('delete', book)"
              >
                <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" aria-hidden="true">
                  <path d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>
