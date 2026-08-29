import { 
  Building, 
  User, 
  DuesRecord, 
  ExpenseRecord, 
  Announcement, 
  Poll,
  PaymentStatus 
} from '../types';
import { 
  INITIAL_BUILDING, 
  INITIAL_USERS, 
  INITIAL_DUES_RECORDS, 
  INITIAL_EXPENSES, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_POLLS 
} from './mockData';

const STORAGE_KEYS = {
  BUILDING: 'aidatim_building',
  USERS: 'aidatim_users',
  CURRENT_USER: 'aidatim_current_user',
  DUES: 'aidatim_dues',
  EXPENSES: 'aidatim_expenses',
  ANNOUNCEMENTS: 'aidatim_announcements',
  POLLS: 'aidatim_polls',
};

// Helper for local storage safe fetch & set
export const getStored = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from storage`, e);
    return defaultValue;
  }
};

export const setStored = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage`, e);
  }
};

export class AppStorage {
  // Initialize storage with mock data if empty
  static init(): void {
    if (!localStorage.getItem(STORAGE_KEYS.BUILDING)) {
      setStored(STORAGE_KEYS.BUILDING, INITIAL_BUILDING);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      setStored(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.DUES)) {
      setStored(STORAGE_KEYS.DUES, INITIAL_DUES_RECORDS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.EXPENSES)) {
      setStored(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
      setStored(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.POLLS)) {
      setStored(STORAGE_KEYS.POLLS, INITIAL_POLLS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      // Default to manager for immediate rich experience
      setStored(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
    }
  }

  // Auth Methods
  static getCurrentUser(): User | null {
    return getStored<User | null>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  }

  static setCurrentUser(user: User | null): void {
    setStored(STORAGE_KEYS.CURRENT_USER, user);
  }

  static getUsers(): User[] {
    return getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  static getBuilding(): Building {
    return getStored<Building>(STORAGE_KEYS.BUILDING, INITIAL_BUILDING);
  }

  static updateBuilding(updates: Partial<Building>): Building {
    const current = this.getBuilding();
    const updated = { ...current, ...updates };
    setStored(STORAGE_KEYS.BUILDING, updated);
    return updated;
  }

  // Register Manager -> generates Building ID
  static registerManager(data: {
    name: string;
    phone: string;
    email?: string;
    buildingName: string;
    address: string;
    city: string;
    district: string;
    totalApartments: number;
    apartmentNo: number;
    floor: number;
    monthlyDues: number;
    iban: string;
    bankName: string;
    password: string;
    deedPhotoUrl?: string;
  }): { user: User; building: Building } {
    // Generate special Building ID
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const newBuildingId = `BINA-${randomDigits}`;
    const newUserId = `user-mgr-${Date.now()}`;

    const newBuilding: Building = {
      id: newBuildingId,
      name: data.buildingName,
      address: data.address,
      city: data.city,
      district: data.district,
      totalApartments: data.totalApartments,
      managerId: newUserId,
      managerName: data.name,
      managerPhone: data.phone,
      monthlyDuesAmount: data.monthlyDues,
      iban: data.iban,
      ibanOwner: `${data.buildingName} Yönetimi - ${data.name}`,
      bankName: data.bankName,
      deedPhotoUrl: data.deedPhotoUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date().toISOString(),
    };

    const newUser: User = {
      id: newUserId,
      name: data.name,
      phone: data.phone,
      email: data.email,
      role: 'yonetici',
      apartmentNo: data.apartmentNo,
      floor: data.floor,
      buildingId: newBuildingId,
      password: data.password,
      isVerified: true,
    };

    // Save Building & User
    setStored(STORAGE_KEYS.BUILDING, newBuilding);
    const users = this.getUsers();
    users.push(newUser);
    setStored(STORAGE_KEYS.USERS, users);
    this.setCurrentUser(newUser);

    // Seed dues for this new building
    const currentMonth = 'Ağustos 2026';
    const newDues: DuesRecord[] = [];
    for (let i = 1; i <= data.totalApartments; i++) {
      newDues.push({
        id: `dues-${newBuildingId}-${i}`,
        buildingId: newBuildingId,
        apartmentNo: i,
        residentName: i === data.apartmentNo ? `${data.name} (Yönetici)` : `Daire ${i} Sakini`,
        month: currentMonth,
        year: 2026,
        amount: data.monthlyDues,
        status: i === data.apartmentNo ? 'odendi' : 'odenecek',
        paidAt: i === data.apartmentNo ? new Date().toISOString() : undefined,
        paymentMethod: i === data.apartmentNo ? 'IBAN_HAVALE' : undefined,
      });
    }
    setStored(STORAGE_KEYS.DUES, newDues);

    return { user: newUser, building: newBuilding };
  }

  // Register Resident with Building ID
  static registerResident(data: {
    buildingId: string;
    name: string;
    phone: string;
    email?: string;
    apartmentNo: number;
    floor: number;
    password: string;
  }): { success: boolean; user?: User; error?: string } {
    const building = this.getBuilding();
    if (data.buildingId.trim().toUpperCase() !== building.id.toUpperCase()) {
      return { 
        success: false, 
        error: `Geçersiz Bina ID! Yöneticinizden aldığınız "${building.id}" gibi geçerli bina kodunu giriniz.` 
      };
    }

    const newUserId = `user-sakin-${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      name: data.name,
      phone: data.phone,
      email: data.email,
      role: 'sakin',
      apartmentNo: data.apartmentNo,
      floor: data.floor,
      buildingId: building.id,
      password: data.password,
      isVerified: true,
    };

    const users = this.getUsers();
    users.push(newUser);
    setStored(STORAGE_KEYS.USERS, users);
    this.setCurrentUser(newUser);

    // Update dues record resident name if available
    const dues = this.getDues();
    const updatedDues = dues.map((d) => {
      if (d.buildingId === building.id && d.apartmentNo === data.apartmentNo) {
        return { ...d, residentName: data.name, residentPhone: data.phone };
      }
      return d;
    });
    setStored(STORAGE_KEYS.DUES, updatedDues);

    return { success: true, user: newUser };
  }

  // Login
  static login(idOrPhone: string, password: string): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const building = this.getBuilding();

    const cleanInput = idOrPhone.trim().toLowerCase();

    // Check user match by ID, phone, email, or building ID + apartment
    const matched = users.find(u => {
      const isIdMatch = u.id.toLowerCase() === cleanInput;
      const isPhoneMatch = u.phone.replace(/\s+/g, '') === cleanInput.replace(/\s+/g, '');
      const isEmailMatch = u.email?.toLowerCase() === cleanInput;
      const isBuildingCodeMatch = (cleanInput === building.id.toLowerCase() || cleanInput === `daire-${u.apartmentNo}` || cleanInput === `${u.apartmentNo}`);
      
      return (isIdMatch || isPhoneMatch || isEmailMatch || isBuildingCodeMatch);
    });

    if (!matched) {
      // Fallback: check if matches building manager or default resident
      if (cleanInput === 'yonetici' || cleanInput === 'admin' || cleanInput === building.id.toLowerCase()) {
        const mgr = users.find(u => u.role === 'yonetici') || users[0];
        this.setCurrentUser(mgr);
        return { success: true, user: mgr };
      }
      if (cleanInput === 'sakin' || cleanInput === 'daire4') {
        const sakin = users.find(u => u.apartmentNo === 4) || users[1];
        this.setCurrentUser(sakin);
        return { success: true, user: sakin };
      }
      return { success: false, error: 'Girdiğiniz ID/Telefon veya şifre hatalı. Lütfen kontrol ediniz.' };
    }

    if (matched.password && matched.password !== password) {
      return { success: false, error: 'Şifre hatalı. Lütfen tekrar deneyiniz.' };
    }

    this.setCurrentUser(matched);
    return { success: true, user: matched };
  }

  static logout(): void {
    this.setCurrentUser(null);
  }

  // Dues Operations
  static getDues(buildingId?: string): DuesRecord[] {
    const all = getStored<DuesRecord[]>(STORAGE_KEYS.DUES, INITIAL_DUES_RECORDS);
    if (!buildingId) return all;
    return all.filter(d => d.buildingId === buildingId);
  }

  static markDuesAsPaidByResident(
    recordId: string, 
    details: { paymentMethod: 'IBAN_HAVALE' | 'ELDEN_MAKBUZ'; receiptImageUrl?: string; note?: string }
  ): void {
    const dues = this.getDues();
    const updated = dues.map(d => {
      if (d.id === recordId) {
        return {
          ...d,
          status: 'onay_bekliyor' as PaymentStatus,
          paidAt: new Date().toISOString(),
          paymentMethod: details.paymentMethod,
          receiptImageUrl: details.receiptImageUrl,
          note: details.note || 'IBAN üzerinden havale/EFT yapıldı',
        };
      }
      return d;
    });
    setStored(STORAGE_KEYS.DUES, updated);
  }

  static confirmDuesByManager(recordId: string, approved: boolean): void {
    const dues = this.getDues();
    const updated = dues.map(d => {
      if (d.id === recordId) {
        return {
          ...d,
          status: (approved ? 'odendi' : 'odenecek') as PaymentStatus,
          paidAt: approved ? (d.paidAt || new Date().toISOString()) : undefined,
        };
      }
      return d;
    });
    setStored(STORAGE_KEYS.DUES, updated);
  }

  static updateDuesRecord(recordId: string, updates: Partial<DuesRecord>): void {
    const dues = this.getDues();
    const updated = dues.map(d => (d.id === recordId ? { ...d, ...updates } : d));
    setStored(STORAGE_KEYS.DUES, updated);
  }

  // Expenses Operations (Fişler)
  static getExpenses(buildingId?: string): ExpenseRecord[] {
    const all = getStored<ExpenseRecord[]>(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
    if (!buildingId) return all;
    return all.filter(e => e.buildingId === buildingId);
  }

  static addExpense(expense: Omit<ExpenseRecord, 'id' | 'addedAt'>): ExpenseRecord {
    const expenses = this.getExpenses();
    const newRecord: ExpenseRecord = {
      ...expense,
      id: `exp-${Date.now()}`,
      addedAt: new Date().toISOString(),
    };
    expenses.unshift(newRecord);
    setStored(STORAGE_KEYS.EXPENSES, expenses);
    return newRecord;
  }

  static deleteExpense(id: string): void {
    const expenses = this.getExpenses();
    const filtered = expenses.filter(e => e.id !== id);
    setStored(STORAGE_KEYS.EXPENSES, filtered);
  }

  // Announcements Operations
  static getAnnouncements(buildingId?: string): Announcement[] {
    const all = getStored<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    if (!buildingId) return all;
    return all.filter(a => a.buildingId === buildingId);
  }

  static addAnnouncement(announcement: Omit<Announcement, 'id' | 'readCount'>): Announcement {
    const list = this.getAnnouncements();
    const newAnn: Announcement = {
      ...announcement,
      id: `ann-${Date.now()}`,
      readCount: 1,
    };
    list.unshift(newAnn);
    setStored(STORAGE_KEYS.ANNOUNCEMENTS, list);
    return newAnn;
  }

  static deleteAnnouncement(id: string): void {
    const list = this.getAnnouncements();
    setStored(STORAGE_KEYS.ANNOUNCEMENTS, list.filter(a => a.id !== id));
  }

  // Polls Operations
  static getPolls(buildingId?: string): Poll[] {
    const all = getStored<Poll[]>(STORAGE_KEYS.POLLS, INITIAL_POLLS);
    if (!buildingId) return all;
    return all.filter(p => p.buildingId === buildingId);
  }

  static castVote(pollId: string, userId: string, userName: string, apartmentNo: number, optionId: string): void {
    const polls = this.getPolls();
    const updated = polls.map(poll => {
      if (poll.id === pollId) {
        const prevVote = poll.votes[userId];
        const newVotes = { ...poll.votes };
        newVotes[userId] = {
          userId,
          userName,
          apartmentNo,
          optionId,
          votedAt: new Date().toISOString(),
        };

        // Recalculate counts
        const newOptions = poll.options.map(opt => {
          let count = 0;
          Object.values(newVotes).forEach(v => {
            if (v.optionId === opt.id) count++;
          });
          return { ...opt, votes: count };
        });

        return {
          ...poll,
          options: newOptions,
          votes: newVotes,
        };
      }
      return poll;
    });
    setStored(STORAGE_KEYS.POLLS, updated);
  }

  static createPoll(poll: Omit<Poll, 'id' | 'votes' | 'createdAt'>): Poll {
    const polls = this.getPolls();
    const newPoll: Poll = {
      ...poll,
      id: `poll-${Date.now()}`,
      votes: {},
      createdAt: new Date().toISOString(),
    };
    polls.unshift(newPoll);
    setStored(STORAGE_KEYS.POLLS, polls);
    return newPoll;
  }

  static resetToDefault(): void {
    localStorage.clear();
    this.init();
  }
}
