import { useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { API_URL } from "../api";
import styles from "./PostsList.module.css";

export default function PostsList({ posts, user, onPostCreated }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleCreate = async () => {
        const { tokens } = await fetchAuthSession();
        const token = tokens.idToken.toString();

        const res = await fetch(`${API_URL}/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({ title, content, author: user.username }),
        });
        const post = await res.json();
        onPostCreated(post);
        setTitle("");
        setContent("");
    };

    return (
        <div>
            {user && (
                <div className={styles.section}>
                    <div className={styles.sectionBar}>New Post</div>
                    <div className={styles.newPost}>
                        <input
                            placeholder="Subject"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea
                            placeholder="Message"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <button onClick={handleCreate}>Submit</button>
                    </div>
                </div>
            )}

            <div className={styles.sectionBar}>Posts</div>
            <table className={styles.threadTable}>
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Author</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post) => (
                        <tr key={post.postId}>
                            <td>
                                <span className={styles.threadTitle}>
                                    {post.title}
                                </span>
                                <p className={styles.threadBody}>
                                    {post.content}
                                </p>
                            </td>
                            <td className={styles.colAuthor}>{post.author}</td>
                            <td className={styles.colDate}>
                                {new Date(post.createdAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
