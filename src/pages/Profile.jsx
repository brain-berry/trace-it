import { seed, getItems } from '../lib/mock'
import { useEffect, useState } from 'react'

export default function Profile() {
  const [items, setItems] = useState([])
  useEffect(() => { seed(); setItems(getItems().filter(i => i.reporter === "demoUser")) }, [])
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">My Profile</h1>
      <p className="text-gray-600 text-sm">Demo user. Your reported items will appear here.</p>
      <ul className="list-disc pl-5">
        {items.map(i => <li key={i.id}>{i.type.toUpperCase()} — {i.name}</li>)}
      </ul>
    </div>
  )
}
