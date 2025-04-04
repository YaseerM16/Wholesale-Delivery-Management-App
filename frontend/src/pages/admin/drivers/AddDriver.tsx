import { useState } from 'react';
import { Truck, X, Save, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { DriverRegisterInput } from '../../../utils/driver.types';

interface AddDriverProps {
    onClose: () => void;
    onDriverAdded: (driver: DriverRegisterInput) => Promise<void>;
}

export const AddDriver = ({ onClose, onDriverAdded }: AddDriverProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm<DriverRegisterInput>({
        defaultValues: {
        }
    });

    const onSubmit = async (data: DriverRegisterInput) => {
        setIsSubmitting(true);
        try {
            await onDriverAdded(data);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Success!",
                text: "Driver added successfully!",
                showConfirmButton: false,
                timer: 2000,
                toast: true,
            });
            reset();
            onClose();
        } catch (error) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Error!",
                text: (error as Error)?.message || "Failed to add driver",
                showConfirmButton: true,
                confirmButtonText: "OK",
                timer: 3000,
                toast: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Modal Header - Fixed height */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <Truck className="w-6 h-6" />
                            <h2 className="text-xl font-bold">Add New Driver</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full hover:bg-white/10 transition-colors"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Modal Body - Fixed height with scroll if needed */}
                <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                        <div className="space-y-4">
                            {/* Name Field - Fixed height row */}
                            <div className="min-h-[80px]">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    {...register('name', {
                                        required: 'Name is required',
                                        minLength: {
                                            value: 2,
                                            message: 'Name must be at least 2 characters'
                                        },
                                        validate: (value) => {
                                            const trimmed = value.trim();
                                            setValue('name', trimmed);
                                            return trimmed.length > 0 || 'Name cannot be empty';
                                        }
                                    })}
                                    className={`w-full px-4 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    placeholder="John Doe"
                                />
                                <div className="h-5 mt-1">
                                    {errors.name && (
                                        <p className="text-sm text-red-600">{errors.name.message}</p>
                                    )}
                                </div>
                            </div>

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

                            {/* Address Field */}
                            <div className="min-h-[120px]">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                    Address
                                </label>
                                <textarea
                                    id="address"
                                    {...register('address', {
                                        required: 'Address is required',
                                        minLength: {
                                            value: 5,
                                            message: 'Address too short'
                                        },
                                        validate: (value) => {
                                            const trimmed = value.trim();
                                            setValue('address', trimmed);
                                            return trimmed.length > 0 || 'Address cannot be empty';
                                        }
                                    })}
                                    rows={3}
                                    className={`w-full px-4 py-2 rounded-lg border ${errors.address ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    placeholder="123 Main St, City, State"
                                />
                                <div className="h-5 mt-1">
                                    {errors.address && (
                                        <p className="text-sm text-red-600">{errors.address.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* License Number Field - India Specific */}
                            {/* India Driving License Field - Structured Input */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Driving License Number
                                    </label>

                                    {/* State Code Dropdown */}
                                    <div className="grid grid-cols-4 gap-3">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">State Code</label>
                                            <select
                                                {...register('dlState', {
                                                    required: 'State code is required'
                                                })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            >
                                                <option value="">Select</option>
                                                {[
                                                    'AN', 'AP', 'AR', 'AS', 'BR', 'CH', 'CG', 'DD', 'DL', 'DN',
                                                    'GA', 'GJ', 'HR', 'HP', 'JK', 'JH', 'KA', 'KL', 'LD', 'MP',
                                                    'MH', 'MN', 'ML', 'MZ', 'NL', 'OR', 'PY', 'PB', 'RJ', 'SK',
                                                    'TN', 'TR', 'UP', 'UK', 'WB'
                                                ].map(state => (
                                                    <option key={state} value={state}>{state}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Year of Issue */}
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Year</label>
                                            <select
                                                {...register('dlYear', {
                                                    required: 'Year is required',
                                                    validate: (value) => {
                                                        const currentYear = new Date().getFullYear();
                                                        return (value >= 1985 && value <= currentYear) || 'Invalid year';
                                                    }
                                                })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            >
                                                <option value="">Year</option>
                                                {Array.from({ length: 40 }, (_, i) => {
                                                    const year = new Date().getFullYear() - i;
                                                    return <option key={year} value={year}>{year}</option>;
                                                })}
                                            </select>
                                        </div>

                                        {/* Serial Number (8 digits) */}
                                        <div className="col-span-2">
                                            <label className="block text-xs text-gray-500 mb-1">Unique Number</label>
                                            <input
                                                type="text"
                                                {...register('dlNumber', {
                                                    required: 'License number is required',
                                                    pattern: {
                                                        value: /^\d{8}$/,
                                                        message: 'Must be 8 digits'
                                                    }
                                                })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                placeholder="12345678"
                                                maxLength={8}
                                            />
                                        </div>
                                    </div>

                                    {/* Combined Display */}
                                    <div className="mt-3 p-2 bg-gray-50 rounded-md">
                                        <p className="text-sm font-mono">
                                            {watch('dlState') || 'XX'}{watch('dlYear')?.toString().slice(-2) || '00'}{watch('dlNumber') || '12345678'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Format: StateCode + Last2DigitsOfYear + 8DigitNumber
                                        </p>
                                    </div>

                                    {/* Error Messages */}
                                    <div className="h-5 mt-1">
                                        {errors.dlState && <p className="text-sm text-red-600">{errors.dlState.message}</p>}
                                        {errors.dlYear && <p className="text-sm text-red-600">{errors.dlYear.message}</p>}
                                        {errors.dlNumber && <p className="text-sm text-red-600">{errors.dlNumber.message}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="min-h-[80px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: { value: 6, message: 'Password must be at least 6 characters' },
                                        validate: (value) => /^\S+$/.test(value) || 'Password cannot contain spaces',
                                    })}
                                    className={`w-full p-3 rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-blue-500`}
                                />
                                <div className="h-5 mt-1">
                                    {errors.password && (
                                        <p className="text-sm text-red-600">{String(errors.password.message)}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer - Fixed position */}
                        <div className="flex justify-end space-x-3 pt-4 sticky bottom-0 bg-white pb-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center min-w-24"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Driver
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};