import { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';

const FacilityForm = ({ facility, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        nama: '',
        jenis: '',
        kategori: 'Pendidikan',
        alamat: '',
        latitude: '',
        longitude: '',
        pengelola: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const categories = ['Pendidikan', 'Kesehatan', 'Tempat Ibadah'];

    useEffect(() => {
        if (facility) {
            const props = facility.properties;
            const coords = facility.geometry.coordinates;
            setFormData({
                nama: props.nama || '',
                jenis: props.jenis || '',
                kategori: props.kategori || 'Pendidikan',
                alamat: props.alamat || '',
                latitude: coords[1].toString(),
                longitude: coords[0].toString(),
                pengelola: props.pengelola || ''
            });
        }
    }, [facility]);

    const validate = () => {
        const newErrors = {};

        if (!formData.nama.trim()) {
            newErrors.nama = 'Nama fasilitas wajib diisi';
        }
        if (!formData.jenis.trim()) {
            newErrors.jenis = 'Jenis fasilitas wajib diisi';
        }
        if (!formData.latitude || isNaN(parseFloat(formData.latitude))) {
            newErrors.latitude = 'Latitude harus berupa angka';
        } else {
            const lat = parseFloat(formData.latitude);
            if (lat < -90 || lat > 90) {
                newErrors.latitude = 'Latitude harus antara -90 dan 90';
            }
        }
        if (!formData.longitude || isNaN(parseFloat(formData.longitude))) {
            newErrors.longitude = 'Longitude harus berupa angka';
        } else {
            const lng = parseFloat(formData.longitude);
            if (lng < -180 || lng > 180) {
                newErrors.longitude = 'Longitude harus antara -180 dan 180';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        try {
            await onSubmit({
                nama: formData.nama.trim(),
                jenis: formData.jenis.trim(),
                kategori: formData.kategori,
                alamat: formData.alamat.trim(),
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
                pengelola: formData.pengelola.trim()
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-dark rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">
                        {facility ? 'Edit Fasilitas' : 'Tambah Fasilitas'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Nama */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Nama Fasilitas <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="nama"
                            value={formData.nama}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nama ? 'border-red-500' : 'border-white/20'}`}
                            placeholder="Contoh: SD Negeri 1 Sidigede"
                        />
                        {errors.nama && <p className="text-red-400 text-xs mt-1">{errors.nama}</p>}
                    </div>

                    {/* Jenis */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Jenis Fasilitas <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="jenis"
                            value={formData.jenis}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.jenis ? 'border-red-500' : 'border-white/20'}`}
                            placeholder="Contoh: SD, Klinik, Masjid"
                        />
                        {errors.jenis && <p className="text-red-400 text-xs mt-1">{errors.jenis}</p>}
                    </div>

                    {/* Kategori */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Kategori Umum <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="kategori"
                            value={formData.kategori}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat} className="bg-slate-800">{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Alamat */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Alamat
                        </label>
                        <textarea
                            name="alamat"
                            value={formData.alamat}
                            onChange={handleChange}
                            rows={2}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Masukkan alamat lengkap"
                        />
                    </div>

                    {/* Koordinat */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Latitude <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="latitude"
                                value={formData.latitude}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.latitude ? 'border-red-500' : 'border-white/20'}`}
                                placeholder="-6.75488"
                            />
                            {errors.latitude && <p className="text-red-400 text-xs mt-1">{errors.latitude}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Longitude <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="longitude"
                                value={formData.longitude}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.longitude ? 'border-red-500' : 'border-white/20'}`}
                                placeholder="110.70096"
                            />
                            {errors.longitude && <p className="text-red-400 text-xs mt-1">{errors.longitude}</p>}
                        </div>
                    </div>

                    {/* Pengelola */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Pengelola
                        </label>
                        <input
                            type="text"
                            name="pengelola"
                            value={formData.pengelola}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Contoh: Dinas Pendidikan Kab. Jepara"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-4 py-2 glass text-white rounded-lg hover:bg-white/20 transition-all"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Simpan
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FacilityForm;
