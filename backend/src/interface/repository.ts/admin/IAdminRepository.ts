import { IAdmin, AdminRegisterInput } from "../../../types/admin.types"

export interface IAdminRepositoryMethods {
    // register(data: AdminRegisterInput): Promise<IAdmin>
    updateAdmin(adminId: string, data: Partial<IAdmin>): Promise<IAdmin>
    findByEmail(email: string): Promise<IAdmin | null>
}