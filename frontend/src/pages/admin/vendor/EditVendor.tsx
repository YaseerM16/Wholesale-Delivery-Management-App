import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Building2, X } from 'lucide-react';
import { IVendor } from '../../../utils/vendor.types';

interface EditVendorProps {
    vendorData: IVendor;
    onClose: () => void;
    onVendorUpdated: (updatedVendor: IVendor) => void;
}

export const EditVendor = ({ vendorData, onClose, onVendorUpdated }: EditVendorProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<IVendor>();

    // Initialize form with vendor data
    useEffect(() => {
        reset(vendorData);
    }, [vendorData, reset]);

    const onSubmit = async (data: IVendor) => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const updatedVendor: IVendor = {
                ...data,
                _id: vendorData._id, // Keep the original ID
                isDeleted: vendorData.isDeleted // Keep the original deletion status
            };

            onVendorUpdated(updatedVendor);
            onClose();
        } catch (error) {
            console.error('Error updating vendor:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 sm:max-w-lg">
                {/* Header */}
                <div className="flex justify-between items-center border-b p-4">
                    <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold">Edit Vendor</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Vendor Name */}
                        <div className="space-y-1">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Vendor Name*
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Enter vendor name"
                                className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                {...register('name', { required: 'Vendor name is required' })}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email*
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter vendor email"
                                className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                })}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone Number*
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            placeholder="Enter phone number"
                            className={`w-full px-3 py-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                            {...register('phone', {
                                required: 'Phone number is required',
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: 'Phone number must be 10 digits'
                                }
                            })}
                        />
                        {errors.phone && (
                            <p className="text-sm text-red-500">{errors.phone.message}</p>
                        )}
                    </div>

                    {/* Address */}
                    <div className="space-y-1">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Address*
                        </label>
                        <input
                            id="address"
                            type="text"
                            placeholder="Enter full address"
                            className={`w-full px-3 py-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                            {...register('address', { required: 'Address is required' })}
                        />
                        {errors.address && (
                            <p className="text-sm text-red-500">{errors.address.message}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </>
                            ) : 'Update Vendor'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};