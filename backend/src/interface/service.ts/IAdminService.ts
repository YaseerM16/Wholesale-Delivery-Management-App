import { IAdmin, AdminRegisterInput } from "../../types/admin.types"

export interface IAdminAuthServicesMethods {
    register(data: AdminRegisterInput): Promise<IAdmin>
    verifyEmail(token: string, email: string): Promise<IAdmin>
    login(email: string, password: string): Promise<IAdmin>
}