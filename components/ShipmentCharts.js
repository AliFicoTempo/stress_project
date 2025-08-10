// components/ShipmentCharts.js
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Registrasi komponen-komponen Chart.js yang akan kita gunakan
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function ShipmentCharts({ shipmentData, summaryData }) {
  // Pengecekan data awal yang kuat
  if (!shipmentData || !summaryData) {
    return <div className="text-center p-4 text-gray-400">Memuat data grafik...</div>;
  }
  
  const validShipmentData = shipmentData.filter(d => d && d.tanggal && !isNaN(new Date(d.tanggal).getTime()));

  if (validShipmentData.length === 0) {
    return (
      <div className="bg-white/10 p-4 rounded-xl shadow-lg text-center text-gray-400">
        <h3 className="font-semibold text-lg mb-2">Grafik Performa</h3>
        <p>Tidak ada data valid yang bisa ditampilkan pada rentang ini.</p>
      </div>
    );
  }

  // ---- Konfigurasi untuk Grafik Batang (Bar Chart) ----
  const barChartLabels = validShipmentData.map(d => 
    new Date(d.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
  ).reverse();

  const barChartData = {
    labels: barChartLabels,
    datasets: [
      {
        label: 'Terkirim',
        data: validShipmentData.map(d => d.terkirim).reverse(),
        backgroundColor: 'rgba(16, 185, 129, 0.7)', // Hijau
        stack: 'Stack 0',
      },
      {
        label: 'Gagal',
        data: validShipmentData.map(d => d.gagal).reverse(),
        backgroundColor: 'rgba(239, 68, 68, 0.7)', // Merah
        stack: 'Stack 0',
      },
    ],
  };

  const barChartOptions = {
    plugins: { legend: { labels: { color: '#D1D5DB' } } },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true, ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
      y: { stacked: true, ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
    },
  };

  // ---- Konfigurasi untuk Grafik Lingkaran (Pie Chart) ----
  const pieChartData = {
    labels: ['Terkirim', 'Gagal'],
    datasets: [
      {
        label: 'Total',
        data: [summaryData.totalTerkirim || 0, summaryData.totalGagal || 0],
        backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(239, 68, 68, 0.8)'],
        borderColor: ['#10B981', '#EF4444'],
        borderWidth: 1,
      },
    ],
  };
  
  const pieChartOptions = {
    plugins: { legend: { position: 'top', labels: { color: '#D1D5DB' } } },
    responsive: true,
    maintainAspectRatio: false,
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white/10 p-4 rounded-xl shadow-lg">
        <h3 className="font-semibold text-lg mb-4">Performa Harian</h3>
        <div style={{ position: 'relative', height: '300px' }}>
          <Bar options={barChartOptions} data={barChartData} />
        </div>
      </div>

      <div className="bg-white/10 p-4 rounded-xl shadow-lg flex flex-col items-center">
        <h3 className="font-semibold text-lg mb-4">Perbandingan Keseluruhan</h3>
        <div style={{ position: 'relative', height: '300px', width: '100%' }}>
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>
    </div>
  );
}