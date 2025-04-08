import { useEffect, useState } from 'react';
import { Plus, Truck } from 'lucide-react';
import { Table, TableColumn } from '../../../components/Table';
import { AddDriver } from './AddDriver';
import Swal from 'sweetalert2';
import { driverRegisterApi, editDriverApi, getDrivers, deleteDriverApi } from '../../../services/driverApi';
import { DriverRegisterInput, IDriver } from '../../../utils/driver.types';
import { Loader } from '../../../components/Loader';
import { Pagination } from '../../../components/Pagination';
import { EditDriver } from './EditDriver';
import AdminNavbar from '../AdminNavbar';

export const DriversPage = () => {
    const [drivers, setDrivers] = useState<IDriver[]>([
        {
            _id: "dsfsd",
            name: 'John Smith',
            phone: 9876543210,
            address: '123 Main St, New York, NY',
            drivingLicense: 'DL123456789',
            isDeleted: false
        },
        {
            _id: "rgreg",
            name: 'Robert Johnson',
            phone: 8765432109,
            address: '456 Oak Ave, Los Angeles, CA',
            drivingLicense: 'DL987654321',
            isDeleted: false
        },
        {
            _id: "sdfsfs",
            name: 'Michael Williams',
            phone: 7654321098,
            address: '789 Pine Rd, Chicago, IL',
            drivingLicense: 'DL456789123',
            isDeleted: false
        }
    ]);

    const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [editingDriver, setEditingDriver] = useState<IDriver | null>(null);

    const driversPerPage = 6;

    const fetchDrivers = async (currentPage: number) => {
        try {
            setLoading(true);
            const response = await getDrivers(currentPage, driversPerPage);
            if (response?.status === 200) {
                const { data } = response;
                setDrivers(data.data.drivers)
                setLoading(false);
                setTotalPages(
                    prev => (prev !== Math.ceil(data.data.totalDrivers / driversPerPage)
                        ? Math.ceil(data.data.totalDrivers / driversPerPage)
                        : prev)
                );
            }
        } catch (err) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Error!",
                text: (err as Error)?.message || "Something went wrong. Please try again.",
                showConfirmButton: true,
                confirmButtonText: "OK",
                timer: 3000,
                toast: true,
            });
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchDrivers(currentPage);
    }, [currentPage]);

    const handleAddDriver = () => {
        setIsAddDriverOpen(true); // Open the modal
    };

    const handleCloseAddDriver = () => {
        setIsAddDriverOpen(false); // Close the modal
    };

    const handleDriverAdded = async (newDriver: DriverRegisterInput) => {
        try {
            const drivingLicense = `${newDriver.dlState}${newDriver.dlYear?.toString().slice(-2)}${newDriver.dlNumber}`;
            const driverData = {
                ...newDriver,
                drivingLicense
            };

            const response = await driverRegisterApi(driverData);

            if (response?.status === 200) {
                fetchDrivers(currentPage)
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Success!",
                    text: "Driver added successfully!",
                    showConfirmButton: false,
                    timer: 2000,
                    toast: true,
                });
            }

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
        }
    };

    const handleEditDriver = (driver: IDriver) => {
        setEditingDriver(driver);
    };

    // Handler for when update is complete
    const handleDriverUpdated = async (updatedDriver: DriverRegisterInput) => {
        try {
            console.log("THata is EDible L :", updatedDriver);
            const response = await editDriverApi(editingDriver?._id as string, updatedDriver)
            if (response?.status === 200) {
                const { data } = response
                // console.log("RESpon from the EditDriver :", data.data);
                setDrivers(drivers.map(driver => {
                    return driver._id === data.data._id ? data.data : driver;
                }));
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Success!",
                    text: "Driver detils has been updated successfully!",
                    showConfirmButton: false,
                    timer: 2000,
                    toast: true,
                });
            }
        } catch (error) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Error!",
                text: (error as Error)?.message || "Failed to edit driver details",
                showConfirmButton: true,
                confirmButtonText: "OK",
                timer: 3000,
                toast: true,
            });
        }
    };

    const handleDeleteDriver = async (driver: IDriver) => {
        try {
            console.log('Delete driver:', driver);
            // Implement delete driver logic
            Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to Delete this Driver ?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, proceed!',
                cancelButtonText: 'No, cancel!',
                toast: true,
                position: 'top-end',
                timer: 3000,
                timerProgressBar: true,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const response = await deleteDriverApi(driver._id, currentPage, driversPerPage);
                    if (response?.status === 200) {
                        const { data } = response;
                        setDrivers(data.data);
                        Swal.fire({
                            icon: 'success',
                            title: "Success",
                            text: "Driver has been Deleted successfully ✅",
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                        });
                    }
                }
            });
        } catch (error) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Error!",
                text: (error as Error)?.message || "Something went wrong. Please try again.",
                showConfirmButton: true,
                confirmButtonText: "OK",
                timer: 3000,
                toast: true,
            });
        }
    };

    const columns: TableColumn<IDriver>[] = [
        { header: 'Name', accessor: 'name' },
        { header: 'Mobile Number', accessor: 'phone' },
        { header: 'Address', accessor: 'address' },
        { header: 'License Number', accessor: 'drivingLicense' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavbar />
            <div className="pt-20">
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
                        {loading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
                                <Loader message="Fetching driver records" size="md" />
                            </div>
                        ) : (
                            <>

                                <Table
                                    data={drivers}
                                    columns={columns}
                                    onEdit={handleEditDriver}
                                    onDelete={handleDeleteDriver}
                                />
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                    className="mt-4"
                                />
                            </>
                        )}
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

                    {isAddDriverOpen && (
                        <AddDriver
                            onClose={handleCloseAddDriver}
                            onDriverAdded={handleDriverAdded}
                        />
                    )}
                    {/* Edit Driver Modal */}
                    {editingDriver && (
                        <EditDriver
                            driverData={editingDriver}
                            onClose={() => setEditingDriver(null)}
                            onDriverUpdated={handleDriverUpdated}
                        />
                    )}

                    {/* Add/Edit Modal would go here */}
                </div>
            </div>
        </div>
    );
};