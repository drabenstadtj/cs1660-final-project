import { useState } from 'react'
import { signIn, getCurrentUser } from 'aws-amplify/auth'
import styles from './Form.module.css'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    await signIn({ username: email, password })
    const user = await getCurrentUser()
    onLogin(user)
  }

  return (
    <div className={styles.form}>
      <div className={styles.formBar}>Login</div>
      <div className={styles.formBody}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  )
}
