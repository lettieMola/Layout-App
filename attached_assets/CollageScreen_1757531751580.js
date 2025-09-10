import React from 'react';
import { useNavigate } from 'react-router-dom';

const CollageScreen = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/')} style={styles.backButton}>
          ← Back to Home
        </button>
        <h1 style={styles.title}>My Collages</h1>
      </div>

      <div style={styles.content}>
        <p style={styles.message}>Your saved collages will appear here.</p>
        <button 
          style={styles.createButton}
          onClick={() => navigate('/editor')}
        >
          Create New Collage
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
    gap: '20px',
  },
  backButton: {
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
  },
  content: {
    textAlign: 'center',
    padding: '40px',
  },
  message: {
    fontSize: '1.2rem',
    color: '#666',
    marginBottom: '20px',
  },
  createButton: {
    padding: '15px 30px',
    fontSize: '1.1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  }
};

export default CollageScreen;