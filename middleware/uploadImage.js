const bucket = require('../firebase');
const multer = require('multer');

// Configure multer storage and file filter
const upload = multer({ storage: multer.memoryStorage() });

// Specify the allowed file types
const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];

// Middleware function for image upload
const uploadImage = (req, res, next) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: 'Failed to upload image' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No image provided' });
        }
        // Check if the file type is allowed
        if (!allowedFileTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ error: 'Invalid file type' });
        }

        try {
            const folderName = req.body.folderName;
            const filename = req.file.originalname;
            const file = bucket.file(`${folderName}/${filename}`);

            await file.save(req.file.buffer, {
                resumable: false,
                metadata: { contentType: req.file.mimetype },
                predefinedAcl: 'publicRead'
            });

            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

            // Store the public URL in the request object
            req.imageUrl = publicUrl;
            next();
        } catch (error) {
            console.error('Error uploading image:', error);
            return res.status(500).json({ error: 'Failed to upload image' });
        }
    });
};

module.exports = uploadImage;