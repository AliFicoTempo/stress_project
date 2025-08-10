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

// Style khusus untuk dropdown agar sesuai dengan tema gelap Anda
const multiSelectStyles = {
  control: (styles) => ({ ...styles, backgroundColor: '#374151', border: '1px solid #4B5563', color: 'white' }),
  menu: (styles) => ({ ...styles, backgroundColor: '#1F2937' }),
  option: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: isFocused ? '#4B5563' : '#1F2937',
    color: 'white',
    ':active': { ...styles[':active'], backgroundColor: '#6B7280' },
  }),
  multiValue: (styles) => ({ ...styles, backgroundColor: '#06B6D4' }),
  multiValueLabel: (styles) => ({ ...styles, color: 'white' }),
  multiValueRemove: (styles) => ({ ...styles, color: 'white', ':hover': { backgroundColor: '#EF4444', color: 'white' } }),
  input: (styles) => ({...styles, color: 'white'}),
  singleValue: (styles) => ({...styles, color: 'white'}),
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

    if (!user) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading session...</div>;

    return (
        <>
            <Head><title>Dashboard | STRESS</title></Head>
            <div className="flex min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black animate-gradient text-white">
                <Sidebar />
                <main className="flex-1 lg:pl-64">
                    <div className="p-6">
                        {isAddModalOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
                                <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-lg border border-gray-700">
                                    <h2 className="text-xl font-bold mb-4 text-cyan-400">INPUT SHIPMENT BARU</h2>
                                    <ShipmentForm onSubmit={handleAdd} user={user} allUsers={allUsersForForm} />
                                    <button onClick={() => setIsAddModalOpen(false)} className="w-full mt-4 py-2 bg-gray-600 hover:bg-gray-500 rounded font-semibold transition-colors">Batal</button>
                                </div>
                            </div>
                        )}
                        {editingShipment && (
                            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
                                <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-lg border border-gray-700">
                                    <h2 className="text-xl font-bold mb-4 text-yellow-400">EDIT SHIPMENT</h2>
                                    <ShipmentForm onSubmit={handleUpdate} user={user} allUsers={allUsersForForm} initialData={editingShipment} />
                                    <button onClick={() => setEditingShipment(null)} className="w-full mt-4 py-2 bg-gray-600 hover:bg-gray-500 rounded font-semibold transition-colors">Batal</button>
                                </div>
                            </div>
                        )}
                        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                            <div><h1 className="text-3xl font-bold" style={{ fontFamily: "Orbitron, sans-serif" }}>Selamat datang, {user?.name}</h1><p className="text-sm text-gray-400">STRESS | Shipment Tracking Report & Engagement Support System</p></div>
                            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                                <button onClick={() => setIsAddModalOpen(true)} className="px-5 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50">Input Shipment</button>
                                <button onClick={logout} className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition">Logout</button>
                            </div>
                        </header>
                        {loading ? (<div className="text-center p-10">Memuat data awal...</div>) : (
                            <>
                                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                    <StatCard title="TOTAL HK" value={filteredData.summary.totalHK} /><StatCard title="TOTAL DP" value={filteredData.summary.totalDP} /><StatCard title="TOTAL TERKIRIM" value={filteredData.summary.totalTerkirim} /><StatCard title="TOTAL GAGAL" value={filteredData.summary.totalGagal} />
                                </section>
                                <section className="space-y-6 mb-6">
                                    <ShipmentCharts shipmentData={filteredData.shipments} summaryData={filteredData.summary} />
                                    {user.status === 'admin' && <RankingCard rankingData={filteredData.ranking} />}
                                </section>
                                <section className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-lg">
                                    <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                                        <h3 className="font-semibold text-lg mb-2 md:mb-0">Rekap Shipment</h3>
                                        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
                                            <input type="date" name="start" value={filters.start} onChange={handleDateChange} className="border border-white/30 bg-gray-700 px-2 py-1 rounded placeholder-gray-300"/>
                                            <input type="date" name="end" value={filters.end} onChange={handleDateChange} className="border border-white/30 bg-gray-700 px-2 py-1 rounded placeholder-gray-300"/>
                                            {user.status === 'admin' && (
                                                <div className="w-full md:w-64"><Select isMulti name="names" options={userList} className="basic-multi-select" classNamePrefix="select" placeholder="Filter Nama..." styles={multiSelectStyles} onChange={handleMultiSelectChange} /></div>
                                            )}
                                        </div>
                                    </div>
                                    <ShipmentTable data={filteredData.shipments} onDelete={handleDelete} onEdit={setEditingShipment} isAdmin={user.status === 'admin'} />
                                </section>
                            </>
                        )}
                    </div>
                </main>
            </div>
            <style jsx global>{`@keyframes gradient {0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; }} .animate-gradient { background-size: 400% 400%; animation: gradient 15s ease infinite; }`}</style>
        </>
    );
}