import React from 'react';

interface HistoryItem {
  no: number;
  date: string;
}

interface TabelRiwayatProps {
  data: HistoryItem[];
  onViewDetails: (id: number) => void;
}

export const TabelRiwayat: React.FC<TabelRiwayatProps> = ({ data, onViewDetails }) => {
  return (
    <div className="w-full max-w-2xl bg-white p-6 rounded-xl">
      <table className="w-full border-collapse">
        {/* Header Tabel */}
        <thead>
          <tr className="text-gray-900 font-bold text-lg">
            <th className="py-4 text-left w-16">No</th>
            <th className="py-4 text-left">Waktu Pengerjaan</th>
            <th className="py-4 text-right pr-2">Aksi</th>
          </tr>
        </thead>
        
        {/* Isi Tabel */}
        <tbody className="text-gray-700 text-base">
          {data.map((item) => (
            <tr 
              key={item.no} 
              className="border-t border-gray-200 hover:bg-gray-50/50 transition-colors duration-150"
            >
              {/* Kolom Nomor */}
              <td className="py-4 text-left font-normal">{item.no}.</td>
              
              {/* Kolom Tanggal */}
              <td className="py-4 text-left font-normal tracking-wide">{item.date}</td>
              
              {/* Kolom Aksi Tombol Mata */}
              <td className="py-4 text-right">
                <button
                  onClick={() => onViewDetails(item.no)}
                  className="inline-flex items-center justify-center text-blue-500 hover:text-blue-600 p-1.5 rounded-full hover:bg-blue-50 transition-all duration-200 focus:outline-none"
                  aria-label={`Lihat detail nomor ${item.no}`}
                >
                  {/* Icon Mata (Lucide/Heroicons Style) */}
                  <svg 
                    className="w-6 h-6 stroke-current" 
                    fill="none" 
                    strokeWidth="2.5" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
