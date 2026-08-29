import React, { useState } from 'react';
import { 
  Building, 
  User, 
  DuesRecord 
} from '../../types';
import { 
  Building2, 
  KeyRound, 
  Share2, 
  Copy, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  FileText, 
  CreditCard, 
  Users, 
  Edit3, 
  Save, 
  Sparkles,
  Home
} from 'lucide-react';

interface BuildingInfoViewProps {
  building: Building;
  currentUser: User | null;
  users: User[];
  dues: DuesRecord[];
  onOpenShareModal: () => void;
  onOpenDeedModal: () => void;
  onUpdateBuilding: (updates: Partial<Building>) => void;
}

export const BuildingInfoView: React.FC<BuildingInfoViewProps> = ({
  building,
  currentUser,
  users,
  dues,
  onOpenShareModal,
  onOpenDeedModal,
  onUpdateBuilding,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit fields for manager
  const [editName, setEditName] = useState(building.name);
  const [editIban, setEditIban] = useState(building.iban);
  const [editBank, setEditBank] = useState(building.bankName);
  const [editDues, setEditDues] = useState(building.monthlyDuesAmount);
  const [editAddress, setEditAddress] = useState(building.address);

  const copyId = () => {
    navigator.clipboard.writeText(building.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSave = () => {
    onUpdateBuilding({
      name: editName,
      iban: editIban,
      bankName: editBank,
      monthlyDuesAmount: Number(editDues),
      address: editAddress,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-bold uppercase tracking-wider border border-slate-200">
              Bina Bilgisi & Sakinler
            </span>
            <span className="text-xs font-semibold text-emerald-700 font-mono">
              ID: {building.id}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            {building.name} Bilgileri
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Bina kodu paylaşımı, sakinler listesi ve resmi kayıt bilgileri
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser?.role === 'yonetici' && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-600" />
              <span>{isEditing ? 'Vazgeç' : 'Bilgileri Düzenle'}</span>
            </button>
          )}

          <button
            onClick={onOpenShareModal}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            Bina ID'sini Sakinlere Gönder
          </button>
        </div>
      </div>

      {/* 1. Building ID & Verification Hero */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Building ID Card */}
        <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 text-white p-5 rounded-2xl border border-emerald-800/40 shadow-md flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4" />
                Binanızın Özel Kodu (Bina ID)
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                Tapu Onaylı
              </span>
            </div>

            <div className="p-3 bg-white/10 rounded-xl border border-white/15 backdrop-blur flex items-center justify-between gap-3">
              <span className="text-2xl sm:text-3xl font-mono font-black tracking-widest text-emerald-300">
                {building.id}
              </span>
              <button
                id="btn-copy-id-info-view"
                onClick={copyId}
                className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-sm"
              >
                {copiedId ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedId ? 'Kopyalandı' : 'Kodu Kopyala'}
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Bina sakinleriniz uygulamayı indirip <strong>"Bina Sakini Olarak Hesap Aç"</strong> dediklerinde bu kodu girerek binanıza dahil olurlar.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-400">Yönetici: <strong>{building.managerName}</strong></span>
            <button
              onClick={onOpenDeedModal}
              className="text-emerald-300 hover:text-white underline font-semibold flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" /> Tapu Belgesini Gör
            </button>
          </div>
        </div>

        {/* Building Financial & Bank Info */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              Aidat ve Hesap Detayları
            </span>
            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Aylık Aidat: {building.monthlyDuesAmount} ₺
            </span>
          </div>

          {isEditing ? (
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Bina Adı</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Banka Adı</label>
                  <input
                    type="text"
                    value={editBank}
                    onChange={(e) => setEditBank(e.target.value)}
                    className="w-full p-2 bg-slate-50 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Aylık Aidat (₺)</label>
                  <input
                    type="number"
                    value={editDues}
                    onChange={(e) => setEditDues(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">IBAN Numarası</label>
                <input
                  type="text"
                  value={editIban}
                  onChange={(e) => setEditIban(e.target.value)}
                  className="w-full p-2 bg-slate-50 border rounded-lg font-mono"
                />
              </div>
              <button
                onClick={handleSave}
                className="w-full py-2 bg-emerald-600 text-white font-bold rounded-lg flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Değişiklikleri Kaydet
              </button>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Adres:</span>
                <span className="font-bold text-slate-800 text-right">{building.address}, {building.district}/{building.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Toplam Daire:</span>
                <span className="font-bold text-slate-800">{building.totalApartments} Daire</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Banka & Şube:</span>
                <span className="font-bold text-slate-800">{building.bankName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">IBAN:</span>
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                  {building.iban}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hesap Sahibi:</span>
                <span className="font-medium text-slate-800">{building.ibanOwner}</span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 2. Daireler ve Sakinler Listesi (1 - 10) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <h2 className="font-extrabold text-sm sm:text-base text-slate-900">
              Bina Daire ve Sakin Listesi ({building.totalApartments} Daire)
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {building.name} Fihristi
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
          {Array.from({ length: building.totalApartments }).map((_, index) => {
            const apartmentNo = index + 1;
            const floor = Math.ceil(apartmentNo / 2);
            const user = users.find(u => u.apartmentNo === apartmentNo);
            const dueStatus = dues.find(d => d.apartmentNo === apartmentNo)?.status;

            return (
              <div
                key={apartmentNo}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-800 font-black text-sm flex items-center justify-center border border-slate-300 shrink-0">
                    {apartmentNo}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                        {user ? user.name : `Daire ${apartmentNo} Sakini`}
                      </span>
                      {user?.role === 'yonetici' && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                          Yönetici
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      Kat {floor} • {user?.phone || 'Kayıtlı'}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {dueStatus === 'odendi' && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Ödendi
                    </span>
                  )}
                  {dueStatus === 'onay_bekliyor' && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      Onayda
                    </span>
                  )}
                  {dueStatus === 'odenecek' && (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                      Ödenmedi
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
