import { Router } from "express";
import { vendorController } from "../controllers/vendor/Vendor.Controller";

const router = Router()

router
    .post("/register", vendorController.vendorRegister.bind(vendorController))
    .get("/get-vendors", vendorController.getVendors.bind(vendorController))
    .put("/edit-vendor/:vendorId", vendorController.editVendor.bind(vendorController))
    .delete("/delete-vendor/:vendorId", vendorController.deleteVendor.bind(vendorController))

export const vendorRouter = router