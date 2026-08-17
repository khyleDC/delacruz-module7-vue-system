<script setup>
// ── Edit these two lines with your details before submitting ──
const STUDENT_NAME = 'Your Name Here'
const STUDENT_SECTION = 'Section / Course Code'
// ────────────────────────────────────────────────────────────

const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-spine-dark text-white/70 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
      <p>&copy; {{ year }} Library Management System &middot; Built with Vue 3 &amp; Tailwind CSS</p>
      <p class="text-white/90 font-medium">{{ STUDENT_NAME }} &middot; {{ STUDENT_SECTION }}</p>
    </div>
  </footer>
</template>
