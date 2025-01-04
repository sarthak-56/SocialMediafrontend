import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Profile.module.css';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs'; // To format the date of birth

const ContactInfoEdit = ({ profileData, setProfileData }) => {
  const [name, setName] = useState(profileData.name || '');
  const [bio, setBio] = useState(profileData.bio || '');
  const [location, setLocation] = useState(profileData.location || '');
  const [study, setStudy] = useState(profileData.study || '');
  const [work, setWork] = useState(profileData.work || '');
  const [relationshipStatus, setRelationshipStatus] = useState(profileData.relationship_status || '');
  const [dateOfBirth, setDateOfBirth] = useState(profileData.date_of_birth ? dayjs(profileData.date_of_birth).format('YYYY-MM-DD') : '');

  const navigate = useNavigate();

  useEffect(() => {
 
    setName(profileData.name || '');
    setBio(profileData.bio || '');
    setLocation(profileData.location || '');
    setStudy(profileData.study || '');
    setWork(profileData.work || '');
    setRelationshipStatus(profileData.relationship_status || '');
    setDateOfBirth(profileData.date_of_birth ? dayjs(profileData.date_of_birth).format('YYYY-MM-DD') : '');
  }, [profileData]); 

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleStudyChange = (e) => {
    setStudy(e.target.value);
  };

  const handleWorkChange = (e) => {
    setWork(e.target.value);
  };

  const handleRelationshipStatusChange = (e) => {
    setRelationshipStatus(e.target.value);
  };

  const handleDateOfBirthChange = (e) => {
    setDateOfBirth(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await axios.patch(
        'http://127.0.0.1:8000/api/user/profile/update/',
        { name, bio, location, study, work, relationship_status: relationshipStatus, date_of_birth: dateOfBirth },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfileData(res.data); 
      alert('Profile updated successfully');
      navigate('/main');
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles['contact-info-edit-form']}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Name:</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleNameChange}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Bio:</label>
        <textarea
          name="bio"
          value={bio}
          onChange={handleBioChange}
          className={styles.textarea}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Location:</label>
        <input
          type="text"
          name="location"
          value={location}
          onChange={handleLocationChange}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Study:</label>
        <input
          type="text"
          name="study"
          value={study}
          onChange={handleStudyChange}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Work:</label>
        <input
          type="text"
          name="work"
          value={work}
          onChange={handleWorkChange}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Relationship Status:</label>
        <select
          name="relationship_status"
          value={relationshipStatus}
          onChange={handleRelationshipStatusChange}
          className={styles.input}
        >
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="engaged">Engaged</option>
          <option value="in_relationship">In a Relationship</option>
          <option value="divorced">Divorced</option>
          <option value="separated">Separated</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Date of Birth:</label>
        <input
          type="date"
          name="date_of_birth"
          value={dateOfBirth}
          onChange={handleDateOfBirthChange}
          className={styles.input}
        />
      </div>
      <button type="submit" className={styles.button}>Save</button>
    </form>
  );
};

export default ContactInfoEdit;
