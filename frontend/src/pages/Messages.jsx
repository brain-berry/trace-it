import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../AuthContext'

export default function Messages() {
  const { user } = useAuth()
  const [approvedClaims, setApprovedClaims] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchApprovedClaims() {
      if (!user) return

      const { data, error } = await supabase
        .from('claims')
        .select(`
          id,
          status,
          created_at,
          items (name)
        `)
        .eq('claimant_id', user.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching approved claims:', error.message)
      } else {
        setApprovedClaims(data || [])
      }

      setLoading(false)
    }

    fetchApprovedClaims()
  }, [user])

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Messages</h1>

      {loading ? (
        <p>Loading approved claims...</p>
      ) : approvedClaims.length > 0 ? (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl space-y-2">
          <h2 className="font-semibold text-green-800">🎉 Claim Approved</h2>
          {approvedClaims.map(claim => (
            <div key={claim.id}>
              Your claim for <strong>{claim.items?.name}</strong> has been <span className="font-semibold">approved</span>!
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-600 border rounded-xl bg-white p-4">
          No approved claims yet. You’ll see updates here once your item claim is approved.
        </div>
      )}

      <div className="card p-4">
        <p className="text-gray-600 text-sm mb-2">
          Real-time secure messaging between claimants and reporters will be added here soon.
        </p>
        <div className="p-3 bg-ugLightBlue rounded-xl text-sm">
          [Demo Chat] "Hi, I think this is my phone. The wallpaper is a lion and the case is scratched bottom-right."
        </div>
      </div>
    </div>
  )
}
