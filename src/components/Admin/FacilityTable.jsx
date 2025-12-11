import { useState } from 'react';
import { getCategoryColor } from '../../utils/spatial';
import { Search, Edit2, Trash2, School, Heart, Church, MapPin } from 'lucide-react';

const FacilityTable = ({ facilities, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    const categories = ['Pendidikan', 'Kesehatan', 'Tempat Ibadah'];

    const getCategoryIcon = (kategori) => {
        if (kategori === 'Pendidikan') return <School className="w-4 h-4" />;
        if (kategori === 'Kesehatan') return <Heart className="w-4 h-4" />;
        if (kategori === 'Tempat Ibadah') return <Church className="w-4 h-4" />;
        return <MapPin className="w-4 h-4" />;
    };

    const filteredFacilities = facilities.filter(f => {
        const props = f.properties;
        const matchesSearch =
            props.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            props.alamat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            props.jenis?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = filterCategory === 'all' || props.kategori === filterCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="glass-dark rounded-xl overflow-hidden">
            {/* Filters */}
            <div className="p-4 border-b border-white/10 flex flex-wrap gap-4">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari fasilitas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>

                {/* Category Filter */}
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                    <option value="all" className="bg-slate-800">Semua Kategori</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat} className="bg-slate-800">{cat}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Nama
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Jenis
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Kategori
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Alamat
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Koordinat
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredFacilities.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                                    {searchTerm || filterCategory !== 'all'
                                        ? 'Tidak ada fasilitas yang cocok dengan filter'
                                        : 'Belum ada data fasilitas'
                                    }
                                </td>
                            </tr>
                        ) : (
                            filteredFacilities.map((facility, idx) => {
                                const props = facility.properties;
                                const coords = facility.geometry.coordinates;

                                return (
                                    <tr key={props.id || idx} className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="p-1.5 rounded-lg"
                                                    style={{ backgroundColor: getCategoryColor(props.kategori) }}
                                                >
                                                    {getCategoryIcon(props.kategori)}
                                                </div>
                                                <span className="text-white font-medium text-sm">{props.nama}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-300 text-sm">
                                            {props.jenis || '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className="px-2 py-1 rounded-full text-xs font-medium"
                                                style={{
                                                    backgroundColor: getCategoryColor(props.kategori) + '30',
                                                    color: getCategoryColor(props.kategori)
                                                }}
                                            >
                                                {props.kategori}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-300 text-sm max-w-[200px] truncate">
                                            {props.alamat || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                                            {coords[1].toFixed(5)}, {coords[0].toFixed(5)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => onEdit(facility)}
                                                    className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(facility)}
                                                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400 hover:text-red-300"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-white/10 text-sm text-gray-400">
                Menampilkan {filteredFacilities.length} dari {facilities.length} fasilitas
            </div>
        </div>
    );
};

export default FacilityTable;
