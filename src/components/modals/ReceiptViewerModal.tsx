import React from 'react';
import { ExpenseRecord, DuesRecord } from '../../types';
import { X, Receipt, Calendar, User, Tag, Download, CheckCircle2 } from 'lucide-react';

interface ReceiptViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: ExpenseRecord | null;
  dues?: DuesRecord | null;
}

export const ReceiptViewerModal: React.FC<ReceiptViewerModalProps> = ({
  isOpen,
  onClose,
  expense,
  dues,
}) => {
  if (!isOpen || (!expense && !dues)) return null;

  const imageUrl = expense ? expense.receiptPhotoUrl : dues?.receiptImageUrl;
  const title = expense ? expense.title : `${dues?.residentName} - ${dues?.month} Aidat Dekontu`;
  const amount = expense ? expense.amount : dues?.amount;
  const date = expense ? expense.date : (dues?.paidAt ? new Date(dues.paidAt).toLocaleDateString('tr-TR') : 'Belirtilmedi');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base leading-tight">{title}</h3>
              <p className="text-[11px] text-slate-300">
                {expense ? `Fiş / Fatura No: ${expense.receiptNumber || 'Kayıtlı'}` : 'Banka Havale / FAST Dekontu'}
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
          
          {/* Metadata pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Tutar:</span>
              <span className="text-base font-black text-emerald-700">{amount?.toLocaleString('tr-TR')} ₺</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Tarih:</span>
              <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {date}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">
                {expense ? 'Kategori / Ekleyen:' : 'Daire / Sakin:'}
              </span>
              <span className="font-bold text-slate-800 block truncate mt-0.5">
                {expense ? `${expense.category}` : `Daire ${dues?.apartmentNo} - ${dues?.residentName}`}
              </span>
            </div>
          </div>

          {/* Description if any */}
          {expense?.description && (
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-950">
              <span className="font-bold block mb-0.5">Açıklama & Harcama Nedeni:</span>
              <p className="text-slate-700 leading-relaxed">{expense.description}</p>
            </div>
          )}

          {dues?.note && (
            <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-blue-950">
              <span className="font-bold block mb-0.5">Ödeme Açıklaması:</span>
              <p className="text-slate-700 leading-relaxed">{dues.note}</p>
            </div>
          )}

          {/* Image Container with high contrast border */}
          <div className="border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center min-h-[260px] max-h-[420px] relative group">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="max-h-[400px] w-auto max-w-full object-contain mx-auto"
              />
            ) : (
              <div className="text-center p-6 text-slate-400">
                <Receipt className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Görsel yüklenmedi (Elden veya doğrudan IBAN kontrolü ile yapıldı)</p>
              </div>
            )}
            
            {imageUrl && (
              <a
                href={imageUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold shadow-lg backdrop-blur flex items-center gap-1.5 border border-white/20 transition-all opacity-90 group-hover:opacity-100"
              >
                <Download className="w-3.5 h-3.5" />
                Tam Boyutta Aç
              </a>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Sistemde Onaylı Kayıt
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition-colors"
            >
              Kapat
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
