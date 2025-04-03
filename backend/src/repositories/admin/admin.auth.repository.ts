import { IAdminAuthRepositoryMethods } from "../../interface/repository.ts/admin/IAdminAuthRepository";
import { AdminModel, IAdmin } from "../../models/Admin.model";
import { AdminRegisterInput } from "../../types/admin.types";
import BaseRepository from "../base.repository";
import { IAdmin as AdminInstance } from "../../types/admin.types"
import bcryptjs from "bcrypt";


export default class AdminAuthRepository extends BaseRepository<{
    Admin: IAdmin
}>
    implements IAdminAuthRepositoryMethods {

    constructor() {
        super({
            Admin: AdminModel
        })
    }

    async register(data: AdminRegisterInput): Promise<IAdmin> {
        try {
            const adminExists = await this.findOne("Admin", { email: data.email })
            if (adminExists) throw new Error("Admin Email Exists..!! Try Login.")
            const addAdmin = await this.createData('Admin', data as unknown as Partial<IAdmin>)
            const newAdmin: AdminInstance = {
                _id: addAdmin._id,
                name: addAdmin.name,
                email: addAdmin.email,
                phone: addAdmin.phone,
                isVerified: addAdmin.isVerified
            }
            return newAdmin as IAdmin
        } catch (error: unknown) {
            throw error
        }
    }

    async login(email: string, password: string): Promise<AdminInstance> {
        try {

            const admin = await this.findOne("Admin", { email });
            if (!admin) throw new Error("Invalid email or password.");

            const isPasswordValid = await bcryptjs.compare(password, admin.password);
            if (!isPasswordValid) throw new Error("Invalid email or password.");

            const loggedInAdmin: AdminInstance = {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                phone: admin.phone,
                isVerified: admin.isVerified
            };

            return loggedInAdmin
        } catch (error) {
            throw error;
        }
    }

}