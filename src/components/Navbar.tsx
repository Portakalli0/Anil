import React from 'react';
import { 
  Building, 
  User, 
  ActiveView 
} from '../types';
import { 
  Menu, 
  Building2, 
  CreditCard, 
  Receipt, 
  Megaphone, 
  Vote, 
  Info, 
  LogOut, 
  Share2, 
  ShieldCheck, 
  UserCircle2, 
  KeyRound,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  building: Building;
  currentUser: User | null;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onOpenSidebar: () => void;
  onOpenAuth: () => void;
  onOpenShareModal: () => void;
  onSwitchRole: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  building,
  currentUser,
  activeView,
  setActiveView,
  onOpenSidebar,
  onOpenAuth,
  onOpenShareModal,
  onSwitchRole,
  onLogout,
}) => {
  const getViewTitle = () => {
    switch (activeView) {
      case 'aidat_yonetimi':
        return 'Aidat & Ödeme Takibi';
      case 'bina_harcamalari':
        return 'Bina Harcamaları & Fişler';
      case 'duyurular':
        return 'Duyurular & Tadilat';
      case 'oylamalar':
        return 'Bina İçi Oylama & Seçimler';
      case 'bina_bilgileri':
        return 'Bina Bilgisi & Sakinler';
      default:
        return 'Aidatım';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2">
          
          {/* Left: 3-line Menu Button & App Brand */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              id="btn-open-sidebar"
              onClick={onOpenSidebar}
              className="p-2.5 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 active:bg-emerald-100 transition-colors border border-slate-200/80 shadow-2xs flex items-center justify-center"
              aria-label="Menüyü Aç"
              title="Menüyü Aç (Sol Üst 3 Çizgi)"
            >
              <Menu className="w-5 h-5 text-slate-800" />
            </button>

            <div 
              onClick={() => setActiveView('aidat_yonetimi')}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="hidden xs:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 font-sans">
                    Aidat<span className="text-emerald-600">ım</span>
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Bina Yönetimi
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium truncate max-w-[150px] sm:max-w-[220px]">
                  {building.name}
                </p>
              </div>
            </div>
          </div>

          {/* Center View Title (Desktop Pill) */}
          <div className="hidden md:flex items-center bg-slate-100/90 rounded-full p-1 border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveView('aidat_yonetimi')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeView === 'aidat_yonetimi' 
                  ? 'bg-white text-emerald-700 shadow-xs font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              Aidat
            </button>
            <button
              onClick={() => setActiveView('bina_harcamalari')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeView === 'bina_harcamalari' 
                  ? 'bg-white text-emerald-700 shadow-xs font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              Harcama & Fişler
            </button>
            <button
              onClick={() => setActiveView('duyurular')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeView === 'duyurular' 
                  ? 'bg-white text-emerald-700 shadow-xs font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              Duyurular
            </button>
            <button
              onClick={() => setActiveView('oylamalar')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeView === 'oylamalar' 
                  ? 'bg-white text-emerald-700 shadow-xs font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Vote className="w-3.5 h-3.5" />
              Oylama
            </button>
          </div>

          {/* Right: Building ID, Role Tag, Switch Profile & User */}
          <div className="flex items-center gap-2">
            
            {/* Building ID Badge with Quick Share */}
            <button
              id="btn-share-building-id"
              onClick={onOpenShareModal}
              title="Bina ID'sini Sakinlerle Paylaş (WhatsApp / Kopyala)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors text-xs font-bold shadow-2xs"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Bina ID:</span>
              <span className="font-mono bg-white px-1.5 py-0.5 rounded text-emerald-700 border border-emerald-200 text-[11px]">
                {building.id}
              </span>
              <Share2 className="w-3.5 h-3.5 text-emerald-600 ml-0.5" />
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* Fast Role Switcher (Manager <-> Resident) for easy live testing */}
                <button
                  id="btn-switch-role"
                  onClick={onSwitchRole}
                  title="Yönetici ve Sakin görünümü arasında hızlıca geçiş yap"
                  className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border shadow-2xs ${
                    currentUser.role === 'yonetici'
                      ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                      : 'bg-blue-50 text-blue-900 border-blue-300 hover:bg-blue-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {currentUser.role === 'yonetici' ? '👑 Yönetici Modu' : '🏠 Sakin Modu (Daire ' + currentUser.apartmentNo + ')'}
                  </span>
                  <span className="text-[10px] text-slate-500 underline ml-0.5">Değiştir</span>
                </button>

                {/* User Profile avatar/badge */}
                <div className="flex items-center gap-2 pl-1">
                  <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center text-slate-700 font-bold text-xs">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      currentUser.name.charAt(0)
                    )}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[110px]">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {currentUser.role === 'yonetici' ? 'Yönetici' : `Daire ${currentUser.apartmentNo}`}
                    </p>
                  </div>
                </div>

                <button
                  id="btn-logout"
                  onClick={onLogout}
                  title="Çıkış Yap"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="btn-nav-login"
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <UserCircle2 className="w-4 h-4" />
                <span>Giriş Yap</span>
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Mobile Active View bar */}
      <div className="md:hidden border-t border-slate-200/70 bg-slate-50/90 px-4 py-1.5 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          {getViewTitle()}
        </span>
        {currentUser && (
          <button 
            onClick={onSwitchRole}
            className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
          >
            {currentUser.role === 'yonetici' ? '👑 Yönetici' : `🏠 Daire ${currentUser.apartmentNo}`} (Değiştir)
          </button>
        )}
      </div>
    </header>
  );
};
