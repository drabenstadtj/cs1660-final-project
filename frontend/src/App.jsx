import { useState, useEffect } from 'react'
import { signIn, signUp, signOut, getCurrentUser, fetchAuthSession, confirmSignUp } from 'aws-amplify/auth'
const API_URL = 'https://jvjkzd3e00.execute-api.us-east-1.amazonaws.com/Prod'

export default function App() {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [view, setView] = useState('posts') // 'posts', 'login', 'signup'

  // check if user is already logged in on load
  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
  }, [])

  // fetch posts on load
  useEffect(() => {
    fetch(`${API_URL}/posts`)
      .then(res => res.json())
      .then(setPosts)
  }, [])

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1>Overcast</h1>
      <nav>
        <button onClick={() => setView('posts')}>Posts</button>
        {user
          ? <button onClick={() => signOut().then(() => setUser(null))}>Sign out</button>
          : <>
              <button onClick={() => setView('login')}>Login</button>
              <button onClick={() => setView('signup')}>Sign up</button>
            </>
        }
        {user && <span> Logged in as {user.username}</span>}
      </nav>

      {view === 'posts' && <PostsList posts={posts} user={user} onPostCreated={p => setPosts([...posts, p])} />}
      {view === 'login' && <Login onLogin={u => { setUser(u); setView('posts') }} />}
      {view === 'signup' && <Signup onSignup={() => setView('login')} />}
    </div>
  )
}

function PostsList({ posts, user, onPostCreated }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleCreate = async () => {
  const { tokens } = await fetchAuthSession()
  const token = tokens.idToken.toString()

  const res = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify({ title, content, author: user.username }),
  })
  const post = await res.json()
  onPostCreated(post)
  setTitle('')
  setContent('')
}

  return (
    <div>
      {user && (
        <div>
          <h2>New Post</h2>
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />
          <button onClick={handleCreate}>Publish</button>
        </div>
      )}
      <h2>Posts</h2>
      {posts.map(post => (
        <div key={post.postId}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <small>by {post.author} · {new Date(post.createdAt).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  )
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    await signIn({ username: email, password })
    const user = await getCurrentUser()
    onLogin(user)
  }

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

function Signup({ onSignup }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState('signup') // 'signup' or 'confirm'

  const handleSignup = async () => {
    await signUp({ username: email, password, options: { userAttributes: { email } } })
    setStep('confirm')
  }

  const handleConfirm = async () => {
    await confirmSignUp({ username: email, confirmationCode: code })
    onSignup()
  }

  return (
    <div>
      {step === 'signup' ? (
        <>
          <h2>Sign up</h2>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={handleSignup}>Sign up</button>
        </>
      ) : (
        <>
          <h2>Confirm your email</h2>
          <input placeholder="Verification code" value={code} onChange={e => setCode(e.target.value)} />
          <button onClick={handleConfirm}>Confirm</button>
        </>
      )}
    </div>
  )
}