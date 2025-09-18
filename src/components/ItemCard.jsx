import { Link } from 'react-router-dom'

export default function ItemCard({ item }) {
  const statusColor = {
    available: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-blue-100 text-blue-800",
    claimed: "bg-blue-100 text-blue-800", // alias of approved
    rejected: "bg-red-100 text-red-800"
  }

  const claimStatus = item.claim_status || 'available'
  const statusLabel = claimStatus === 'approved' ? 'Claimed' :
                      claimStatus === 'pending' ? 'Pending Review' :
                      claimStatus === 'rejected' ? 'Rejected' :
                      'Available'

  return (
    <div className="card p-4 flex gap-4">
      <img src={item.image_url || item.image} alt={item.name} className="w-28 h-28 object-cover rounded-xl border" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <span className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>

        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="px-2 py-1 rounded-full bg-ugLightBlue text-ugBlue">{item.category}</span>
          <span className="text-gray-500">• {item.location}</span>
          {item.claim_status === 'claimed' && (
            <span className="ml-2 px-2 py-1 text-white text-xs rounded-full bg-green-600">Claimed</span>
          )}
        </div>


        <div className="mt-2 flex items-center gap-2 text-xs flex-wrap">
          <span className="px-2 py-1 rounded-full bg-ugLightBlue text-ugBlue">{item.category}</span>
          <span className="text-gray-500">• {item.location}</span>
          <span className={`px-2 py-1 rounded-full ${statusColor[claimStatus]} ml-auto`}>
            {statusLabel}
          </span>
        </div>

        <div className="mt-3">
          <Link className="btn btn-outline text-sm" to={`/item/${item.id}`}>View details</Link>
        </div>
      </div>
    </div>
  )
}
