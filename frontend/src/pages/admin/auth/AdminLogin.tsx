import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAppDispatch } from "../../../store/hooks";
import { adminLogin } from "../../../services/adminApi";
import { login } from "../../../store/slice/AdminSlice";


const AdminLogin = () => {
    const dispatcher = useAppDispatch()
    const navigate = useNavigate()
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<{ email: string, password: string }>();

    const onSubmit = async (data: { email: string; password: string; }) => {
        try {
            const response = await adminLogin(data.email, data.password)
            if (response?.status === 200) {
                const { data } = response
                dispatcher(login(data.data))
                localStorage.setItem('admin', JSON.stringify(data.data));
                navigate("/")
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h2 className="text-3xl font-bold mb-6">Admin Login</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md w-96">
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        placeholder="email"
                        {...register('email', {
                            required: 'Email is required',  // Required validation
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: 'Email is invalid',  // Email format validation
                            },
                            validate: {
                                trim: (value) => {
                                    const trimmedValue = value.trim();
                                    setValue('email', trimmedValue); // Set the trimmed value
                                    return trimmedValue.length > 0 || 'Email cannot be empty after trimming';
                                }
                            }
                        })} className="w-full p-2 border rounded" />
                    {errors.email?.message && <p className="text-red-500 text-sm">{String(errors.email.message)}</p>}
                </div>
                <div className="mb-4 relative">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        placeholder="Password"
                        {...register('password', {
                            required: 'Password is required',
                            validate: (value) => /^\S+$/.test(value) || 'Password cannot contain spaces',
                        })}
                        className="w-full p-3 rounded-md border border-gray-300 focus:outline-green-500"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{String(errors.password.message)}</p>}
                </div>


                <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">Login</button>
                <a href="/register/admin">
                    <button
                        type="button"
                        className="w-full mt-4 py-2 px-4 bg-gray-600 text-white font-semibold rounded-md shadow-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        signup for new account
                    </button>
                </a>
            </form>
        </div>
    );
};

export default AdminLogin;
