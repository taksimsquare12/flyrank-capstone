import React, { useState, useEffect } from 'react'

const STORAGE_KEY = 'user_settings_v1'

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email)
}

export default function UserSettingsForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    receiveNotifications: true,
    theme: 'system',
    bio: '',
  })
  const [status, setStatus] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        setForm(JSON.parse(raw))
      } catch (e) {}
    }
  }, [])

  function handleChange(e) {
    const { name, type, value, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function validate() {
    const err = {}
    if (!form.name.trim()) err.name = 'Name is required'
    if (form.email && !validateEmail(form.email)) err.email = 'Invalid email'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  function handleSave(e) {
    e.preventDefault()
    if (!validate()) {
      setStatus('error')
      return
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
    setStatus('saved')
    setTimeout(() => setStatus(null), 2000)
  }

  function handleReset() {
    localStorage.removeItem(STORAGE_KEY)
    setForm({ name: '', email: '', receiveNotifications: true, theme: 'system', bio: '' })
    setStatus('reset')
    setTimeout(() => setStatus(null), 2000)
  }

  return (
    <form className="settings-form" onSubmit={handleSave}>
      <label>
        Name
        <input name="name" value={form.name} onChange={handleChange} />
        {errors.name && <div className="error">{errors.name}</div>}
      </label>

      <label>
        Email
        <input name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
        {errors.email && <div className="error">{errors.email}</div>}
      </label>

      <label className="checkbox">
        <input name="receiveNotifications" type="checkbox" checked={form.receiveNotifications} onChange={handleChange} /> Receive notifications
      </label>

      <label>
        Theme
        <select name="theme" value={form.theme} onChange={handleChange}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </label>

      <label>
        Bio
        <textarea name="bio" value={form.bio} onChange={handleChange} rows={4} />
      </label>

      <div className="actions">
        <button type="submit">Save</button>
        <button type="button" className="muted" onClick={handleReset}>Reset</button>
      </div>

      {status === 'saved' && <div className="notice success">Settings saved</div>}
      {status === 'reset' && <div className="notice">Settings reset</div>}
      {status === 'error' && <div className="notice error">Please fix errors above</div>}
    </form>
  )
}
