import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import FacilityTable from './FacilityTable';
import FacilityForm from './FacilityForm';
import { fetchFacilities, createFacility, updateFacility, deleteFacility } from '../../lib/supabase';
import { LogOut, Plus, MapPin, RefreshCw, Loader2 } from 'lucide-react';

const AdminPanel = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingFacility, setEditingFacility] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // Load facilities
    const loadFacilities = async () => {
        try {
            setRefreshing(true);
            const data = await fetchFacilities();
            if (data && data.features) {
                setFacilities(data.features);
            }
        } catch (error) {
            console.error('Error loading facilities:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadFacilities();
    }, []);

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    const handleAdd = () => {
        setEditingFacility(null);
        setShowForm(true);
    };

    const handleEdit = (facility) => {
        setEditingFacility(facility);
        setShowForm(true);
    };

    const handleDelete = async (facility) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus "${facility.properties.nama}"?`)) {
            try {
                await deleteFacility(facility.properties.id);
                await loadFacilities();
            } catch (error) {
                console.error('Error deleting facility:', error);
                alert('Gagal menghapus fasilitas');
            }
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingFacility) {
                await updateFacility(editingFacility.properties.id, formData);
            } else {
                await createFacility(formData);
            }
            setShowForm(false);
            setEditingFacility(null);
            await loadFacilities();
        } catch (error) {
            console.error('Error saving facility:', error);
            alert('Gagal menyimpan fasilitas');
        }
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingFacility(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-white text-lg">Memuat data fasilitas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen h-screen overflow-auto bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Header */}
            <header className="glass-dark border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                            <p className="text-sm text-gray-400">WebGIS Sidigede</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400">
                            {user?.email}
                        </span>
                        <button
                            onClick={() => navigate('/')}
                            className="px-4 py-2 glass text-white rounded-lg hover:bg-white/20 transition-all text-sm"
                        >
                            Lihat Peta
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all flex items-center gap-2 text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Actions Bar */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Kelola Fasilitas</h2>
                        <p className="text-gray-400">Total: {facilities.length} fasilitas</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={loadFacilities}
                            disabled={refreshing}
                            className="px-4 py-2 glass text-white rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
                        >
                            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <button
                            onClick={handleAdd}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Fasilitas
                        </button>
                    </div>
                </div>

                {/* Facility Table */}
                <FacilityTable
                    facilities={facilities}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </main>

            {/* Facility Form Modal */}
            {showForm && (
                <FacilityForm
                    facility={editingFacility}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                />
            )}
        </div>
    );
};

export default AdminPanel;
