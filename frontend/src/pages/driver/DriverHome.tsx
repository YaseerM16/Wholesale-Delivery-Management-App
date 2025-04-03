import { useNavigate } from "react-router-dom";

const Driver = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            {/* Header */}
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Driver Dashboard</h1>
            <p className="text-lg text-gray-600 mb-8">
                View and manage your assigned deliveries efficiently.
            </p>

            {/* Navigation Options */}
            <div className="flex flex-col gap-6 w-full max-w-md">
                <button
                    onClick={() => navigate("/driver/assigned-deliveries")}
                    className="w-full px-6 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition"
                >
                    View Assigned Deliveries
                </button>
                <button
                    onClick={() => navigate("/driver/delivery-history")}
                    className="w-full px-6 py-4 text-lg font-semibold text-white bg-gray-600 rounded-lg shadow-md hover:bg-gray-700 transition"
                >
                    Delivery History
                </button>
            </div>
        </div>
    );
};

export default Driver;
