import dotenv from "dotenv"

dotenv.config()

export const config = {
    MONGO_URL: process.env.MONGO_URL,
    PORT: process.env.PORT,
    MODE: process.env.MODE,
    NODEMAILER_USER: process.env.NODEMAILER_USER,
    NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD,
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD,
    MAIL_LINK: process.env.FRONT_END,
}