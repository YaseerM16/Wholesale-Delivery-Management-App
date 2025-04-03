import { IAdminAuthServicesMethods } from "../../interface/service.ts/IAdminService"
import AdminAuthRepository from "../../repositories/admin/admin.auth.repository"
import { AdminRegisterInput, IAdmin } from "../../types/admin.types"
import bcrypt from "bcrypt"
import { NodemailerService } from "../Nodemailer.Service"
import { generateHashPassword } from "../../utils/passwordUtils"
import AdminRepository from "../../repositories/admin/admin.repository"

export default class AdminAuthServices implements IAdminAuthServicesMethods {
    private adminAuthRepository: AdminAuthRepository
    private adminRepository: AdminRepository
    private mailService: NodemailerService;

    constructor(adminAuthRepository: AdminAuthRepository, adminRepository: AdminRepository, mailService: NodemailerService) {
        this.adminAuthRepository = adminAuthRepository
        this.adminRepository = adminRepository
        this.mailService = mailService
    }

    async verifyEmail(token: string, email: string): Promise<IAdmin> {
        try {
            const admin = await this.adminRepository.findByEmail(email)
            if (!admin) throw Error("Admin not Found ..!");
            if (admin.verifyToken && admin.verifyTokenExpiry) {
                const date = admin.verifyTokenExpiry.getTime();

                if (date < Date.now()) throw new Error("Token expired");
                if (admin.verifyToken === token) {
                    const data = {
                        isVerified: true,
                        verifyToken: "",
                        verifyTokenExpiry: "",
                    };
                    return this.adminRepository.updateAdmin(admin._id as unknown as string, data as unknown as Partial<IAdmin>)
                } else {
                    throw new Error("Invalid verification token");
                }
            }
            throw new Error("Something went wrong while Verifying the Email ..!!")
        } catch (error) {
            throw error
        }
    }

    async register(data: AdminRegisterInput): Promise<IAdmin> {
        try {
            const hashedPassword = await bcrypt.hash(data.password, 12)
            data.password = hashedPassword
            const addAdmin = await this.adminAuthRepository.register(data)
            const token = await generateHashPassword(addAdmin._id.toString())
            this.mailService.sendMail(data.email, token)
            const currentDate = new Date();
            const twoDaysLater = new Date(currentDate);
            twoDaysLater.setDate(currentDate.getDate() + 2);
            const updateData = { verifyToken: token, verifyTokenExpiry: twoDaysLater }
            this.adminRepository.updateAdmin(addAdmin._id as unknown as string, updateData as unknown as Partial<IAdmin>)
            return addAdmin
        } catch (error) {
            throw error
        }
    }

    async login(email: string, password: string): Promise<IAdmin> {
        try {
            if (!email || !password) throw new Error("Email or Password were not getting..!");

            const loggedAdmin = await this.adminAuthRepository.login(email, password)

            return loggedAdmin
        } catch (error) {
            throw error
        }
    }
}

const adminAuthRepository = new AdminAuthRepository()
const adminRepository = new AdminRepository()
const nodeMailerService = new NodemailerService()
export const adminAuthServices = new AdminAuthServices(adminAuthRepository, adminRepository, nodeMailerService)