import * as turf from '@turf/turf';

/**
 * Calculate distance between two points
 * @param {Array} point1 - [lng, lat]
 * @param {Array} point2 - [lng, lat]
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (point1, point2) => {
    const from = turf.point(point1);
    const to = turf.point(point2);
    return turf.distance(from, to, { units: 'kilometers' });
};

/**
 * Find nearest facility to a given point
 * @param {Array} clickPoint - [lng, lat]
 * @param {Array} facilities - Array of GeoJSON features
 * @returns {Object} Nearest facility with distance
 */
export const findNearestFacility = (clickPoint, facilities) => {
    if (!facilities || facilities.length === 0) return null;

    let nearest = null;
    let minDistance = Infinity;

    facilities.forEach(facility => {
        const coords = facility.geometry.coordinates;
        const distance = calculateDistance(clickPoint, coords);

        if (distance < minDistance) {
            minDistance = distance;
            nearest = {
                ...facility,
                distance: distance
            };
        }
    });

    return nearest;
};

/**
 * Generate buffer around a point
 * @param {Array} coordinates - [lng, lat]
 * @param {number} radius - Buffer radius in kilometers
 * @returns {Object} GeoJSON polygon
 */
export const generateBuffer = (coordinates, radius) => {
    const point = turf.point(coordinates);
    const buffered = turf.buffer(point, radius, { units: 'kilometers' });
    return buffered;
};

/**
 * Generate buffers for multiple facilities
 * @param {Array} facilities - Array of GeoJSON features
 * @param {number} radius - Buffer radius in kilometers
 * @returns {Array} Array of buffer polygons
 */
export const generateBuffers = (facilities, radius) => {
    if (!facilities || facilities.length === 0) return [];

    return facilities.map(facility => {
        const coords = facility.geometry.coordinates;
        const buffer = generateBuffer(coords, radius);
        return {
            ...buffer,
            properties: {
                ...facility.properties,
                radius: radius
            }
        };
    });
};

/**
 * Check if a point is within any buffer
 * @param {Array} point - [lng, lat]
 * @param {Array} buffers - Array of buffer polygons
 * @returns {boolean}
 */
export const isPointInBuffers = (point, buffers) => {
    if (!buffers || buffers.length === 0) return false;

    const pt = turf.point(point);

    for (const buffer of buffers) {
        if (turf.booleanPointInPolygon(pt, buffer)) {
            return true;
        }
    }

    return false;
};

/**
 * Get category color
 * @param {string} category
 * @returns {string} Color hex code
 */
export const getCategoryColor = (category) => {
    const colors = {
        'Pendidikan': '#3B82F6', // blue
        'Kesehatan': '#EF4444',  // red
        'Tempat Ibadah': '#10B981' // green
    };
    return colors[category] || '#6B7280';
};

/**
 * Get buffer color by radius
 * @param {number} radius - in kilometers
 * @returns {string} Color hex code
 */
export const getBufferColor = (radius) => {
    if (radius <= 0.5) return '#3B82F6'; // blue
    if (radius <= 1) return '#F59E0B';   // amber
    return '#10B981';                     // green
};

/**
 * Format distance for display
 * @param {number} distance - in kilometers
 * @returns {string} Formatted distance
 */
export const formatDistance = (distance) => {
    if (distance < 1) {
        return `${Math.round(distance * 1000)} m`;
    }
    return `${distance.toFixed(2)} km`;
};
