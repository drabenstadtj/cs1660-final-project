import styles from './PostView.module.css'

export default function PostView({ post, onBack }) {
  return (
    <div>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <button onClick={onBack}>← Back</button>
        <span className={styles.sep}>&rsaquo;</span>
        <span>{post.title}</span>
      </div>

      {/* Thread header bar */}
      <div className={styles.threadBar}>{post.title}</div>

      {/* Post table — classic postbit layout */}
      <table className={styles.postTable}>
        <tbody>
          <tr>
            {/* Left: postbit — user info */}
            <td className={styles.postbit}>
              <div className={styles.username}>{post.author}</div>
              <div className={styles.userMeta}>
                Posted: {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric'
                })}
              </div>
            </td>

            {/* Right: post content */}
            <td className={styles.postContent}>
              {post.imageUrl && (
                <img src={post.imageUrl} alt="" className={styles.postImage} />
              )}
              <p className={styles.postBody}>{post.content}</p>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Back button footer */}
      <div className={styles.footer}>
        <button className={styles.backBtn} onClick={onBack}>← Back</button>
      </div>
    </div>
  )
}
