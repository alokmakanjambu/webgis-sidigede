import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getCategoryColor } from '../../utils/spatial';
import { MapPin, School, Heart, Church } from 'lucide-react';

const FacilityLayer = ({ facilities, onFacilityClick, measurementMode, selectedForMeasurement }) => {

    // Create custom icon for each category
    const createCustomIcon = (category, isSelected = false) => {
        const color = getCategoryColor(category);

        const svgIcon = `
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" fill="${color}" opacity="${isSelected ? '1' : '0.9'}" stroke="${isSelected ? '#FFD700' : 'white'}" stroke-width="${isSelected ? '3' : '2'}"/>
        <circle cx="16" cy="16" r="4" fill="white"/>
      </svg>
    `;

        return L.divIcon({
            html: svgIcon,
            className: 'custom-marker',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16]
        });
    };

    const getCategoryIcon = (kategori) => {
        if (kategori === 'Pendidikan') return <School className="w-4 h-4 text-white" />;
        if (kategori === 'Kesehatan') return <Heart className="w-4 h-4 text-white" />;
        if (kategori === 'Tempat Ibadah') return <Church className="w-4 h-4 text-white" />;
        return <MapPin className="w-4 h-4 text-white" />;
    };

    const handleMarkerClick = (facility) => {
        if (measurementMode && onFacilityClick) {
            onFacilityClick(facility);
        }
    };

    const isSelected = (facility) => {
        if (!selectedForMeasurement || !measurementMode) return false;
        return selectedForMeasurement.some(f =>
            f.properties.nama === facility.properties.nama
        );
    };

    return (
        <>
            {facilities.map((facility, idx) => {
                const coords = facility.geometry.coordinates;
                const props = facility.properties;
                const selected = isSelected(facility);

                return (
                    <Marker
                        key={idx}
                        position={[coords[1], coords[0]]}
                        icon={createCustomIcon(props.kategori, selected)}
                        eventHandlers={{
                            click: () => handleMarkerClick(facility)
                        }}
                    >
                        <Popup className="custom-popup">
                            <div className="p-3 min-w-[250px] bg-white">
                                <div className="flex items-start gap-2 mb-3">
                                    <div className="p-2 rounded-lg" style={{ backgroundColor: getCategoryColor(props.kategori) }}>
                                        {getCategoryIcon(props.kategori)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 text-base">{props.nama}</h3>
                                        <p className="text-sm text-gray-600">{props.jenis}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-start gap-2">
                                        <span className="text-gray-700 font-semibold">Kategori:</span>
                                        <span className="text-gray-900">{props.kategori}</span>
                                    </div>

                                    {props.alamat && (
                                        <div className="flex items-start gap-2">
                                            <span className="text-gray-700 font-semibold">Alamat:</span>
                                            <span className="text-gray-900 text-sm flex-1">{props.alamat}</span>
                                        </div>
                                    )}

                                    {props.pengelola && (
                                        <div className="flex items-start gap-2">
                                            <span className="text-gray-700 font-semibold">Pengelola:</span>
                                            <span className="text-gray-900">{props.pengelola}</span>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-2 mt-3 pt-2 border-t border-gray-300">
                                        <span className="text-gray-700 font-semibold">Koordinat:</span>
                                        <span className="text-gray-900 font-mono text-xs">
                                            {coords[1].toFixed(5)}, {coords[0].toFixed(5)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
};

export default FacilityLayer;
