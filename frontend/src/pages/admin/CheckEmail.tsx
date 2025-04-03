import { MailCheck } from "lucide-react";

const EmailVerificationNotice = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-indigo-600 px-6">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                <div className="flex justify-center">
                    <MailCheck className="w-20 h-20 text-blue-600 animate-bounce" />
                </div>
                <h1 className="mt-4 text-3xl font-bold text-gray-800">Check Your Email!</h1>
                <p className="mt-3 text-gray-600">
                    We've sent a verification link to your email. Please check your inbox and click the link to verify your account.
                </p>
                <p className="mt-2 text-gray-500">
                    If you don’t see it in your inbox, check your <span className="font-semibold text-red-500">Spam</span> folder.
                </p>
            </div>
        </div>
    );
};

export default EmailVerificationNotice;
