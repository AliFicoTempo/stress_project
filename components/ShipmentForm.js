// components/ShipmentForm.js
import { useState, useEffect } from "react";
import Select from 'react-select';

// Style khusus untuk dropdown agar sesuai dengan tema baru
const formSelectStyles = {
  control: (styles) => ({ ...styles, backgroundColor: 'white', border: '1px solid #d1d5db' }),
  menu: (styles) => ({ ...styles, backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }),
  option: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: isFocused ? '#f0f9ff' : 'white',
    color: '#1f2937',
    ':active': { ...styles[':active'], backgroundColor: '#e0f2fe' },
  }),
  singleValue: (styles) => ({...styles, color: '#1f2937'}),
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
    <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Driver</label>
        {user.status === 'admin' ? (
          <Select
            options={allUsers}
            styles={formSelectStyles}
            placeholder="Pilih nama driver..."
            onChange={handleNameChange}
            value={allUsers.find(u => u.value === formData.nama)}
          />
        ) : (
          <input 
            type="text" 
            value={formData.nama} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100" 
            readOnly 
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
        <input 
          type="date" 
          name="tanggal" 
          value={formData.tanggal} 
          onChange={handleChange} 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500" 
          required 
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Shipment (10 digit)</label>
        <input 
          type="text" 
          name="shipment" 
          inputMode="numeric" 
          pattern="\d{10}" 
          title="Harus 10 digit angka" 
          value={formData.shipment} 
          onChange={handleChange} 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500" 
          required 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Toko</label>
          <input 
            type="number" 
            name="jumlah_toko" 
            inputMode="numeric" 
            value={formData.jumlah_toko} 
            onChange={handleChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500" 
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Terkirim</label>
          <input 
            type="number" 
            name="terkirim" 
            inputMode="numeric" 
            value={formData.terkirim} 
            onChange={handleChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500" 
            required 
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Gagal</label>
        <input 
          type="number" 
          name="gagal" 
          value={gagal} 
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100" 
          readOnly 
        />
      </div>
      
      {gagal > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alasan</label>
          <textarea 
            name="alasan" 
            value={formData.alasan} 
            onChange={handleChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500" 
            required={gagal > 0} 
          />
        </div>
      )}
      
      <button 
        type="submit" 
        className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 transition-all duration-300 shadow"
      >
        {initialData.id ? "Update Data" : "Simpan Data"}
      </button>
    </form>
  );
}