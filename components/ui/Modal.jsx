import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
  showFooter = true,   // 🚀 tambahkan opsi ini
}) {
  const ref = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose?.();
    }
    if (open) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onKey);
      setTimeout(() => {
        const el = ref.current?.querySelector('button, input, [tabindex]');
        el?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const sizeClass = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' }[size];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.18 } }}
            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.14 } }}
            role="dialog"
            aria-modal="true"
          >
            <div
              ref={ref}
              className={`w-full ${sizeClass} bg-white rounded-2xl shadow-lg ring-1 ring-slate-900/5 overflow-hidden`}
            >
              {/* Header */}
              <header className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              </header>

              {/* Body */}
              <div className="p-6">{children}</div>

              {/* Footer opsional */}
              {showFooter && (
                <footer className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-md text-sm bg-gray-200 hover:bg-gray-300"
                  >
                    Batal
                  </button>
                  <button className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm hover:from-blue-500 hover:to-indigo-600">
                    Simpan
                  </button>
                </footer>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
