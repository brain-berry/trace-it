import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../AuthContext'

export default function Chat() {
  const { claimId } = useParams()
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const chatEndRef = useRef()

  useEffect(() => {
    fetchMessages()
    const channel = supabase.channel(`claim-chat-${claimId}`)

    channel
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `claim_id=eq.${claimId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [claimId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  async function fetchMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('claim_id', claimId)
      .order('sent_at', { ascending: true })

    if (data) setMessages(data)
  }

  async function sendMessage(e) {
    e.preventDefault()
    if (!input.trim()) return

    const { error } = await supabase.from('messages').insert({
      claim_id: claimId,
      sender_id: user.id,
      content: input.trim()
    })

    if (error) alert('❌ Failed to send: ' + error.message)
    else setInput('')
  }

  function scrollToBottom() {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="max-w-2xl mx-auto h-[80vh] card p-4 flex flex-col">
      <h1 className="text-lg font-semibold mb-3">Live Chat</h1>
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs p-2 rounded-xl text-sm ${
              msg.sender_id === user.id
                ? 'ml-auto bg-blue-100 text-right'
                : 'bg-gray-200'
            }`}
          >
            {msg.content}
            <div className="text-xs text-gray-500 mt-1">
              {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      <form onSubmit={sendMessage} className="mt-4 flex gap-2">
        <input
          className="flex-1 border px-3 py-2 rounded-xl"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="btn btn-primary">Send</button>
      </form>
    </div>
  )
}
