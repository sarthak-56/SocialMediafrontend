import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './UserSearch.module.css';

const UserSearchAndFriendRequest = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [friends, setFriends] = useState([]);
  const [friendRequestCount, setFriendRequestCount] = useState(0);
  const [lastRequestTime, setLastRequestTime] = useState(null);
  const [requestedUsers, setRequestedUsers] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }

        const response = await axios.get('http://127.0.0.1:8000/api/user/friends/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();

    const interval = setInterval(() => {
      if (lastRequestTime && Date.now() - lastRequestTime > 60000) {
        setFriendRequestCount(0);
        setLastRequestTime(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastRequestTime]);

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/user/search/?q=${searchKeyword}`
      );
      setUsers(response.data);
    } catch (err) {
      setError('Error fetching users');
    }
    setLoading(false);
  };

  const handleSendRequest = async (userId) => {
    if (friendRequestCount >= 3) {
      setError('You cannot send more than 3 friend requests within a minute.');
      return;
    }

    setIsSending(true);

    if (friends.some((friend) => friend.id === userId)) {
      setError('User is already a friend');
      setIsSending(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token not found in localStorage');
        setIsSending(false);
        return;
      }

      await axios.post(
        'http://127.0.0.1:8000/api/user/send-friend-request/',
        { to_user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRequestedUsers((prevRequested) => [...prevRequested, userId]);
      setFriendRequestCount((prevCount) => prevCount + 1);
      setLastRequestTime(Date.now());
    } catch (error) {
      console.error('Error sending friend request:', error);
    }

    setIsSending(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Search for users by name or email"
          className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.searchButton}>
          Search
        </button>
        {loading && <p className={styles.message}>Loading...</p>}
      </div>
      {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}
      <ul className={styles.userList}>
        {users.map((user) => (
          <li key={user.id} className={styles.userItem}>
            <div className={styles.userInfo}>
              {user.profile_pic ? (
                <img
                  className={styles.profilePicture}
                  src={`http://127.0.0.1:8000${user.profile_pic}`}
                  alt="Profile"
                />
              ) : (
                <img
                  className={styles.profilePicture}
                  src="/profile.png"
                  alt="Profile"
                />
              )}
              {user.name}
            </div>
            <button
              onClick={() => handleSendRequest(user.id)}
              disabled={requestedUsers.includes(user.id)}
              className={styles.sendRequestButton}
            >
              {requestedUsers.includes(user.id) ? 'Request Sent' : 'Send Request'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearchAndFriendRequest;
