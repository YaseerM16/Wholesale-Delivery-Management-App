import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { verifyEmail } from "../../services/adminApi";
import Swal from "sweetalert2";
import { login } from "../../store/slice/AdminSlice";
import { useAppDispatch } from "../../store/hooks";

const VerifyMail = () => {
    const [verified, setVerified] = useState(false);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const dispatcher = useAppDispatch()

    console.log("Toekn :", token);
    console.log("Email :", email);

    const handleVerify = async () => {
        try {
            const response = await verifyEmail(token as string, email as string)
            if (response?.status === 200) {
                const { data } = response
                dispatcher(login(data.data))
                localStorage.setItem('admin', JSON.stringify(data.data));
                setVerified(true);
            }
        } catch (error) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Error!",
                text: (error as Error)?.message || "Something went wrong. Please try again.",
                showConfirmButton: true,
                confirmButtonText: "OK",
                timer: 3000,
                toast: true,
            });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-2xl shadow-2xl text-center w-96 border border-gray-200"
            >
                {verified ? (
                    <div className="flex flex-col items-center">
                        <CheckCircle className="text-green-500 w-16 h-16 mb-4 animate-bounce" />
                        <h2 className="text-2xl font-bold text-gray-800">Email Verified!</h2>
                        <p className="text-gray-600 mt-2">You can now proceed to  <a href="/login/admin">
                            <button className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300">
                                Login
                            </button>
                        </a>.</p>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Verify Your Email</h2>
                        <p className="text-gray-600 mt-2">Click the button below to verify your email.</p>
                        {email && <p className="text-sm text-gray-500 mt-2">Verifying for: {email}</p>}
                        <button
                            onClick={handleVerify}
                            className="mt-6 w-full bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300"
                        >
                            Click Here to Verify
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default VerifyMail;
