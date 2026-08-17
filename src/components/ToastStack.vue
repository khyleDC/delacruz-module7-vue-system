<script setup>
defineProps({
  toasts: { type: Array, required: true },
})
defineEmits(['dismiss'])

const styles = {
  success: { icon: 'M20 6 9 17l-5-5', ring: 'border-available-ring', bg: 'bg-available-bg', text: 'text-available' },
  error: { icon: 'M18 6 6 18M6 6l12 12', ring: 'border-maintenance-ring', bg: 'bg-maintenance-bg', text: 'text-maintenance' },
  info: { icon: 'M12 8h.01M11 12h1v4h1', ring: 'border-borrowed-ring', bg: 'bg-borrowed-bg', text: 'text-borrowed' },
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[60] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="animate-pop card-surface border pointer-events-auto flex items-start gap-3 p-3.5"
        :class="[styles[toast.type].ring]"
      >
        <div class="h-7 w-7 rounded-full flex items-center justify-center shrink-0" :class="styles[toast.type].bg">
          <svg class="h-4 w-4" :class="styles[toast.type].text" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path :d="styles[toast.type].icon" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <p class="text-sm text-charcoal leading-snug pt-0.5">{{ toast.message }}</p>
        <button type="button" class="icon-btn ml-auto -mr-1 -mt-1 shrink-0" aria-label="Dismiss" @click="$emit('dismiss', toast.id)">
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </div>
  </Teleport>
</template>
