
import { Response } from "express";

interface CookieOptions {
    name: string;
    value: string;
    options?: any;
}

interface ResponseParams {
    res: Response;
    statusCode?: number;
    success: boolean;
    message: string;
    data?: any;
    cookies?: CookieOptions[];
}

export const sendResponse = ({
    res,
    statusCode = 200,
    success,
    message,
    data,
    cookies = [],
}: ResponseParams) => {
    cookies.forEach(({ name, value, options }) => {
        res.cookie(name, value, options);
    });

    return res.status(statusCode).send({
        success,
        message,
        data,
    });
};


export const sendErrorResponse = (res: Response, message = "Internal Server Error", statusCode = 500): void => {
    res.status(statusCode).json({ success: false, message });
};