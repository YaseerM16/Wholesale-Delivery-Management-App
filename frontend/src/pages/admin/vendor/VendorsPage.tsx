import { useEffect, useState } from 'react';
import { Building2, Plus } from 'lucide-react';
import { Loader } from '../../../components/Loader';
import { Pagination } from '../../../components/Pagination';
import { Table, TableColumn } from '../../../components/Table';
import { IVendor } from '../../../utils/vendor.types';
import { AddVendor } from './AddVendor';
import { vendorRegisterApi, getVendors, editVendorApi, deleteVendorApi } from '../../../services/vendorApi';
import Swal from 'sweetalert2';
import { EditVendor } from './EditVendor';

export const VendorsPage = () => {
    const [vendors, setVendors] = useState<IVendor[]>([
        {
            _id: "vndr1",
            name: 'ABC Suppliers',
            email: 'contact@abcsuppliers.com',
            phone: 9876543210,
            address: '123 Business Park, New York, NY',
            isDeleted: false
        },
        {
            _id: "vndr2",
            name: 'XYZ Wholesale',
            email: 'info@xyzwholesale.com',
            phone: 8765432109,
            address: '456 Industrial Zone, Los Angeles, CA',
            isDeleted: false
        },
        {
            _id: "vndr3",
            name: 'Global Distributors',
            email: 'sales@globaldist.com',
            phone: 7654321098,
            address: '789 Trade Center, Chicago, IL',
            isDeleted: false
        }
    ]);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState<IVendor | null>(null);
    const vendorsPerPage = 6

    const columns: TableColumn<IVendor>[] = [
        { header: 'Vendor Name', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        { header: 'Phone Number', accessor: 'phone' },
        { header: 'Address', accessor: 'address' },
    ];

    const fetchVendors = async (currentPage: number) => {
        try {
            setLoading(true);
            const response = await getVendors(currentPage, vendorsPerPage);
            if (response?.status === 200) {
                const { data } = response;
                setVendors(data.data.vendors)
                setLoading(false);
                setTotalPages(
                    prev => (prev !== Math.ceil(data.data.totalVendors / vendorsPerPage)
                        ? Math.ceil(data.data.totalVendors / vendorsPerPage)
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
        fetchVendors(currentPage);
    }, [currentPage]);

    const handleAddVendor = () => {
        setIsAddVendorOpen(true);
    };

    const handleCloseAddVendor = () => {
        setIsAddVendorOpen(false);
    };

    const handleVendorAdded = async (newVendor: IVendor) => {
        try {
            const response = await vendorRegisterApi(newVendor)
            if (response?.status === 200) {
                const { data } = response
                setVendors([data.data, ...vendors]);
                setIsAddVendorOpen(false);
                Swal.fire({
                    icon: 'success',
                    title: "Success",
                    text: "Vendor has been Added successfully ✅",
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                });
            }
        } catch (error) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Error!",
                text: (error as Error)?.message || "Something went wrong. Please try again.",
                showConfirmButton: true,
                confirmButtonText: "OK",
                toast: true,
            })
        }
    };

    const handleEditVendor = (vendor: IVendor) => {
        setEditingVendor(vendor);
    };

    const handleDeleteVendor = (vendor: IVendor) => {
        try {
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
                    const response = await deleteVendorApi(vendor._id, currentPage, vendorsPerPage);
                    if (response?.status === 200) {
                        const { data } = response;
                        setVendors(data.data);
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

    const handleVendorUpdated = async (updatedVendor: IVendor) => {
        try {
            const response = await editVendorApi(updatedVendor._id, updatedVendor)
            if (response?.status === 200) {
                const { data } = response
                setVendors(vendors.map(vendor =>
                    vendor._id === data.data._id ? data.data : vendor
                ));
                setEditingVendor(null);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Success!",
                    text: "Vendor details has been updated successfully!",
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
                text: (error as Error)?.message || "Something went wrong. Please try again.",
                showConfirmButton: true,
                confirmButtonText: "OK",
                toast: true,
            })
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Manage all your vendors in one place
                        </p>
                    </div>
                    <button
                        onClick={handleAddVendor}
                        className="relative flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
                    >
                        {/* Animated background effect */}
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>

                        {/* Button content */}
                        <span className="relative flex items-center gap-3">
                            {/* Vendor icon with container */}
                            <span className="flex items-center justify-center p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Building2 className="w-5 h-5 text-white" />
                            </span>

                            {/* Text with subtle animation */}
                            <span className="font-medium tracking-wide group-hover:translate-x-1 transition-transform duration-200">
                                Add New Vendor
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
                            <Loader message="Fetching vendor records" size="md" />
                        </div>
                    ) : (
                        <>
                            <Table
                                data={vendors}
                                columns={columns}
                                onEdit={handleEditVendor}
                                onDelete={handleDeleteVendor}
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
                {vendors.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center border-2 border-dashed border-gray-200 mt-8">
                        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No vendors found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Get started by adding a new vendor.
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={handleAddVendor}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <Plus className="-ml-1 mr-2 h-5 w-5" />
                                Add Vendor
                            </button>
                        </div>
                    </div>
                )}

                {isAddVendorOpen && (
                    <AddVendor
                        onClose={handleCloseAddVendor}
                        onVendorAdded={handleVendorAdded}
                    />
                )}

                {/* Edit Vendor Modal */}
                {editingVendor && (
                    <EditVendor
                        vendorData={editingVendor}
                        onClose={() => setEditingVendor(null)}
                        onVendorUpdated={handleVendorUpdated}
                    />
                )}
            </div>
        </div>
    );
}