import React, { useState, useEffect } from 'react';
import { 
  Building, 
  User, 
  DuesRecord, 
  ExpenseRecord, 
  Announcement, 
  Poll, 
  ActiveView 
} from './types';
import { AppStorage } from './services/storage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DuesView } from './components/views/DuesView';
import { ExpensesView } from './components/views/ExpensesView';
import { AnnouncementsView } from './components/views/AnnouncementsView';
import { VotingView } from './components/views/VotingView';
import { BuildingInfoView } from './components/views/BuildingInfoView';
import { AuthModal } from './components/auth/AuthModal';
import { PayDuesModal } from './components/modals/PayDuesModal';
import { ReceiptViewerModal } from './components/modals/ReceiptViewerModal';
import { DeedViewerModal } from './components/modals/DeedViewerModal';
import { AddExpenseModal } from './components/modals/AddExpenseModal';
import { AddAnnouncementModal } from './components/modals/AddAnnouncementModal';
import { AddPollModal } from './components/modals/AddPollModal';
import { ShareBuildingIdModal } from './components/modals/ShareBuildingIdModal';
import { 
  CheckCircle2, 
  CreditCard, 
  Receipt, 
  Megaphone, 
  Vote, 
  Building2, 
  Info,
  ShieldCheck
} from 'lucide-react';

