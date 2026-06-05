import { useState } from 'react'
import { Mail, MapPin, MessageSquare, Send } from 'lucide-react'
import Seo from '../components/seo/Seo'
import { toast } from 'sonner'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSending(true)
    setTimeout(() => {
      toast.success('Message received! We will get back to you soon.')
      setForm({ name: '', email: '', subject: '', message: '' })
      setSending(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <Seo title="Contact" description="Get in touch with the AI Tools Library team." path="/contact" />
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-primary-100 text-lg">Questions, feedback, or partnership ideas — we are here to help.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <Mail className="w-8 h-8 text-primary-600 mb-4" />
              <h3 className="font-semibold mb-2">Email</h3>
              <a href="mailto:hello@aitoolslib.com" className="text-primary-600 hover:underline">
                hello@aitoolslib.com
              </a>
            </div>
            <div className="card p-6">
              <MessageSquare className="w-8 h-8 text-primary-600 mb-4" />
              <h3 className="font-semibold mb-2">Response time</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">We typically reply within 1–2 business days.</p>
            </div>
            <div className="card p-6">
              <MapPin className="w-8 h-8 text-primary-600 mb-4" />
              <h3 className="font-semibold mb-2">Location</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Remote-first team serving users worldwide.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="lg:col-span-3 card p-8 space-y-4">
            <h2 className="text-xl font-bold mb-2">Send a message</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input className="input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea className="input min-h-[140px]" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            </div>
            <button type="submit" disabled={sending} className="btn-primary flex items-center gap-2 disabled:opacity-50">
              <Send className="w-4 h-4" />
              {sending ? 'Sending...' : 'Send message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
