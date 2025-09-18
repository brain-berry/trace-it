import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Admin() {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchClaims()
  }, [statusFilter])

  async function fetchClaims() {
    setLoading(true)

    let query = supabase
      .from('claims')
      .select(`
        id,
        status,
        message,
        proof_link,
        created_at,
        items (id, name, type),
        users:claimant_id (email)
      `)
      .order('created_at', { ascending: false })

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }

    const { data, error } = await query

    if (error) {
      alert('Failed to fetch claims: ' + error.message)
    } else {
      setClaims(data || [])
    }

    setLoading(false)
  }

  async function updateStatus(id, status) {
    const { error } = await supabase
      .from('claims')
      .update({ status })
      .eq('id', id)

    if (error) {
      alert(`❌ Failed to update status: ${error.message}`)
    } else {
      console.log(`[Notification] Claim ${id} marked as: ${status}`) // placeholder
      alert(`✅ Claim marked as ${status}`)
      fetchClaims()
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Admin Dashboard – Claims</h1>

      {/* Filter dropdown */}
      <div className="mb-4">
        <label className="text-sm font-medium mr-2">Filter by status:</label>
        <select
          className="border px-2 py-1 rounded-xl"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading && <p>Loading claims...</p>}

      {claims.length === 0 && !loading && (
        <p className="text-gray-500">No claims found.</p>
      )}

      {claims.map(claim => (
        <div key={claim.id} className="card p-4 space-y-2">
          <p><strong>Item:</strong> {claim.items?.name} ({claim.items?.type})</p>
          <p><strong>Claimed by:</strong> {claim.users?.email}</p>
          <p><strong>Message:</strong> {claim.message}</p>
          <p>
            <strong>Proof link:</strong>{' '}
            {claim.proof_link ? (
              <a
                href={claim.proof_link}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                {claim.proof_link}
              </a>
            ) : (
              'No link provided'
            )}
          </p>
          <p>
            <strong>Status:</strong>{' '}
            <span
              className={
                claim.status === 'approved'
                  ? 'text-green-600'
                  : claim.status === 'rejected'
                  ? 'text-red-600'
                  : 'text-yellow-600'
              }
            >
              {claim.status.toUpperCase()}
            </span>
          </p>

          {claim.status === 'pending' && (
            <div className="mt-2 flex gap-3">
              <button
                className="btn btn-primary"
                onClick={() => updateStatus(claim.id, 'approved')}
              >
                Approve
              </button>
              <button
                className="btn btn-outline"
                onClick={() => updateStatus(claim.id, 'rejected')}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
