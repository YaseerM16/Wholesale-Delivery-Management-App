import { useEffect, useState } from 'react';
import { Truck, X, Save, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { DriverRegisterInput, IDriver } from '../../../utils/driver.types';

interface EditDriverProps {
    driverData: IDriver;
    onClose: () => void;
    onDriverUpdated: (driver: DriverRegisterInput) => Promise<void>;
}

export const EditDriver = ({ driverData, onClose, onDriverUpdated }: EditDriverProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm<DriverRegisterInput>();

    // Initialize form with driver data
    useEffect(() => {
        if (driverData) {
            reset(driverData);

            // Split DL number if it exists
            if (driverData.drivingLicense) {
                const dl = driverData.drivingLicense;
                setValue('dlState', dl.substring(0, 2));
                setValue('dlYear', parseInt(`20${dl.substring(2, 4)}`));
                setValue('dlNumber', dl.substring(4));
            }
        }
    }, [driverData, reset, setValue]);

    const onSubmit = async (data: DriverRegisterInput) => {
        setIsSubmitting(true);
        try {
            await onDriverUpdated(data);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Success!",
                text: "Driver updated successfully!",
                showConfirmButton: false,
                timer: 2000,
                toast: true,
            });
            onClose();
        } catch (error) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Error!",
                text: (error as Error)?.message || "Failed to update driver",
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
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <Truck className="w-6 h-6" />
                            <h2 className="text-xl font-bold">Edit Driver</h2>
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

                {/* Modal Body */}
                <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                        <div className="space-y-4">
                            {/* Name Field */}
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
                                />
                                <div className="h-5 mt-1">
                                    {errors.address && (
                                        <p className="text-sm text-red-600">{errors.address.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Driving License Field */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Driving License Number
                                    </label>

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
                                                maxLength={8}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-3 p-2 bg-gray-50 rounded-md">
                                        <p className="text-sm font-mono">
                                            {watch('dlState') || 'XX'}{watch('dlYear')?.toString().slice(-2) || '00'}{watch('dlNumber') || '12345678'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Format: StateCode + Last2DigitsOfYear + 8DigitNumber
                                        </p>
                                    </div>

                                    <div className="h-5 mt-1">
                                        {errors.dlState && <p className="text-sm text-red-600">{errors.dlState.message}</p>}
                                        {errors.dlYear && <p className="text-sm text-red-600">{errors.dlYear.message}</p>}
                                        {errors.dlNumber && <p className="text-sm text-red-600">{errors.dlNumber.message}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
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
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Update Driver
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