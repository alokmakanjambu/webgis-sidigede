import { useState, useEffect } from 'react';
import { MapContainer as LeafletMap, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import BoundaryLayer from './BoundaryLayer';
import RoadLayer from './RoadLayer';
import FacilityLayer from './FacilityLayer';
import BufferLayer from './BufferLayer';
import NearestFacilityFinder from './NearestFacilityFinder';
import MeasurementTool from './MeasurementTool';

const MapContainer = ({
    facilities,
    selectedCategories,
    bufferRadii,
    showBuffers,
    setNearestInfo,
    measurementMode,
    selectedForMeasurement,
    onFacilityClick
}) => {
    const [boundary, setBoundary] = useState(null);
    const [roads, setRoads] = useState(null);

    // Load boundary data
    useEffect(() => {
        fetch('/data/batasdesa-sidigede.geojson')
            .then(res => res.json())
            .then(data => setBoundary(data))
            .catch(err => console.error('Error loading boundary:', err));
    }, []);

    // Load road network
    useEffect(() => {
        fetch('/data/jalan-sidigede.geojson')
            .then(res => res.json())
            .then(data => setRoads(data))
            .catch(err => console.error('Error loading roads:', err));
    }, []);

    // Filter facilities based on selected categories
    const filteredFacilities = facilities?.features?.filter(f =>
        selectedCategories.includes(f.properties.kategori)
    ) || [];

    // Center map on Sidigede
    const center = [-6.756, 110.707];
    const zoom = 14;

    return (
        <div className="map-container">
            <LeafletMap
                center={center}
                zoom={zoom}
                zoomControl={false}
                style={{ height: '100%', width: '100%' }}
                attributionControl={false}
            >
                {/* Base Tile Layer */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution=""
                />

                {/* Zoom Control */}
                <ZoomControl position="topright" />

                {/* Boundary Layer */}
                {boundary && <BoundaryLayer data={boundary} />}

                {/* Road Network Layer */}
                {roads && <RoadLayer data={roads} />}

                {/* Buffer Zones */}
                {showBuffers && filteredFacilities.length > 0 && (
                    <BufferLayer
                        facilities={filteredFacilities}
                        radii={bufferRadii}
                    />
                )}

                {/* Facility Markers */}
                <FacilityLayer
                    facilities={filteredFacilities}
                    measurementMode={measurementMode}
                    selectedForMeasurement={selectedForMeasurement}
                    onFacilityClick={onFacilityClick}
                />

                {/* Measurement Tool */}
                {measurementMode && (
                    <MeasurementTool selectedFacilities={selectedForMeasurement} />
                )}

                {/* Nearest Facility Finder (disabled when measurement mode is active) */}
                {!measurementMode && (
                    <NearestFacilityFinder
                        facilities={filteredFacilities}
                        setNearestInfo={setNearestInfo}
                    />
                )}
            </LeafletMap>
        </div>
    );
};

export default MapContainer;
