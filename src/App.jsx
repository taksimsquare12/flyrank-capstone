import React from 'react'
import UserSettingsForm from './components/UserSettingsForm'

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>User Settings</h1>
      </header>
      <main>
        <UserSettingsForm />
      </main>
    </div>
  )
}
