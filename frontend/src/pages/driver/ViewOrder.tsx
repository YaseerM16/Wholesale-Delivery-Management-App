import { useState, useEffect } from "react";
// import { Order } from "../types/order";
// import { formatDate } from "../utils/dateUtils";
import { Inventory } from "../../utils/inventory.types";
import { Order } from "../../utils/order.types";
import { updatePaymentApi } from "../../services/orderApi";

interface OrderViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    onSave: (updatedOrder: Order) => void;
}

const OrderViewPage = ({ isOpen, onClose, order, onSave }: OrderViewModalProps) => {
    const [originalAmount, setOriginalAmount] = useState(0);
    const [updatedOrder, setUpdatedOrder] = useState<Order | null>(order);
    const [collectedAmount, setCollectedAmount] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (order) {
            setOriginalAmount(order.collectedAmount);
            setCollectedAmount(order.collectedAmount);
            setShowSuccess(false);
            setError('');
        }
    }, [order]);

    const validateAmount = (amount: number) => {
        if (amount < originalAmount) {
            return `Amount cannot be less than $${originalAmount.toFixed(2)}`;
        }
        if (amount > Number(order?.totalBillAmount.toFixed(2))) {
            return `Amount seems higher than (max $${order?.totalBillAmount.toFixed(2)})`;
        }
        if (isNaN(amount)) {
            return 'Please enter a valid number';
        }
        return '';
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value) || 0;
        setCollectedAmount(newValue);
        setError(validateAmount(newValue));
    };

    const handleUpdate = async () => {
        const validationError = validateAmount(collectedAmount);
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsUpdating(true);
        setError('');
        try {
            // await onSave(collectedAmount);
            const response = await updatePaymentApi(order?._id as string, collectedAmount)
            if (response?.status === 200) {
                const { data } = response
                console.log("CollectedAmt by handleUpdate :", collectedAmount);
                console.log("Respon by collectAmt (Backecnd :)", data.data);
                setShowSuccess(true);
                setUpdatedOrder(data.data)
                setTimeout(() => setShowSuccess(false), 3000);
                setOriginalAmount(collectedAmount); // Update baseline after successful save
            }
        } catch (error) {
            console.error("Update failed:", error);
            setError('Failed to update amount. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    if (!isOpen || !order) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (updatedOrder) onSave(updatedOrder);
        else onSave(order)
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Order Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                                    Order Information
                                </h3>
                                <div>
                                    <p className="text-sm text-gray-500">Order Date</p>
                                    {/* <p className="text-gray-800">{formatDate(order.createdAt)}</p> */}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                    <p className="text-gray-800 font-medium">
                                        ${order.totalBillAmount.toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Collected Amount</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        {order.status === "Completed" ? (
                                            <div className="flex-1 border border-gray-300 rounded-md p-2 bg-gray-100">
                                                ${collectedAmount.toFixed(2)}
                                            </div>
                                        ) : (
                                            <>
                                                <input
                                                    type="number"
                                                    value={collectedAmount}
                                                    onChange={handleAmountChange}
                                                    className={`flex-1 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:ring-blue-500 focus:border-blue-500`}
                                                    step="0.01"
                                                    min={originalAmount}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleUpdate}
                                                    disabled={isUpdating || collectedAmount === originalAmount || !!error}
                                                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
                                                >
                                                    {isUpdating ? 'Updating...' : 'Update'}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                    {error && (
                                        <p className="text-sm text-red-600 mt-1">{error}</p>
                                    )}
                                    {showSuccess && (
                                        <p className="text-sm text-green-600 mt-1">Amount updated successfully!</p>
                                    )}
                                    {error && (
                                        <p className="text-sm text-red-600 mt-1">{error}</p>
                                    )}
                                    {showSuccess && (
                                        <p className="text-sm text-green-600 mt-1">Amount updated successfully!</p>
                                    )}
                                    {order.status === "Completed" && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Amount cannot be modified for completed orders
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Vendor Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                                    Vendor Information
                                </h3>
                                <div>
                                    <p className="text-sm text-gray-500">Vendor Name</p>
                                    <p className="text-gray-800">{order.vendor.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone Number</p>
                                    <p className="text-gray-800">{order.vendor.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Address</p>
                                    <p className="text-gray-800">{order.vendor.address}</p>
                                </div>
                            </div>

                            {/* Driver Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                                    Driver Information
                                </h3>
                                <div>
                                    <p className="text-sm text-gray-500">Driver Name</p>
                                    <p className="text-gray-800">{order.truckDriver.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone Number</p>
                                    <p className="text-gray-800">{order.truckDriver.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">License Number</p>
                                    <p className="text-gray-800">{order.truckDriver.drivingLicense}</p>
                                </div>
                            </div>
                        </div>

                        {/* Products List */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                                Products ({order.products.length})
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {order.products.map((productItem: { product: Inventory, quantity: number }) => (
                                            <tr key={productItem.product._id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {productItem.product.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {productItem.product.category}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {productItem.quantity}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    ${productItem.product.price.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    ${(productItem.product.price * productItem.quantity).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 border-t pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OrderViewPage;