import React from 'react';
import { 
  Building, 
  User, 
  ActiveView 
} from '../types';
import { 
  X, 
  CreditCard, 
  Receipt, 
  Megaphone, 
  Vote, 
  Building2, 
  Share2, 
  KeyRound, 
  LogOut, 
  UserCheck, 
  FileText,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Home
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  building: Building;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenShareModal: () => void;
  onOpenDeedModal: () => void;
  onSwitchRole: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeView,
  setActiveView,
  building,
  currentUser,
  onOpenAuth,
  onOpenShareModal,
  onOpenDeedModal,
  onSwitchRole,
  onLogout,
}) => {
  if (!isOpen) return null;

  const handleNav = (view: ActiveView) => {
    setActiveView(view);
    onClose();
  };

  const navItems = [
    {
      id: 'aidat_yonetimi' as ActiveView,
      title: '1. Aidat & Ödeme Takibi',
      subtitle: 'Kim ödedi / ödemedi, IBAN ile ödeme',
      icon: CreditCard,
      badge: 'Ana Sayfa',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      id: 'bina_harcamalari' as ActiveView,
      title: '2. Harcamalar & Yüklenen Fişler',
      subtitle: 'Yöneticinin yüklediği fiş ve faturalar',
      icon: Receipt,
      badge: 'Kasa',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      id: 'duyurular' as ActiveView,
      title: '3. Duyurular & Tadilat',
      subtitle: 'Onarım, bakım, su/elektrik ve toplantı',
      icon: Megaphone,
      badge: 'Duyuru',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      id: 'oylamalar' as ActiveView,
      title: '4. Bina İçi Oylama & Seçimler',
      subtitle: 'Yönetici seçimi ve bina yenilik anketleri',
      icon: Vote,
      badge: 'Oylama',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    {
      id: 'bina_bilgileri' as ActiveView,
      title: '5. Bina Bilgileri & Sakinler',
      subtitle: 'Bina ID, daire listesi, tapu belgesi',
      icon: Building2,
      badge: 'Rehber',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-sm sm:max-w-md bg-white shadow-2xl flex flex-col justify-between border-r border-slate-200 animate-in slide-in-from-left duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-900/40">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight">Aidat<span className="text-emerald-400">ım</span></h2>
                  <p className="text-xs text-slate-300 font-medium truncate max-w-[200px]">{building.name}</p>
                </div>
              </div>
              <button
                id="btn-close-sidebar"
                onClick={onClose}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors"
                aria-label="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Building ID Share box in Header */}
            <div className="mt-4 p-3 bg-white/10 rounded-xl border border-white/15 backdrop-blur-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-300 font-medium block">Binanızın Özel Kodu:</span>
                <span className="text-base font-mono font-bold tracking-wider text-emerald-300">{building.id}</span>
              </div>
              <button
                id="btn-sidebar-share-code"
                onClick={() => {
                  onClose();
                  onOpenShareModal();
                }}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5" />
                Sakinlere Gönder
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
            <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Uygulama Menüsü (Sol 3 Çizgi)
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-950 border border-emerald-300 shadow-xs'
                      : 'hover:bg-slate-100 text-slate-700 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-white group-hover:text-emerald-700'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${isActive ? 'text-emerald-900' : 'text-slate-900'}`}>
                          {item.title}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 line-clamp-1 block">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                    <ChevronRight className={`w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all ${isActive ? 'text-emerald-600' : ''}`} />
                  </div>
                </button>
              );
            })}

            {/* Extra Section: Tapu & Doğrulama Belgesi */}
            <div className="pt-3">
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Resmi Belgeler & Güvenlik
              </div>
              <button
                id="btn-sidebar-view-deed"
                onClick={() => {
                  onClose();
                  onOpenDeedModal();
                }}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors flex items-center justify-between border border-dashed border-slate-300 mt-1"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Yönetici Tapu / Kimlik Belgesi</span>
                    <span className="text-[11px] text-slate-500">Kayıt sırasında onaylanan belgeyi incele</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">Onaylı</span>
              </button>
            </div>
          </div>

          {/* Footer: User Status & Switcher */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            {currentUser ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {currentUser.role === 'yonetici' ? '👑 Bina Yöneticisi' : `🏠 Daire ${currentUser.apartmentNo} (Kat ${currentUser.floor})`}
                      </p>
                    </div>
                  </div>

                  <button
                    id="btn-sidebar-logout"
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    title="Çıkış Yap"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Toggle between Manager & Resident */}
                <button
                  id="btn-sidebar-switch-role"
                  onClick={() => {
                    onSwitchRole();
                    onClose();
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300 flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{currentUser.role === 'yonetici' ? 'Sakin Görünümüne Geç (Daire 4)' : 'Yönetici Görünümüne Geç'}</span>
                </button>
              </div>
            ) : (
              <button
                id="btn-sidebar-login"
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                Giriş Yap veya Hesap Oluştur
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