export default function App() {
  // Initialize storage
  useEffect(() => {
    AppStorage.init();
  }, []);

  // State
  const [building, setBuilding] = useState<Building>(() => AppStorage.getBuilding());
  const [currentUser, setCurrentUser] = useState<User | null>(() => AppStorage.getCurrentUser());
  const [dues, setDues] = useState<DuesRecord[]>(() => AppStorage.getDues());
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => AppStorage.getExpenses());
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => AppStorage.getAnnouncements());
  const [polls, setPolls] = useState<Poll[]>(() => AppStorage.getPolls());
  const [users, setUsers] = useState<User[]>(() => AppStorage.getUsers());

  const [activeView, setActiveView] = useState<ActiveView>('aidat_yonetimi');

  // Modals
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register_manager' | 'register_resident'>('login');
  
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedDuesForPay, setSelectedDuesForPay] = useState<DuesRecord | null>(null);

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedExpenseForReceipt, setSelectedExpenseForReceipt] = useState<ExpenseRecord | null>(null);
  const [selectedDuesForReceipt, setSelectedDuesForReceipt] = useState<DuesRecord | null>(null);

  const [isDeedModalOpen, setIsDeedModalOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddAnnouncementOpen, setIsAddAnnouncementOpen] = useState(false);
  const [isAddPollOpen, setIsAddPollOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync data refresh helper
  const refreshAllState = () => {
    setBuilding(AppStorage.getBuilding());
    setCurrentUser(AppStorage.getCurrentUser());
    setDues(AppStorage.getDues());
    setExpenses(AppStorage.getExpenses());
    setAnnouncements(AppStorage.getAnnouncements());
    setPolls(AppStorage.getPolls());
    setUsers(AppStorage.getUsers());
  };

  // Role Switcher (Manager <-> Resident)
  const handleSwitchRole = () => {
    const allUsers = AppStorage.getUsers();
    if (!currentUser || currentUser.role === 'yonetici') {
      const resident = allUsers.find(u => u.apartmentNo === 4) || allUsers[1];
      AppStorage.setCurrentUser(resident);
      setCurrentUser(resident);
      showToast(`🏠 Sakin Görünümüne Geçildi: ${resident.name} (Daire ${resident.apartmentNo})`);
    } else {
      const manager = allUsers.find(u => u.role === 'yonetici') || allUsers[0];
      AppStorage.setCurrentUser(manager);
      setCurrentUser(manager);
      showToast(`👑 Yönetici Görünümüne Geçildi: ${manager.name}`);
    }
  };

  // Logout
  const handleLogout = () => {
    AppStorage.logout();
    setCurrentUser(null);
    showToast('Çıkış yapıldı.');
  };

  // Successful Login / Register
  const handleSuccessLogin = (user: User) => {
    setCurrentUser(user);
    refreshAllState();
    showToast(`Hoş geldiniz, ${user.name}!`);
  };

  // Pay Dues Submit
  const handleSubmitPayment = (
    recordId: string, 
    details: { paymentMethod: 'IBAN_HAVALE'; receiptImageUrl?: string; note?: string }
  ) => {
    AppStorage.markDuesAsPaidByResident(recordId, details);
    setDues(AppStorage.getDues());
    showToast('Aidat ödeme bildiriminiz yöneticiye iletildi!');
  };

  // Confirm Payment by Manager
  const handleConfirmPayment = (recordId: string, approved: boolean) => {
    AppStorage.confirmDuesByManager(recordId, approved);
    setDues(AppStorage.getDues());
    showToast(approved ? 'Aidat ödemesi onaylandı ✓' : 'Ödeme reddedildi ✕');
  };

  // Mark directly paid by Manager
  const handleMarkAsPaidDirectly = (recordId: string) => {
    AppStorage.confirmDuesByManager(recordId, true);
    setDues(AppStorage.getDues());
    showToast('Dairenin aidatı ödendi olarak işaretlendi.');
  };

  // Add Expense
  const handleAddExpense = (expense: Omit<ExpenseRecord, 'id' | 'addedAt'>) => {
    AppStorage.addExpense(expense);
    setExpenses(AppStorage.getExpenses());
    showToast('Yeni harcama ve fiş fotoğrafı başarıyla yayınlandı!');
  };

  // Delete Expense
  const handleDeleteExpense = (id: string) => {
    AppStorage.deleteExpense(id);
    setExpenses(AppStorage.getExpenses());
    showToast('Harcama kaydı silindi.');
  };

  // Add Announcement
  const handleAddAnnouncement = (ann: Omit<Announcement, 'id' | 'readCount'>) => {
    AppStorage.addAnnouncement(ann);
    setAnnouncements(AppStorage.getAnnouncements());
    showToast('Duyuru tüm sakinlere yayınlandı!');
  };

  // Delete Announcement
  const handleDeleteAnnouncement = (id: string) => {
    AppStorage.deleteAnnouncement(id);
    setAnnouncements(AppStorage.getAnnouncements());
    showToast('Duyuru kaldırıldı.');
  };

  // Cast Vote
  const handleCastVote = (pollId: string, optionId: string) => {
    if (!currentUser) {
      setAuthInitialMode('login');
      setIsAuthOpen(true);
      return;
    }
    AppStorage.castVote(pollId, currentUser.id, currentUser.name, currentUser.apartmentNo, optionId);
    setPolls(AppStorage.getPolls());
    showToast('Oyunuz başarıyla kaydedildi! ✓');
  };

  // Add Poll
  const handleAddPoll = (poll: Omit<Poll, 'id' | 'votes' | 'createdAt'>) => {
    AppStorage.createPoll(poll);
    setPolls(AppStorage.getPolls());
    showToast('Yeni oylama başlatıldı!');
  };

  // Update Building
  const handleUpdateBuilding = (updates: Partial<Building>) => {
    const updated = AppStorage.updateBuilding(updates);
    setBuilding(updated);
    showToast('Bina bilgileri güncellendi.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        building={building}
        currentUser={currentUser}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onOpenAuth={() => {
          setAuthInitialMode('login');
          setIsAuthOpen(true);
        }}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onSwitchRole={handleSwitchRole}
        onLogout={handleLogout}
      />

      {/* Slide-over Menu (Sol Üst 3 Çizgiye Basınca Açılan Kısım) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeView={activeView}
        setActiveView={setActiveView}
        building={building}
        currentUser={currentUser}
        onOpenAuth={() => {
          setAuthInitialMode('login');
          setIsAuthOpen(true);
        }}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenDeedModal={() => setIsDeedModalOpen(true)}
        onSwitchRole={handleSwitchRole}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6">
        {activeView === 'aidat_yonetimi' && (
          <DuesView
            building={building}
            currentUser={currentUser}
            dues={dues}
            onOpenPayModal={(record) => {
              setSelectedDuesForPay(record);
              setIsPayModalOpen(true);
            }}
            onOpenReceiptModal={(record) => {
              setSelectedDuesForReceipt(record);
              setSelectedExpenseForReceipt(null);
              setIsReceiptModalOpen(true);
            }}
            onConfirmPayment={handleConfirmPayment}
            onMarkAsPaidDirectly={handleMarkAsPaidDirectly}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            onOpenAuth={() => {
              setAuthInitialMode('login');
              setIsAuthOpen(true);
            }}
          />
        )}

        {activeView === 'bina_harcamalari' && (
          <ExpensesView
            building={building}
            currentUser={currentUser}
            expenses={expenses}
            dues={dues}
            onOpenAddExpenseModal={() => setIsAddExpenseOpen(true)}
            onOpenReceiptModal={(expense) => {
              setSelectedExpenseForReceipt(expense);
              setSelectedDuesForReceipt(null);
              setIsReceiptModalOpen(true);
            }}
            onDeleteExpense={handleDeleteExpense}
          />
        )}

        {activeView === 'duyurular' && (
          <AnnouncementsView
            building={building}
            currentUser={currentUser}
            announcements={announcements}
            onOpenAddAnnouncementModal={() => setIsAddAnnouncementOpen(true)}
            onDeleteAnnouncement={handleDeleteAnnouncement}
          />
        )}

        {activeView === 'oylamalar' && (
          <VotingView
            building={building}
            currentUser={currentUser}
            polls={polls}
            onOpenAddPollModal={() => setIsAddPollOpen(true)}
            onCastVote={handleCastVote}
          />
        )}

        {activeView === 'bina_bilgileri' && (
          <BuildingInfoView
            building={building}
            currentUser={currentUser}
            users={users}
            dues={dues}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            onOpenDeedModal={() => setIsDeedModalOpen(true)}
            onUpdateBuilding={handleUpdateBuilding}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">Aidat<span className="text-emerald-600">ım</span></span>
            <span>• Bina Aidatı, Fiş & Harcama Yönetimi</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Bina Kodu: <strong className="text-slate-700 font-mono">{building.id}</strong></span>
            <span>•</span>
            <button
              onClick={() => {
                AppStorage.resetToDefault();
                refreshAllState();
                showToast('Örnek veriler sıfırlandı.');
              }}
              className="text-slate-500 hover:text-emerald-700 underline text-[11px]"
            >
              Örnek Verileri Sıfırla
            </button>
          </div>
        </div>
      </footer>

      {/* ================= MODALS ================= */}

      {/* 1. Auth Modal (Giriş / Hesap Oluştur / Şifremi Unuttum) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccessLogin={handleSuccessLogin}
        building={building}
        initialMode={authInitialMode}
      />

      {/* 2. Pay Dues Modal (IBAN ile Ödeme Bildir & Dekont Yükle) */}
      {selectedDuesForPay && (
        <PayDuesModal
          isOpen={isPayModalOpen}
          onClose={() => {
            setIsPayModalOpen(false);
            setSelectedDuesForPay(null);
          }}
          building={building}
          duesRecord={selectedDuesForPay}
          currentUser={currentUser}
          onSubmitPayment={handleSubmitPayment}
        />
      )}

      {/* 3. Receipt Viewer Modal (Fiş ve Dekont İnceleme) */}
      <ReceiptViewerModal
        isOpen={isReceiptModalOpen}
        onClose={() => {
          setIsReceiptModalOpen(false);
          setSelectedExpenseForReceipt(null);
          setSelectedDuesForReceipt(null);
        }}
        expense={selectedExpenseForReceipt}
        dues={selectedDuesForReceipt}
      />

      {/* 4. Deed Viewer Modal (Tapu ve Bina Doğrulama Belgesi) */}
      <DeedViewerModal
        isOpen={isDeedModalOpen}
        onClose={() => setIsDeedModalOpen(false)}
        building={building}
      />

      {/* 5. Add Expense & Receipt Modal (Yönetici Fiş Yükleme) */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        building={building}
        currentUser={currentUser}
        onAddExpense={handleAddExpense}
      />

      {/* 6. Add Announcement Modal (Yönetici Duyuru Yayınlama) */}
      <AddAnnouncementModal
        isOpen={isAddAnnouncementOpen}
        onClose={() => setIsAddAnnouncementOpen(false)}
        building={building}
        currentUser={currentUser}
        onAddAnnouncement={handleAddAnnouncement}
      />

      {/* 7. Add Poll Modal (Yönetici Oylama Başlatma) */}
      <AddPollModal
        isOpen={isAddPollOpen}
        onClose={() => setIsAddPollOpen(false)}
        building={building}
        currentUser={currentUser}
        onAddPoll={handleAddPoll}
      />

      {/* 8. Share Building ID Modal (Bina ID Kopyalama ve Sakinlere İletme) */}
      <ShareBuildingIdModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        building={building}
        currentUser={currentUser}
      />

    </div>
  );
}
