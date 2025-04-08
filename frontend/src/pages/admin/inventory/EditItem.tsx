import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Package, X } from 'lucide-react';
import { Inventory, InventoryInput } from '../../../utils/inventory.types';
import { BACKEND_URL } from '../../../utils/constants';

interface EditItemProps {
    itemData: Inventory;
    onClose: () => void;
    onItemUpdated: (updatedItem: FormData) => void;
}

export const EditItem = ({ itemData, onClose, onItemUpdated }: EditItemProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, reset, setError, clearErrors, formState: { errors } } = useForm<InventoryInput>();
    const [existingImages, setExistingImages] = useState<{ imageUrl: string, name: string }[]>(itemData.images);
    const [newImages, setNewImages] = useState<{ file: File, previewUrl: string }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagesCount, setImagesCount] = useState(0);


    // Initialize form with item data
    useEffect(() => {
        reset({
            name: itemData.name,
            price: itemData.price,
            quantity: itemData.quantity,
            category: itemData.category,
            images: itemData.images
        });
    }, [itemData, reset]);

    useEffect(() => {
        if (imagesCount > 0) {
            clearErrors("images");
        }
    }, [imagesCount, clearErrors]);

    const onSubmit = async (data: InventoryInput) => {
        setIsLoading(true);
        try {
            const files = fileInputRef.current?.files;
            const newImageFiles = files ? Array.from(files) : [];

            const imagesArray = [
                ...newImageFiles,
                ...existingImages.map(img => ({
                    name: img.name,
                    imageUrl: img.imageUrl
                }))
            ];

            if (!imagesArray.length && !existingImages.length) {
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
            formData.append("quantity", String(data.quantity))
            imagesArray.forEach((file: any) => formData.append("images", file));
            formData.append("existingImages", JSON.stringify(existingImages));

            onItemUpdated(formData);
            onClose();
        } catch (error) {
            console.error('Error updating item:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newImageFiles = Array.from(files).map(file => ({
                file,
                previewUrl: URL.createObjectURL(file)
            }));
            setNewImages(prev => [...prev, ...newImageFiles]);
            setImagesCount(newImageFiles.length); // 🟢 triggers error-clear effect

        }
    };

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewImage = (index: number) => {
        const imageToRemove = newImages[index];
        URL.revokeObjectURL(imageToRemove.previewUrl); // Clean up memory
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    // Clean up object URLs when component unmounts
    useEffect(() => {
        return () => {
            newImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
        };
    }, [newImages]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 sm:max-w-lg">
                {/* Header */}
                <div className="flex justify-between items-center border-b p-4">
                    <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold">Edit Inventory Item</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
                    {/* Item Name */}
                    <div className="space-y-1">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Item Name*
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Enter item name"
                            className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            {...register('name', { required: 'Item name is required' })}
                        />
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
                        {/* Quantity */}
                        <div className="space-y-1">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                Quantity *
                            </label>
                            <input
                                id="quantity"
                                type="number"
                                step="0.01"
                                placeholder="Enter quantity"
                                className={`w-full px-3 py-2 border rounded-md ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
                                {...register('quantity', {
                                    required: 'quantity is required',
                                    min: {
                                        value: 1,
                                        message: 'quantity must be greater than 0'
                                    }
                                })}
                            />
                            {errors.quantity && (
                                <p className="text-sm text-red-500">{errors.quantity.message}</p>
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
                                <option value="Electrical Supplies">Electrical Supplies</option>
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

                    {/* Image Management */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Item Images
                        </label>

                        {/* Existing Images */}
                        {existingImages.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Current Images</h4>
                                <div className="flex flex-wrap gap-2">
                                    {existingImages.map((img, index) => (
                                        <div key={`existing-${index}`} className="relative group">
                                            <div className="w-16 h-16 rounded-md border border-gray-300 overflow-hidden">
                                                <img
                                                    src={`${BACKEND_URL}/uploads/${img.name}`}
                                                    alt={img.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                                                {img.name}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New Images */}
                        {newImages.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-500 mb-2">New Images</h4>
                                <div className="flex flex-wrap gap-2">
                                    {newImages.map((img, index) => (
                                        <div key={`new-${index}`} className="relative group">
                                            <div className="w-16 h-16 rounded-md border border-gray-300 overflow-hidden">
                                                <img
                                                    src={img.previewUrl}
                                                    alt={img.file.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                                                {img.file.name}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Add More Images */}
                        <label className="block">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                                ref={fileInputRef}
                                multiple
                            />
                            <div className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer text-center">
                                Add More Images
                            </div>
                        </label>
                        {errors.images && (
                            <p className="text-sm text-red-500">{errors.images.message}</p>
                        )}
                        <p className="text-xs text-gray-500">Select additional images (max 3MB each)</p>
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
                            ) : 'Update Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};