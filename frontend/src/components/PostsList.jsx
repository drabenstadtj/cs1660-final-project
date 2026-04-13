import { useState } from 'react'
import { fetchAuthSession } from 'aws-amplify/auth'
import { API_URL } from '../api'
import PostView from './PostView'
import { thumbStyle } from './thumbStyle'
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
        // 1. Get presigned upload URL
        const urlRes = await fetch(
          `${API_URL}/upload-url?filename=${encodeURIComponent(imageFile.name)}&contentType=${encodeURIComponent(imageFile.type)}`,
          { headers: { Authorization: token } }
        )
        const { uploadUrl, imageUrl: s3Url } = await urlRes.json()

        // 2. PUT the file directly to S3
        await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': imageFile.type },
          body: imageFile,
        })

        imageUrl = s3Url
      }

      // 3. Create the post
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
      {user && (
        <div className={styles.section}>
          <div className={styles.sectionBar}>New Post</div>
          <div className={styles.newPost}>
            <input
              placeholder="Subject"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Message"
              value={content}
              onChange={e => setContent(e.target.value)}
            />
            <label className={styles.fileLabel}>
              {imageFile ? imageFile.name : 'Attach image (optional)'}
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
                <button
                  className={styles.removeImg}
                  onClick={() => { setImageFile(null); setPreview(null) }}
                >
                  Remove
                </button>
              </div>
            )}
            <button onClick={handleCreate} disabled={uploading}>
              {uploading ? 'Uploading…' : 'Submit'}
            </button>
          </div>
        </div>
      )}

      <div className={styles.sectionBar}>Posts</div>
      <div className={styles.grid}>
        {posts.map(post => (
          <div key={post.postId} className={styles.card} onClick={() => setSelected(post)}>
            {post.imageUrl
              ? <img src={post.imageUrl} alt={post.title} className={styles.cardThumb} />
              : <div className={styles.cardThumb} style={thumbStyle(post.postId)} />
            }
            <div className={styles.cardBody}>
              <span className={styles.cardTitle}>{post.title}</span>
              <p className={styles.cardSnippet}>{post.content}</p>
              <div className={styles.cardMeta}>
                <span>{post.author}</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
