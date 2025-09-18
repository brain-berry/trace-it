export default function Filters({
  search, setSearch,
  category, setCategory,
  location, setLocation,
  date, setDate,
  status, setStatus // ✅ NEW
}) {
  return (
    <div className="card p-4 grid md:grid-cols-5 gap-3">
      <input
        className="border rounded-xl px-3 py-2"
        placeholder="Search..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <select
        className="border rounded-xl px-3 py-2"
        value={category}
        onChange={e => setCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        <option>Phone</option>
        <option>ID Card</option>
        <option>Bag</option>
        <option>Laptop</option>
        <option>Other</option>
      </select>

      <input
        className="border rounded-xl px-3 py-2"
        placeholder="Location"
        value={location}
        onChange={e => setLocation(e.target.value)}
      />

      <input
        className="border rounded-xl px-3 py-2"
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
      />

      <select
        className="border rounded-xl px-3 py-2"
        value={status}
        onChange={e => setStatus(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="available">Available</option>
        <option value="pending">Pending</option>
        <option value="approved">Claimed</option>
      </select>
    </div>
  )
}
