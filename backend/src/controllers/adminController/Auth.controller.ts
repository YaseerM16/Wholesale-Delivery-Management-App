import { Request, Response } from "express";
import { sendErrorResponse, sendResponse } from "../../utils/responseHandler";
import AdminAuthServices, { adminAuthServices } from "../../services/admin/auth.service";

export default class AdminAuthcontroller {
    private adminAuthServices: AdminAuthServices

    constructor(adminAuthServices: AdminAuthServices) {
        this.adminAuthServices = adminAuthServices
    }

    async adminRegister(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body
            console.log("Admin Regitering Dets :", data);

            const addUser = await this.adminAuthServices.register(data)

            sendResponse({
                res,
                success: true,
                message: 'Admin Registered Successfully',
                data: addUser,
            })
            return
        } catch (error: unknown) {
            console.log(error)
            sendErrorResponse(res, (error as Error).message || "Internal Server Error", 500);
            return
        }
    }

    async verifyEmail(req: Request, res: Response): Promise<void> {
        const { email, token } = req.query;
        if (!email || !token) sendErrorResponse(res, "Missing email or token", 400);
        try {
            const verifiedAdmin = await this.adminAuthServices.verifyEmail(token as string, email as string)
            sendResponse({
                res,
                success: true,
                message: "Admin Verified Successfully :)",
                data: verifiedAdmin
            })
        } catch (error) {
            sendErrorResponse(res, (error as Error).message || "Internal Server Error", 500);
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        if (!email || !password) sendErrorResponse(res, "Missing email or password", 400);
        try {
            const loggedAdmin = await this.adminAuthServices.login(email, password)
            sendResponse({
                res,
                success: true,
                message: "Admin Logged In Successfully :)",
                data: loggedAdmin
            })
        } catch (error) {
            sendErrorResponse(res, (error as Error).message || "Internal Server Error", 500);
        }
    }

}

export const adminAuthController = new AdminAuthcontroller(adminAuthServices)