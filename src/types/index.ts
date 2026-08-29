export type UserRole = 'yonetici' | 'sakin';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  apartmentNo: number;
  floor: number;
  buildingId: string;
  password?: string;
  isVerified?: boolean;
  avatar?: string;
}

export interface Building {
  id: string; // e.g. "BINA-34082"
  name: string;
  address: string;
  city: string;
  district: string;
  totalApartments: number;
  managerId: string;
  managerName: string;
  managerPhone: string;
  monthlyDuesAmount: number;
  iban: string;
  ibanOwner: string;
  bankName: string;
  deedPhotoUrl?: string; // Tapu belgesi görseli
  createdAt: string;
}

export type PaymentStatus = 'odendi' | 'odenecek' | 'onay_bekliyor';

export interface DuesRecord {
  id: string;
  buildingId: string;
  apartmentNo: number;
  residentName: string;
  residentPhone?: string;
  month: string; // e.g. "Ağustos 2026"
  year: number;
  amount: number;
  status: PaymentStatus;
  paidAt?: string;
  paymentMethod?: 'IBAN_HAVALE' | 'ELDEN_MAKBUZ' | 'ONLINE';
  receiptImageUrl?: string;
  note?: string;
}

export type ExpenseCategory = 
  | 'Tadilat & Onarım'
  | 'Temizlik & Hijyen'
  | 'Asansör Bakımı'
  | 'Ortak Elektrik & Su'
  | 'Bahçe & Çevre Düzeni'
  | 'Güvenlik & Kamera'
  | 'Yönetim Giderleri'
  | 'Diğer';

export interface ExpenseRecord {
  id: string;
  buildingId: string;
  title: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  receiptPhotoUrl: string; // Fiş / Fatura görseli
  receiptNumber?: string;
  description: string;
  addedByName: string;
  addedAt: string;
}

export type AnnouncementCategory =
  | 'Tadilat & Onarım'
  | 'Bina Toplantısı'
  | 'Su & Elektrik Kesintisi'
  | 'Genel Bilgilendirme'
  | 'Acil Durum';

export interface Announcement {
  id: string;
  buildingId: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  date: string;
  isImportant: boolean;
  authorName: string;
  authorRole: string;
  readCount: number;
}

export type PollCategory = 
  | 'Yönetici Seçimi' 
  | 'Bina & Site Yenilikleri' 
  | 'Tadilat & Onarım Kararı' 
  | 'Kurallar & Düzenlemeler' 
  | 'Genel Oylama';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollVote {
  userId: string;
  userName: string;
  apartmentNo: number;
  optionId: string;
  votedAt: string;
}

export interface Poll {
  id: string;
  buildingId: string;
  title: string;
  description: string;
  category: PollCategory;
  options: PollOption[];
  votes: Record<string, PollVote>; // key: userId
  endDate: string;
  isActive: boolean;
  createdByName: string;
  createdAt: string;
}

export type ActiveView = 
  | 'aidat_yonetimi'   // 1. Ana Sayfa (Kim ödedi / kim ödemedi & IBAN ödeme)
  | 'bina_harcamalari' // 2. Harcamalar & Yüklenen Fişler
  | 'duyurular'        // 3. Tadilat, onarım ve toplantı duyuruları
  | 'oylamalar'        // 4. Yönetici seçimi & bina yenilik oylamaları
  | 'bina_bilgileri';  // 5. Bina & Sakinler Rehberi
