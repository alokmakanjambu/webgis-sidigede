import { School, Heart, Church, Info, Ruler, User, Settings } from 'lucide-react';
import { getCategoryColor, formatDistance, calculateDistance } from '../../utils/spatial';

const Sidebar = ({
    selectedCategories,
    setSelectedCategories,
    bufferRadii,
    setBufferRadii,
    showBuffers,
    setShowBuffers,
    facilities,
    nearestInfo,
    measurementMode,
    toggleMeasurementMode,
    selectedForMeasurement,
    isAuthenticated,
    onAdminClick
}) => {

    const categories = ['Pendidikan', 'Kesehatan', 'Tempat Ibadah'];
    const bufferOptions = [0.5, 1, 2]; // in kilometers

    const toggleCategory = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const toggleBuffer = (radius) => {
        if (bufferRadii.includes(radius)) {
            setBufferRadii(bufferRadii.filter(r => r !== radius));
        } else {
            setBufferRadii([...bufferRadii, radius]);
        }
    };

    const getCategoryIcon = (kategori) => {
        if (kategori === 'Pendidikan') return <School className="w-5 h-5" />;
        if (kategori === 'Kesehatan') return <Heart className="w-5 h-5" />;
        if (kategori === 'Tempat Ibadah') return <Church className="w-5 h-5" />;
        return null;
    };

    const getCategoryCount = (category) => {
        return facilities?.features?.filter(f => f.properties.kategori === category).length || 0;
    };

    return (
        <div className="h-full flex flex-col glass-dark p-6 overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">
                    WebGIS Sidigede
                </h1>
                <p className="text-sm text-gray-300">
                    Analisis Aksesibilitas Fasilitas Publik
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    Desa Sidigede, Kec. Welahan, Kab. Jepara
                </p>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Filter Kategori
                </h2>
                <div className="space-y-3">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => toggleCategory(category)}
                            className={`w-full p-3 rounded-lg transition-all flex items-center gap-3 ${selectedCategories.includes(category)
                                    ? 'glass-dark border-2 border-white/30 transform scale-105'
                                    : 'glass border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            <div
                                className="p-2 rounded-lg"
                                style={{ backgroundColor: getCategoryColor(category) }}
                            >
                                {getCategoryIcon(category)}
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-medium text-white text-sm">{category}</p>
                                <p className="text-xs text-gray-400">
                                    {getCategoryCount(category)} fasilitas
                                </p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedCategories.includes(category)
                                    ? 'bg-blue-500 border-blue-500'
                                    : 'border-white/30'
                                }`}>
                                {selectedCategories.includes(category) && (
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Measurement Tool */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Ruler className="w-5 h-5" />
                    Alat Ukur Jarak
                </h2>
                <button
                    onClick={toggleMeasurementMode}
                    className={`w-full p-3 rounded-lg transition-all font-medium ${measurementMode
                            ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/50'
                            : 'glass border border-white/20 text-white hover:bg-white/10'
                        }`}
                >
                    {measurementMode ? '✓ Mode Ukur Aktif' : 'Aktifkan Mode Ukur'}
                </button>

                {measurementMode && (
                    <div className="mt-3 p-3 glass-dark rounded-lg border border-purple-500/30">
                        <p className="text-xs text-cyan-400 mb-2">
                            📍 Klik 2 fasilitas untuk mengukur jarak
                        </p>
                        <div className="space-y-1">
                            <div className="text-xs">
                                <span className="text-gray-400">Terpilih:</span>
                                <span className="text-white ml-2">{selectedForMeasurement?.length || 0}/2</span>
                            </div>
                            {selectedForMeasurement && selectedForMeasurement.length === 2 && (
                                <div className="mt-2 p-2 bg-purple-50/20 rounded border border-purple-500/50">
                                    <p className="text-xs text-cyan-400 mb-1">Jarak:</p>
                                    <p className="text-lg font-bold text-purple-400">
                                        {formatDistance(calculateDistance(
                                            selectedForMeasurement[0].geometry.coordinates,
                                            selectedForMeasurement[1].geometry.coordinates
                                        ))}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Buffer Controls */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">Buffer Zones</h2>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showBuffers}
                            onChange={(e) => setShowBuffers(e.target.checked)}
                            className="w-4 h-4 accent-blue-500"
                        />
                        <span className="text-sm text-gray-300">Show</span>
                    </label>
                </div>

                <div className="space-y-2">
                    {bufferOptions.map(radius => (
                        <label
                            key={radius}
                            className="flex items-center gap-3 p-2 rounded-lg glass hover:bg-white/10 cursor-pointer transition-all"
                        >
                            <input
                                type="checkbox"
                                checked={bufferRadii.includes(radius)}
                                onChange={() => toggleBuffer(radius)}
                                disabled={!showBuffers}
                                className="w-4 h-4 accent-blue-500"
                            />
                            <div className="flex-1">
                                <span className="text-white text-sm">
                                    {radius === 0.5 ? '500 m' : `${radius} km`}
                                </span>
                            </div>
                            <div
                                className="w-4 h-4 rounded-full opacity-60"
                                style={{ backgroundColor: radius === 0.5 ? '#3B82F6' : radius === 1 ? '#F59E0B' : '#10B981' }}
                            ></div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Nearest Facility Info */}
            {nearestInfo && !measurementMode && (
                <div className="mb-6 p-4 glass rounded-lg border border-amber-500/30">
                    <h3 className="text-sm font-semibold text-amber-500 mb-2">
                        📍 Fasilitas Terdekat
                    </h3>
                    <p className="text-white font-medium text-sm">
                        {nearestInfo.facility.properties.nama}
                    </p>
                    <p className="text-gray-300 text-xs">
                        {nearestInfo.facility.properties.kategori}
                    </p>
                    <p className="text-amber-500 font-bold mt-2">
                        Jarak: {nearestInfo.distance < 1
                            ? `${Math.round(nearestInfo.distance * 1000)} m`
                            : `${nearestInfo.distance.toFixed(2)} km`
                        }
                    </p>
                </div>
            )}

            {/* Statistics */}
            <div className="mb-6 p-4 glass rounded-lg">
                <h3 className="text-sm font-semibold text-white mb-3">Statistik</h3>
                <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Total Fasilitas:</span>
                        <span className="text-white font-semibold">{facilities?.features?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Ditampilkan:</span>
                        <span className="text-white font-semibold">
                            {facilities?.features?.filter(f => selectedCategories.includes(f.properties.kategori)).length || 0}
                        </span>
                    </div>
                </div>
            </div>

            {/* Admin Button - Always at bottom */}
            <div className="mt-auto pt-4 border-t border-white/10">
                <button
                    onClick={onAdminClick}
                    className="w-full p-3 glass border border-white/20 rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-white"
                >
                    {isAuthenticated ? (
                        <>
                            <Settings className="w-5 h-5" />
                            Panel Admin
                        </>
                    ) : (
                        <>
                            <User className="w-5 h-5" />
                            Login Admin
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
