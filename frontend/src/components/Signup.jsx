import { useState } from 'react'
import { signUp, confirmSignUp } from 'aws-amplify/auth'
import styles from './Form.module.css'

export default function Signup({ onSignup }) {
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
    <div className={styles.form}>
      {step === 'signup' ? (
        <>
          <div className={styles.formBar}>Sign up</div>
          <div className={styles.formBody}>
            <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={handleSignup}>Sign up</button>
          </div>
        </>
      ) : (
        <>
          <div className={styles.formBar}>Confirm Email</div>
          <div className={styles.formBody}>
            <input placeholder="Verification code" value={code} onChange={e => setCode(e.target.value)} />
            <button onClick={handleConfirm}>Confirm</button>
          </div>
        </>
      )}
    </div>
  )
}
