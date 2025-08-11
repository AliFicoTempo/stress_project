export default function RankingCard({ rankingData }) {
  if (!rankingData || rankingData.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
        <h3 className="font-semibold text-lg mb-2 text-gray-900">Ranking Kinerja</h3>
        <p className="text-gray-500">Belum ada data untuk ditampilkan.</p>
      </div>
    );
  }

  // Fungsi untuk mendapatkan ikon piala berdasarkan peringkat
  const getTrophyIcon = (rank) => {
    switch(rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return `${rank}`;
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
      <h3 className="font-semibold text-lg mb-4 text-gray-900">Ranking Kinerja</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {rankingData.map((rank, index) => (
          <div key={index} className="bg-gray-300 p-3 rounded-lg flex items-center">
            <div className="text-2xl font-bold mr-3">
              {getTrophyIcon(index + 1)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{rank.nama}</p>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-green-600">Terkirim: {rank.persenTerkirim}</span>
                <span className="text-red-600">Gagal: {rank.persenGagal}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}