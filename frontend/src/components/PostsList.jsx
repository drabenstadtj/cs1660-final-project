import { useState } from 'react'
import { fetchAuthSession } from 'aws-amplify/auth'
import { API_URL } from '../api'
import PostView from './PostView'
import styles from './PostsList.module.css'

export default function PostsList({ posts, user, onPostCreated }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [selected, setSelected] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleCreate = async () => {
    setUploading(true)
    try {
      const { tokens } = await fetchAuthSession()
      const token = tokens.idToken.toString()

      let imageUrl = null
      if (imageFile) {
        const urlRes = await fetch(
          `${API_URL}/upload-url?filename=${encodeURIComponent(imageFile.name)}&contentType=${encodeURIComponent(imageFile.type)}`,
          { headers: { Authorization: token } }
        )
        const { uploadUrl, imageUrl: s3Url } = await urlRes.json()
        await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': imageFile.type },
          body: imageFile,
        })
        imageUrl = s3Url
      }

      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token },
        body: JSON.stringify({ title, content, author: user.username, imageUrl }),
      })
      const post = await res.json()
      onPostCreated(post)
      setTitle('')
      setContent('')
      setImageFile(null)
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  if (selected) {
    return <PostView post={selected} onBack={() => setSelected(null)} />
  }

  return (
    <div>
      {/* New post form */}
      {user && (
        <div className={styles.formBlock}>
          <div className={styles.formBar}>New Post</div>
          <table className={styles.postForm}>
            <tbody>
              <tr>
                <td className={styles.formLabel}>Subject</td>
                <td>
                  <input
                    className={styles.formInput}
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className={styles.formLabel}>Message</td>
                <td>
                  <textarea
                    className={styles.formTextarea}
                    placeholder="Content"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className={styles.formLabel}>Image</td>
                <td>
                  <label className={styles.fileLabel}>
                    {imageFile ? imageFile.name : 'Choose file…'}
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.fileInput}
                      onChange={handleFileChange}
                    />
                  </label>
                  {preview && (
                    <div className={styles.previewWrap}>
                      <img src={preview} alt="preview" className={styles.preview} />
                      <button className={styles.removeImg} onClick={() => { setImageFile(null); setPreview(null) }}>
                        Remove
                      </button>
                    </div>
                  )}
                </td>
              </tr>
              <tr>
                <td />
                <td>
                  <button className={styles.submitBtn} onClick={handleCreate} disabled={uploading}>
                    {uploading ? 'Uploading…' : 'Submit'}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Thread listing */}
      <table className={styles.threadTable}>
        <thead>
          <tr className={styles.tableHead}>
            <th className={styles.thSubject}>Subject</th>
            <th className={styles.thAuthor}>Author</th>
            <th className={styles.thDate}>Date</th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 && (
            <tr>
              <td colSpan={3} className={styles.empty}>No posts yet. Be the first to post!</td>
            </tr>
          )}
          {posts.map((post, i) => (
            <tr
              key={post.postId}
              className={i % 2 === 0 ? styles.rowEven : styles.rowOdd}
              onClick={() => setSelected(post)}
            >
              <td className={styles.tdSubject}>
                <span className={styles.threadTitle}>{post.title}</span>
                {post.imageUrl && <span className={styles.imgBadge}>[img]</span>}
              </td>
              <td className={styles.tdAuthor}>{post.author}</td>
              <td className={styles.tdDate}>{new Date(post.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.tableFooter}>
        {posts.length} thread{posts.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
