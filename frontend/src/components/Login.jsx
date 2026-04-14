import { useState } from 'react'
import { signIn, getCurrentUser } from 'aws-amplify/auth'
import styles from './Form.module.css'

const COGNITO_ERRORS = {
  NotAuthorizedException: 'Incorrect email or password.',
  UserNotFoundException: 'No account found with that email.',
  UserNotConfirmedException: 'Please confirm your email before logging in.',
}

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError(null)

    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    setLoading(true)
    try {
      await signIn({ username: email, password })
      const user = await getCurrentUser()
      onLogin(user)
    } catch (e) {
      setError(COGNITO_ERRORS[e.name] ?? e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.form}>
      <div className={styles.formBar}>Login</div>
      <div className={styles.formBody}>
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={error && !email ? styles.inputError : ''}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className={error && !password ? styles.inputError : ''}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </div>
    </div>
  )
}
