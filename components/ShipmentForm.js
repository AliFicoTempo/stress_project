// components/ShipmentForm.js
import { useState, useEffect } from "react";
import Select from 'react-select';

const formSelectStyles = {
  control: (styles) => ({ ...styles, backgroundColor: '#4B5563', border: '1px solid #6B7280' }),
  menu: (styles) => ({ ...styles, backgroundColor: '#1F2937' }),
  option: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: isFocused ? '#4B5563' : '#1F2937',
    color: 'white',
    ':active': { ...styles[':active'], backgroundColor: '#6B7280' },
  }),
  singleValue: (styles) => ({...styles, color: 'white'}),
};

export default function ShipmentForm({ onSubmit, user, allUsers = [], initialData = {} }) {
  const [formData, setFormData] = useState({
    nama: initialData.nama || (user.status !== 'admin' ? user.name : ''),
    tanggal: initialData.tanggal ? initialData.tanggal.split("T")[0] : new Date().toISOString().split("T")[0],
    shipment: initialData.shipment || "",
    jumlah_toko: initialData.jumlah || 0,
    terkirim: initialData.terkirim || 0,
    alasan: initialData.alasan || "",
  });

  const [gagal, setGagal] = useState(0);

  useEffect(() => {
    const jumlah = parseInt(formData.jumlah_toko) || 0;
    const terkirim = parseInt(formData.terkirim) || 0;
    setGagal(Math.max(0, jumlah - terkirim));
  }, [formData.jumlah_toko, formData.terkirim]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleNameChange(selectedOption) {
      setFormData(prev => ({ ...prev, nama: selectedOption.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.nama) {
        alert("Nama wajib dipilih/diisi.");
        return;
    }
    if (parseInt(formData.terkirim) > parseInt(formData.jumlah_toko)) {
      alert("Jumlah terkirim tidak boleh lebih besar dari jumlah toko.");
      return;
    }
    if (gagal > 0 && !formData.alasan) {
      alert("Alasan wajib diisi jika ada barang yang gagal terkirim.");
      return;
    }
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-white">
      <div>
        <label className="block text-sm text-gray-300">Nama Driver</label>
        {user.status === 'admin' ? (
          <Select
            options={allUsers}
            styles={formSelectStyles}
            placeholder="Pilih nama driver..."
            onChange={handleNameChange}
            value={allUsers.find(u => u.value === formData.nama)}
            className="mt-1"
          />
        ) : (
          <input type="text" value={formData.nama} className="mt-1 w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded cursor-not-allowed" readOnly />
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-300">Tanggal</label>
        <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} className="mt-1 w-full bg-white/20 border border-white/30 px-3 py-2 rounded focus:outline-none focus:border-cyan-400" required />
      </div>
      <div>
        <label className="block text-sm text-gray-300">Shipment (10 digit)</label>
        <input type="text" name="shipment" inputMode="numeric" pattern="\d{10}" title="Harus 10 digit angka" value={formData.shipment} onChange={handleChange} className="mt-1 w-full bg-white/20 border border-white/30 px-3 py-2 rounded focus:outline-none focus:border-cyan-400" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-300">Jumlah Toko</label>
          <input type="number" name="jumlah_toko" inputMode="numeric" value={formData.jumlah_toko} onChange={handleChange} className="mt-1 w-full bg-white/20 border border-white/30 px-3 py-2 rounded focus:outline-none focus:border-cyan-400" required />
        </div>
        <div>
          <label className="block text-sm text-gray-300">Terkirim</label>
          <input type="number" name="terkirim" inputMode="numeric" value={formData.terkirim} onChange={handleChange} className="mt-1 w-full bg-white/20 border border-white/30 px-3 py-2 rounded focus:outline-none focus:border-cyan-400" required />
        </div>
      </div>
       <div>
        <label className="block text-sm text-gray-300">Gagal</label>
        <input type="number" name="gagal" value={gagal} className="mt-1 w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded cursor-not-allowed" readOnly />
      </div>
      {gagal > 0 && (
        <div>
          <label className="block text-sm text-gray-300">Alasan</label>
          <textarea name="alasan" value={formData.alasan} onChange={handleChange} className="mt-1 w-full bg-white/20 border border-white/30 px-3 py-2 rounded focus:outline-none focus:border-cyan-400" required={gagal > 0} />
        </div>
      )}
      <button type="submit" className="w-full py-2 rounded text-white font-semibold bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 transition-all duration-300">
        {initialData.id ? "Update Data" : "Simpan Data"}
      </button>
    </form>
  );
}