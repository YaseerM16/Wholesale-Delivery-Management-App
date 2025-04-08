import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../components/Pagination";
import { Table, TableColumn } from "../../components/Table";
import { IVendor } from "../../utils/vendor.types";
import { getOrders } from "../../services/orderApi";
import { Order, productList } from "../../utils/order.types";
import OrderViewPage from "./ViewOrder";
import { Package, Truck } from "lucide-react";
// import { TableColumn } from "../../components/Table/Table.types";
interface OrdersPageProps {
    role: 'ADMIN' | 'DRIVER';
}

const OrdersPage = ({ role }: OrdersPageProps) => {
    const isAdmin = role === 'ADMIN';
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Order; direction: "asc" | "desc" }>({
        key: "createdAt",
        direction: "desc",
    });
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const ordersPerPage = 6;
    console.log("orders :", orders);


    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await getOrders(currentPage, ordersPerPage);
                if (response?.status === 200) {
                    const { data } = response;
                    console.log("Orders (backend): ", data.data);

                    setOrders(data.data.orders);
                    setTotalPages(
                        prev => (prev !== Math.ceil(data.data.totalOrders / ordersPerPage)
                            ? Math.ceil(data.data.totalOrders / ordersPerPage)
                            : prev)
                    );
                    setError("");
                }
            } catch (err) {
                setError("Failed to fetch orders. Please try again.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [currentPage]);

    const handleSort = (key: keyof Order) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const columns: TableColumn<Order>[] = [
        {
            header: (
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("createdAt")}>
                    Date
                    {sortConfig.key === "createdAt" && (
                        <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                </div>
            ),
            accessor: "createdAt",
            cell: (value) => <span className="text-sm text-gray-500">{formatDate(value)}</span>,
        },
        {
            header: "Vendor",
            accessor: "vendor",
            cell: (vendor: IVendor) => (
                <div>
                    <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                    <div className="text-sm text-gray-500">{vendor.phone}</div>
                </div>
            ),
        },
        {
            header: "Products",
            accessor: "products",
            cell: (products: productList[]) => (
                <div>
                    <div className="text-sm text-gray-900">{products.length} items</div>
                    <div className="text-xs text-gray-500">
                        {products.map((p) => `${p.product.name} (${p.quantity})`).join(", ")}
                    </div>
                </div>
            ),
        },
        {
            header: (
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("totalBillAmount")}>
                    Total Amount
                    {sortConfig.key === "totalBillAmount" && (
                        <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                </div>
            ),
            accessor: "totalBillAmount",
            cell: (value) => (
                <span className="text-sm font-medium text-gray-900">${value.toFixed(2)}</span>
            ),
        },
        {
            header: "Collected",
            accessor: "collectedAmount",
            cell: (value) => (
                <span className="text-sm font-medium text-gray-900">${value.toFixed(2)}</span>
            ),
        },
        {
            header: "Status",
            accessor: "status",
            cell: (status: "Pending" | "Completed") => (
                <div className="flex items-center">
                    {status === "Completed" ? (
                        <svg className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="h-4 w-4 text-yellow-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                        }`}>
                        {status}
                    </span>
                </div>
            ),
        },
        {
            header: "Actions",
            accessor: "_id",
            cell: (_, row) => (
                <button
                    onClick={() => {
                        setSelectedOrder(row);
                        setIsViewModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                >
                    View
                </button>
            ),
        }
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <header className="mb-8">
                        {/* App Branding with Role Indicator */}
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-600 p-2 rounded-lg">
                                    <Truck className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">LogiTrack</h1>
                                    <p className="text-sm text-gray-500">Delivery Management System</p>
                                </div>
                            </div>

                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                {isAdmin ? 'Administrator' : 'Delivery Professional'}
                            </span>
                        </div>

                        {/* Page Title and Actions */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                                    {isAdmin ? 'Orders Dashboard' : 'My Delivery Schedule'}
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    {isAdmin
                                        ? 'Comprehensive view of all delivery orders'
                                        : 'Your assigned deliveries and status updates'}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {/* Create Order / Find Deliveries Button */}
                                <button
                                    onClick={() => navigate(isAdmin ? "/admin/create-bill" : "/driver/create-bill")}
                                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${isAdmin
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                        }`}
                                >
                                    <Package className="w-4 h-4" />
                                    {isAdmin ? 'Create Order' : 'Create Bill'}
                                </button>
                            </div>
                        </div>
                    </header>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                        <p>{error}</p>
                    </div>
                )}

                <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                    <Table
                        data={orders}
                        columns={columns}
                        emptyState={
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                                    No orders found
                                </td>
                            </tr>
                        }
                    />
                </div>

                <div className="flex justify-between items-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
            <div className="min-h-screen bg-gray-50 p-6">
                {/* ... your existing code ... */}

                {/* Add the modal */}
                <OrderViewPage
                    isOpen={isViewModalOpen}
                    onClose={() => setIsViewModalOpen(false)}
                    order={selectedOrder}
                    onSave={(updatedOrder) => {
                        // Handle save logic here (update collected amount)
                        console.log("Updated order: (ordersPage):", updatedOrder);
                        setOrders(orders.map(order => {
                            return order._id === updatedOrder._id ? updatedOrder : order;
                        }));
                        setIsViewModalOpen(false);
                    }}
                />
            </div>

        </div>
    );
};

export default OrdersPage;