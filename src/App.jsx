import React, { useRef, useState } from "react";
import "./App.css";

const App = () => {
  const fileInputRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleFileUpload = async () => {
    const files = fileInputRef.current.files;

    if (files && files.length > 0) {
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      try {
        const response = await fetch("http://localhost:5175/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Uploaded Files:", data.files);
          setUploadStatus("Upload successful");
        } else {
          setUploadStatus("Upload failed. Please try again later.");
        }
      } catch (error) {
        console.error("Error occurred during upload:", error);
        setUploadStatus("Error occurred during upload");
      }
    } else {
      setUploadStatus("Please select files to upload");
    }
  };

  return (
    <div>
      <div className="head">
        <h1 className="heading">Upload Files To GDrive</h1>
      </div>
      <div className="bodyy">
        <input type="file" placeholder="Add Item" multiple ref={fileInputRef} />
        <button  onClick={handleFileUpload}>Uploads Files</button>
        {uploadStatus && <p>{uploadStatus}</p>}
      </div>
    </div>
  );
};

export default App;
