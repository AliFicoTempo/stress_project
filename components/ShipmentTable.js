// components/ShipmentTable.js
import { useState } from "react";

export default function ShipmentTable({ data, onDelete, onEdit, isAdmin }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [sortConfig, setSortConfig] = useState({ key: 'tanggal', direction: 'descending' });

  const sortedData = [...data].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500 p-8 bg-white border border-gray-200 rounded-xl">Belum ada data untuk ditampilkan.</div>;
  }
  
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "↕";
    if (sortConfig.direction === 'ascending') return "↑";
    return "↓";
  };

  const getPaginationGroup = () => {
    let start = Math.floor((currentPage - 1) / 5) * 5;
    const pageGroup = new Array(Math.min(5, totalPages - start)).fill().map((_, idx) => start + idx + 1);
    return pageGroup;
  };

return (
    <>
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-300 text-black">
            <tr>
              {isAdmin && <th className="p-3 text-center text-xs font-bold uppercase tracking-wider w-[15%]">Nama</th>}
              <th className="p-3 text-center text-xs font-bold uppercase tracking-wider w-[12%]">Tanggal</th>
              <th className="p-3 text-center text-xs font-bold uppercase tracking-wider w-[13%]">Shipment</th>
              <th className="p-3 text-center text-xs font-bold uppercase tracking-wider w-[10%]">Jml Toko</th>
              <th className="p-3 text-center text-xs font-bold uppercase tracking-wider w-[10%]">Terkirim</th>
              <th className="p-3 text-center text-xs font-bold uppercase tracking-wider w-[10%]">Gagal</th>
              <th className="p-3 text-center text-xs font-bold uppercase tracking-wider w-[20%]">Alasan</th>
              <th className="p-3 text-center text-xs font-bold uppercase tracking-wider w-[10%]">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {currentRows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {isAdmin && <td className="p-3 max-w-0 truncate text-gray-500 text-left">{row.nama}</td>}
                <td className="p-3 text-gray-500 text-center">{new Date(row.tanggal).toLocaleDateString("id-ID")}</td>
                <td className="p-3 text-gray-500 text-center">{row.shipment}</td>
                <td className="p-3 text-gray-500 text-center">{row.jumlah}</td>
                <td className="p-3 text-green-500 text-center">{row.terkirim}</td>
                <td className="p-3 font-medium text-yellow-500 text-center">{row.gagal}</td>
                <td className="p-3 max-w-0 truncate text-gray-500 text-left" title={row.alasan}>{row.alasan}</td>
                <td className="p-3 text-center">
                  <div className="flex justify-center space-x-3">
                    <button 
                      onClick={() => onEdit(row)} 
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => onDelete(row.id)} 
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Hapus"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-1">
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1} 
            className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &lt;
          </button>
          
          {getPaginationGroup()[0] > 1 && (
            <>
              <button onClick={() => paginate(1)} className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300">
                1
              </button>
              <span className="px-3 py-2 text-gray-500">...</span>
            </>
          )}
          
          {getPaginationGroup().map(item => (
            <button 
              key={item} 
              onClick={() => paginate(item)} 
              className={`px-3 py-2 rounded ${
                currentPage === item 
                  ? 'bg-blue-600 text-white font-medium' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {item}
            </button>
          ))}
          
          {getPaginationGroup()[getPaginationGroup().length - 1] < totalPages && (
            <>
              <span className="px-3 py-2 text-gray-500">...</span>
              <button onClick={() => paginate(totalPages)} className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300">
                {totalPages}
              </button>
            </>
          )}
          
          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === totalPages} 
            className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &gt;
          </button>
        </div>
      )}
    </>
  );
}