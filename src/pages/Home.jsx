import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import ItemCard from '../components/ItemCard'

export default function Home() {
  const [items, setItems] = useState([])

  useEffect(() => {
    async function fetchItems() {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4)

      if (error) {
        console.error('❌ Failed to load items:', error.message)
      } else {
        setItems(data || [])
      }
    }

    fetchItems()
  }, [])

  return (
    <div className="space-y-6">
      <section className="card p-6 bg-gradient-to-r from-ugLightBlue to-white">
        <h1 className="text-2xl font-bold text-ugBlue">Welcome to TraceIt</h1>
        <p className="text-gray-600 mt-1">UG's simple lost & found. Report, search, and reclaim items.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="btn btn-primary" to="/report/lost">Report Lost Item</Link>
          <Link className="btn btn-outline" to="/report/found">Report Found Item</Link>
          <Link className="btn btn-outline" to="/lost">Browse Lost</Link>
          <Link className="btn btn-outline" to="/found">Browse Found</Link>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Recent Items</h2>
        {items.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {items.map(it => (
              <ItemCard key={it.id} item={it} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No items found yet.</p>
        )}
      </section>
    </div>
  )
}
