import { useMapEvents, Marker, Popup, Polyline } from 'react-leaflet';
import { useState } from 'react';
import L from 'leaflet';
import { findNearestFacility, formatDistance, getCategoryColor } from '../../utils/spatial';
import { MapPin, Navigation } from 'lucide-react';

const NearestFacilityFinder = ({ facilities, setNearestInfo }) => {
    const [clickedPoint, setClickedPoint] = useState(null);
    const [nearestFacility, setNearestFacility] = useState(null);

    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            const point = [lng, lat];

            setClickedPoint([lat, lng]);

            // Find nearest facility
            const nearest = findNearestFacility(point, facilities);

            if (nearest) {
                setNearestFacility(nearest);

                // Pass info to parent component
                if (setNearestInfo) {
                    setNearestInfo({
                        point: point,
                        facility: nearest,
                        distance: nearest.distance
                    });
                }
            }
        }
    });

    // Function to clear the clicked point
    const clearClickedPoint = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setClickedPoint(null);
        setNearestFacility(null);
        if (setNearestInfo) {
            setNearestInfo(null);
        }
    };

    // Custom icon for clicked point
    const clickIcon = L.divIcon({
        html: `
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" fill="#F59E0B" opacity="0.8" stroke="white" stroke-width="2"/>
        <circle cx="12" cy="12" r="3" fill="white"/>
      </svg>
    `,
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    return (
        <>
            {clickedPoint && (
                <>
                    {/* Marker for clicked point */}
                    <Marker position={clickedPoint} icon={clickIcon}>
                        <Popup closeButton={false}>
                            <div className="p-2 relative bg-white">
                                <button
                                    onClick={clearClickedPoint}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center hover:bg-red-100 rounded transition-colors text-red-600 font-bold text-xl leading-none"
                                    title="Hapus titik"
                                    type="button"
                                >
                                    ×
                                </button>
                                <div className="flex items-center gap-2 mb-2 pr-6">
                                    <MapPin className="w-4 h-4 text-amber-500" />
                                    <span className="font-semibold text-gray-900 text-sm">Titik yang Dipilih</span>
                                </div>
                                <p className="text-xs text-gray-600">
                                    Koordinat: {clickedPoint[0].toFixed(5)}, {clickedPoint[1].toFixed(5)}
                                </p>
                            </div>
                        </Popup>
                    </Marker>

                    {/* Line to nearest facility */}
                    {nearestFacility && (
                        <>
                            <Polyline
                                positions={[
                                    clickedPoint,
                                    [
                                        nearestFacility.geometry.coordinates[1],
                                        nearestFacility.geometry.coordinates[0]
                                    ]
                                ]}
                                pathOptions={{
                                    color: '#F59E0B',
                                    weight: 3,
                                    opacity: 0.7,
                                    dashArray: '10, 10'
                                }}
                            />

                            {/* Info popup on the line */}
                            <Popup
                                position={[
                                    (clickedPoint[0] + nearestFacility.geometry.coordinates[1]) / 2,
                                    (clickedPoint[1] + nearestFacility.geometry.coordinates[0]) / 2
                                ]}
                            >
                                <div className="p-3 min-w-[250px] bg-white">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Navigation className="w-5 h-5 text-amber-500" />
                                        <h3 className="font-bold text-gray-900">Fasilitas Terdekat</h3>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="p-2 rounded-lg" style={{ backgroundColor: getCategoryColor(nearestFacility.properties.kategori) + '40' }}>
                                            <p className="font-semibold text-gray-900 text-sm">
                                                {nearestFacility.properties.nama}
                                            </p>
                                            <p className="text-xs text-gray-700">
                                                {nearestFacility.properties.jenis} • {nearestFacility.properties.kategori}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between p-2 bg-amber-100 rounded-lg border border-amber-300">
                                            <span className="text-sm text-gray-800 font-semibold">Jarak:</span>
                                            <span className="text-lg font-bold text-amber-600">
                                                {formatDistance(nearestFacility.distance)}
                                            </span>
                                        </div>

                                        {nearestFacility.properties.alamat && (
                                            <div className="pt-2 border-t border-gray-200">
                                                <p className="text-xs text-gray-600 font-semibold">Alamat:</p>
                                                <p className="text-xs text-gray-800 mt-1">{nearestFacility.properties.alamat}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Popup>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default NearestFacilityFinder;
