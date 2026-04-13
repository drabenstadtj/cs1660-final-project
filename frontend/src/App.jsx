import { useState, useEffect } from 'react'
import { getCurrentUser } from 'aws-amplify/auth'
import { API_URL } from './api'
import Navbar from './components/Navbar'
import PostsList from './components/PostsList'
import Login from './components/Login'
import Signup from './components/Signup'
import styles from './App.module.css'

export default function App() {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [view, setView] = useState('posts') // 'posts', 'login', 'signup'

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
  }, [])

  useEffect(() => {
    fetch(`${API_URL}/posts`)
      .then(res => res.json())
      .then(setPosts)
  }, [])

  const handleNavigate = (dest) => {
    if (dest === 'logout') {
      setUser(null)
      setView('posts')
    } else {
      setView(dest)
    }
  }

  return (
    <div className={styles.wrapper}>
      <Navbar user={user} onNavigate={handleNavigate} />

      {view === 'posts' && (
        <PostsList posts={posts} user={user} onPostCreated={p => setPosts([...posts, p])} />
      )}
      {view === 'login' && (
        <Login onLogin={u => { setUser(u); setView('posts') }} />
      )}
      {view === 'signup' && (
        <Signup onSignup={() => setView('login')} />
      )}
    </div>
  )
}
