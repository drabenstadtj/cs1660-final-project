import styles from './PostView.module.css'
import { thumbStyle } from './thumbStyle'

export default function PostView({ post, onBack }) {
  return (
    <div className={styles.container}>
      <button className={styles.back} onClick={onBack}>← Back</button>
      {post.imageUrl
        ? <img src={post.imageUrl} alt={post.title} className={styles.thumb} />
        : <div className={styles.thumb} style={thumbStyle(post.postId)} />
      }
      <div className={styles.body}>
        <h2 className={styles.title}>{post.title}</h2>
        <div className={styles.meta}>
          <span>{post.author}</span>
          <span>·</span>
          <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <p className={styles.content}>{post.content}</p>
      </div>
    </div>
  )
}
