import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import LostItems from './pages/LostItems'
import FoundItems from './pages/FoundItems'
import ReportLost from './pages/ReportLost'
import ReportFound from './pages/ReportFound'
import ItemDetails from './pages/ItemDetails'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import Messages from './pages/Messages'
import Login from './pages/Login'
import Chat from './pages/Chat'
import { useAuth } from './AuthContext'

export default function App() {
  const { role, loading } = useAuth()

  console.log('🔥 ROLE:', role)
  console.log('📦 LOADING:', loading)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ugGrey">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lost" element={<LostItems />} />
          <Route path="/found" element={<FoundItems />} />
          <Route path="/report/lost" element={<ReportLost />} />
          <Route path="/report/found" element={<ReportFound />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:claimId" element={<Chat />} />
          <Route path="/login" element={<Login />} />

          {/* Only show /admin if user is admin */}
          {role === 'admin' && <Route path="/admin" element={<Admin />} />}

          {/* Redirect anything unknown */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
