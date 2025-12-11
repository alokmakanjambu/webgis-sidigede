import { Polyline, Popup } from 'react-leaflet';
import { formatDistance, getCategoryColor } from '../../utils/spatial';
import { calculateDistance } from '../../utils/spatial';
import { Ruler } from 'lucide-react';

const MeasurementTool = ({ selectedFacilities }) => {
    if (!selectedFacilities || selectedFacilities.length !== 2) {
        return null;
    }

    const [facility1, facility2] = selectedFacilities;
    const coords1 = facility1.geometry.coordinates;
    const coords2 = facility2.geometry.coordinates;

    // Calculate distance
    const distance = calculateDistance(coords1, coords2);

    // Midpoint for popup
    const midpoint = [
        (coords1[1] + coords2[1]) / 2,
        (coords1[0] + coords2[0]) / 2
    ];

    return (
        <>
            {/* Line between two facilities */}
            <Polyline
                positions={[[coords1[1], coords1[0]], [coords2[1], coords2[0]]]}
                pathOptions={{
                    color: '#8B5CF6',
                    weight: 4,
                    opacity: 0.8,
                    dashArray: '15, 10'
                }}
            />

            {/* Distance popup */}
            <Popup position={midpoint}>
                <div className="p-3 min-w-[280px] bg-white">
                    <div className="flex items-center gap-2 mb-3">
                        <Ruler className="w-5 h-5 text-purple-600" />
                        <h3 className="font-bold text-gray-900">Pengukuran Jarak</h3>
                    </div>

                    <div className="space-y-2">
                        {/* Facility 1 */}
                        <div className="p-2 rounded-lg" style={{ backgroundColor: getCategoryColor(facility1.properties.kategori) + '30' }}>
                            <p className="text-sm font-semibold text-gray-900">{facility1.properties.nama}</p>
                            <p className="text-xs text-gray-700">{facility1.properties.kategori}</p>
                        </div>

                        {/* Distance display */}
                        <div className="flex items-center justify-center py-3">
                            <div className="text-center">
                                <p className="text-xs text-gray-600 mb-1">Jarak</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {formatDistance(distance)}
                                </p>
                            </div>
                        </div>

                        {/* Facility 2 */}
                        <div className="p-2 rounded-lg" style={{ backgroundColor: getCategoryColor(facility2.properties.kategori) + '30' }}>
                            <p className="text-sm font-semibold text-gray-900">{facility2.properties.nama}</p>
                            <p className="text-xs text-gray-700">{facility2.properties.kategori}</p>
                        </div>
                    </div>
                </div>
            </Popup>
        </>
    );
};

export default MeasurementTool;
