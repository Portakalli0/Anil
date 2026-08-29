import React, { useState } from 'react';
import { 
  Building, 
  User, 
  DuesRecord, 
  PaymentStatus 
} from '../../types';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Copy, 
  Send, 
  Search, 
  Filter, 
  Check, 
  X, 
  Receipt, 
  Share2, 
  MessageSquare, 
  Sparkles, 
  ChevronRight,
  TrendingUp,
  Building2,
  Phone,
  Calendar,
  Wallet,
  Users
} from 'lucide-react';

interface DuesViewProps {
  building: Building;
  currentUser: User | null;
  dues: DuesRecord[];
  onOpenPayModal: (record: DuesRecord) => void;
  onOpenReceiptModal: (record: DuesRecord) => void;
  onConfirmPayment: (recordId: string, approved: boolean) => void;
  onMarkAsPaidDirectly: (recordId: string) => void;
  onOpenShareModal: () => void;
  onOpenAuth: () => void;
}

export const DuesView: React.FC<DuesViewProps> = ({
  building,
  currentUser,
  dues,
  onOpenPayModal,
  onOpenReceiptModal,
  onConfirmPayment,
  onMarkAsPaidDirectly,
  onOpenShareModal,
  onOpenAuth,
}) => {
  const [selectedMonth, setSelectedMonth] = useState('Ağustos 2026');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedIban, setCopiedIban] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);

  // Filter dues by month
  const monthDues = dues.filter(d => d.month === selectedMonth);

  // Statistics calculation
  const totalApartments = building.totalApartments || monthDues.length;
  const paidRecords = monthDues.filter(d => d.status === 'odendi');
  const pendingRecords = monthDues.filter(d => d.status === 'onay_bekliyor');
  const unpaidRecords = monthDues.filter(d => d.status === 'odenecek');

  const totalExpectedAmount = totalApartments * building.monthlyDuesAmount;
  const totalCollectedAmount = paidRecords.reduce((sum, d) => sum + d.amount, 0);
  const collectionRate = totalExpectedAmount > 0 ? Math.round((totalCollectedAmount / totalExpectedAmount) * 100) : 0;

  // Filter list
  const filteredDues = monthDues.filter(d => {
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'odendi' && d.status === 'odendi') ||
      (filterStatus === 'odenecek' && d.status === 'odenecek') ||
      (filterStatus === 'onay_bekliyor' && d.status === 'onay_bekliyor');

    const matchesSearch = 
      d.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.apartmentNo.toString().includes(searchQuery) ||
      (d.note && d.note.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  // Current user's own apartment record
  const myApartmentRecord = currentUser 
    ? monthDues.find(d => d.apartmentNo === currentUser.apartmentNo)
    : null;

  const copyIban = () => {
    navigator.clipboard.writeText(building.iban.replace(/\s+/g, ''));
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  const copySampleDescription = () => {
    const text = currentUser 
      ? `Daire ${currentUser.apartmentNo} ${currentUser.name} ${selectedMonth} Aidatı`
      : `Daire No - Ad Soyad - ${selectedMonth} Aidatı`;
    navigator.clipboard.writeText(text);
    setCopiedDesc(true);
    setTimeout(() => setCopiedDesc(false), 2000);
  };

  const sendWhatsAppReminder = (record: DuesRecord) => {
    const message = `Merhaba ${record.residentName},\n\n${building.name} binamızın ${record.month} ayı aidatı (${record.amount} TL) henüz ödenmemiş görünmektedir.\n\n💳 IBAN: ${building.iban}\nAlıcı: ${building.ibanOwner}\n\nÖdeme yaptıktan sonra Aidatım uygulamasından veya bana dekontu iletebilirsiniz. Kolaylıklar dileriz.`;
    const url = `https://api.whatsapp.com/send?phone=${record.residentPhone ? record.residentPhone.replace(/\D/g, '') : ''}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const sendAllUnpaidReminders = () => {
    const count = unpaidRecords.length;
    const names = unpaidRecords.map(u => `Daire ${u.apartmentNo} (${u.residentName})`).join('\n- ');
    const text = `📢 *${building.name} Aidat Hatırlatması (${selectedMonth})*\n\nDeğerli sakinlerimiz, ayın aidatını henüz ödemeyen dairelerimiz:\n- ${names}\n\n💳 IBAN: ${building.iban}\nLütfen ödemelerinizi tamamlayıp uygulamadan bildiriniz.`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header & Month Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider border border-emerald-200">
              Ana Sayfa
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Bina Kodu: <strong className="text-slate-800 font-mono">{building.id}</strong>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            {building.name} Aidat Takibi
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Makbuzsuz, zahmetsiz IBAN ile ödeme ve şeffaf tahsilat listesi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-bold">
            <Calendar className="w-4 h-4 text-slate-500 ml-1" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent font-bold text-slate-800 border-none outline-none cursor-pointer pr-2"
            >
              <option value="Ağustos 2026">Ağustos 2026</option>
              <option value="Temmuz 2026">Temmuz 2026</option>
              <option value="Haziran 2026">Haziran 2026</option>
            </select>
          </div>

          <button
            onClick={onOpenShareModal}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-colors flex items-center gap-1.5"
            title="Bina ID'sini Sakinlerle Paylaş"
          >
            <Share2 className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Bina ID Paylaş</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Collected */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Toplanan Aidat</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-lg sm:text-2xl font-black text-emerald-700">
              {totalCollectedAmount.toLocaleString('tr-TR')} ₺
            </span>
            <span className="text-[11px] text-slate-500 block font-medium">
              Hedef: {totalExpectedAmount.toLocaleString('tr-TR')} ₺ (%{collectionRate})
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(collectionRate, 100)}%` }}
            />
          </div>
        </div>

        {/* Paid Apartments */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Ödeyen Daireler</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-2xl font-black text-slate-900">{paidRecords.length}</span>
              <span className="text-xs font-bold text-slate-400">/ {totalApartments} Daire</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold block">
              Aidatını eksiksiz ödedi
            </span>
          </div>
        </div>

        {/* Pending Approval */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Onay Bekleyen</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-2xl font-black text-amber-700">{pendingRecords.length}</span>
              <span className="text-xs font-bold text-slate-400">Daire</span>
            </div>
            <span className="text-[11px] text-amber-700 font-semibold block">
              Dekont yüklendi, onay bekliyor
            </span>
          </div>
        </div>

        {/* Unpaid */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Ödemeyen / Kalan</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-2xl font-black text-rose-700">{unpaidRecords.length}</span>
              <span className="text-xs font-bold text-slate-400">Daire</span>
            </div>
            <span className="text-[11px] text-rose-700 font-semibold block">
              Kalan Tutar: {(unpaidRecords.length * building.monthlyDuesAmount).toLocaleString('tr-TR')} ₺
            </span>
          </div>
        </div>

      </div>

      {/* 3. IBAN Bilgisi & Kolay Havale Kartı */}
      <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-lg border border-emerald-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CreditCard className="w-4 h-4" />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                Binanın Resmi Aidat Hesabı ({building.bankName})
              </span>
            </div>

            <div>
              <p className="text-xs text-slate-300">
                Hesap Sahibi: <strong className="text-white">{building.ibanOwner}</strong>
              </p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="font-mono text-sm sm:text-lg font-black tracking-wider text-white bg-white/10 px-3 py-1 rounded-xl border border-white/20 select-all">
                  {building.iban}
                </span>
                <button
                  id="btn-copy-iban-hero"
                  onClick={copyIban}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1 shadow-xs"
                >
                  {copiedIban ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedIban ? 'Kopyalandı!' : 'IBAN Kopyala'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300 pt-1">
              <span className="text-emerald-400 font-bold">Önemli:</span>
              <span>Havale açıklama kısmına daire no ve adınızı yazınız.</span>
              <button
                onClick={copySampleDescription}
                className="text-xs font-bold text-emerald-300 hover:text-white underline ml-1"
              >
                {copiedDesc ? '✓ Açıklama Kopyalandı' : 'Örnek Açıklamayı Kopyala'}
              </button>
            </div>
          </div>

          {/* Quick Pay Action Card for current user / resident */}
          <div className="p-4 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-xs flex flex-col justify-between gap-3 min-w-[260px]">
            <div>
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                {currentUser ? `Daire ${currentUser.apartmentNo} (${currentUser.name})` : 'Dairenizin Durumu:'}
              </span>
              
              {myApartmentRecord ? (
                <div className="mt-1 flex items-center gap-2">
                  {myApartmentRecord.status === 'odendi' && (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {selectedMonth} Aidatı Ödendi
                    </span>
                  )}
                  {myApartmentRecord.status === 'onay_bekliyor' && (
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Dekont Onay Bekliyor
                    </span>
                  )}
                  {myApartmentRecord.status === 'odenecek' && (
                    <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Ödenmedi ({building.monthlyDuesAmount} ₺)
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-200 mt-1">
                  Aylık Aidat: <strong className="text-white">{building.monthlyDuesAmount} ₺</strong>
                </p>
              )}
            </div>

            {myApartmentRecord ? (
              myApartmentRecord.status === 'odendi' ? (
                <button
                  onClick={() => onOpenReceiptModal(myApartmentRecord)}
                  className="w-full py-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Receipt className="w-3.5 h-3.5" /> Dekontumu Görüntüle
                </button>
              ) : (
                <button
                  id="btn-resident-quick-pay"
                  onClick={() => onOpenPayModal(myApartmentRecord)}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Aidatımı Ödedim (Dekont Yükle)
                </button>
              )
            ) : (
              <button
                onClick={onOpenAuth}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
              >
                Giriş Yaparak Aidatını Bildir
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 4. Kim Ödedi / Kim Ödemedi Tablosu & Arama */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
          
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              Kim Ödedi / Kim Ödemedi Listesi ({selectedMonth})
            </h2>
            <p className="text-xs text-slate-500">
              Tüm dairelerin ödeme durumu, makbuz ve onay takibi
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            
            {/* Search Input */}
            <div className="relative min-w-[180px] flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Daire No veya Sakin Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center bg-slate-200/80 p-1 rounded-lg text-xs font-bold">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterStatus === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tümü ({monthDues.length})
              </button>
              <button
                onClick={() => setFilterStatus('odendi')}
                className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                  filterStatus === 'odendi' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600 hover:text-emerald-700'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Ödeyenler ({paidRecords.length})
              </button>
              <button
                onClick={() => setFilterStatus('onay_bekliyor')}
                className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                  filterStatus === 'onay_bekliyor' ? 'bg-white text-amber-800 shadow-2xs' : 'text-slate-600 hover:text-amber-700'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Onay ({pendingRecords.length})
              </button>
              <button
                onClick={() => setFilterStatus('odenecek')}
                className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                  filterStatus === 'odenecek' ? 'bg-white text-rose-800 shadow-2xs' : 'text-slate-600 hover:text-rose-700'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                Kalan ({unpaidRecords.length})
              </button>
            </div>

            {/* Manager WhatsApp Broadcast Button */}
            {currentUser?.role === 'yonetici' && unpaidRecords.length > 0 && (
              <button
                id="btn-broadcast-reminder"
                onClick={sendAllUnpaidReminders}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                title="Ödemeyen tüm dairelere toplu WhatsApp hatırlatması gönder"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Toplu Hatırlatma Gönder</span>
              </button>
            )}

          </div>
        </div>

        {/* Table Records */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Daire</th>
                <th className="py-3 px-4">Sakin Adı</th>
                <th className="py-3 px-4">Aidat Tutarı</th>
                <th className="py-3 px-4">Ödeme Durumu</th>
                <th className="py-3 px-4">Ödeme Tarihi / Yöntem</th>
                <th className="py-3 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                    Arama kriterlerinize uygun daire kaydı bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredDues.map((record) => {
                  const isMyApartment = currentUser?.apartmentNo === record.apartmentNo;
                  return (
                    <tr 
                      key={record.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isMyApartment ? 'bg-emerald-50/40 font-semibold' : ''
                      }`}
                    >
                      {/* Apartment No & Floor */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-800 font-black text-xs flex items-center justify-center border border-slate-200 shadow-2xs">
                            {record.apartmentNo}
                          </span>
                          {isMyApartment && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Benim Dairem
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Resident Name & Phone */}
                      <td className="py-3 px-4">
                        <div>
                          <span className="font-bold text-slate-900 block">{record.residentName}</span>
                          {record.residentPhone && (
                            <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                              <Phone className="w-3 h-3" /> {record.residentPhone}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {record.amount.toLocaleString('tr-TR')} ₺
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4">
                        {record.status === 'odendi' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ödendi
                          </span>
                        )}
                        {record.status === 'onay_bekliyor' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                            <Clock className="w-3.5 h-3.5 text-amber-600" /> Onay Bekliyor
                          </span>
                        )}
                        {record.status === 'odenecek' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Ödenmedi
                          </span>
                        )}
                      </td>

                      {/* Payment Date & Note */}
                      <td className="py-3 px-4">
                        {record.status === 'odendi' ? (
                          <div>
                            <span className="text-slate-700 font-medium block">
                              {record.paidAt ? new Date(record.paidAt).toLocaleDateString('tr-TR') : 'Bu Ay'}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[160px]">
                              {record.paymentMethod === 'IBAN_HAVALE' ? 'IBAN / FAST Havale' : 'Elden Makbuz'}
                            </span>
                          </div>
                        ) : record.status === 'onay_bekliyor' ? (
                          <div>
                            <span className="text-amber-800 font-semibold block">Dekont İletildi</span>
                            <span className="text-[10px] text-slate-500 block truncate max-w-[150px]">
                              {record.note || 'Banka onayı bekleniyor'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Henüz ödeme yapılmadı</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Receipt preview if attached */}
                          {record.receiptImageUrl && (
                            <button
                              id={`btn-view-receipt-${record.apartmentNo}`}
                              onClick={() => onOpenReceiptModal(record)}
                              className="p-1.5 px-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] border border-blue-200 transition-colors flex items-center gap-1"
                              title="Dekont / Fiş Görselini İncele"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                              <span>Dekont</span>
                            </button>
                          )}

                          {/* Manager Approval Actions */}
                          {currentUser?.role === 'yonetici' ? (
                            record.status === 'onay_bekliyor' ? (
                              <div className="flex items-center gap-1">
                                <button
                                  id={`btn-approve-dues-${record.apartmentNo}`}
                                  onClick={() => onConfirmPayment(record.id, true)}
                                  className="p-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs flex items-center gap-1"
                                  title="Ödemeyi Onayla"
                                >
                                  <Check className="w-3.5 h-3.5" /> Onayla
                                </button>
                                <button
                                  onClick={() => onConfirmPayment(record.id, false)}
                                  className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors"
                                  title="Reddet"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : record.status === 'odenecek' ? (
                              <div className="flex items-center gap-1">
                                <button
                                  id={`btn-mark-paid-${record.apartmentNo}`}
                                  onClick={() => onMarkAsPaidDirectly(record.id)}
                                  className="p-1.5 px-2 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 font-bold text-[11px] border border-slate-200 transition-colors"
                                  title="Ödendi Olarak İşaretle"
                                >
                                  Ödendi Yap
                                </button>
                                <button
                                  onClick={() => sendWhatsAppReminder(record)}
                                  className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                                  title="WhatsApp Hatırlatması Gönder"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] text-emerald-700 font-bold">✓ Onaylı</span>
                            )
                          ) : (
                            // Resident actions
                            isMyApartment && record.status === 'odenecek' && (
                              <button
                                id="btn-resident-table-pay"
                                onClick={() => onOpenPayModal(record)}
                                className="p-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs flex items-center gap-1"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                IBAN ile Öde
                              </button>
                            )
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
