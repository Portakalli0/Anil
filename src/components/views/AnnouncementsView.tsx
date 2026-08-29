import React, { useState } from 'react';
import { 
  Building, 
  User, 
  Announcement, 
  AnnouncementCategory 
} from '../../types';
import { 
  Megaphone, 
  Plus, 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  Trash2, 
  Clock, 
  Wrench, 
  Users, 
  Droplet, 
  Info,
  ShieldCheck
} from 'lucide-react';

interface AnnouncementsViewProps {
  building: Building;
  currentUser: User | null;
  announcements: Announcement[];
  onOpenAddAnnouncementModal: () => void;
  onDeleteAnnouncement: (id: string) => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  building,
  currentUser,
  announcements,
  onOpenAddAnnouncementModal,
  onDeleteAnnouncement,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [acknowledgedIds, setAcknowledgedIds] = useState<Record<string, boolean>>({});

  const handleAcknowledge = (id: string) => {
    setAcknowledgedIds(prev => ({ ...prev, [id]: true }));
  };

  const filteredAnnouncements = announcements.filter(a => {
    if (selectedCategory === 'all') return true;
    return a.category === selectedCategory;
  });

  const getCategoryIcon = (category: AnnouncementCategory) => {
    switch (category) {
      case 'Tadilat & Onarım':
        return <Wrench className="w-4 h-4 text-amber-600" />;
      case 'Bina Toplantısı':
        return <Users className="w-4 h-4 text-purple-600" />;
      case 'Su & Elektrik Kesintisi':
        return <Droplet className="w-4 h-4 text-blue-600" />;
      case 'Acil Durum':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold uppercase tracking-wider border border-amber-200">
              Bina Duyuruları
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Tadilat, Onarım ve Toplantı Bilgilendirmeleri
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Duyurular & Tadilat Takvimi
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Binamızdaki bakım, arıza, temizlik ve toplantı tarihlerini anlık takip edin
          </p>
        </div>

        {currentUser?.role === 'yonetici' && (
          <button
            id="btn-open-add-announcement"
            onClick={onOpenAddAnnouncementModal}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Yeni Duyuru Yayınla
          </button>
        )}
      </div>

      {/* 2. Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-100 p-2 rounded-2xl border border-slate-200 text-xs font-bold">
        {['all', 'Tadilat & Onarım', 'Bina Toplantısı', 'Su & Elektrik Kesintisi', 'Genel Bilgilendirme'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-white text-amber-950 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat === 'all' ? 'Tüm Duyurular' : cat}
          </button>
        ))}
      </div>

      {/* 3. Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-700 text-sm">Bu kategoride duyuru bulunmamaktadır</h3>
            <p className="text-xs text-slate-500 mt-1">Yeni bir tadilat veya toplantı duyurusu olduğunda burada listelenecektir.</p>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => {
            const isRead = acknowledgedIds[ann.id];
            return (
              <div
                key={ann.id}
                className={`bg-white rounded-2xl border transition-all shadow-xs overflow-hidden ${
                  ann.isImportant
                    ? 'border-amber-400/80 ring-1 ring-amber-400/30'
                    : 'border-slate-200'
                }`}
              >
                {/* Important top strip */}
                {ann.isImportant && (
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-4 py-1 text-[11px] font-extrabold flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      ÖNEMLİ VE ACİL BİNA DUYURUSU
                    </span>
                    <span className="text-[10px] bg-slate-950 text-amber-300 px-2 py-0.5 rounded font-mono">
                      Tüm Sakinlerin Dikkatine
                    </span>
                  </div>
                )}

                <div className="p-4 sm:p-6">
                  
                  {/* Category & Date Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-slate-100 border border-slate-200">
                        {getCategoryIcon(ann.category)}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {ann.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(ann.date).toLocaleDateString('tr-TR')}
                      </span>
                      <span className="font-semibold text-slate-700">
                        Yayınlayan: {ann.authorName} ({ann.authorRole})
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-black text-slate-900 mb-2.5 leading-snug">
                    {ann.title}
                  </h3>

                  {/* Content */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
                    {ann.content}
                  </p>

                  {/* Footer: Read count, acknowledge button, delete */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    
                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{ann.readCount + (isRead ? 1 : 0)} Bina Sakini Bilgilendi</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAcknowledge(ann.id)}
                        disabled={isRead}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isRead
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                            : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200'
                        }`}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isRead ? 'text-emerald-600' : 'text-slate-400'}`} />
                        {isRead ? 'Okundu Olarak İşaretlendi' : 'Okudum / Bilgim Var'}
                      </button>

                      {currentUser?.role === 'yonetici' && (
                        <button
                          onClick={() => onDeleteAnnouncement(ann.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Duyuruyu Kaldır"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
