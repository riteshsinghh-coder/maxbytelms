import React from 'react';
import { getUploads } from './data/uploads';

const UploadsPage = () => {
  const uploads = getUploads();

  return (
    <div style={styles.section}>
      <h3>Uploaded Videos</h3>
      {uploads.length === 0 ? (
        <p>No videos uploaded yet.</p>
      ) : (
        <ul>
          {uploads.map((upload, index) => (
            <li key={index}>
              <p>Video URL: {upload.videoURL}</p>
              <p>Target: {upload.target.type === 'group' ? `Group: ${upload.target.value}` : `Student: ${upload.target.value}`}</p>
              <p>Uploaded on: {upload.timestamp.toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  section: {
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
};

export default UploadsPage;
