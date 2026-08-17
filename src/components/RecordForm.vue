<script setup>
import { reactive, ref, watch } from 'vue'
import { CATEGORIES, STATUSES } from '../composables/useBooks.js'

const props = defineProps({
  mode: { type: String, default: 'add' }, // 'add' | 'edit'
  book: { type: Object, default: null }, // populated when editing
})

const emit = defineEmits(['submit', 'cancel'])

function emptyForm() {
  return { title: '', author: '', category: '', status: 'Available' }
}

const form = reactive(emptyForm())
const errors = reactive({ title: '', author: '', category: '' })
const touched = reactive({ title: false, author: false, category: false })

watch(
  () => props.book,
  (book) => {
    if (book) {
      form.title = book.title
      form.author = book.author
      form.category = book.category
      form.status = book.status
    } else {
      Object.assign(form, emptyForm())
    }
    errors.title = ''
    errors.author = ''
    errors.category = ''
    touched.title = false
    touched.author = false
    touched.category = false
  },
  { immediate: true }
)

function validateField(field) {
  const value = (form[field] || '').toString().trim()
  if (field === 'title') {
    errors.title = value.length === 0 ? 'Title is required.' : value.length < 2 ? 'Title is too short.' : ''
  }
  if (field === 'author') {
    errors.author = value.length === 0 ? 'Author is required.' : value.length < 2 ? 'Author name is too short.' : ''
  }
  if (field === 'category') {
    errors.category = value.length === 0 ? 'Please choose a category.' : ''
  }
}

function handleBlur(field) {
  touched[field] = true
  validateField(field)
}

function validateAll() {
  ;['title', 'author', 'category'].forEach((f) => {
    touched[f] = true
    validateField(f)
  })
  return !errors.title && !errors.author && !errors.category
}

function handleSubmit() {
  if (!validateAll()) return
  emit('submit', {
    title: form.title.trim(),
    author: form.author.trim(),
    category: form.category,
    status: form.status,
  })
  if (props.mode === 'add') {
    Object.assign(form, emptyForm())
    touched.title = false
    touched.author = false
    touched.category = false
  }
}

function handleCancel() {
  emit('cancel')
}

defineExpose({})
</script>

<template>
  <form novalidate class="grid grid-cols-1 sm:grid-cols-2 gap-4" @submit.prevent="handleSubmit">
    <!-- Title -->
    <div class="sm:col-span-2">
      <label for="title" class="block text-xs font-semibold uppercase tracking-wide text-muted mb-1.5">
        Title
      </label>
      <input
        id="title"
        v-model="form.title"
        type="text"
        placeholder="e.g. The Great Gatsby"
        class="field-input"
        :class="{ 'field-input-error': touched.title && errors.title }"
        @blur="handleBlur('title')"
      />
      <p v-if="touched.title && errors.title" class="mt-1 text-xs text-maintenance">{{ errors.title }}</p>
    </div>

    <!-- Author -->
    <div>
      <label for="author" class="block text-xs font-semibold uppercase tracking-wide text-muted mb-1.5">
        Author
      </label>
      <input
        id="author"
        v-model="form.author"
        type="text"
        placeholder="e.g. F. Scott Fitzgerald"
        class="field-input"
        :class="{ 'field-input-error': touched.author && errors.author }"
        @blur="handleBlur('author')"
      />
      <p v-if="touched.author && errors.author" class="mt-1 text-xs text-maintenance">{{ errors.author }}</p>
    </div>

    <!-- Category -->
    <div>
      <label for="category" class="block text-xs font-semibold uppercase tracking-wide text-muted mb-1.5">
        Category
      </label>
      <select
        id="category"
        v-model="form.category"
        class="field-input"
        :class="{ 'field-input-error': touched.category && errors.category }"
        @blur="handleBlur('category')"
        @change="handleBlur('category')"
      >
        <option value="" disabled>Select a category</option>
        <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
      </select>
      <p v-if="touched.category && errors.category" class="mt-1 text-xs text-maintenance">{{ errors.category }}</p>
    </div>

    <!-- Status -->
    <div class="sm:col-span-2">
      <label for="status" class="block text-xs font-semibold uppercase tracking-wide text-muted mb-1.5">
        Status
      </label>
      <select id="status" v-model="form.status" class="field-input">
        <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
      </select>
      <p class="mt-1 text-xs text-muted">
        Tip: once a book is Borrowed or Under Maintenance, use the check button in
        the list to mark it back as Available.
      </p>
    </div>

    <!-- Actions -->
    <div class="sm:col-span-2 flex flex-wrap items-center gap-3 pt-1">
      <button type="submit" class="btn btn-primary">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path v-if="mode === 'add'" d="M12 5v14M5 12h14" stroke-linecap="round" />
          <path v-else d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {{ mode === 'add' ? 'Add Book' : 'Save Changes' }}
      </button>
      <button v-if="mode === 'edit'" type="button" class="btn btn-secondary" @click="handleCancel">
        Cancel
      </button>
      <span v-if="mode === 'add'" class="text-xs text-muted">
        Book ID is generated automatically after saving.
      </span>
    </div>
  </form>
</template>
