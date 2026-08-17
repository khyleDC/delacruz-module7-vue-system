<script setup>
defineProps({
  title: { type: String, required: true },
})
const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-ink-950/50 backdrop-blur-[2px] animate-in" @click="emit('close')" />
      <div
        class="relative w-full max-w-lg card-surface p-5 sm:p-6 animate-pop"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <div class="flex items-start justify-between gap-4 mb-4">
          <h2 class="font-display text-lg font-semibold text-charcoal">{{ title }}</h2>
          <button type="button" class="icon-btn -mr-1.5 -mt-1.5" aria-label="Close dialog" @click="emit('close')">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
            </svg>
          </button>
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
