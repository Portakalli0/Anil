import React, { useState } from 'react';
import { 
  Building, 
  User, 
  ExpenseRecord, 
  ExpenseCategory,
  DuesRecord
} from '../../types';
import { 
  Receipt, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Tag, 
  DollarSign, 
  CheckCircle2, 
  Trash2, 
  Eye, 
  ExternalLink,
  ShieldCheck,
  TrendingDown,
  Wallet,
  Building2,
  FileText
} from 'lucide-react';

interface ExpensesViewProps {
  building: Building;
  currentUser: User | null;
  expenses: ExpenseRecord[];
  dues: DuesRecord[];
  onOpenAddExpenseModal: () => void;
  onOpenReceiptModal: (expense: ExpenseRecord) => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  building,
  currentUser,
  expenses,
  dues,
  onOpenAddExpenseModal,
  onOpenReceiptModal,
  onDeleteExpense,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculations
  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalCollectedDues = dues
    .filter(d => d.status === 'odendi')
    .reduce((sum, d) => sum + d.amount, 0);
  
  const netKasaBalance = totalCollectedDues - totalExpenseAmount;

  // Filtered Expenses
  const filteredExpenses = expenses.filter(e => {
    const matchesCat = selectedCategory === 'all' || e.category === selectedCategory;
    const matchesSearch = 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.receiptNumber && e.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header & Quick Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[11px] font-bold uppercase tracking-wider border border-blue-200">
              Şeffaf Kasa & Harcamalar
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {expenses.length} Adet Fiş & Fatura Kaydı
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Bina Harcamaları ve Yüklenen Fişler
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Yöneticinin yüklediği fiş ve faturalarla bina bütçesini şeffafça inceleyin
          </p>
        </div>

        {currentUser?.role === 'yonetici' ? (
          <button
            id="btn-open-add-expense"
            onClick={onOpenAddExpenseModal}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Yeni Harcama & Fiş Yükle
          </button>
        ) : (
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 font-medium block">Tüm harcamalar bina halkına açıktır</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              ✓ Şeffaf Yönetim
            </span>
          </div>
        )}
      </div>

      {/* 2. Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        
        {/* Total Expenses */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Toplam Bina Gideri</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 mt-1 block">
              {totalExpenseAmount.toLocaleString('tr-TR')} ₺
            </span>
            <span className="text-[11px] text-slate-500">
              {expenses.length} adet faturalandırılmış harcama
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        {/* Collected Dues */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Toplanan Aidat Geliri</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-700 mt-1 block">
              {totalCollectedDues.toLocaleString('tr-TR')} ₺
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold">
              Bina sakinlerinden tahsil edilen
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        {/* Current Net Balance */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Kasa Net Bakiyesi</span>
            <span className={`text-xl sm:text-2xl font-black mt-1 block ${netKasaBalance >= 0 ? 'text-blue-700' : 'text-rose-700'}`}>
              {netKasaBalance.toLocaleString('tr-TR')} ₺
            </span>
            <span className="text-[11px] text-slate-500">
              {netKasaBalance >= 0 ? 'Kasa fazlası mevcut' : 'Kasa açığı'}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* 3. Search & Category Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-100 p-2.5 rounded-2xl border border-slate-200">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs font-bold">
          {['all', 'Tadilat & Onarım', 'Temizlik & Hijyen', 'Asansör Bakımı', 'Ortak Elektrik & Su'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-white text-blue-900 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {cat === 'all' ? 'Tüm Harcamalar' : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Fiş, fatura veya iş ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 4. Expenses Grid (Each Card Shows Attached Receipt Photo) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredExpenses.length === 0 ? (
          <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-700 text-sm">Harcama veya fiş kaydı bulunamadı</h3>
            <p className="text-xs text-slate-500 mt-1">Seçili filtreye uygun bir kayıt henüz eklenmemiş.</p>
          </div>
        ) : (
          filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="p-4 border-b border-slate-100 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                      {expense.category}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(expense.date).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                    {expense.title}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-base sm:text-lg font-black text-rose-600 block">
                    -{expense.amount.toLocaleString('tr-TR')} ₺
                  </span>
                  {expense.receiptNumber && (
                    <span className="text-[10px] font-mono text-slate-400 block">
                      {expense.receiptNumber}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body: Description & Receipt Thumbnail */}
              <div className="p-4 flex gap-3.5 items-center">
                
                {/* Receipt Image Thumbnail (Click to zoom/view full modal) */}
                <div 
                  onClick={() => onOpenReceiptModal(expense)}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 border-slate-200 relative group cursor-pointer shrink-0 bg-slate-900"
                  title="Fiş / Fatura Fotoğrafını Büyüt"
                >
                  <img
                    src={expense.receiptPhotoUrl}
                    alt={expense.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Eye className="w-5 h-5 drop-shadow" />
                  </div>
                  <span className="absolute bottom-1 right-1 bg-slate-900/90 text-[9px] font-bold text-white px-1.5 py-0.5 rounded backdrop-blur">
                    Fişi Gör
                  </span>
                </div>

                {/* Description */}
                <div className="flex-1 space-y-1.5">
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {expense.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Yükleyen: <strong>{expense.addedByName}</strong></span>
                  </div>
                </div>

              </div>

              {/* Card Footer Actions */}
              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  id={`btn-view-receipt-card-${expense.id}`}
                  onClick={() => onOpenReceiptModal(expense)}
                  className="font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  Fişi ve Detayları İncele
                </button>

                {currentUser?.role === 'yonetici' && (
                  <button
                    onClick={() => onDeleteExpense(expense.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                    title="Bu harcama kaydını sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
