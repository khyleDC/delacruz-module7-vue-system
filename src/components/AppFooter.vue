<script setup>
defineProps({
  studentName: { type: String, required: true },
  section: { type: String, required: true },
  courseTitle: { type: String, default: 'Software Engineering 1' },
})

const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-ink-900/10 bg-paper-warm">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
      <div class="flex items-center gap-2.5">
        <div class="h-8 w-8 rounded-lg bg-ink-900 flex items-center justify-center shrink-0">
          <svg class="h-4 w-4 text-paper" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div class="text-sm">
          <p class="font-semibold text-charcoal">{{ studentName }}</p>
          <p class="text-xs text-muted">{{ section }} &middot; {{ courseTitle }}</p>
        </div>
      </div>
      <p class="text-xs text-muted">
        &copy; {{ year }} Library Management System &mdash; built with Vue.js &amp; Tailwind CSS
      </p>
    </div>
  </footer>
</template>
