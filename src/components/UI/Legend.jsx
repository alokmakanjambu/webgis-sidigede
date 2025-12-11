import { School, Heart, Church, Circle } from 'lucide-react';
import { getCategoryColor } from '../../utils/spatial';

const Legend = () => {
    return (
        <div className="absolute bottom-6 right-6 z-[1000] glass-dark p-4 rounded-lg shadow-xl max-w-xs">
            <h3 className="text-white font-semibold mb-3 text-sm">Legenda</h3>

            {/* Facility Categories */}
            <div className="mb-4">
                <p className="text-gray-400 text-xs mb-2">Kategori Fasilitas</p>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getCategoryColor('Pendidikan') }}></div>
                        <School className="w-4 h-4 text-blue-400" />
                        <span className="text-white text-xs">Pendidikan</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getCategoryColor('Kesehatan') }}></div>
                        <Heart className="w-4 h-4 text-red-400" />
                        <span className="text-white text-xs">Kesehatan</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getCategoryColor('Tempat Ibadah') }}></div>
                        <Church className="w-4 h-4 text-green-400" />
                        <span className="text-white text-xs">Tempat Ibadah</span>
                    </div>
                </div>
            </div>

            {/* Buffer Zones */}
            <div className="mb-4">
                <p className="text-gray-400 text-xs mb-2">Buffer Zones</p>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Circle className="w-4 h-4 text-blue-400" />
                        <span className="text-white text-xs">500 m</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Circle className="w-4 h-4 text-amber-400" />
                        <span className="text-white text-xs">1 km</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Circle className="w-4 h-4 text-green-400" />
                        <span className="text-white text-xs">2 km</span>
                    </div>
                </div>
            </div>

            {/* Other Elements */}
            <div>
                <p className="text-gray-400 text-xs mb-2">Elemen Lain</p>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-0.5 border-t-2 border-dashed border-blue-400"></div>
                        <span className="text-white text-xs">Batas Desa</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-0.5 bg-gray-400"></div>
                        <span className="text-white text-xs">Jalan</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                        <span className="text-white text-xs">Titik Klik</span>
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-gray-400 text-xs italic">
                    💡 Klik pada peta untuk mencari fasilitas terdekat
                </p>
            </div>
        </div>
    );
};

export default Legend;
