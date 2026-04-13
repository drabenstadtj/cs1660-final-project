import { signOut } from 'aws-amplify/auth'
import styles from './Navbar.module.css'

export default function Navbar({ user, onNavigate }) {
  return (
    <nav className={styles.nav}>
      <div className={styles.banner}>
        <h1 className={styles.title}>Overcast</h1>
        <div className={styles.actions}>
          <button onClick={() => onNavigate('posts')}>Posts</button>
          {user ? (
            <button onClick={() => signOut().then(() => onNavigate('logout'))}>Sign out</button>
          ) : (
            <>
              <button onClick={() => onNavigate('login')}>Login</button>
              <button onClick={() => onNavigate('signup')}>Sign up</button>
            </>
          )}
          {user && <span className={styles.username}>Logged in as {user.username}</span>}
        </div>
      </div>
    </nav>
  )
}
