import { useState } from 'react'
import { signUp, confirmSignUp } from 'aws-amplify/auth'
import { API_URL } from '../api'
import styles from './Form.module.css'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERNAME_RE = /^[a-zA-Z0-9_-]{3,20}$/

function validatePassword(pw) {
  if (pw.length < 8)            return 'Password must be at least 8 characters.'
  if (!/[A-Z]/.test(pw))        return 'Password must contain an uppercase letter.'
  if (!/[a-z]/.test(pw))        return 'Password must contain a lowercase letter.'
  if (!/[0-9]/.test(pw))        return 'Password must contain a number.'
  if (!/[^A-Za-z0-9]/.test(pw)) return 'Password must contain a symbol.'
  return null
}

const COGNITO_ERRORS = {
  UsernameExistsException: 'An account with that username already exists.',
  CodeMismatchException: 'Incorrect verification code.',
  ExpiredCodeException: 'Code has expired. Please request a new one.',
}

export default function Signup({ onSignup }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState('signup')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    setError(null)

    if (!USERNAME_RE.test(username)) {
      setError('Username must be 3–20 characters: letters, numbers, _ or - only.')
      return
    }
    if (!EMAIL_RE.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    const pwError = validatePassword(password)
    if (pwError) { setError(pwError); return }

    setLoading(true)
    try {
      await signUp({ username, password, options: { userAttributes: { email } } })
      setStep('confirm')
    } catch (e) {
      setError(COGNITO_ERRORS[e.name] ?? e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async () => {
    setError(null)
    if (!code.trim()) { setError('Please enter the verification code.'); return }

    setLoading(true)
    try {
      await confirmSignUp({ username, confirmationCode: code })

      // Save user profile to DynamoDB
      await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email }),
      })

      onSignup()
    } catch (e) {
      setError(COGNITO_ERRORS[e.name] ?? e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.form}>
      {step === 'signup' ? (
        <>
          <div className={styles.formBar}>Sign up</div>
          <div className={styles.formBody}>
            <input
              placeholder="Username (3–20 chars, letters/numbers/_/-)"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <input
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {error && <p className={styles.error}>{error}</p>}
            <button onClick={handleSignup} disabled={loading}>
              {loading ? 'Signing up…' : 'Sign up'}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className={styles.formBar}>Confirm Email</div>
          <div className={styles.formBody}>
            <input
              placeholder="Verification code"
              value={code}
              onChange={e => setCode(e.target.value)}
              className={error && !code.trim() ? styles.inputError : ''}
            />
            {error && <p className={styles.error}>{error}</p>}
            <button onClick={handleConfirm} disabled={loading}>
              {loading ? 'Confirming…' : 'Confirm'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
