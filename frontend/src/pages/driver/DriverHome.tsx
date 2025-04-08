import { useNavigate } from "react-router-dom";

const DriverHome = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-3">Driver Portal</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Manage your deliveries and create bills for completed orders.
                </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Create Bill Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                    <div className="p-8">
                        <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold mb-2">
                            Order Management
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Bill</h2>
                        <p className="text-gray-600 mb-6">
                            Generate bills for completed deliveries and update order statuses.
                        </p>
                        <button
                            onClick={() => navigate("/driver/create-bill")}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
                        >
                            Go to Bill Creation
                        </button>
                    </div>
                </div>

                {/* View Orders Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                    <div className="p-8">
                        <div className="uppercase tracking-wide text-sm text-green-600 font-semibold mb-2">
                            Delivery Tracking
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">View Orders</h2>
                        <p className="text-gray-600 mb-6">
                            Check your assigned orders, delivery statuses, and customer details.
                        </p>
                        <button
                            onClick={() => navigate("/driver/view-orders")}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition"
                        >
                            View Your Orders
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverHome;