import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { driverLogin } from "../../services/driverApi";
import { login } from "../../store/slice/DriverSlice";
import { useAppDispatch } from "../../store/hooks";


const DriverLogin = () => {
    const dispatcher = useAppDispatch()
    const navigate = useNavigate()
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<{ phone: number, password: string }>();

    const onSubmit = async (data: { phone: number; password: string; }) => {
        try {
            const response = await driverLogin(data.phone, data.password)
            if (response?.status === 200) {
                const { data } = response
                dispatcher(login(data.data))
                console.log("Driver login Data (Backend):", data.data);
                localStorage.setItem('driver', JSON.stringify(data.data));
                navigate("/home/driver")
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Success!",
                    text: "Logged as Driver successfully :)!",
                    showConfirmButton: false,
                    timer: 2000,
                    toast: true,
                });
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
            <h2 className="text-3xl font-bold mb-6">Driver Login</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md w-96">
                {/* Mobile Number Field */}
                <div className="min-h-[80px]">
                    <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile Number
                    </label>
                    <input
                        id="mobileNumber"
                        type="tel"
                        {...register('phone', {
                            required: 'Mobile number is required',
                            pattern: {
                                value: /^\d{10}$/,
                                message: 'Invalid phone number (10 digits required)'
                            }
                        })}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'
                            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="9876543210"
                    />
                    <div className="h-5 mt-1">
                        {errors.phone && (
                            <p className="text-sm text-red-600">{errors.phone.message}</p>
                        )}
                    </div>
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
            </form>
        </div>
    );
};

export default DriverLogin;
