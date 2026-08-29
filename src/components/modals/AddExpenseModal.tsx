import React, { useState } from 'react';
import { ExpenseRecord, ExpenseCategory, User, Building } from '../../types';
import { 
  X, 
  Receipt, 
  Upload, 
  FileCheck, 
  Calendar, 
  Tag, 
  CheckCircle2, 
  Building2,
  DollarSign
} from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  building: Building;
  currentUser: User | null;
  onAddExpense: (expense: Omit<ExpenseRecord, 'id' | 'addedAt'>) => void;
}

const CATEGORIES: ExpenseCategory[] = [
  'Tadilat & Onarım',
  'Temizlik & Hijyen',
  'Asansör Bakımı',
  'Ortak Elektrik & Su',
  'Bahçe & Çevre Düzeni',
  'Güvenlik & Kamera',
  'Yönetim Giderleri',
  'Diğer',
];

const SAMPLE_RECEIPT_PREVIEWS = [
  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
];

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  building,
  currentUser,
  onAddExpense,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<ExpenseCategory>('Tadilat & Onarım');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [description, setDescription] = useState('');
  const [receiptPhotoUrl, setReceiptPhotoUrl] = useState<string>(SAMPLE_RECEIPT_PREVIEWS[0]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setReceiptPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    onAddExpense({
      buildingId: building.id,
      title,
      amount: Number(amount),
      date,
      category,
      receiptNumber: receiptNumber || `FIS-${Math.floor(10000 + Math.random() * 90000)}`,
      receiptPhotoUrl,
      description: description || `${category} kapsamında yapılan bina harcaması.`,
      addedByName: currentUser?.name || 'Bina Yöneticisi',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight">Yeni Harcama & Fiş Yükle</h3>
              <p className="text-[11px] text-slate-300">
                Bina sakinlerinin şeffafça görebileceği fatura veya fiş kaydı
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

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Fiş / Fatura Görseli Yükleme Alanı */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Alınan Fiş / Fatura / Makbuz Fotoğrafı *
            </label>
            <div className="border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-xl p-3.5 bg-blue-50/40 text-center relative transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex items-center justify-center gap-3">
                <img
                  src={receiptPhotoUrl}
                  alt="Fiş Önizleme"
                  className="w-16 h-14 object-cover rounded-lg border border-blue-400 shadow-xs"
                />
                <div className="text-left">
                  <span className="text-xs font-bold text-blue-900 flex items-center gap-1">
                    <FileCheck className="w-4 h-4 text-blue-600" /> Fiş Fotoğrafı Yüklendi
                  </span>
                  <span className="text-[10px] text-slate-500 block">Kendi cihazınızdan fotoğraf seçmek için tıklayın</span>
                </div>
              </div>
            </div>
          </div>

          {/* Title & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Harcama Başlığı / İşin Adı *
              </label>
              <input
                type="text"
                required
                placeholder="Örn: Asansör Yıllık MMO Bakımı"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tutar (₺) *
              </label>
              <input
                type="number"
                required
                min={1}
                placeholder="1850"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Harcama Tarihi
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Receipt Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Fiş / Fatura Numarası (Opsiyonel)
            </label>
            <input
              type="text"
              placeholder="Örn: FAT-2026-8941 veya Fiş No"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Detaylı Açıklama (Bina halkı ne için para harcandığını görsün)
            </label>
            <textarea
              rows={3}
              placeholder="Örn: Kone yetkili servisi geldi, halatlar yağlandı ve 5. kat butonu onarıldı."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              id="btn-submit-add-expense"
              className="w-2/3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 transition-colors flex items-center justify-center gap-1.5"
            >
              <Receipt className="w-3.5 h-3.5" />
              Fişi Kaydet ve Yayınla
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
