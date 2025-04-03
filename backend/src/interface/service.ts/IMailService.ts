export interface IMailService {
    sendMail(
        name: string,
        email: string,
        type: string,
        token: string,
        role: string
    ): Promise<any>;
}
