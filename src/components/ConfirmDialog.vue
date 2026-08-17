<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  book: { type: Object, required: true },
})
const emit = defineEmits(['confirm', 'cancel'])

function handleKeydown(e) {
  if (e.key === 'Escape') emit('cancel')
}

onMounted(() => document.addEventListener('keydown', handleKeydown))
onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <div class="fixed inset-0 z-40 flex items-center justify-center px-4">
    <div class="absolute inset-0 bg-ink/50 backdrop-blur-[2px]" @click="emit('cancel')" />
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
      class="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
    >
      <div class="flex items-start gap-3">
        <div class="shrink-0 w-10 h-10 rounded-full bg-rust-bg flex items-center justify-center">
          <svg viewBox="0 0 24 24" class="w-5 h-5 text-rust" fill="none" aria-hidden="true">
            <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.29 2.25h17.78A1.5 1.5 0 0 0 22.18 18L13.71 3.86a1.5 1.5 0 0 0-2.6 0Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
          </svg>
        </div>
        <div class="min-w-0">
          <h3 id="confirm-title" class="font-display text-base font-semibold text-spine-dark">Remove this book?</h3>
          <p id="confirm-desc" class="text-sm text-ink-soft mt-1">
            "{{ book.title }}" by {{ book.author }} will be permanently removed from the catalog. This can't be undone.
          </p>
        </div>
      </div>
      <div class="flex items-center justify-end gap-3 mt-6">
        <button
          type="button"
          class="rounded-lg border border-paper-dim hover:bg-paper-dim text-ink-soft text-sm font-semibold px-4 py-2 transition-colors focus:outline-none"
          @click="emit('cancel')"
        >
          Cancel
        </button>
        <button
          type="button"
          autofocus
          class="rounded-lg bg-rust hover:bg-rust/90 text-white text-sm font-semibold px-4 py-2 transition-colors focus:outline-none"
          @click="emit('confirm')"
        >
          Remove Book
        </button>
      </div>
    </div>
  </div>
</template>
