import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import ItemCard from '../components/ItemCard'
import Filters from '../components/Filters'

export default function FoundItems() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [status, setStatus] = useState("")
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()
  }, [search, category, location, date, status])

  async function fetchItems() {
    setLoading(true)
    let query = supabase
      .from('items')
      .select(`
        *,
        claims (status)
      `)
      .eq('type', 'found')

    if (category) query = query.eq('category', category)
    if (location) query = query.ilike('location', `%${location}%`)
    if (date) query = query.eq('date', date)
    if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)

    const { data, error } = await query
    if (error) {
      console.error("Failed to fetch found items:", error)
      setItems([])
    } else {
      const mapped = data.map(item => {
        const claimed = item.claims?.some(c => c.status === 'approved')
        return { ...item, claim_status: claimed ? 'claimed' : 'available' }
      })
      const filtered = status ? mapped.filter(i => i.claim_status === status) : mapped
      setItems(filtered)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Found Items</h1>
      <Filters
        {...{ search, setSearch, category, setCategory, location, setLocation, date, setDate, status, setStatus }}
      />
      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-500">No items found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map(it => (
            <ItemCard key={it.id} item={it} />
          ))}
        </div>
      )}
    </div>
  )
}
