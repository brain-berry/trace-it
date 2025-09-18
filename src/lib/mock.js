// Simple mock storage using localStorage
const KEY = "traceit_items_v1"

export function seed() {
  if (localStorage.getItem(KEY)) return
  const now = new Date()
  const items = [
    {
      id: "l1",
      type: "lost",
      name: "Black Samsung Phone",
      description: "Black Samsung Galaxy A52 with cracked screen protector.",
      category: "Phone",
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate()-2).toISOString(),
      location: "Balme Library",
      image: "https://picsum.photos/seed/phone/200/200",
      reporter: "st12345678",
    },
    {
      id: "f1",
      type: "found",
      name: "UG Student ID Card",
      description: "Student ID card for 'E. Mensah' found near the CS Dept.",
      category: "ID Card",
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate()-1).toISOString(),
      location: "Computer Science Building",
      image: "https://picsum.photos/seed/id/200/200",
      reporter: "st87654321",
    },
    {
      id: "l2",
      type: "lost",
      name: "Grey Backpack",
      description: "Grey backpack with notebooks and a calculator.",
      category: "Bag",
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate()-4).toISOString(),
      location: "Business School",
      image: "https://picsum.photos/seed/bag/200/200",
      reporter: "st11223344",
    }
  ]
  localStorage.setItem(KEY, JSON.stringify(items))
}

export function getItems() {
  const raw = localStorage.getItem(KEY)
  return raw ? JSON.parse(raw) : []
}

export function saveItem(item) {
  const items = getItems()
  items.push(item)
  localStorage.setItem(KEY, JSON.stringify(items))
}

export function getItem(id) {
  return getItems().find(i => i.id === id)
}

export function filterItems({ type, search, category, location, date }) {
  return getItems().filter(i => {
    if (type && i.type !== type) return false
    if (category && i.category !== category) return false
    if (location && !i.location.toLowerCase().includes(location.toLowerCase())) return false
    if (date && i.date.slice(0,10) !== date) return false
    if (search) {
      const q = search.toLowerCase()
      const inText = (i.name + " " + i.description).toLowerCase()
      if (!inText.includes(q)) return false
    }
    return true
  })
}

export function uid(prefix="id") {
  return prefix + Math.random().toString(36).slice(2, 8)
}
