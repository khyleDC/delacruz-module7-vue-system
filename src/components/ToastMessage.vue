<script setup>
defineProps({
  toast: { type: Object, default: null }, // { type: 'success' | 'error', text: string }
})
const emit = defineEmits(['dismiss'])
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="toast"
        role="status"
        aria-live="polite"
        class="fixed bottom-5 right-5 z-50 max-w-sm rounded-xl shadow-lg px-4 py-3 flex items-start gap-3 text-sm font-medium text-white"
        :class="toast.type === 'error' ? 'bg-rust' : 'bg-sage'"
      >
        <svg v-if="toast.type !== 'error'" viewBox="0 0 24 24" class="w-5 h-5 shrink-0" fill="none" aria-hidden="true">
          <path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <svg v-else viewBox="0 0 24 24" class="w-5 h-5 shrink-0" fill="none" aria-hidden="true">
          <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.29 2.25h17.78A1.5 1.5 0 0 0 22.18 18L13.71 3.86a1.5 1.5 0 0 0-2.6 0Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
        </svg>
        <p class="flex-1">{{ toast.text }}</p>
        <button type="button" class="text-white/80 hover:text-white shrink-0" aria-label="Dismiss" @click="emit('dismiss')">
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>
