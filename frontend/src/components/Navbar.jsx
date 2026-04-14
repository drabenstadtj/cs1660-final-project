import { signOut } from 'aws-amplify/auth'
import styles from './Navbar.module.css'

export default function Navbar({ user, onNavigate }) {
  return (
    <header className={styles.header}>
      {/* Site banner */}
      <div className={styles.banner}>
        <img src="/overcast_logo.png" alt="Overcast" className={styles.logo} />
      </div>

      {/* Navigation strip */}
      <div className={styles.navStrip}>
        <div className={styles.navLinks}>
          <button onClick={() => onNavigate('posts')}>Posts</button>
        </div>
        <div className={styles.navUser}>
          {user ? (
            <>
              <span>Logged in as <strong>{user.username}</strong></span>
              <span className={styles.sep}>•</span>
              <button onClick={() => signOut().then(() => onNavigate('logout'))}>Sign out</button>
            </>
          ) : (
            <>
              <button onClick={() => onNavigate('login')}>Login</button>
              <span className={styles.sep}>•</span>
              <button onClick={() => onNavigate('signup')}>Sign up</button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
