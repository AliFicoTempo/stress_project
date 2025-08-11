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
    return <div className="text-center p-4 text-gray-500">Memuat data grafik...</div>;
  }
  
  const validShipmentData = shipmentData.filter(d => d && d.tanggal && !isNaN(new Date(d.tanggal).getTime()));

  if (validShipmentData.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl shadow border border-gray-200 text-center text-gray-500">
        <h3 className="font-semibold text-lg mb-2">Grafik Performa</h3>
        <p>Tidak ada data valid yang bisa ditampilkan pada rentang ini.</p>
      </div>
    );
  }

  // Batasi jumlah data menjadi maksimal 15
  const maxBars = 15;
  const barData = [...validShipmentData]
    .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal))
    .slice(-maxBars); // Ambil 15 data terbaru

  // ---- Konfigurasi untuk Grafik Batang (Bar Chart) ----
  const barChartLabels = barData.map(d => 
    new Date(d.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
  );

  const barChartData = {
    labels: barChartLabels,
    datasets: [
      {
        label: 'Terkirim',
        data: barData.map(d => d.terkirim),
        backgroundColor: 'rgba(16, 185, 129, 0.7)', // Hijau
        stack: 'Stack 0',
      },
      {
        label: 'Gagal',
        data: barData.map(d => d.gagal),
        backgroundColor: 'rgba(239, 68, 68, 0.7)', // Merah
        stack: 'Stack 0',
      },
    ],
  };

  const barChartOptions = {
    plugins: { 
      legend: { 
        labels: { 
          color: '#374151',
          font: {
            family: "'Inter', sans-serif"
          } 
        } 
      } 
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { 
        stacked: true, 
        ticks: { color: '#6B7280' }, 
        grid: { color: 'rgba(0, 0, 0, 0.05)' } 
      },
      y: { 
        stacked: true, 
        ticks: { color: '#6B7280' }, 
        grid: { color: 'rgba(0, 0, 0, 0.05)' } 
      },
    },
  };

  // Hitung lebar yang dibutuhkan untuk chart
  const barWidth = 60; // perkiraan lebar per bar dalam px
  const chartWidth = barData.length * barWidth;

  // ---- Konfigurasi untuk Grafik Lingkaran (Pie Chart) ----
  const totalShipments = summaryData.totalTerkirim + summaryData.totalGagal;
  const pieChartData = {
    labels: [
      `Terkirim (${totalShipments > 0 ? Math.round((summaryData.totalTerkirim / totalShipments) * 100) : 0}%)`,
      `Gagal (${totalShipments > 0 ? Math.round((summaryData.totalGagal / totalShipments) * 100) : 0}%)`
    ],
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
    plugins: { 
      legend: { 
        position: 'top', 
        labels: { 
          color: '#374151',
          font: {
            family: "'Inter', sans-serif",
            size: 12
          } 
        } 
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = totalShipments > 0 ? Math.round((value / totalShipments) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    responsive: true,
    maintainAspectRatio: true,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow border border-gray-200">
        <h3 className="font-semibold text-lg mb-4 text-gray-900">Performa Harian</h3>
        
        {/* Container dengan scroll horizontal */}
        <div className="overflow-x-auto">
          <div 
            className="relative" 
            style={{ 
              height: '300px',
              minWidth: `${Math.max(1000, chartWidth)}px` // Lebar minimum 1000px atau lebih jika banyak data
            }}
          >
            <Bar options={barChartOptions} data={barChartData} />
          </div>
        </div>
        
        {validShipmentData.length > maxBars && (
          <div className="mt-2 text-sm text-gray-500 text-center">
            Menampilkan {maxBars} data terbaru dari total {validShipmentData.length} data
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl shadow border border-gray-200 flex flex-col items-center">
        <h3 className="font-semibold text-lg mb-4 text-gray-900">Perbandingan Keseluruhan</h3>
        <div style={{ position: 'relative', height: '300px', width: '100%' }}>
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>
    </div>
  );
}