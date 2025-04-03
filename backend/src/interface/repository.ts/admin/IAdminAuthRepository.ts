import { IAdmin, AdminRegisterInput } from "../../../types/admin.types"

export interface IAdminAuthRepositoryMethods {
    register(data: AdminRegisterInput): Promise<IAdmin>
    login(email: string, password: string): Promise<IAdmin>
}