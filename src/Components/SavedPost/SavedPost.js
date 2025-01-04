import React, { useState, useEffect } from 'react';
import styles from './SavedPost.module.css';
import LikeButton from '../LikeButton/LikeButton';
import CommentForm from '../Comments/CommentForm';
import ShareButton from '../Share/ShareButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';

const SavedPost = () => {
    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSavedPosts = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/user/saved-posts/', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = await response.json();
                setSavedPosts(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching saved posts:', error);
                setError(error);
                setLoading(false);
            }
        };

        fetchSavedPosts();
    }, []);

    const handleRemovePost = async (postId) => {
        try {
            await fetch(`http://127.0.0.1:8000/api/user/posts/${postId}/save/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setSavedPosts((prevPosts) => prevPosts.filter(post => post.id !== postId));
        } catch (error) {
            console.error('Error unsaving post:', error);
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    if (loading) {
        return <div className={styles.loading}>Loading saved posts...</div>;
    }

    if (error) {
        return <div className={styles.error}>Error: {error.message}</div>;
    }

    return (
        <div className={styles.feed}>
            {savedPosts.length > 0 ? (
                savedPosts.map(post => (
                    post.content && (
                        <div key={post.id} className={styles.post}>
                            {/* Display User Info: Assuming post.user is an object */}
                            <div className={styles['user-info']}>
                                {post.user.profile_pic && (
                                    <img
                                        src={`http://127.0.0.1:8000${post.user.profile_pic}`}
                                        alt="Profile"
                                        className={styles['profile-pic']}
                                    />
                                )}
                                <h2 className={styles['user-name']}>
                                    {post.user.name || post.user.email} {/* Render user's name or email */}
                                </h2>
                            </div>

                            {post.image && (
                                <img
                                    src={`http://127.0.0.1:8000${post.image}`}
                                    alt="Post"
                                    className={styles['post-image']}
                                />
                            )}
                            <p className={styles['post-content']}>
                                {post.user.email}: {post.content}
                            </p>
                            <div className={styles['button-container']}>
                                <div className={styles['button-group-left']}>
                                    <LikeButton postId={post.id} />
                                    <CommentForm postId={post.id} />
                                    <ShareButton postId={post.id} />
                                </div>
                                <div className={styles['button-group-right']}>
                                    <button onClick={() => handleRemovePost(post.id)} className={styles['remove-button']}>
                                        <FontAwesomeIcon icon={faBookmark} style={{ color: 'red' }} size="2x" />
                                    </button>
                                </div>
                            </div>
                            
                            {post.created_at && <p className={styles.timestamp}>{formatDate(post.created_at)}</p>}
                        </div>
                    )
                ))
            ) : (
                <div className={styles['no-posts']}>No saved posts to display</div>
            )}
        </div>
    );
};

export default SavedPost;
