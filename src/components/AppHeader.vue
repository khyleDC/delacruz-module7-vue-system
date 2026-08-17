<script setup>
defineProps({
  total: { type: Number, required: true },
  available: { type: Number, required: true },
  borrowed: { type: Number, required: true },
  maintenance: { type: Number, required: true },
})
</script>

<template>
  <header class="bg-ink-900 text-paper">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div class="max-w-xl">
          <div class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-500">
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Catalog System
          </div>
          <h1 class="font-display mt-4 text-3xl sm:text-4xl font-semibold leading-tight">
            Library Management System
          </h1>
          <p class="mt-3 text-sm sm:text-base text-ink-100/90 leading-relaxed">
            Add new titles to the catalog, track who has what on loan, and keep
            maintenance status current — every change is saved to this browser
            automatically.
          </p>
        </div>

        <dl class="grid grid-cols-4 gap-2 sm:gap-3 shrink-0">
          <div class="rounded-xl bg-white/10 px-3 py-2.5 text-center min-w-[4.5rem]">
            <dt class="text-[0.65rem] uppercase tracking-wide text-ink-100/70">Total</dt>
            <dd class="font-display text-xl sm:text-2xl font-semibold mt-0.5">{{ total }}</dd>
          </div>
          <div class="rounded-xl bg-white/10 px-3 py-2.5 text-center min-w-[4.5rem]">
            <dt class="text-[0.65rem] uppercase tracking-wide text-ink-100/70">Available</dt>
            <dd class="font-display text-xl sm:text-2xl font-semibold mt-0.5 text-emerald-300">{{ available }}</dd>
          </div>
          <div class="rounded-xl bg-white/10 px-3 py-2.5 text-center min-w-[4.5rem]">
            <dt class="text-[0.65rem] uppercase tracking-wide text-ink-100/70">Borrowed</dt>
            <dd class="font-display text-xl sm:text-2xl font-semibold mt-0.5 text-amber-300">{{ borrowed }}</dd>
          </div>
          <div class="rounded-xl bg-white/10 px-3 py-2.5 text-center min-w-[4.5rem]">
            <dt class="text-[0.65rem] uppercase tracking-wide text-ink-100/70">Maintenance</dt>
            <dd class="font-display text-xl sm:text-2xl font-semibold mt-0.5 text-rose-300">{{ maintenance }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </header>
</template>
