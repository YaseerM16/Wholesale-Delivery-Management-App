import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Package, X } from 'lucide-react';
import Swal from 'sweetalert2';

interface InventoryInput {
    name: string;
    price: number;
    category: string;
    images: File[]; // Now an array of Files
}

interface AddItemProps {
    onClose: () => void;
    onItemAdded: (newItem: FormData) => void;
}

export const AddItem = ({ onClose, onItemAdded }: AddItemProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        setError,
        setValue,
        handleSubmit,
        clearErrors,
        formState: { errors },
    } = useForm<InventoryInput>();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [imagesCount, setImagesCount] = useState(0); // 🔍 used to track file change

    useEffect(() => {
        if (imagesCount > 0) {
            clearErrors("images");
        }
    }, [imagesCount, clearErrors]);

    const onSubmit = async (data: InventoryInput) => {
        setIsLoading(true);
        try {
            const files = fileInputRef.current?.files;
            const imagesArray = files ? Array.from(files) : [];

            if (!imagesArray.length) {
                setError("images", {
                    type: "manual",
                    message: "Please upload at least one image",
                });
                return;
            }

            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("price", String(data.price));
            formData.append("category", data.category);

            imagesArray.forEach((file) => formData.append("images", file));

            console.log("Form data with images:", formData);

            onItemAdded(formData);
            onClose();
        } catch (error) {
            console.error("Error adding item:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const filesArray = Array.from(files).slice(0, 3);

            const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
            setImagePreviews(previewUrls);
            setImagesCount(filesArray.length); // 🟢 triggers error-clear effect
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 sm:max-w-lg">
                {/* Header */}
                <div className="flex justify-between items-center border-b p-4">
                    <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold">Add New Inventory Item</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
                    <div className="space-y-1">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Item Name*
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Enter item name"
                            className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            {...register('name', {
                                required: 'Name is required',
                                minLength: {
                                    value: 4,
                                    message: 'Name must be at least 4 characters'
                                },
                                validate: (value) => {
                                    const trimmed = value.trim();
                                    setValue('name', trimmed);
                                    return trimmed.length > 0 || 'Name cannot be empty';
                                }
                            })} />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Price */}
                        <div className="space-y-1">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                Price ($)*
                            </label>
                            <input
                                id="price"
                                type="number"
                                step="0.01"
                                placeholder="Enter price"
                                className={`w-full px-3 py-2 border rounded-md ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                                {...register('price', {
                                    required: 'Price is required',
                                    min: {
                                        value: 0.01,
                                        message: 'Price must be greater than 0'
                                    }
                                })}
                            />
                            {errors.price && (
                                <p className="text-sm text-red-500">{errors.price.message}</p>
                            )}
                        </div>

                        {/* Category */}
                        <div className="space-y-1">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                Category*
                            </label>
                            <select
                                id="category"
                                className={`w-full px-3 py-2 border rounded-md ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                                {...register('category', { required: 'Category is required' })}
                            >
                                <option value="">Select category</option>
                                <option value="Construction Materials">Construction Materials</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Plumbing">Plumbing</option>
                                <option value="Tools">Tools</option>
                                <option value="Safety Equipment">Safety Equipment</option>
                                <option value="Groceries">Groceries</option>
                                <option value="Beverages">Beverages</option>
                                <option value="Stationery">Stationery</option>
                                <option value="Cleaning Supplies">Cleaning Supplies</option>
                                <option value="Furniture">Furniture</option>
                                <option value="Packaging Materials">Packaging Materials</option>
                            </select>
                            {errors.category && (
                                <p className="text-sm text-red-500">{errors.category.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Image Upload - Multiple */}
                    <div className="space-y-1">
                        <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                            Item Images (Max 3)
                        </label>

                        {/* Preview Area */}
                        <div className="flex gap-2 mb-2">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="w-16 h-16 rounded-md border border-gray-300 overflow-hidden">
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                            {imagePreviews.length === 0 && (
                                <div className="w-16 h-16 rounded-md border border-gray-300 bg-gray-100 flex items-center justify-center">
                                    <Package className="w-6 h-6 text-gray-400" />
                                </div>
                            )}
                        </div>

                        <label className="block">
                            <input
                                id="images"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                                ref={fileInputRef}
                                multiple // Allow multiple selection
                            />
                            <div className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer text-center">
                                {imagePreviews.length > 0 ? 'Change Images' : 'Upload Images'}
                            </div>
                            {errors.images && (
                                <p className="text-sm text-red-500">{errors.images.message}</p>
                            )}
                        </label>
                        <p className="text-xs text-gray-500">Select up to 3 images</p>
                        {imagePreviews.length > 3 && (
                            <p className="text-sm text-red-500">Maximum 3 images allowed</p>
                        )}
                    </div>

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
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isLoading ? 'Adding...' : 'Add Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};