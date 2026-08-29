import React from 'react';
import { Building } from '../../types';
import { X, FileText, ShieldCheck, MapPin, Building2, Download } from 'lucide-react';

interface DeedViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  building: Building;
}

export const DeedViewerModal: React.FC<DeedViewerModalProps> = ({
  isOpen,
  onClose,
  building,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 to-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base leading-tight">Yönetici Tapu & Kimlik Doğrulaması</h3>
              <p className="text-[11px] text-emerald-300">
                Bina ID: <span className="font-mono font-bold">{building.id}</span> - Onaylı Kayıt
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4">
          
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Resmi Doğrulama Bilgisi:</p>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Bina yöneticisi <strong>{building.managerName}</strong> sisteme kayıt olurken bu tapu belgesini ibraz etmiş ve sistem tarafından <strong>{building.id}</strong> kodlu Bina ID'si üretilmiştir.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Bina Adı & Daire Sayısı:</span>
              <span className="font-bold text-slate-800">{building.name} ({building.totalApartments} Daire)</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Adres / Konum:</span>
              <span className="font-medium text-slate-800 truncate block">{building.district} / {building.city}</span>
            </div>
          </div>

          {/* Deed Image */}
          <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center min-h-[260px] max-h-[380px] relative">
            <img
              src={building.deedPhotoUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80'}
              alt="Tapu Belgesi"
              className="max-h-[360px] w-auto max-w-full object-contain mx-auto"
            />
            <div className="absolute top-3 left-3 bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Tapu Onaylandı
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Tamam
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
