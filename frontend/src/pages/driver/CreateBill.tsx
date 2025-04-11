import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getInventory } from "../../services/inventoryApi";
import { getVendors } from "../../services/vendorApi";
import { Pagination } from "../../components/Pagination";
import { useAppSelector } from "../../store/hooks";
import { createOrderApi } from "../../services/orderApi";
import { OrderInput } from "../../utils/order.types";
import Swal from "sweetalert2";
import { BACKEND_URL } from "../../utils/constants";

// Types
export type IVendor = {
    _id: string;
    name: string;
    address: string;
    email: string;
    phone: number;
    isDeleted: boolean;
};

export type Inventory = {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    category: string;
    images: { imageUrl: string; name: string }[];
    isDeleted: boolean;
};

type OrderItem = {
    product: Inventory;
    quantity: number;
};

const CreateBill = () => {
    const navigate = useNavigate();
    const [vendors, setVendors] = useState<IVendor[]>([]);
    const [products, setProducts] = useState<Inventory[]>([]);
    const [selectedVendor, setSelectedVendor] = useState<IVendor | null>(null);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [collectedAmount, setCollectedAmount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const itemsPerPage = 6
    const driver = useAppSelector(state => state.drivers.driver)

    // Calculate total bill amount
    const totalAmount = orderItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    // Fetch vendors and products
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const [vendorsRes, productsRes] = await Promise.all([
                    // axios.get("/api/vendors"),
                    // axios.get("/api/inventory"),
                    getVendors(undefined, undefined),
                    getInventory(currentPage, itemsPerPage)
                ]);

                setTotalPages(
                    prev => (prev !== Math.ceil(productsRes?.data.data.totalInventory / itemsPerPage)
                        ? Math.ceil(productsRes?.data.data.totalInventory / itemsPerPage)
                        : prev)
                );
                setVendors(vendorsRes?.data.data.vendors);
                setProducts(productsRes?.data.data.inventory);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch data. Please try again.");
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage]);

    const handleAddProduct = (product: Inventory) => {
        const existingItem = orderItems.find((item) => item.product._id === product._id);

        if (existingItem) {
            setOrderItems(
                orderItems.map((item) =>
                    item.product._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } else {
            setOrderItems([...orderItems, { product, quantity: 1 }]);
        }
    };

    const handleRemoveProduct = (productId: string) => {
        setOrderItems(orderItems.filter((item) => item.product._id !== productId));
    };

    const handleQuantityChange = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            handleRemoveProduct(productId);
            return;
        }

        setOrderItems(
            orderItems.map((item) =>
                item.product._id === productId ? { ...item, quantity } : item
            )
        );
    };

    const handleSubmit = async () => {
        if (!selectedVendor) {
            setError("Please select a vendor");
            return;
        }

        if (orderItems.length === 0) {
            setError("Please add at least one product");
            return;
        }

        if (collectedAmount <= 0) {
            setError("Collected amount must be greater than 0");
            return;
        }

        if (collectedAmount > Number(totalAmount.toFixed(2))) {
            setError(`Collected amount seems higher than total amount (max $${totalAmount.toFixed(2)})`);
            return;
        }

        try {
            const orderData = {
                vendor: selectedVendor._id,
                products: orderItems.map((item) => ({
                    product: item.product._id,
                    quantity: item.quantity,
                })),
                totalBillAmount: totalAmount,
                collectedAmount,
                truckDriver: driver?._id
            };
            console.log("Order Data :", orderData);
            const response = await createOrderApi(orderData as OrderInput)
            if (response?.status === 200) {
                const { data } = response
                console.log("The Order was Created (backend): ", data);
                navigate(-1);
                Swal.fire({
                    icon: 'success',
                    title: "Success",
                    text: "Bill has been created successfully ✅",
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                });
            }
        } catch (err) {
            setError("Failed to create order. Please try again.");
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Error!",
                text: (err as Error)?.message || "Something went wrong. Please try again.",
                showConfirmButton: true,
                confirmButtonText: "OK",
                toast: true,
            })
        }
    };

    // if (loading) {
    //     return (
    //         <div className="flex justify-center items-center min-h-screen">
    //             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    //         </div>
    //     );
    // }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Create New Bill</h1>
                    <button
                        onClick={() => navigate("/driver")}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                        Back to Dashboard
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                        <p>{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Vendor Selection */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Vendor Details</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Select Vendor</label>
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                onChange={(e) =>
                                    setSelectedVendor(
                                        vendors.find((v) => v._id === e.target.value) || null
                                    )
                                }
                                value={selectedVendor?._id || ""}
                            >
                                <option value="">Select a vendor</option>
                                {vendors.map((vendor) => (
                                    <option key={vendor._id} value={vendor._id}>
                                        {vendor.name} - {vendor.phone}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {selectedVendor && (
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="font-medium text-gray-800 mb-2">Vendor Information</h3>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Name:</span> {selectedVendor.name}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Address:</span> {selectedVendor.address}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Phone:</span> {selectedVendor.phone}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Email:</span> {selectedVendor.email}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Product Selection */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Products</h2>
                        {loading ? <div className="flex justify-center items-center min-h-screen">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div> : <>
                            {/* Update the product card rendering in your existing code */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {products.map((product) => {
                                    const isSelected = orderItems.some(item => item.product._id === product._id);
                                    return (
                                        <div
                                            key={product._id}
                                            className={`border rounded-lg p-4 transition-all duration-300 cursor-pointer ${isSelected
                                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                                : 'border-gray-200 hover:bg-gray-50 hover:shadow-sm'
                                                }`}
                                            onClick={() => {
                                                if (isSelected) {
                                                    handleRemoveProduct(product._id);
                                                } else {
                                                    handleAddProduct(product);
                                                }
                                            }}
                                        >
                                            <div className="flex gap-4">
                                                {/* Product Image */}
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={`${BACKEND_URL}/uploads/${product.images[0].name}` || '/placeholder-product.png'}
                                                        alt={product.name}
                                                        className="w-20 h-20 object-cover rounded-md"
                                                    />
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                                                                {product.name}
                                                                {isSelected && (
                                                                    <span className="ml-2 text-blue-600">
                                                                        ✓
                                                                    </span>
                                                                )}
                                                            </h3>
                                                            <p className={isSelected ? 'text-blue-600' : 'text-gray-600'}>
                                                                ${product.price.toFixed(2)}
                                                            </p>
                                                            <p className={`text-sm ${isSelected ? 'text-blue-500' : 'text-gray-500'}`}>
                                                                Available: {product.quantity}
                                                            </p>
                                                        </div>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${isSelected
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {product.category}
                                                        </span>
                                                    </div>

                                                    {/* Show quantity only if selected */}
                                                    {isSelected && (
                                                        <div className="mt-2">
                                                            <p className="text-xs text-blue-600">
                                                                Selected (click to remove)
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>}

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            className="mt-4"
                        />

                        {/* Selected Products */}
                        <h3 className="text-lg font-medium mb-3 text-gray-800">Selected Products</h3>
                        {orderItems.length === 0 ? (
                            <p className="text-gray-500 italic">No products selected</p>
                        ) : (
                            <div className="border rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orderItems.map((item) => (
                                            <tr key={item.product._id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {item.product.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {item.product.category}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    ${item.product.price.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-gray-500 mb-1">
                                                            Available: {item.product.quantity}
                                                        </span>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max={item.product.quantity}
                                                            value={item.quantity}
                                                            onChange={(e) =>
                                                                handleQuantityChange(
                                                                    item.product._id,
                                                                    parseInt(e.target.value) || 1
                                                                )
                                                            }
                                                            className="w-20 p-1 border border-gray-300 rounded"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    ${(item.product.price * item.quantity).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => handleRemoveProduct(item.product._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                        <p>{error}</p>
                    </div>
                )}

                {/* Order Summary */}
                <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-700">Subtotal:</span>
                                <span className="font-medium">${totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-4">
                                <span className="text-gray-700">Collected Amount:</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={collectedAmount}
                                    onChange={(e) => setCollectedAmount(Math.round(parseFloat(e.target.value) || 0))}
                                    className="w-32 p-2 border border-gray-300 rounded text-right"
                                />
                            </div>
                            <div className="border-t pt-4">z
                                <div className="flex justify-between">
                                    <span className="font-semibold text-gray-800">Balance:</span>
                                    <span className="font-bold text-lg">
                                        ${(collectedAmount - totalAmount).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-end">
                            <button
                                onClick={handleSubmit}
                                disabled={!selectedVendor || orderItems.length === 0}
                                className={`px-6 py-3 rounded-lg text-white font-medium ${!selectedVendor || orderItems.length === 0
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                    } transition`}
                            >
                                Create Bill
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateBill;