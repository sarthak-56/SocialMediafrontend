import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import styles from './comment.module.css'; 

const CommentForm = ({ postId }) => {
  const [content, setContent] = useState('');
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);  
  const [error, setError] = useState(null);
  console.log(comments)
  useEffect(() => {

    const fetchComments = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/user/posts/${postId}/comment/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }

        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (showModal) {
      fetchComments();
    }
  }, [postId, showModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/user/posts/${postId}/comment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData);
        throw new Error('Network response was not ok');
      }

      const newComment = await response.json();
      setComments([newComment, ...comments]);
      setContent('');
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  return (
    <>
    
      <button className={styles.commentButton} onClick={() => setShowModal(true)}>
        <FontAwesomeIcon icon={faCommentDots} style={{ color: 'red' }} size='2x' />
      </button>

  
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={() => setShowModal(false)}>&times;</span>
            <div className={styles.commentList}>
              {comments.map((comment, index) => (
                <div key={index} className={styles.comment}>
                  <img
                    src={`http://127.0.0.1:8000${comment.user.profile_pic}`}
                    alt="Profile"
                    className={styles['profile-pic']}
                  />
                  <strong>{comment.user.email}</strong>: {comment.content}
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit}>
              <textarea
                className={styles.textarea}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a comment..."
              />
              <button type="submit" className={styles.submitButton}>Submit</button>
            </form>
            {error && <p className={styles.error}>Error: {JSON.stringify(error)}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default CommentForm;
