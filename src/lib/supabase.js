import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Set these in your .env file as VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Fetch all facilities from Supabase
 */
export const fetchFacilities = async () => {
    try {
        const { data, error } = await supabase
            .from('facilities')
            .select('*')
            .order('nama', { ascending: true });

        if (error) throw error;

        // Convert to GeoJSON format
        const geojson = {
            type: 'FeatureCollection',
            features: data.map(facility => ({
                type: 'Feature',
                properties: {
                    id: facility.id,
                    nama: facility.nama,
                    jenis: facility.jenis,
                    kategori: facility.kategori,
                    alamat: facility.alamat,
                    pengelola: facility.pengelola
                },
                geometry: {
                    type: 'Point',
                    coordinates: [facility.longitude, facility.latitude]
                }
            }))
        };

        return geojson;
    } catch (error) {
        console.error('Error fetching facilities:', error);
        return null;
    }
};

/**
 * Create a new facility
 */
export const createFacility = async (facilityData) => {
    try {
        const { data, error } = await supabase
            .from('facilities')
            .insert([{
                nama: facilityData.nama,
                jenis: facilityData.jenis,
                kategori: facilityData.kategori,
                alamat: facilityData.alamat,
                pengelola: facilityData.pengelola || '',
                latitude: facilityData.latitude,
                longitude: facilityData.longitude
            }])
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating facility:', error);
        throw error;
    }
};

/**
 * Update an existing facility
 */
export const updateFacility = async (id, facilityData) => {
    try {
        const { data, error } = await supabase
            .from('facilities')
            .update({
                nama: facilityData.nama,
                jenis: facilityData.jenis,
                kategori: facilityData.kategori,
                alamat: facilityData.alamat,
                pengelola: facilityData.pengelola || '',
                latitude: facilityData.latitude,
                longitude: facilityData.longitude
            })
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating facility:', error);
        throw error;
    }
};

/**
 * Delete a facility
 */
export const deleteFacility = async (id) => {
    try {
        const { error } = await supabase
            .from('facilities')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting facility:', error);
        throw error;
    }
};

/**
 * Insert multiple facilities (for initial data migration)
 */
export const insertFacilities = async (facilities) => {
    try {
        const records = facilities.map(f => ({
            nama: f.properties.nama,
            jenis: f.properties.jenis,
            kategori: f.properties.kategori,
            alamat: f.properties.alamat,
            pengelola: f.properties.pengelola || '',
            latitude: f.geometry.coordinates[1],
            longitude: f.geometry.coordinates[0]
        }));

        const { data, error } = await supabase
            .from('facilities')
            .insert(records)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error inserting facilities:', error);
        throw error;
    }
};
