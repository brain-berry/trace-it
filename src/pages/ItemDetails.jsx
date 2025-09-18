import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../AuthContext'

export default function ItemDetails() {
  const { id } = useParams()
  const nav = useNavigate()
  const { user } = useAuth()

  const [item, setItem] = useState(null)
  const [showClaim, setShowClaim] = useState(false)
  const [claim, setClaim] = useState({ message: "", proof: "" })
  const [myClaim, setMyClaim] = useState(null)
  const [loading, setLoading] = useState(true)

  // 🔍 Fetch item + claims
  useEffect(() => {
    async function fetchItemWithClaimStatus() {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          claims (
            status
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error('Item fetch failed:', error.message)
      } else {
        const isClaimed = data.claims?.some(claim => claim.status === 'approved')
        setItem({ ...data, claim_status: isClaimed ? 'claimed' : 'available' })
      }

      setLoading(false)
    }

    fetchItemWithClaimStatus()
  }, [id])

  // 👤 Check if current user already submitted a claim
  useEffect(() => {
    async function fetchClaim() {
      if (!user) return
      const { data } = await supabase
        .from('claims')
        .select('*')
        .eq('item_id', id)
        .eq('claimant_id', user.id)
        .single()
      if (data) setMyClaim(data)
    }

    fetchClaim()
  }, [user, id])

  async function submitClaim(e) {
    e.preventDefault()
    if (!user) return alert('Please log in to submit a claim.')

    // Check again if item already has approved claim (frontend check)
    const { data: existingApproved } = await supabase
      .from('claims')
      .select('id')
      .eq('item_id', id)
      .eq('status', 'approved')
      .limit(1)

    if (existingApproved?.length > 0) {
      alert('❌ This item has already been claimed.')
      setShowClaim(false)
      return
    }

    const { error } = await supabase.from('claims').insert({
      item_id: id,
      claimant_id: user.id,
      message: claim.message,
      proof_link: claim.proof,
      status: 'pending'
    })

    if (error) {
      alert("❌ Failed to submit claim: " + error.message)
    } else {
      alert("✅ Claim submitted. Admin will review it.")
      setShowClaim(false)
      nav('/messages')
    }
  }

  if (loading) return <p>Loading...</p>
  if (!item) return <p>Item not found.</p>

  return (
    <div className="max-w-3xl mx-auto grid gap-4">
      <div className="card p-4">
        <div className="grid md:grid-cols-2 gap-4">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-64 object-cover rounded-xl border"
          />
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              {item.name}
              {item.claim_status === 'claimed' && (
                <span className="px-2 py-1 text-xs rounded-full bg-green-600 text-white">
                  Claimed
                </span>
              )}
            </h1>
            <p className="text-gray-600">{item.description}</p>
            <div className="mt-2 text-sm text-gray-700">
              Location: <strong>{item.location}</strong>
            </div>
            <div className="text-sm text-gray-700">
              Date: <strong>{new Date(item.date).toLocaleDateString()}</strong>
            </div>

            {item.claim_status === 'claimed' ? (
              <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-xl text-sm">
                This item has already been claimed and approved.
              </div>
            ) : myClaim ? (
              <div className="mt-4 p-3 bg-ugLightBlue rounded-xl text-sm">
                You’ve already claimed this item. Status:{" "}
                <strong>{myClaim.status}</strong>
              </div>
            ) : (
              <div className="mt-4 flex gap-2">
                <button className="btn btn-primary" onClick={() => setShowClaim(true)}>
                  Claim Item
                </button>
                <button className="btn btn-outline" onClick={() => window.history.back()}>
                  Back
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showClaim && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center p-4 z-50">
          <form
            onSubmit={submitClaim}
            className="card p-6 max-w-lg w-full bg-white"
          >
            <h2 className="text-xl font-semibold mb-3">Submit Claim</h2>
            <p className="text-sm text-gray-600 mb-2">
              Describe proof/unique identifiers (e.g., lock screen wallpaper,
              serial number).
            </p>
            <textarea
              required
              className="border rounded-xl px-3 py-2 mb-2"
              placeholder="Message to reporter"
              value={claim.message}
              onChange={(e) => setClaim({ ...claim, message: e.target.value })}
            />
            <input
              className="border rounded-xl px-3 py-2 mb-4"
              placeholder="Optional proof link (Google Drive/Photo URL)"
              value={claim.proof}
              onChange={(e) => setClaim({ ...claim, proof: e.target.value })}
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowClaim(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary">Send Claim</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
