import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./UploadCV.module.css";

const UploadCV: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link to="/">DreamHack</Link>
        </div>
        <div className={styles.navLinks}>
          <Link to="/profiles">Profiles</Link>
          <Link to="/upload-project">Upload Project</Link>
          <Link to="/upload-cv" className={styles.active}>Upload CV</Link>
          <Link to="/match">Match</Link>
        </div>
      </nav>

      <main className={styles.mainContent}>
        <h1 className={styles.title}>Upload Your CV</h1>
        <p className={styles.subtitle}>
          Upload your CV to find the perfect match for your skills and experience
        </p>

        <div 
          className={`${styles.uploadArea} ${isDragging ? styles.dragging : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className={styles.uploadIcon}>
            <i className="fas fa-file-upload"></i>
          </div>
          <p className={styles.uploadText}>
            {file ? file.name : "Drag & Drop your CV here or click to browse"}
          </p>
          <p className={styles.fileFormats}>Accepted formats: PDF, DOC, DOCX</p>
          <input 
            type="file" 
            id="cv-upload" 
            className={styles.fileInput}
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />
          <label htmlFor="cv-upload" className={styles.browseButton}>
            Browse Files
          </label>
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.uploadButton} disabled={!file}>
            Upload CV
          </button>
          <Link to="/match" className={styles.matchButton}>
            Match
          </Link>
        </div>
      </main>
    </div>
  );
};

export default UploadCV; 