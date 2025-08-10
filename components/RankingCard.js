// components/RankingCard.js
export default function RankingCard({ rankingData }) {
  if (!rankingData || rankingData.length === 0) {
    return (
        <div className="bg-white/10 p-4 rounded-xl shadow-lg">
            <h3 className="font-semibold text-lg mb-2">Ranking Kinerja</h3>
            <p className="text-gray-400">Belum ada data untuk ditampilkan.</p>
        </div>
    );
  }

  return (
    <div className="bg-white/10 p-4 rounded-xl shadow-lg">
      <h3 className="font-semibold text-lg mb-3">Ranking Kinerja</h3>
      <div className="space-y-3">
        {rankingData.map((rank, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-800/50 p-2 rounded-lg">
            <div className="flex items-center">
              <span className="font-bold text-lg mr-3">{index + 1}</span>
              <div>
                <p className="font-semibold">{rank.nama}</p>
                <p className="text-xs text-gray-400">Terkirim: <span className="text-green-400">{rank.persenTerkirim}</span> | Gagal: <span className="text-red-400">{rank.persenGagal}</span></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}