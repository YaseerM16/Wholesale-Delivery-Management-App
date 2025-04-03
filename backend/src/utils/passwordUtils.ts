import bcryptjs from "bcrypt";
import { sendErrorResponse } from "./responseHandler";
// import { ErrorResponse } from "../../shared/utils/errors";

export const generateHashPassword = async (
    password: string
): Promise<string> => {
    try {
        const hashedPassword = await bcryptjs.hash(password, 10);
        return hashedPassword;
    } catch (error) {
        throw error
    }
};

export const comparePassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    try {
        return bcryptjs.compare(password, hashedPassword);
    } catch (error) {
        throw error
    }
};