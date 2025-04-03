import nodemailer from "nodemailer";
// import { config } from "../../config/config";
import { IMailService } from "../interface/service.ts/IMailService";
import { config } from "../utils/constants";

export class NodemailerService implements IMailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.MODE === "production" ? "smtp.gmail.com" : "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: config.MODE === "production" ? config.EMAIL : config.NODEMAILER_USER,
                pass: config.MODE === "production" ? config.PASSWORD : config.NODEMAILER_PASSWORD,
            },
        });
    }

    async sendMail(email: string, token: string): Promise<any> {
        try {
            console.log("Sending email...");

            const subject = "Account Verification";
            const html = `<p>Click this <a href="${config.MAIL_LINK}/verifymail?token=${token}&email=${email}">
                      link </a> to verify your account.</p>`;

            return await this.transporter.sendMail({
                from: '"Turf Booking" <turfbooking@gmail.com>',
                to: email,
                subject,
                html,
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

}
