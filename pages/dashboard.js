import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAnalytics, getShipments, addShipment, updateShipment, deleteShipment } from "../lib/api";
import ShipmentForm from "../components/ShipmentForm";
import ShipmentTable from "../components/ShipmentTable";
import Head from "next/head";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ start: "", end: "", name: "" });

  useEffect(() => {
    const s = localStorage.getItem("sp_user");
    if (!s) return router.push("/");
    setUser(JSON.parse(s));
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    const a = await getAnalytics(filter);
    if (a.ok) setSummary(a.summary);
    const s = await getShipments(filter);
    if (s.ok) setShipments(s.data || []);
    setLoading(false);
  }

  async function handleAdd(payload) {
    payload.nik = user.nik;
    payload.nama = user.name;
    const r = await addShipment(payload);
    if (r.ok) loadAll();
    else alert(r.message || "Gagal menambah");
  }

  async function handleUpdate(payload) {
    const r = await updateShipment(payload);
    if (r.ok) loadAll();
    else alert(r.message || "Gagal update");
  }

  async function handleDelete(id) {
    if (!confirm("Hapus shipment ini?")) return;
    const r = await deleteShipment({ id });
    if (r.ok) loadAll();
    else alert(r.message || "Gagal hapus");
  }

  function logout() {
    localStorage.removeItem("sp_user");
    router.push("/");
  }

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&display=swap" rel="stylesheet" />
      </Head>
      <div className="min-h-screen p-6 animate-gradient bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white">
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ fontFamily: "Orbitron, sans-serif" }}>
            Dashboard — {user?.name}
          </h2>
          <button className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 transition" onClick={logout}>
            Logout
          </button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow">
            <div className="text-xs text-gray-300">TOTAL HK</div>
            <div className="text-2xl font-bold">{summary?.totalHK ?? "-"}</div>
          </div>
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow">
            <div className="text-xs text-gray-300">TOTAL DP</div>
            <div className="text-2xl font-bold">{summary?.totalDP ?? "-"}</div>
          </div>
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow">
            <div className="text-xs text-gray-300">TOTAL TERKIRIM</div>
            <div className="text-2xl font-bold">{summary?.totalTerkirim ?? "-"}</div>
          </div>
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow">
            <div className="text-xs text-gray-300">TOTAL GAGAL</div>
            <div className="text-2xl font-bold">{summary?.totalGagal ?? "-"}</div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Shipments</h3>
              <div className="flex gap-2">
                <input placeholder="start YYYY-MM-DD" className="border border-white/30 bg-white/20 px-2 py-1 rounded text-white placeholder-gray-300" value={filter.start} onChange={e=>setFilter({...filter, start:e.target.value})}/>
                <input placeholder="end YYYY-MM-DD" className="border border-white/30 bg-white/20 px-2 py-1 rounded text-white placeholder-gray-300" value={filter.end} onChange={e=>setFilter({...filter, end:e.target.value})}/>
                <input placeholder="nama" className="border border-white/30 bg-white/20 px-2 py-1 rounded text-white placeholder-gray-300" value={filter.name} onChange={e=>setFilter({...filter, name:e.target.value})}/>
                <button className="px-3 bg-blue-600 rounded hover:bg-blue-500 transition" onClick={loadAll}>Filter</button>
              </div>
            </div>
            <ShipmentTable data={shipments} onDelete={handleDelete} onUpdate={handleUpdate} />
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-3">Tambah Shipment</h3>
            <ShipmentForm onSubmit={handleAdd} />
          </div>
        </section>

        {loading && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 pointer-events-none"><div className="p-4 bg-gray-900 rounded text-white">Loading...</div></div>}

        <style jsx global>{`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient {
            background-size: 400% 400%;
            animation: gradient 15s ease infinite;
          }
        `}</style>
      </div>
    </>
  );
}
