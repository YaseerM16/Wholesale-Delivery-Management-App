import { IAdminRepositoryMethods } from "../../interface/repository.ts/admin/IAdminRepository"
import { AdminModel, IAdmin } from "../../models/Admin.model"
import { IAdmin as AdminInstance } from "../../types/admin.types"
import BaseRepository from "../base.repository"

export default class AdminRepository extends BaseRepository<{
    Admin: IAdmin
}>
    implements IAdminRepositoryMethods {

    constructor() {
        super({
            Admin: AdminModel
        })
    }
    async findByEmail(email: string): Promise<AdminInstance | null> {
        try {
            return this.findOne("Admin", { email })
        } catch (error) {
            throw error
        }
    }

    async updateAdmin(adminId: string, data: Partial<IAdmin>): Promise<IAdmin> {
        try {
            const admin = await this.findById("Admin", adminId)
            if (!admin) throw new Error("Admin was not found...!");
            const updatedAdmin = await this.updateById("Admin", adminId, data)
            return updatedAdmin as unknown as IAdmin
        } catch (error) {
            throw error
        }
    }
    // async
}