import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Navbar() {
  const { user, role, logout } = useAuth()

  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-ugBlue">TraceIt</span>
          <span className="text-xs text-gray-500">UG Lost & Found</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-3 text-sm">
          <NavLink className={({ isActive }) => isActive ? "text-ugBlue font-semibold" : "text-gray-700"} to="/lost">Lost</NavLink>
          <NavLink className={({ isActive }) => isActive ? "text-ugBlue font-semibold" : "text-gray-700"} to="/found">Found</NavLink>
          <NavLink className={({ isActive }) => isActive ? "text-ugBlue font-semibold" : "text-gray-700"} to="/report/lost">Report Lost</NavLink>
          <NavLink className={({ isActive }) => isActive ? "text-ugBlue font-semibold" : "text-gray-700"} to="/report/found">Report Found</NavLink>
          <NavLink className={({ isActive }) => isActive ? "text-ugBlue font-semibold" : "text-gray-700"} to="/messages">Messages</NavLink>
          <NavLink className={({ isActive }) => isActive ? "text-ugBlue font-semibold" : "text-gray-700"} to="/profile">Profile</NavLink>

          {/* Admin link only if role is admin */}
          {role === 'admin' && (
            <NavLink className={({ isActive }) => isActive ? "text-ugBlue font-semibold" : "text-gray-700"} to="/admin">Admin</NavLink>
          )}

          {/* Login / Logout */}
          {user ? (
            <button onClick={logout} className="text-xs text-red-600 border border-red-600 rounded-lg px-2 py-1 hover:bg-red-50">
              Logout
            </button>
          ) : (
            <NavLink to="/login" className="text-xs text-ugBlue border border-ugBlue px-2 py-1 rounded-lg hover:bg-ugLightBlue">
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}
