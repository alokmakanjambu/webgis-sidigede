import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './index.css';
import MapContainer from './components/Map/MapContainer';
import Sidebar from './components/Layout/Sidebar';
import Legend from './components/UI/Legend';
import LoginPage from './components/Auth/LoginPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminPanel from './components/Admin/AdminPanel';
import { useAuth } from './contexts/AuthContext';
import { fetchFacilities } from './lib/supabase';
import { Loader2 } from 'lucide-react';

// Main Map View Component
function MapView() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [facilities, setFacilities] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
    const [selectedCategories, setSelectedCategories] = useState([
        'Pendidikan',
        'Kesehatan',
        'Tempat Ibadah'
    ]);

    // Buffer states
    const [bufferRadii, setBufferRadii] = useState([0.5, 1]);
    const [showBuffers, setShowBuffers] = useState(true);

    // Nearest facility info
    const [nearestInfo, setNearestInfo] = useState(null);

    // Measurement tool states
    const [measurementMode, setMeasurementMode] = useState(false);
    const [selectedForMeasurement, setSelectedForMeasurement] = useState([]);

    // Load facilities data
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                // Try to load from Supabase first
                const supabaseData = await fetchFacilities();

                if (supabaseData && supabaseData.features && supabaseData.features.length > 0) {
                    setFacilities(supabaseData);
                } else {
                    // Fallback to local GeoJSON file
                    const response = await fetch('/data/fasilitas-sidigede.geojson');

                    if (!response.ok) {
                        throw new Error('Failed to load facilities data');
                    }

                    const data = await response.json();
                    setFacilities(data);
                }

                setError(null);
            } catch (err) {
                console.error('Error loading facilities:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Handle facility click for measurement
    const handleFacilityClick = (facility) => {
        if (!measurementMode) return;

        setSelectedForMeasurement(prev => {
            // If already selected, deselect
            if (prev.some(f => f.properties.nama === facility.properties.nama)) {
                return prev.filter(f => f.properties.nama !== facility.properties.nama);
            }

            // If less than 2 selected, add
            if (prev.length < 2) {
                return [...prev, facility];
            }

            // If 2 already selected, replace the first one
            return [prev[1], facility];
        });
    };

    // Toggle measurement mode
    const toggleMeasurementMode = () => {
        setMeasurementMode(!measurementMode);
        if (measurementMode) {
            // Clear selection when turning off
            setSelectedForMeasurement([]);
        }
    };

    if (loading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-white text-lg font-medium">Memuat WebGIS...</p>
                    <p className="text-gray-400 text-sm mt-2">Desa Sidigede, Welahan, Jepara</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
                <div className="text-center glass-dark p-8 rounded-xl max-w-md">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-white text-xl font-bold mb-2">Error Loading Data</h2>
                    <p className="text-gray-300 text-sm">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-primary mt-4"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-screen h-screen flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-96 h-full flex-shrink-0 shadow-2xl z-10">
                <Sidebar
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    bufferRadii={bufferRadii}
                    setBufferRadii={setBufferRadii}
                    showBuffers={showBuffers}
                    setShowBuffers={setShowBuffers}
                    facilities={facilities}
                    nearestInfo={nearestInfo}
                    measurementMode={measurementMode}
                    toggleMeasurementMode={toggleMeasurementMode}
                    selectedForMeasurement={selectedForMeasurement}
                    isAuthenticated={isAuthenticated}
                    onAdminClick={() => navigate(isAuthenticated ? '/admin' : '/login')}
                />
            </div>

            {/* Map Container */}
            <div className="flex-1 h-full relative">
                <MapContainer
                    facilities={facilities}
                    selectedCategories={selectedCategories}
                    bufferRadii={bufferRadii}
                    showBuffers={showBuffers}
                    setNearestInfo={setNearestInfo}
                    measurementMode={measurementMode}
                    selectedForMeasurement={selectedForMeasurement}
                    onFacilityClick={handleFacilityClick}
                />

                {/* Legend */}
                <Legend />
            </div>
        </div>
    );
}

// Main App Component with Routes
function App() {
    return (
        <Routes>
            <Route path="/" element={<MapView />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <AdminPanel />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
