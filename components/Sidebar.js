// components/Sidebar.js
import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Tombol untuk membuka di mobile */}
      <button onClick={() => setIsOpen(!isOpen)} className="fixed top-4 left-4 z-40 p-2 bg-white border border-gray-200 shadow rounded-md lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      {/* Overlay di mobile */}
      <div onClick={() => setIsOpen(false)} className={`fixed inset-0 bg-black z-30 transition-opacity lg:hidden ${isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`}></div>

      {/* Konten Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 w-64 z-40 transform transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-600 text-white font-bold text-xl px-3 py-2 rounded-lg mr-3">
              SP
            </div>
            <h2 className="text-xl font-bold text-gray-900">STRESS Project</h2>
          </div>
        </div>
        <nav className="mt-4">
          <a href="#" className="flex items-center px-4 py-3 text-gray-700 bg-blue-50 border-l-4 border-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Dashboard
          </a>
        </nav>
      </aside>
    </>
  );
}