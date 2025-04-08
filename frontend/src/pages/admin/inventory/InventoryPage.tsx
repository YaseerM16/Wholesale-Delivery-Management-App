import { useEffect, useState } from 'react';
import { Plus, Package } from 'lucide-react';
import { Inventory } from '../../../utils/inventory.types';
import { Table, TableColumn } from '../../../components/Table';
import { Loader } from '../../../components/Loader';
import { Pagination } from '../../../components/Pagination';
import { AddItem } from './AddItem';
import { addItemToInventoryApi, getInventory, editItemApi, deleteItemApi } from '../../../services/inventoryApi';
import Swal from 'sweetalert2';
import { EditItem } from './EditItem';
import AdminNavbar from '../AdminNavbar';
import { BACKEND_URL } from '../../../utils/constants';

export const InventoryPage = () => {
    const [inventory, setInventory] = useState<Inventory[]>([
        {
            _id: "inv1",
            name: 'Steel Rods',
            price: 45.99,
            quantity: 4,
            category: 'Construction Materials',
            images: [{ imageUrl: "string", name: "string" }],
            isDeleted: false
        },
        {
            _id: "inv2",
            name: 'Cement Bags',
            price: 12.50,
            quantity: 6,
            category: 'Construction Materials',
            images: [{ imageUrl: "string", name: "string" }],
            isDeleted: false
        },
        {
            _id: "inv3",
            name: 'Electrical Wires',
            price: 8.75,
            quantity: 9,
            category: 'Electrical Supplies',
            images: [{ imageUrl: "string", name: "string" }],
            isDeleted: false
        }
    ]);

    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isAddInventoryOpen, setIsAddInventoryOpen] = useState(false);
    const [editingInventory, setEditingInventory] = useState<Inventory | null>(null);
    const [previewImg, setPreviewImg] = useState<string | null>(null);
    const itemPerPage = 6

    const columns: TableColumn<Inventory>[] = [
        { header: 'Item Name', accessor: 'name' },
        {
            header: 'Price ($)',
            accessor: 'price',
            cell: (value: number) => `$${(value as number).toFixed(2)}` // Format price with 2 decimals
        },
        {
            header: 'Quantity ',
            accessor: 'quantity',
            cell: (value: number) => `${(value as number)}` // Format price with 2 decimals
        },
        { header: 'Category', accessor: 'category' },
        {
            header: "Images",
            accessor: "images",
            cell: (value: { imageUrl: string; name: string }[], row: Inventory) => {

                return (
                    <>
                        <div className="group relative">
                            <div className="flex gap-2">
                                {value.slice(0, 1).map((img, index) => (
                                    <div
                                        key={`${row._id}-${index}`}
                                        className="w-10 h-10 rounded-md overflow-hidden border border-gray-200 cursor-pointer transition-transform duration-200 hover:scale-110 hover:shadow-md"
                                        onClick={() => setPreviewImg(`${BACKEND_URL}/uploads/${img.name}`)}
                                    >
                                        <img
                                            src={`${BACKEND_URL}/uploads/${img.name}`}
                                            alt={`${img.name} image ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                if (!target.src.endsWith("/default-inventory.jpg")) {
                                                    target.src = "/default-inventory.jpg";
                                                }
                                            }}
                                        />
                                    </div>
                                ))}
                                {value.length > 1 && (
                                    <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-xs font-medium">
                                        +{value.length - 1}
                                    </div>
                                )}
                            </div>

                            {/* Expanded view on hover */}
                            {value.length > 1 && (
                                <div className="absolute z-10 hidden group-hover:flex flex-wrap gap-2 p-2 bg-white border border-gray-200 rounded-md shadow-lg max-w-[300px]">
                                    {value.map((img, index) => (
                                        <div
                                            key={`${row._id}-expanded-${index}`}
                                            className="w-16 h-16 cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow"
                                            onClick={() => setPreviewImg(`${BACKEND_URL}/uploads/${img.name}`)}
                                        >
                                            <img
                                                src={`${BACKEND_URL}/uploads/${img.name}`}
                                                alt={`${img.name} image ${index + 1}`}
                                                className="w-full h-full object-cover rounded-md border"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Fullscreen Image Preview */}
                        {previewImg && (
                            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                                <div className="relative">
                                    <button
                                        onClick={() => setPreviewImg(null)}
                                        className="absolute top-0 right-0 text-white text-2xl bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center z-50"
                                    >
                                        &times;
                                    </button>
                                    <img
                                        src={previewImg}
                                        alt="Preview"
                                        className="max-w-full max-h-screen rounded-lg shadow-lg"
                                    />
                                </div>
                            </div>
                        )}
                    </>
                );
            },
        }

    ];

    const fetchInventory = async (currentPage: number) => {
        try {
            setLoading(true);
            const response = await getInventory(currentPage, itemPerPage);
            if (response?.status === 200) {
                const { data } = response;
                setInventory(data.data.inventory)
                console.log("REsulte form the getInventory (Backend) :", data.data);

                setLoading(false);
                setTotalPages(
                    prev => (prev !== Math.ceil(data.data.totalInventory / itemPerPage)
                        ? Math.ceil(data.data.totalInventory / itemPerPage)
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
        fetchInventory(currentPage);
    }, [currentPage]);

    const handleAddInventory = () => {
        setIsAddInventoryOpen(true);
    };

    const handleCloseAddInventory = () => {
        setIsAddInventoryOpen(false);
    };

    const handleInventoryAdded = async (newItem: FormData) => {
        try {
            const response = await addItemToInventoryApi(newItem)
            if (response?.status === 200) {
                const { data } = response
                console.log("Data by Add the Item (BAckend) :", data.data);
                setInventory([data.data, ...inventory])
                setIsAddInventoryOpen(false);
                Swal.fire({
                    icon: 'success',
                    title: "Success",
                    text: "Item has been Added successfully ✅",
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

    const handleEditInventory = (item: Inventory) => {
        setEditingInventory(item);
    };

    const handleDeleteInventory = (item: Inventory) => {
        try {
            // console.log('Delete driver:', driver);
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
                    const response = await deleteItemApi(item._id, currentPage, itemPerPage);
                    if (response?.status === 200) {
                        const { data } = response;
                        console.log("Response data by Del (Backend) :", data.data);
                        setInventory(data.data);
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

    const handleInventoryUpdated = async (updatedItem: FormData) => {
        try {
            console.log("Thr Edited Item (editSub):", updatedItem);
            const response = await editItemApi(editingInventory?._id as string, updatedItem)
            if (response?.status === 200) {
                const { data } = response
                console.log("DAta From editItemRes :", data.data);
                setInventory(inventory.map(item => {
                    return item._id === data.data._id ? data.data : item;
                }));
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Success!",
                    text: "Item details has been updated successfully!",
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                    toast: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        setEditingInventory(null);
                    }
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

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavbar />
            <div className="pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
                            <p className="mt-2 text-sm text-gray-600">
                                Manage all your inventory items in one place
                            </p>
                        </div>
                        <button
                            onClick={handleAddInventory}
                            className="relative flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
                        >
                            {/* Animated background effect */}
                            <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>

                            {/* Button content */}
                            <span className="relative flex items-center gap-3">
                                {/* Inventory icon with container */}
                                <span className="flex items-center justify-center p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <Package className="w-5 h-5 text-white" />
                                </span>

                                {/* Text with subtle animation */}
                                <span className="font-medium tracking-wide group-hover:translate-x-1 transition-transform duration-200">
                                    Add New Item
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
                                <Loader message="Fetching inventory items" size="md" />
                            </div>
                        ) : (
                            <>
                                <Table
                                    data={inventory}
                                    columns={columns}
                                    onEdit={handleEditInventory}
                                    onDelete={handleDeleteInventory}
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
                    {inventory.length === 0 && (
                        <div className="bg-white rounded-xl shadow-sm p-12 text-center border-2 border-dashed border-gray-200 mt-8">
                            <Package className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No inventory items found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Get started by adding a new inventory item.
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={handleAddInventory}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                                    Add Item
                                </button>
                            </div>
                        </div>
                    )}

                    {isAddInventoryOpen && (
                        <AddItem
                            onClose={handleCloseAddInventory}
                            onItemAdded={handleInventoryAdded}
                        />
                    )}

                    {/* Edit Inventory Modal */}
                    {editingInventory && (
                        <EditItem
                            itemData={editingInventory}
                            onClose={() => setEditingInventory(null)}
                            onItemUpdated={handleInventoryUpdated}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}