import { useState } from 'react';
import { Plus, Truck } from 'lucide-react';
import { Table, TableColumn } from '../../../components/Table';

interface Driver {
    id: string;
    name: string;
    mobileNumber: string;
    address: string;
    licenseNumber: string;
    licenseExpiry: string;
    vehicleType: string;
}

export const DriversPage = () => {
    const [drivers, setDrivers] = useState<Driver[]>([
        {
            id: '1',
            name: 'John Smith',
            mobileNumber: '9876543210',
            address: '123 Main St, New York, NY',
            licenseNumber: 'DL123456789',
            licenseExpiry: '2025-12-31',
            vehicleType: 'Medium Truck'
        },
        {
            id: '2',
            name: 'Robert Johnson',
            mobileNumber: '8765432109',
            address: '456 Oak Ave, Los Angeles, CA',
            licenseNumber: 'DL987654321',
            licenseExpiry: '2024-11-30',
            vehicleType: 'Heavy Truck'
        },
        {
            id: '3',
            name: 'Michael Williams',
            mobileNumber: '7654321098',
            address: '789 Pine Rd, Chicago, IL',
            licenseNumber: 'DL456789123',
            licenseExpiry: '2026-05-15',
            vehicleType: 'Light Truck'
        }
    ]);

    const handleAddDriver = () => {
        // Implement add driver logic
        console.log('Add new driver');
    };

    const handleEditDriver = (driver: Driver) => {
        // Implement edit driver logic
        console.log('Edit driver:', driver);
    };

    const handleDeleteDriver = (driver: Driver) => {
        // Implement delete driver logic
        setDrivers(drivers.filter(d => d.id !== driver.id));
        console.log('Delete driver:', driver);
    };

    const columns: TableColumn<Driver>[] = [
        { header: 'Name', accessor: 'name' },
        { header: 'Mobile Number', accessor: 'mobileNumber' },
        { header: 'Address', accessor: 'address' },
        { header: 'License Number', accessor: 'licenseNumber' },
        {
            header: 'License Expiry',
            accessor: 'licenseExpiry',
            cell: (value: string) => new Date(value).toLocaleDateString()
        },
        { header: 'Vehicle Type', accessor: 'vehicleType' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Truck Driver Management</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Manage all your truck drivers in one place
                        </p>
                    </div>
                    <button
                        onClick={handleAddDriver}
                        className="relative flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
                    >
                        {/* Animated background effect */}
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>

                        {/* Button content */}
                        <span className="relative flex items-center gap-3">
                            {/* Truck icon with container */}
                            <span className="flex items-center justify-center p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Truck className="w-5 h-5 text-white" />
                            </span>

                            {/* Text with subtle animation */}
                            <span className="font-medium tracking-wide group-hover:translate-x-1 transition-transform duration-200">
                                Add New Driver
                            </span>
                        </span>

                        {/* Optional: Add a subtle shine effect on hover */}
                        <span className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></span>
                    </button>
                </div>

                {/* Main Table Section */}
                <div className="bg-white overflow-hidden shadow-xl rounded-xl border border-gray-100">
                    <div className="p-1 sm:p-2">
                        <Table
                            data={drivers}
                            columns={columns}
                            onEdit={handleEditDriver}
                            onDelete={handleDeleteDriver}
                        />
                    </div>
                </div>

                {/* Empty State */}
                {drivers.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center border-2 border-dashed border-gray-200 mt-8">
                        <Truck className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No drivers found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Get started by adding a new truck driver.
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={handleAddDriver}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <Plus className="-ml-1 mr-2 h-5 w-5" />
                                Add Driver
                            </button>
                        </div>
                    </div>
                )}

                {/* Add/Edit Modal would go here */}
            </div>
        </div>
    );
};