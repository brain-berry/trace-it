import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { v4 as uuid } from 'uuid'

export default function ReportLost() {
  const nav = useNavigate()
  const { user } = useAuth()

  const [form, setForm] = useState({
    name: '', description: '', category: '', date: '', location: '', imageFile: null
  })
  const [uploading, setUploading] = useState(false)
  const [matches, setMatches] = useState([])
  const [showMatches, setShowMatches] = useState(false)

  async function handleImageUpload(file) {
    const ext = file.name.split('.').pop()
    const path = `lost/${uuid()}.${ext}`

    const { error: uploadError } = await supabase
      .storage
      .from('item-images')
      .upload(path, file)

    if (uploadError) {
      alert('Image upload failed: ' + uploadError.message)
      return null
    }

    const { data: publicUrlData } = supabase
      .storage
      .from('item-images')
      .getPublicUrl(path)

    return publicUrlData?.publicUrl || null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!user) return alert('Please log in with your UG email first.')

    setUploading(true)

    let imageUrl = ''
    if (form.imageFile) {
      imageUrl = await handleImageUpload(form.imageFile)
      if (!imageUrl) {
        setUploading(false)
        return
      }
    }

    const { data: inserted, error } = await supabase.from('items').insert({
      name: form.name,
      description: form.description,
      category: form.category,
      date: form.date,
      location: form.location,
      type: 'lost',
      image_url: imageUrl,
      reporter_id: user.id,
    }).select('id').single()

    if (error) {
      alert('❌ Failed to report item: ' + error.message)
      setUploading(false)
      return
    }

    // ✅ Smart matching RPC
    const { data: m, error: matchError } = await supabase.rpc('smart_match_for_item', {
      p_item_id: inserted.id,
      p_limit: 5
    })

    setUploading(false)

    if (!matchError && m?.length) {
      setMatches(m)
      setShowMatches(true)
    } else {
      nav('/lost')
    }
  }

  return (
    <div className="max-w-2xl card p-6 mx-auto">
      <h1 className="text-xl font-bold mb-4">Report Lost Item</h1>
      <form className="grid gap-3" onSubmit={handleSubmit}>
        <input required placeholder="Item name" className="border px-3 py-2 rounded-xl"
          value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

        <textarea required placeholder="Description" className="border px-3 py-2 rounded-xl"
          value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

        <select required className="border px-3 py-2 rounded-xl"
          value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
          <option value="">Select category</option>
          <option>Phone</option><option>ID Card</option><option>Bag</option><option>Laptop</option><option>Other</option>
        </select>

        <input required type="date" className="border px-3 py-2 rounded-xl"
          value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />

        <input required placeholder="Last seen location" className="border px-3 py-2 rounded-xl"
          value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />

        <input type="file" accept="image/*" className="border px-3 py-2 rounded-xl"
          onChange={e => setForm({ ...form, imageFile: e.target.files[0] })} />

        {form.imageFile && (
          <img src={URL.createObjectURL(form.imageFile)} alt="Preview"
            className="h-32 mt-2 rounded-xl border object-cover" />
        )}

        <button className="btn btn-primary" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Submit'}
        </button>
      </form>

      {showMatches && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center p-4 z-50">
          <div className="card p-6 max-w-2xl bg-white">
            <h2 className="text-lg font-semibold mb-2">We found similar items</h2>
            <p className="text-sm text-gray-600 mb-3">These might match what you just posted:</p>
            <div className="grid gap-3">
              {matches.map(m => (
                <div key={m.id} className="flex gap-3 p-3 border rounded-xl">
                  <img src={m.image_url} alt={m.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-gray-500">{m.location}</div>
                    <p className="text-xs text-gray-600 line-clamp-2">{m.description}</p>
                    <a href={`/item/${m.id}`} className="btn btn-outline mt-2 text-sm">View</a>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="btn btn-outline" onClick={() => setShowMatches(false)}>Close</button>
              <button className="btn btn-primary" onClick={() => { setShowMatches(false); nav('/lost') }}>Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
