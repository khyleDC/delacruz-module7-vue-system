import { ref, watch } from 'vue'

const STORAGE_KEY = 'lms.books.v1'

export const CATEGORIES = [
  'Fiction',
  'Non-Fiction',
  'Science',
  'Technology',
  'History',
  'Children',
  'Reference',
  'Biography',
  'Others',
]

export const STATUSES = ['Available', 'Borrowed', 'Under Maintenance']

const SEED_BOOKS = [
  { id: 'BK-0001', title: 'The Silent Archive', author: 'Mireille Voss', category: 'Fiction', status: 'Available' },
  { id: 'BK-0002', title: 'Data Structures Simplified', author: 'R. Anand', category: 'Technology', status: 'Borrowed' },
  { id: 'BK-0003', title: 'A Brief History of Time', author: 'Stephen Hawking', category: 'Science', status: 'Available' },
  { id: 'BK-0004', title: 'The Filipino Struggle', author: 'Teodoro Agoncillo', category: 'History', status: 'Under Maintenance' },
]

function loadBooks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return [...SEED_BOOKS]
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return [...SEED_BOOKS]
    return parsed
  } catch (err) {
    console.error('Failed to read books from localStorage:', err)
    return [...SEED_BOOKS]
  }
}

function persistBooks(books) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
  } catch (err) {
    console.error('Failed to save books to localStorage:', err)
  }
}

function nextBookId(books) {
  const maxNum = books.reduce((max, book) => {
    const match = /^BK-(\d+)$/.exec(book.id || '')
    if (!match) return max
    return Math.max(max, parseInt(match[1], 10))
  }, 0)
  return `BK-${String(maxNum + 1).padStart(4, '0')}`
}

/**
 * useBooks — owns the book list and every mutation, persisting to
 * localStorage after every change. Kept framework-agnostic-ish so the
 * components stay focused on presentation.
 */
export function useBooks() {
  const books = ref(loadBooks())

  watch(books, (value) => persistBooks(value), { deep: true })

  function addBook({ title, author, category, status }) {
    const book = {
      id: nextBookId(books.value),
      title: title.trim(),
      author: author.trim(),
      category,
      status: status || 'Available',
    }
    books.value = [book, ...books.value]
    return book
  }

  function updateBook(id, changes) {
    const index = books.value.findIndex((b) => b.id === id)
    if (index === -1) return null
    const updated = {
      ...books.value[index],
      ...changes,
      title: (changes.title ?? books.value[index].title).trim(),
      author: (changes.author ?? books.value[index].author).trim(),
    }
    const next = [...books.value]
    next[index] = updated
    books.value = next
    return updated
  }

  function deleteBook(id) {
    books.value = books.value.filter((b) => b.id !== id)
  }

  function setStatus(id, status) {
    return updateBook(id, { status })
  }

  return {
    books,
    addBook,
    updateBook,
    deleteBook,
    setStatus,
  }
}
