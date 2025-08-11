// pages/dashboard.js
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import Select from 'react-select';
import { getAnalytics, getShipments, addShipment, updateShipment, deleteShipment, getAllUsers } from "../lib/api";
import Head from "next/head";

import Sidebar from "../components/Sidebar";
import ShipmentTable from "../components/ShipmentTable";
import ShipmentForm from "../components/ShipmentForm";
import StatCard from "../components/StatCard";
import RankingCard from "../components/RankingCard";
import ShipmentCharts from "../components/ShipmentCharts";

// Style untuk dropdown yang disesuaikan dengan tema baru
const multiSelectStyles = {
  control: (styles) => ({ ...styles, backgroundColor: 'white', border: '1px solid #d1d5db', color: '#1f2937' }),
  menu: (styles) => ({ ...styles, backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }),
  option: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: isFocused ? '#f0f9ff' : 'white',
    color: '#1f2937',
    ':active': { ...styles[':active'], backgroundColor: '#e0f2fe' },
  }),
  multiValue: (styles) => ({ ...styles, backgroundColor: '#e0f2fe' }),
  multiValueLabel: (styles) => ({ ...styles, color: '#0369a1' }),
  multiValueRemove: (styles) => ({ ...styles, color: '#0369a1', ':hover': { backgroundColor: '#bae6fd' } }),
  input: (styles) => ({...styles, color: '#1f2937'}),
  singleValue: (styles) => ({...styles, color: '#1f2937'}),
};

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingShipment, setEditingShipment] = useState(null);

    const [masterShipments, setMasterShipments] = useState([]);
    const [masterRanking, setMasterRanking] = useState([]);
    const [masterSummary, setMasterSummary] = useState({ totalHK: 0, totalDP: 0, totalTerkirim: 0, totalGagal: 0 });
    const [userList, setUserList] = useState([]);
    const [allUsersForForm, setAllUsersForForm] = useState([]);

    const [filters, setFilters] = useState({ start: "", end: "", names: [] });

    const filteredData = useMemo(() => {
        if (!masterShipments) return { shipments: [], summary: masterSummary, ranking: masterRanking };
        const selectedNames = filters.names.map(opt => opt.value);
        const filtered = masterShipments.filter(shipment => {
            let keep = true;
            if (filters.start && shipment.tanggal < filters.start) keep = false;
            if (filters.end && shipment.tanggal > filters.end) keep = false;
            if (user?.status === 'admin' && selectedNames.length > 0 && !selectedNames.includes(shipment.nama)) keep = false;
            return keep;
        });
        const summary = filtered.reduce((acc, curr) => {
            acc.totalHK += 1;
            acc.totalDP += curr.jumlah;
            acc.totalTerkirim += curr.terkirim;
            acc.totalGagal += curr.gagal;
            return acc;
        }, { totalHK: 0, totalDP: 0, totalTerkirim: 0, totalGagal: 0 });
        return { shipments: filtered, summary, ranking: masterRanking };
    }, [masterShipments, masterRanking, filters, user]);

    useEffect(() => {
        const storedUser = localStorage.getItem("sp_user");
        if (!storedUser) {
            router.push("/");
            return;
        }
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        loadInitialData(parsedUser);
    }, []);

    async function loadInitialData(currentUser) {
        setLoading(true);
        const filterForAPI = currentUser?.status !== 'admin' ? { name: currentUser.name } : {};
        
        const promises = [
            getAnalytics(filterForAPI),
            getShipments(filterForAPI)
        ];

        if (currentUser?.status === 'admin') {
            promises.push(getAllUsers());
        }

        const [analyticsRes, shipmentsRes, allUsersRes] = await Promise.all(promises);

        if (analyticsRes.ok) {
            setMasterSummary(analyticsRes.summary);
            setMasterRanking(analyticsRes.ranking || []);
        }
        if (shipmentsRes.ok) {
            const shipments = shipmentsRes.data || [];
            setMasterShipments(shipments);
            const uniqueNames = [...new Set(shipments.map(item => item.nama))].map(name => ({ value: name, label: name }));
            setUserList(uniqueNames);
        }
        
        if (allUsersRes && allUsersRes.ok) {
            setAllUsersForForm(allUsersRes.data || []);
        }

        setLoading(false);
    }

    function handleMultiSelectChange(selectedOptions) {
        setFilters(prev => ({ ...prev, names: selectedOptions }));
    }
    
    function handleDateChange(e) {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleAdd(payload) {
        const finalPayload = { ...payload, nik: user.nik };
        // Jika bukan admin, pastikan nama sesuai dengan user yg login
        if (user.status !== 'admin') {
            finalPayload.nama = user.name;
        }
        const res = await addShipment(finalPayload);
        if (res.ok) {
            setIsAddModalOpen(false);
            loadInitialData(user);
        } else {
            alert(res.message || "Gagal menambah data");
        }
    }
    
    async function handleUpdate(payload) {
      const res = await updateShipment({ id: editingShipment.id, ...payload });
      if(res.ok) {
        setEditingShipment(null);
        loadInitialData(user);
      } else {
        alert(res.message || "Gagal update");
      }
    }

    async function handleDelete(id) {
      if(!confirm("Hapus data ini?")) return;
      const res = await deleteShipment({id});
      if(res.ok) loadInitialData(user);
      else alert(res.message || "Gagal hapus");
    }

    function logout() {
        localStorage.removeItem("sp_user");
        router.push("/");
    }

    if (!user) return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );

    return (
        <>
            <Head><title>Dashboard | STRESS</title></Head>
            <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900">
                <Sidebar />
                <main className="flex-1 lg:pl-64">
                    <div className="p-6">
                        {isAddModalOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                                <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg border border-gray-200">
                                    <h2 className="text-xl font-bold mb-4 text-blue-600">INPUT SHIPMENT BARU</h2>
                                    <ShipmentForm onSubmit={handleAdd} user={user} allUsers={allUsersForForm} />
                                    <button 
                                      onClick={() => setIsAddModalOpen(false)} 
                                      className="w-full mt-4 py-2 bg-gray-200 hover:bg-gray-300 rounded font-semibold transition-colors"
                                    >
                                      Batal
                                    </button>
                                </div>
                            </div>
                        )}
                        {editingShipment && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                                <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg border border-gray-200">
                                    <h2 className="text-xl font-bold mb-4 text-blue-600">EDIT SHIPMENT</h2>
                                    <ShipmentForm onSubmit={handleUpdate} user={user} allUsers={allUsersForForm} initialData={editingShipment} />
                                    <button 
                                      onClick={() => setEditingShipment(null)} 
                                      className="w-full mt-4 py-2 bg-gray-200 hover:bg-gray-300 rounded font-semibold transition-colors"
                                    >
                                      Batal
                                    </button>
                                </div>
                            </div>
                        )}
                        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Selamat datang, {user?.name}</h1>
                                <p className="text-sm text-gray-600">STRESS | Shipment Tracking Report & Engagement Support System</p>
                            </div>
                            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                                <button 
                                    onClick={() => setIsAddModalOpen(true)} 
                                    className="px-5 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 transition-all duration-300 shadow"
                                >
                                    Input Shipment
                                </button>
                                <button 
                                  onClick={logout} 
                                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
                                >
                                  Logout
                                </button>
                            </div>
                        </header>
                        {loading ? (
                            <div className="text-center p-10 text-gray-600">Memuat data awal...</div>
                        ) : (
                            <>
                                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                    <StatCard title="TOTAL HK" value={filteredData.summary.totalHK} />
                                    <StatCard title="TOTAL DP" value={filteredData.summary.totalDP} />
                                    <StatCard title="TOTAL TERKIRIM" value={filteredData.summary.totalTerkirim} />
                                    <StatCard title="TOTAL GAGAL" value={filteredData.summary.totalGagal} />
                                </section>
                                <section className="space-y-6 mb-6">
                                    <ShipmentCharts shipmentData={filteredData.shipments} summaryData={filteredData.summary} />
                                    {user.status === 'admin' && <RankingCard rankingData={filteredData.ranking} />}
                                </section>
                                <section className="bg-white border border-gray-200 p-4 rounded-xl shadow">
                                    <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                                        <h3 className="font-semibold text-lg mb-2 md:mb-0 text-gray-900">Rekap Shipment</h3>
                                        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
                                            <input 
                                                type="date" 
                                                name="start" 
                                                value={filters.start} 
                                                onChange={handleDateChange} 
                                                className="border border-gray-300 bg-white px-3 py-2 rounded text-gray-700 text-sm"
                                            />
                                            <input 
                                                type="date" 
                                                name="end" 
                                                value={filters.end} 
                                                onChange={handleDateChange} 
                                                className="border border-gray-300 bg-white px-3 py-2 rounded text-gray-700 text-sm"
                                            />
                                            {user.status === 'admin' && (
                                                <div className="w-full md:w-64">
                                                    <Select 
                                                        isMulti 
                                                        name="names" 
                                                        options={userList} 
                                                        className="basic-multi-select" 
                                                        classNamePrefix="select" 
                                                        placeholder="Filter Nama..." 
                                                        styles={multiSelectStyles} 
                                                        onChange={handleMultiSelectChange} 
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <ShipmentTable 
                                      data={filteredData.shipments} 
                                      onDelete={handleDelete} 
                                      onEdit={setEditingShipment} 
                                      isAdmin={user.status === 'admin'} 
                                    />
                                </section>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}