// import { IVendor } from "../../../models/Vendor.model"
import { VendorRegisterInput, IVendor } from "../../../types/vendor.types"


export interface IVendorRepositoryMethods {
    getVendors(query: any): Promise<{ vendors: IVendor[], totalVendors: number }>
    addVendor(data: VendorRegisterInput): Promise<IVendor>
    editVendor(vendorId: string, data: VendorRegisterInput): Promise<IVendor>
    deleteVendor(vendorId: string, query: any): Promise<IVendor[]>
}