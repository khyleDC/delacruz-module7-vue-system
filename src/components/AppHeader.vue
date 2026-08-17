<script setup>
// Decorative "spines on a shelf" strip — the page's one signature flourish.
// Purely visual, so it's hidden from assistive tech.
const spineColors = ['#a9832b', '#33415c', '#2f6b4a', '#a03a2b', '#c9a94f', '#33415c', '#a9832b', '#2f6b4a']
const spines = Array.from({ length: 48 }, (_, i) => ({
  color: spineColors[i % spineColors.length],
  height: 10 + ((i * 37) % 14), // deterministic pseudo-random heights, no layout shift
}))
</script>

<template>
  <header class="sticky top-0 z-30 bg-spine text-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-4 flex items-center gap-4">
      <div class="shrink-0 w-11 h-11 rounded-lg bg-spine-dark flex items-center justify-center ring-1 ring-white/10">
        <svg viewBox="0 0 24 24" class="w-6 h-6 text-brass-light" fill="none" aria-hidden="true">
          <path
            d="M4 5.5C4 4.67 4.67 4 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13Z"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linejoin="round"
          />
          <path
            d="M20 5.5c0-.83-.67-1.5-1.5-1.5H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5v-13Z"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div class="min-w-0">
        <h1 class="font-display font-semibold text-xl sm:text-2xl leading-tight tracking-tight truncate">
          Library Management System
        </h1>
        <p class="text-white/60 text-xs sm:text-sm">Catalog, search, and circulation — all in this browser</p>
      </div>
    </div>

    <!-- Bookshelf strip -->
    <div class="flex items-end gap-[3px] h-3.5 px-4 sm:px-6 lg:px-8 overflow-hidden" aria-hidden="true">
      <span
        v-for="(spine, i) in spines"
        :key="i"
        class="flex-1 rounded-t-sm"
        :style="{ backgroundColor: spine.color, height: spine.height + 'px' }"
      />
    </div>
  </header>
</template>
