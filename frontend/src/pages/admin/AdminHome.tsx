import { User, Package, Utensils, Truck, Warehouse } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { ReactNode } from 'react';

const AdminHome = () => {
    const navigate = useNavigate();
    const admin = useAppSelector(state => state.admins.admin);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
            {/* Admin Profile Section */}
            {admin && (
                <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="bg-indigo-100 p-4 rounded-full">
                        <User className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-gray-800">{admin.name}</h2>
                        <p className="text-gray-600">{admin.email}</p>
                        <p className="text-gray-600">+{admin.phone}</p>
                    </div>
                </div>
            )}

            {/* Dashboard Header */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-800 mb-3">Admin Dashboard</h1>
                <p className="text-lg text-gray-600 max-w-2xl">
                    Manage all aspects of your delivery platform with these quick access options
                </p>
            </div>

            {/* Navigation Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
                <DashboardCard
                    icon={<Package className="w-8 h-8" />}
                    title="Orders"
                    description="Manage customer orders"
                    color="bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate("/admin/orders")}
                />
                <DashboardCard
                    icon={<Utensils className="w-8 h-8" />}
                    title="Vendors"
                    description="Manage restaurant vendors"
                    color="bg-green-600 hover:bg-green-700"
                    onClick={() => navigate("/admin/vendors")}
                />
                <DashboardCard
                    icon={<Truck className="w-8 h-8" />}
                    title="Drivers"
                    description="Manage delivery drivers"
                    color="bg-orange-600 hover:bg-orange-700"
                    onClick={() => navigate("/admin/drivers-management")}
                />
                <DashboardCard
                    icon={<Warehouse className="w-8 h-8" />}
                    title="Inventory"
                    description="Manage product inventory"
                    color="bg-purple-600 hover:bg-purple-700"
                    onClick={() => navigate("/admin/inventory")}
                />
            </div>
        </div>
    );
};

export default AdminHome;

interface DashboardCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    color: string;
    onClick: () => void;
}

const DashboardCard = ({ icon, title, description, color, onClick }: DashboardCardProps) => {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-8 rounded-xl shadow-md text-white ${color} transition transform hover:scale-105`}
        >
            <div className="bg-white/20 p-3 rounded-full mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-white/90 text-sm">{description}</p>
        </button>
    );
};