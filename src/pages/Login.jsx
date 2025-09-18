import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) {
      alert('Error sending magic link: ' + error.message)
    } else {
      setMsg('✅ Check your UG email for the magic login link.')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 card p-6">
      <h1 className="text-xl font-bold mb-4">Log in with UG Email</h1>
      <form className="grid gap-3" onSubmit={handleLogin}>
        <input
          required
          type="email"
          placeholder="Your UG email"
          className="border px-3 py-2 rounded-xl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn btn-primary">Send Magic Link</button>
      </form>
      {msg && <p className="mt-3 text-green-600 text-sm">{msg}</p>}
    </div>
  )
}
