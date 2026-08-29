import React, { useState } from 'react';
import { 
  Building, 
  User 
} from '../../types';
import { AppStorage } from '../../services/storage';
import { 
  X, 
  Building2, 
  UserCircle2, 
  KeyRound, 
  Lock, 
  Upload, 
  FileCheck, 
  CheckCircle2, 
  AlertCircle, 
  Share2, 
  Copy, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Home, 
  ShieldCheck, 
  CreditCard,
  Phone,
  ArrowLeft,
  FileText
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (user: User) => void;
  building: Building;
  initialMode?: 'login' | 'register_manager' | 'register_resident';
}

type AuthMode = 
  | 'login' 
  | 'select_role' 
  | 'register_manager' 
  | 'register_resident' 
  | 'manager_success' 
  | 'forgot_password';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
  building,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Login Form State
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Manager Register Form State
  const [mgrName, setMgrName] = useState('');
  const [mgrPhone, setMgrPhone] = useState('');
  const [mgrEmail, setMgrEmail] = useState('');
  const [mgrBuildingName, setMgrBuildingName] = useState('');
  const [mgrAddress, setMgrAddress] = useState('');
  const [mgrCity, setMgrCity] = useState('İstanbul');
  const [mgrDistrict, setMgrDistrict] = useState('Kadıköy');
  const [mgrApartments, setMgrApartments] = useState(12);
  const [mgrApartmentNo, setMgrApartmentNo] = useState(10);
  const [mgrFloor, setMgrFloor] = useState(5);
  const [mgrDues, setMgrDues] = useState(750);
  const [mgrIban, setMgrIban] = useState('TR33 0006 1005 1980 0012 3456 78');
  const [mgrBankName, setMgrBankName] = useState('Ziraat Bankası');
  const [mgrPassword, setMgrPassword] = useState('');
  const [deedFilePreview, setDeedFilePreview] = useState<string | null>(
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80'
  );
  const [createdBuildingData, setCreatedBuildingData] = useState<{ user: User; building: Building } | null>(null);

  // Resident Register Form State
  const [resBuildingId, setResBuildingId] = useState(building.id);
  const [resName, setResName] = useState('');
  const [resPhone, setResPhone] = useState('');
  const [resApartmentNo, setResApartmentNo] = useState(4);
  const [resFloor, setResFloor] = useState(2);
  const [resPassword, setResPassword] = useState('');

  // Forgot password state
  const [forgotInput, setForgotInput] = useState('');

  if (!isOpen) return null;

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!loginId || !loginPassword) {
      setError('Lütfen kullanıcı ID veya telefon ve şifrenizi giriniz.');
      return;
    }

    const result = AppStorage.login(loginId, loginPassword);
    if (result.success && result.user) {
      onSuccessLogin(result.user);
      onClose();
    } else {
      setError(result.error || 'Giriş yapılamadı.');
    }
  };

  // Quick 1-Click Demo Login
  const handleDemoLogin = (role: 'yonetici' | 'sakin') => {
    const users = AppStorage.getUsers();
    let target = users.find(u => u.role === role);
    if (!target) target = users[0];
    AppStorage.setCurrentUser(target);
    onSuccessLogin(target);
    onClose();
  };

  // Handle Manager Register
  const handleManagerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!mgrName || !mgrPhone || !mgrBuildingName || !mgrPassword) {
      setError('Lütfen tüm zorunlu alanları doldurunuz.');
      return;
    }

    if (!deedFilePreview) {
      setError('Lütfen bina tapusu veya kimlik belgesi yükleyiniz.');
      return;
    }

    const result = AppStorage.registerManager({
      name: mgrName,
      phone: mgrPhone,
      email: mgrEmail,
      buildingName: mgrBuildingName,
      address: mgrAddress || 'Atatürk Mah. Zambak Sok.',
      city: mgrCity,
      district: mgrDistrict,
      totalApartments: Number(mgrApartments),
      apartmentNo: Number(mgrApartmentNo),
      floor: Number(mgrFloor),
      monthlyDues: Number(mgrDues),
      iban: mgrIban,
      bankName: mgrBankName,
      password: mgrPassword,
      deedPhotoUrl: deedFilePreview,
    });

    setCreatedBuildingData(result);
    setMode('manager_success');
  };

  // Handle Resident Register
  const handleResidentRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!resBuildingId || !resName || !resPhone || !resPassword) {
      setError('Lütfen tüm alanları doldurunuz.');
      return;
    }

    const result = AppStorage.registerResident({
      buildingId: resBuildingId,
      name: resName,
      phone: resPhone,
      apartmentNo: Number(resApartmentNo),
      floor: Number(resFloor),
      password: resPassword,
    });

    if (result.success && result.user) {
      onSuccessLogin(result.user);
      onClose();
    } else {
      setError(result.error || 'Kayıt başarısız oldu.');
    }
  };

  // Handle Image Mock Upload
  const handleDeedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setDeedFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-slate-900 to-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {mode !== 'login' && (
              <button
                onClick={() => setMode(mode === 'register_manager' || mode === 'register_resident' ? 'select_role' : 'login')}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors"
                title="Geri Dön"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                {mode === 'login' && 'Aidatım Giriş Ekranı'}
                {mode === 'select_role' && 'Hesap Türü Seçiniz'}
                {mode === 'register_manager' && 'Yönetici & Bina Kaydı'}
                {mode === 'register_resident' && 'Bina Sakini Kaydı'}
                {mode === 'manager_success' && 'Bina ID Oluşturuldu! 🎉'}
                {mode === 'forgot_password' && 'Şifremi Unuttum'}
              </h3>
              <p className="text-[11px] text-slate-300">
                {mode === 'login' && 'Bina aidatı ve harcamaları tek uygulamada'}
                {mode === 'register_manager' && 'Tapu belgenizle binanızı kaydedin'}
                {mode === 'register_resident' && 'Yöneticinizin verdiği Bina ID ile katılın'}
              </p>
            </div>
          </div>

          <button
            id="btn-close-auth-modal"
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* 1. LOGIN SCREEN (ID & ŞİFRE) */}
        {/* ========================================================= */}
        {mode === 'login' && (
          <div className="p-5 sm:p-6 space-y-5">
            
            {/* Quick Demo Preview Buttons */}
            <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200/80">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tek Tıkla Hızlı Test Girişi (Demo):</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="btn-demo-login-manager"
                  onClick={() => handleDemoLogin('yonetici')}
                  className="p-2.5 rounded-lg bg-white hover:bg-emerald-100/60 border border-emerald-300 text-slate-800 text-left transition-colors flex flex-col shadow-2xs"
                >
                  <span className="text-[11px] font-extrabold text-amber-700 flex items-center gap-1">
                    👑 Yönetici Girişi
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Selim Yıldız (Kat 5)</span>
                </button>
                
                <button
                  type="button"
                  id="btn-demo-login-resident"
                  onClick={() => handleDemoLogin('sakin')}
                  className="p-2.5 rounded-lg bg-white hover:bg-emerald-100/60 border border-emerald-300 text-slate-800 text-left transition-colors flex flex-col shadow-2xs"
                >
                  <span className="text-[11px] font-extrabold text-blue-700 flex items-center gap-1">
                    🏠 Sakin Girişi
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Kemal Aydın (Daire 4)</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kullanıcı ID / Telefon / Bina Kodu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <UserCircle2 className="w-4 h-4" />
                  </div>
                  <input
                    id="input-login-id"
                    type="text"
                    required
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="Örn: 05325551420 veya BINA-34082"
                    className="w-full pl-9.5 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Şifre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="input-login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Şifrenizi giriniz (Demo: 123)"
                    className="w-full pl-9.5 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="btn-submit-login"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-colors flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                Giriş Yap
              </button>
            </form>

            {/* Bottom Links (Hesap Oluştur / Şifremi Unuttum) */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                id="btn-switch-register"
                onClick={() => setMode('select_role')}
                className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
              >
                ✨ Yeni Hesap Oluştur
              </button>
              <button
                type="button"
                id="btn-switch-forgot"
                onClick={() => setMode('forgot_password')}
                className="font-medium text-slate-500 hover:text-slate-700 hover:underline"
              >
                Şifremi Unuttum?
              </button>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* 2. SELECT ROLE (YÖNETİCİ VEYA SAKİN) */}
        {/* ========================================================= */}
        {mode === 'select_role' && (
          <div className="p-5 sm:p-6 space-y-4">
            <p className="text-xs text-slate-600 font-medium text-center">
              Lütfen sisteme hangi yetki ile katılacağınızı seçiniz:
            </p>

            <div className="grid grid-cols-1 gap-3">
              {/* Option 1: Manager */}
              <button
                id="btn-select-manager-role"
                onClick={() => setMode('register_manager')}
                className="p-4 rounded-xl border-2 border-emerald-500/80 bg-emerald-50/50 hover:bg-emerald-50 transition-all text-left flex items-start gap-3.5 group shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-slate-900">Bina Yöneticisi Olarak Hesap Aç</h4>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900">
                      Tapu Gerekli
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Bina tapusunu yükleyin, sistem size özel benzersiz bir <strong>Bina ID</strong> oluştursun. IBAN bilgisi ve aidatları yönetin.
                  </p>
                </div>
              </button>

              {/* Option 2: Resident */}
              <button
                id="btn-select-resident-role"
                onClick={() => setMode('register_resident')}
                className="p-4 rounded-xl border-2 border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/40 transition-all text-left flex items-start gap-3.5 group shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-slate-900">Bina Sakini Olarak Hesap Aç</h4>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-900">
                      Bina ID ile
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Yöneticinizin paylaştığı <strong>Bina ID</strong> kodunu girerek dairesinizi seçin ve şifrenizi belirleyin.
                  </p>
                </div>
              </button>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-slate-500 hover:text-slate-800 font-bold underline"
              >
                Zaten bir hesabınız var mı? Giriş Yapın
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. REGISTER MANAGER (TAPU YÜKLEME & BİNA ID ÜRETİMİ) */}
        {/* ========================================================= */}
        {mode === 'register_manager' && (
          <form onSubmit={handleManagerRegister} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            
            {/* Deed / Tapu upload requirement banner */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Tapu ve Kimlik Doğrulaması:</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Yöneticilik yetkisi ve özel Bina ID tanımlanması için bina tapusu veya karar defteri tutanağı yüklenmelidir.
              </p>
            </div>

            {/* Tapu Upload Box */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Ev / Bina Tapusu veya Yönetici Yetki Belgesi Fotoğrafı *
              </label>
              <div className="border-2 border-dashed border-emerald-300 rounded-xl p-3 bg-emerald-50/30 text-center relative hover:bg-emerald-50/60 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDeedUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {deedFilePreview ? (
                  <div className="flex items-center justify-center gap-3">
                    <img
                      src={deedFilePreview}
                      alt="Tapu Önizleme"
                      className="w-16 h-12 object-cover rounded-lg border border-emerald-400 shadow-2xs"
                    />
                    <div className="text-left">
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600" /> Tapu Belgesi Yüklendi
                      </span>
                      <span className="text-[10px] text-slate-500 block">Değiştirmek için tıklayın</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-6 h-6 text-emerald-600 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">Tapu / Kimlik Görseli Yükle</p>
                    <p className="text-[10px] text-slate-500">JPG, PNG veya PDF</p>
                  </div>
                )}
              </div>
            </div>

            {/* Manager Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Yönetici Adı Soyadı *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Selim Yıldız"
                  value={mgrName}
                  onChange={(e) => setMgrName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Telefon Numarası *</label>
                <input
                  type="tel"
                  required
                  placeholder="0532 555 1420"
                  value={mgrPhone}
                  onChange={(e) => setMgrPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Building Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bina / Site Adı *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Güneş Apartmanı"
                  value={mgrBuildingName}
                  onChange={(e) => setMgrBuildingName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Toplam Daire Sayısı</label>
                <input
                  type="number"
                  min={2}
                  max={200}
                  value={mgrApartments}
                  onChange={(e) => setMgrApartments(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Location & Dues */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">İl / İlçe</label>
                <input
                  type="text"
                  value={`${mgrCity} / ${mgrDistrict}`}
                  onChange={(e) => setMgrDistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Aylık Daire Aidatı (₺)</label>
                <input
                  type="number"
                  min={50}
                  value={mgrDues}
                  onChange={(e) => setMgrDues(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                />
              </div>
            </div>

            {/* IBAN for Dues Collection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Aidat Toplanacak IBAN No *
              </label>
              <input
                type="text"
                required
                value={mgrIban}
                onChange={(e) => setMgrIban(e.target.value)}
                placeholder="TR00 0000 0000 0000 0000 0000 00"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Manager Apartment & Password */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Yöneticinin Daire No</label>
                <input
                  type="number"
                  min={1}
                  value={mgrApartmentNo}
                  onChange={(e) => setMgrApartmentNo(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Giriş Şifresi *</label>
                <input
                  type="password"
                  required
                  placeholder="Şifre oluşturun"
                  value={mgrPassword}
                  onChange={(e) => setMgrPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              id="btn-submit-manager-register"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Tapuyu Doğrula ve Bina ID Üret
            </button>
          </form>
        )}

        {/* ========================================================= */}
        {/* 4. MANAGER REGISTRATION SUCCESS (SHOW GENERATED BUILDING ID) */}
        {/* ========================================================= */}
        {mode === 'manager_success' && createdBuildingData && (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-black text-slate-900">Binanız Başarıyla Oluşturuldu!</h4>
              <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                Tapu doğrulamanız tamamlandı. Binanız için oluşturulan özel <strong>Bina ID</strong> aşağıdadır:
              </p>
            </div>

            {/* Big Building ID Box */}
            <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-dashed border-emerald-300 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Binanızın Özel Kodu (Bina ID)
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-mono font-black tracking-widest text-emerald-700">
                  {createdBuildingData.building.id}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(createdBuildingData.building.id)}
                  className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                  title="Kopyala"
                >
                  {copiedId ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-emerald-800 font-medium">
                Bu kodu WhatsApp veya SMS ile bina sakinlerine atınız. Sakinler hesap oluştururken bu kodu gireceklerdir.
              </p>
            </div>

            <button
              type="button"
              id="btn-manager-start-app"
              onClick={() => {
                onSuccessLogin(createdBuildingData.user);
                onClose();
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-colors"
            >
              Uygulamaya Başla 🚀
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* 5. REGISTER RESIDENT (BİNA SAKİNİ KAYDI - BİNA ID GİRİŞİ) */}
        {/* ========================================================= */}
        {mode === 'register_resident' && (
          <form onSubmit={handleResidentRegister} className="p-5 sm:p-6 space-y-4">
            
            {/* Building ID Banner */}
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 text-xs">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <KeyRound className="w-4 h-4 text-blue-600" />
                <span>Yöneticinizin Gönderdiği Bina ID'si:</span>
              </div>
              <p className="text-[11px] text-blue-800">
                Binanıza bağlanabilmek için yöneticinizin size ilettiği Bina Kodunu giriniz. (Örnek: <code className="font-mono font-bold bg-white px-1 py-0.5 rounded border border-blue-200">{building.id}</code>)
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Bina ID Kodu *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Örn: BINA-34082"
                  value={resBuildingId}
                  onChange={(e) => setResBuildingId(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono font-bold uppercase focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Adınız Soyadınız *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Kemal Aydın"
                  value={resName}
                  onChange={(e) => setResName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Telefon Numarası *</label>
                <input
                  type="tel"
                  required
                  placeholder="0544 321 9876"
                  value={resPhone}
                  onChange={(e) => setResPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Daire Numaranız *</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  required
                  value={resApartmentNo}
                  onChange={(e) => setResApartmentNo(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bulunduğunuz Kat</label>
                <input
                  type="number"
                  min={-2}
                  max={40}
                  value={resFloor}
                  onChange={(e) => setResFloor(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kendi Belirleyeceğiniz Şifre *
              </label>
              <input
                type="password"
                required
                placeholder="Girişte kullanacağınız şifre"
                value={resPassword}
                onChange={(e) => setResPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              id="btn-submit-resident-register"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-600/20 transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Hesap Oluştur ve Binaya Katıl
            </button>
          </form>
        )}

        {/* ========================================================= */}
        {/* 6. FORGOT PASSWORD SCREEN */}
        {/* ========================================================= */}
        {mode === 'forgot_password' && (
          <div className="p-5 sm:p-6 space-y-4">
            <p className="text-xs text-slate-600">
              Kayıtlı telefon numaranızı veya kullanıcı ID'nizi girerek şifre yenileme kodu talep edebilirsiniz.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Telefon Numarası veya ID
              </label>
              <input
                type="text"
                placeholder="0532..."
                value={forgotInput}
                onChange={(e) => setForgotInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setSuccessMsg('Şifre sıfırlama bağlantısı / SMS kodu kayıtlı telefonunuza gönderildi (Demo: Şifreniz 123).');
                setTimeout(() => setMode('login'), 2000);
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              Sıfırlama Kodu Gönder
            </button>

            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-bold"
            >
              Giriş Ekranına Dön
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
