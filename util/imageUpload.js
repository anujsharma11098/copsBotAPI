const multer = require('multer')
const { Storage } = require('@google-cloud/storage')

const storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT_ID,
    keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS,
})

const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL)

const uploader = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, next) => {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
            req.fileValidationError = 'Invalid File Type!'
            return next(null, false)
        }
        next(null, true)
    }
})

module.exports = {
    storage,
    bucket,
    uploader
}