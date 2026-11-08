import { BadRequestException } from "@nestjs/common"
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface.js"
import { mkdirSync } from "fs"
import { diskStorage } from "multer"
import { extname } from "path"

const UPLOAD_DIR = './uploads'
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp']

mkdirSync(UPLOAD_DIR, { recursive: true })

export const multerOptions: MulterOptions = {
    storage: diskStorage({
        destination: UPLOAD_DIR,
        filename: (req, file, cb) => {
            const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
            cb(null, `${unique}${extname(file.originalname).toLowerCase()}`)
        },
    }),

    fileFilter: (req, file, cb) => {
        if (!ALLOWED_MIME.includes(file.mimetype)) {
            return cb(
                new BadRequestException('Faqat jpeg, png yoki webp rasm yuklash mumkin'),
                false,
            )
        }
        cb(null, true)
    },

    limits: { fileSize: 5 * 1024 * 1024 },
}