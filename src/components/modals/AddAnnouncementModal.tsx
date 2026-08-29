import React, { useState } from 'react';
import { Announcement, AnnouncementCategory, User, Building } from '../../types';
import { X, Megaphone, AlertTriangle, Calendar, CheckCircle2 } from 'lucide-react';

interface AddAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  building: Building;
  currentUser: User | null;
  onAddAnnouncement: (announcement: Omit<Announcement, 'id' | 'readCount'>) => void;
}

const CATEGORIES: AnnouncementCategory[] = [
  'Tadilat & Onarım',
  'Bina Toplantısı',
  'Su & Elektrik Kesintisi',
  'Genel Bilgilendirme',
  'Acil Durum',
];

export const AddAnnouncementModal: React.FC<AddAnnouncementModalProps> = ({
  isOpen,
  onClose,
  building,
  currentUser,
  onAddAnnouncement,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<AnnouncementCategory>('Tadilat & Onarım');
  const [isImportant, setIsImportant] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    onAddAnnouncement({
      buildingId: building.id,
      title,
      content,
      category,
      date: new Date().toISOString().split('T')[0],
      isImportant,
      authorName: currentUser?.name || 'Bina Yöneticisi',
      authorRole: currentUser?.role === 'yonetici' ? 'Bina Yöneticisi' : 'Bina Sakini',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-amber-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight">Yeni Bina Duyurusu Yayınla</h3>
              <p className="text-[11px] text-slate-300">
                Tadilat, bakım, kesinti ve toplantı bildirimleri
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Duyuru Başlığı *
            </label>
            <input
              type="text"
              required
              placeholder="Örn: 2 Eylül Salı Asansör Bakımı ve Muayenesi"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AnnouncementCategory)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                />
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Acil / Önemli Duyuru
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Duyuru Metni & Detaylar *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Duyurunun detaylarını, saat aralığını ve bina sakinlerinin dikkat etmesi gereken noktaları yazınız..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              id="btn-submit-add-announcement"
              className="w-2/3 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md shadow-amber-600/20 transition-colors flex items-center justify-center gap-1.5"
            >
              <Megaphone className="w-3.5 h-3.5" />
              Duyuruyu Yayınla
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
