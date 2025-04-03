import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            {/* Hero Section */}
            <div className="text-center max-w-2xl mb-10">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Wholesale Delivery Management</h1>
                <p className="text-lg text-gray-600">
                    A seamless platform for wholesalers to manage deliveries, vendors, and truck drivers efficiently.
                </p>
            </div>

            {/* Login Options */}
            <div className="flex gap-6">
                <button
                    onClick={() => navigate("/login/admin")}
                    className="px-8 py-4 text-xl font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition"
                >
                    As Admin
                </button>

                <button
                    onClick={() => navigate("/login/driver")}
                    className="px-8 py-4 text-xl font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition"
                >
                    As Driver
                </button>
            </div>
        </div>
    );
};

export default Home;
