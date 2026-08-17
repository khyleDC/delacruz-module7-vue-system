<script setup>
import { reactive, computed } from 'vue'

const props = defineProps({
  editingBook: { type: Object, default: null },
})
const emit = defineEmits(['submit', 'cancel'])

const CATEGORIES = [
  'Fiction',
  'Non-Fiction',
  'Science',
  'Technology',
  'History',
  'Biography',
  "Children's",
  'Reference',
  'Other',
]
const STATUSES = ['Available', 'Borrowed', 'Under Maintenance']

const isEditing = computed(() => !!props.editingBook)

const form = reactive({
  title: props.editingBook?.title ?? '',
  author: props.editingBook?.author ?? '',
  category: props.editingBook?.category ?? '',
  status: props.editingBook?.status ?? 'Available',
})

const errors = reactive({ title: '', author: '', category: '' })
const touched = reactive({ title: false, author: false, category: false })

function validateField(field) {
  if (field === 'title') {
    const value = form.title.trim()
    errors.title = value.length === 0 ? 'Title is required.' : value.length < 2 ? 'Title must be at least 2 characters.' : ''
  }
  if (field === 'author') {
    const value = form.author.trim()
    errors.author = value.length === 0 ? 'Author is required.' : value.length < 2 ? 'Author must be at least 2 characters.' : ''
  }
  if (field === 'category') {
    errors.category = form.category ? '' : 'Select a category.'
  }
}

function handleBlur(field) {
  touched[field] = true
  validateField(field)
}

function validateAll() {
  touched.title = true
  touched.author = true
  touched.category = true
  validateField('title')
  validateField('author')
  validateField('category')
  return !errors.title && !errors.author && !errors.category
}

function resetForm() {
  form.title = ''
  form.author = ''
  form.category = ''
  form.status = 'Available'
  touched.title = false
  touched.author = false
  touched.category = false
  errors.title = ''
  errors.author = ''
  errors.category = ''
}

function handleSubmit() {
  if (!validateAll()) return
  emit('submit', {
    title: form.title.trim(),
    author: form.author.trim(),
    category: form.category,
    status: form.status,
  })
  if (!isEditing.value) resetForm()
}

function handleCancel() {
  emit('cancel')
}

const inputBase =
  'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/50 transition-colors focus:outline-none'
</script>

<template>
  <div class="lg:sticky lg:top-28 bg-white rounded-2xl border border-paper-dim shadow-sm p-5 sm:p-6">
    <div class="flex items-center justify-between mb-1">
      <h2 class="font-display text-lg font-semibold text-spine-dark">
        {{ isEditing ? 'Edit Book' : 'Add a Book' }}
      </h2>
      <span
        v-if="isEditing"
        class="font-mono text-xs px-2 py-1 rounded-md bg-paper-dim text-ink-soft"
      >
        {{ props.editingBook.id }}
      </span>
    </div>
    <p class="text-sm text-ink-soft mb-5">
      {{ isEditing ? 'Update the details, then save your changes.' : 'Fill in the details to add a new title to the catalog.' }}
    </p>

    <form novalidate class="space-y-4" @submit.prevent="handleSubmit">
      <!-- Title -->
      <div>
        <label for="title" class="block text-sm font-medium text-ink mb-1.5">Title</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          placeholder="e.g. The Silent Observatory"
          :class="[inputBase, errors.title && touched.title ? 'border-rust focus:border-rust' : 'border-paper-dim focus:border-spine']"
          :aria-invalid="!!(errors.title && touched.title)"
          aria-describedby="title-error"
          @blur="handleBlur('title')"
        />
        <p v-if="errors.title && touched.title" id="title-error" class="mt-1.5 text-xs text-rust">{{ errors.title }}</p>
      </div>

      <!-- Author -->
      <div>
        <label for="author" class="block text-sm font-medium text-ink mb-1.5">Author</label>
        <input
          id="author"
          v-model="form.author"
          type="text"
          placeholder="e.g. Mara Ellison"
          :class="[inputBase, errors.author && touched.author ? 'border-rust focus:border-rust' : 'border-paper-dim focus:border-spine']"
          :aria-invalid="!!(errors.author && touched.author)"
          aria-describedby="author-error"
          @blur="handleBlur('author')"
        />
        <p v-if="errors.author && touched.author" id="author-error" class="mt-1.5 text-xs text-rust">{{ errors.author }}</p>
      </div>

      <!-- Category -->
      <div>
        <label for="category" class="block text-sm font-medium text-ink mb-1.5">Category</label>
        <select
          id="category"
          v-model="form.category"
          :class="[inputBase, 'appearance-none bg-white', errors.category && touched.category ? 'border-rust focus:border-rust' : 'border-paper-dim focus:border-spine']"
          :aria-invalid="!!(errors.category && touched.category)"
          aria-describedby="category-error"
          @blur="handleBlur('category')"
          @change="validateField('category')"
        >
          <option value="" disabled>Select a category</option>
          <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
        </select>
        <p v-if="errors.category && touched.category" id="category-error" class="mt-1.5 text-xs text-rust">{{ errors.category }}</p>
      </div>

      <!-- Status -->
      <div>
        <label for="status" class="block text-sm font-medium text-ink mb-1.5">Status</label>
        <select id="status" v-model="form.status" :class="[inputBase, 'appearance-none bg-white border-paper-dim focus:border-spine']">
          <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>

      <div class="flex items-center gap-3 pt-2">
        <button
          type="submit"
          class="flex-1 rounded-lg bg-spine hover:bg-spine-dark text-white text-sm font-semibold py-2.5 transition-colors focus:outline-none"
        >
          {{ isEditing ? 'Save Changes' : 'Add Book' }}
        </button>
        <button
          v-if="isEditing"
          type="button"
          class="rounded-lg border border-paper-dim hover:bg-paper-dim text-ink-soft text-sm font-semibold px-4 py-2.5 transition-colors focus:outline-none"
          @click="handleCancel"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>
