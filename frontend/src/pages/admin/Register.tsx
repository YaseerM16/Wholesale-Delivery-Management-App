import { useForm } from "react-hook-form";
import { adminRegisterApi } from "../../services/adminApi";
import { AdminRegisterInput } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Register = () => {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<AdminRegisterInput>();
    const password = watch("password"); // Watch the password field
    const navigate = useNavigate()

    const onSubmit = async (data: AdminRegisterInput) => {
        try {
            console.log("Registered Admin:", data);
            const response = await adminRegisterApi(data)
            if (response?.status === 200) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Success!",
                    text: "Login successful.",
                    showConfirmButton: false,
                    timer: 2000,
                    toast: true,
                }).then(() => {
                    navigate("/check-email/admin");
                });
            }
        } catch (err) {
            console.log("While Register the Admin Error:", err);
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Error!",
                text: (err as Error)?.message || "Something went wrong. Please try again.",
                showConfirmButton: true,
                confirmButtonText: "OK",
                timer: 3000,
                toast: true,
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h2 className="text-3xl font-bold mb-6">Admin Registration</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md w-96">
                <div className="mb-4">
                    <label className="block text-gray-700">Full Name</label>
                    <input {...register('name', {
                        required: 'Name is required', minLength: {
                            value: 4,
                            message: "Name must be at least 4 characters long.",
                        },
                        pattern: {
                            value: /^[A-Za-z]+(?:\s[A-Za-z]+)*$/,
                            message: "Name cannot have leading/trailing spaces or multiple spaces between words",
                        },
                    })} className="w-full p-2 border rounded" />
                    {errors.name?.message && <p className="text-red-500 text-sm">{String(errors.name.message)}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Mobile Number</label>
                    <input  {...register("phone", {
                        required: "Mobile number is required",
                        pattern: {
                            value: /^\d{10}$/,
                            message: "Invalid mobile number (10 digits required)"
                        }
                    })} className="w-full p-2 border rounded" />
                    {errors.phone?.message && <p className="text-red-500 text-sm">{String(errors.phone.message)}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input type="email" {...register('email', {
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
                            minLength: { value: 6, message: 'Password must be at least 6 characters' },
                            validate: (value) => /^\S+$/.test(value) || 'Password cannot contain spaces',
                        })}
                        className="w-full p-3 rounded-md border border-gray-300 focus:outline-green-500"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{String(errors.password.message)}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Confirm Password</label>
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        {...register('confirmPassword', {
                            required: 'Confirm Password is required',
                            validate: (value) => value === password || 'Passwords do not match',
                        })}
                        className="w-full p-3 rounded-md border border-gray-300 focus:outline-green-500"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm">{String(errors.confirmPassword.message)}</p>}
                </div>
                <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">Register</button>
            </form>
        </div>
    );
};

export default Register;
