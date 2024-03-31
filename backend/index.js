// Import required modules
const express = require('express');
const { google } = require('googleapis');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');

// Initialize Express app
const app = express();

// Multer storage configuration
const storage = multer.diskStorage({
    destination: 'uploads',
    filename: function (req, file, cb) {
        const extension = file.originalname.split(".").pop();
        cb(null, `${file.fieldname}-${Date.now()}.${extension}`);
    }
});

// Multer upload configuration
const upload = multer({ storage: storage });

// Enable CORS
app.use(cors());

// Route for file upload
app.post('/upload', upload.array('files'), async (req, res) => {
    try {
        // Initialize Google Drive authentication
        const auth = new google.auth.GoogleAuth({
            keyFile: "key.json",
            scopes: ["https://www.googleapis.com/auth/drive"]
        });

        // Initialize Google Drive API
        const drive = google.drive({ version: 'v3', auth });

        const uploadedFiles = [];

        // Upload each file to Google Drive
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            // Upload file to Google Drive
            const response = await drive.files.create({
                requestBody: {
                    name: file.originalname,
                    mimeType: file.mimetype,
                    parents: ['1vZYw3MnRfCTUgKj6H8GNLxy6B9S8ZfFX']
                },
                media: {
                    body: fs.createReadStream(file.path)
                }
            });

            uploadedFiles.push(response.data);
        }

        // Respond with uploaded files information
        res.json({ files: uploadedFiles });

        // Delete uploaded files from server
        for (let i = 0; i < req.files.length; i++) {
            fs.unlink(req.files[i].path, (err) => {
                if (err) {
                    console.error("Error deleting file:", err);
                }
            });
        }
    } catch (error) {
        console.error("Error uploading files:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start the server
app.listen(5175, () => {
    console.log("App is running on port 5175");
});
