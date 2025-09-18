import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('guest') // ✅ start as guest
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      // ⏱️ Timeout fallback after 2 seconds
      const timeout = setTimeout(() => {
        console.warn('⏱️ Supabase auth timed out, setting guest role.')
        setUser(null)
        setRole('guest')
        setLoading(false)
      }, 2000)

      try {
        const { data: { user } } = await supabase.auth.getUser()
        clearTimeout(timeout) // ✅ clear timeout if Supabase responds

        if (!user) {
          setUser(null)
          setRole('guest')
          setLoading(false)
          return
        }

        const email = user.email?.toLowerCase() || ''
        const allowed = email.endsWith('@st.ug.edu.gh') || email.endsWith('@ug.edu.gh')

        if (!allowed) {
          alert('Only UG emails are allowed.')
          await supabase.auth.signOut()
          setUser(null)
          setRole('guest')
          setLoading(false)
          return
        }

        setUser(user)

        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        if (error || !data) {
          setRole('user')
        } else {
          setRole(data.role || 'user')
        }

        setLoading(false)
      } catch (err) {
        console.error('❌ Auth loading error:', err)
        clearTimeout(timeout)
        setUser(null)
        setRole('guest')
        setLoading(false)
      }
    }

    loadUser()

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user || null

      if (!user) {
        setUser(null)
        setRole('guest')
        return
      }

      const email = user.email?.toLowerCase() || ''
      const allowed = email.endsWith('@st.ug.edu.gh') || email.endsWith('@ug.edu.gh')

      if (!allowed) {
        alert('Only UG emails are allowed.')
        await supabase.auth.signOut()
        setUser(null)
        setRole('guest')
        return
      }

      setUser(user)

      try {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        if (error || !data) {
          setRole('user')
        } else {
          setRole(data.role || 'user')
        }
      } catch (err) {
        console.error('Role fetch error (auth change):', err)
        setRole('user')
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      role,
      loading,
      logout: () => supabase.auth.signOut()
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
