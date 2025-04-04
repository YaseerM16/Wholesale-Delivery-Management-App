import { IVendorRepositoryMethods } from "../../interface/repository.ts/vendor/IVendorRepository"
import { IVendor, VendorModel } from "../../models/Vendor.model"
import { VendorRegisterInput, IVendor as VendorInstance } from "../../types/vendor.types"
import BaseRepository from "../base.repository"

export default class VendorRepository extends BaseRepository<{
    Vendor: IVendor
}>
    implements IVendorRepositoryMethods {

    constructor() {
        super({
            Vendor: VendorModel
        })
    }
    async getVendors(query: any): Promise<{ vendors: IVendor[]; totalVendors: number }> {
        const { page = 1, limit = 6 } = query;

        const totalVendors = await this.findAll("Vendor", { isDeleted: false }).countDocuments();

        const vendors = await this.findAll("Vendor", { isDeleted: false })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit, 10));

        return { vendors, totalVendors };
    }

    async addVendor(data: VendorRegisterInput): Promise<VendorInstance> {
        try {
            const vendorExists = await this.findOne("Vendor", {
                $or: [
                    { phone: data.phone },
                    { email: data.email },
                    { name: data.name }
                ]
            })

            if (vendorExists) throw new Error("Vendor Already Exists by Phone number or Email or Name!! Try Login.")
            const addVendor = await this.createData("Vendor", data as unknown as Partial<IVendor>)
            const newVendor: VendorInstance = {
                _id: addVendor._id,
                name: addVendor.name,
                address: addVendor.address,
                phone: addVendor.phone,
                email: addVendor.email,
                isDeleted: addVendor.isDeleted
            }
            return newVendor as VendorInstance
        } catch (error) {
            throw error
        }
    }
    async editVendor(vendorId: string, data: VendorRegisterInput): Promise<IVendor> {
        try {
            const existingVendor = await this.findById("Vendor", vendorId);
            if (!existingVendor) {
                throw new Error("Vendor not found.");
            }

            if (data.name) {
                const nameConflict = await this.findOne("Vendor", { name: data.name, _id: { $ne: vendorId } });
                if (nameConflict) {
                    throw new Error("A vendor with this name already exists.");
                }
            }

            const updatedVendor = await this.updateById("Vendor", vendorId, {
                name: data.name,
                address: data.address,
                phone: data.phone,
                email: data.email
            });

            return updatedVendor as IVendor
        } catch (error) {
            console.log("THE error of editing vendor :", error);
            throw error;
        }
    }

    async deleteVendor(vendorId: string, query: any): Promise<IVendor[]> {
        try {
            const { page = 1, limit = 6 } = query;

            const existingVendor = await this.findById("Vendor", vendorId);
            if (!existingVendor) {
                throw new Error("Vendor not found");
            }
            const updatedVendor = await this.updateById(
                "Vendor",
                vendorId,
                { isDeleted: true }
            );

            if (updatedVendor) {
                const vendors = await this.findAll("Vendor", { isDeleted: false })
                    .sort({ createdAt: -1 })
                    .skip((page - 1) * limit)
                    .limit(parseInt(limit, 10));

                return vendors
            }

            throw new Error("Failed to update driver..!");
        } catch (error) {
            throw error;
        }
    }
}