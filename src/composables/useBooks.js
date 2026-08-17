import { ref, watch } from 'vue'

const STORAGE_KEY = 'lms.books.v1'
const COUNTER_KEY = 'lms.bookIdCounter.v1'

/**
 * Reads the saved catalog from localStorage.
 * Falls back to a small starter catalog the first time the app runs,
 * so the UI never opens empty and unstyled.
 */
function loadBooks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (error) {
    console.error('Could not read the catalog from localStorage:', error)
  }
  return [
    { id: 'BK-0001', title: 'The Silent Observatory', author: 'Mara Ellison', category: 'Science', status: 'Available' },
    { id: 'BK-0002', title: 'Coastal Roads', author: 'Ines Delacroix', category: 'Fiction', status: 'Borrowed' },
    { id: 'BK-0003', title: 'Foundations of Systems Design', author: 'R. K. Ambrose', category: 'Technology', status: 'Under Maintenance' },
  ]
}

function loadCounter(seedBooks) {
  const raw = localStorage.getItem(COUNTER_KEY)
  if (raw) return parseInt(raw, 10) || 0
  // Derive a safe starting counter from any seeded/imported IDs like "BK-0003"
  const seeded = seedBooks.reduce((max, book) => {
    const match = /^BK-(\d+)$/.exec(book.id)
    return match ? Math.max(max, parseInt(match[1], 10)) : max
  }, 0)
  return seeded
}

export function useBooks() {
  const books = ref(loadBooks())
  let idCounter = loadCounter(books.value)

  // Persist on every change (add, edit, delete, or reorder)
  watch(
    books,
    (value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      } catch (error) {
        console.error('Could not save the catalog to localStorage:', error)
      }
    },
    { deep: true }
  )

  function persistCounter() {
    localStorage.setItem(COUNTER_KEY, String(idCounter))
  }

  function nextId() {
    idCounter += 1
    persistCounter()
    return `BK-${String(idCounter).padStart(4, '0')}`
  }

  function addBook({ title, author, category, status }) {
    const book = {
      id: nextId(),
      title: title.trim(),
      author: author.trim(),
      category,
      status,
    }
    books.value = [book, ...books.value]
    return book
  }

  function updateBook(id, { title, author, category, status }) {
    const index = books.value.findIndex((book) => book.id === id)
    if (index === -1) return false
    books.value = books.value.map((book, i) =>
      i === index ? { ...book, title: title.trim(), author: author.trim(), category, status } : book
    )
    return true
  }

  function deleteBook(id) {
    const before = books.value.length
    books.value = books.value.filter((book) => book.id !== id)
    return books.value.length !== before
  }

  return { books, addBook, updateBook, deleteBook }
}
