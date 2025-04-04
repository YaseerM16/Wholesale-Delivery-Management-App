import { IVendor } from "../../../models/Vendor.model"
import { VendorRegisterInput } from "../../../types/vendor.types"


export interface IVendorServiceMethods {
    getVendors(query: any): Promise<{ vendors: IVendor[], totalVendors: number }>
    addVendor(data: VendorRegisterInput): Promise<IVendor>
    editVendor(vendorId: string, data: VendorRegisterInput): Promise<IVendor>
    deleteVendor(vendorId: string, query: any): Promise<IVendor[]>
}