import { useForm } from "react-hook-form";

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data: any) => {
        console.log("Registered Admin:", data);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h2 className="text-3xl font-bold mb-6">Admin Registration</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md w-96">
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input {...register("name", { required: "Name is required" })} className="w-full p-2 border rounded" />
                    {errors.name && <p className="text-red-500 text-sm">{String(errors.name.message)}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Mobile Number</label>
                    <input {...register("mobile", { required: "Mobile number is required" })} className="w-full p-2 border rounded" />
                    {errors.mobile && <p className="text-red-500 text-sm">{String(errors.mobile.message)}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Address</label>
                    <input {...register("address", { required: "Address is required" })} className="w-full p-2 border rounded" />
                    {errors.address && <p className="text-red-500 text-sm">{String(errors.address.message)}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Driving License</label>
                    <input {...register("license", { required: "Driving License details are required" })} className="w-full p-2 border rounded" />
                    {errors.license && <p className="text-red-500 text-sm">{String(errors.license.message)}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input type="password" {...register("password", { required: "Password is required" })} className="w-full p-2 border rounded" />
                    {errors.password && <p className="text-red-500 text-sm">{String(errors.password.message)}</p>}
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Register</button>
            </form>
        </div>
    );
};

export default Register;
