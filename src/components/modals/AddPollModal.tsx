import React, { useState } from 'react';
import { Poll, PollCategory, User, Building } from '../../types';
import { X, Vote, Plus, Trash2, Calendar, CheckCircle2 } from 'lucide-react';

interface AddPollModalProps {
  isOpen: boolean;
  onClose: () => void;
  building: Building;
  currentUser: User | null;
  onAddPoll: (poll: Omit<Poll, 'id' | 'votes' | 'createdAt'>) => void;
}

const CATEGORIES: PollCategory[] = [
  'Yönetici Seçimi',
  'Bina & Site Yenilikleri',
  'Tadilat & Onarım Kararı',
  'Kurallar & Düzenlemeler',
  'Genel Oylama',
];

export const AddPollModal: React.FC<AddPollModalProps> = ({
  isOpen,
  onClose,
  building,
  currentUser,
  onAddPoll,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<PollCategory>('Bina & Site Yenilikleri');
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [options, setOptions] = useState<string[]>([
    'Evet, kabul edilsin',
    'Hayır, reddedilsin',
  ]);

  if (!isOpen) return null;

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, `Seçenek ${options.length + 1}`]);
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || options.some(o => !o.trim())) return;

    onAddPoll({
      buildingId: building.id,
      title,
      description,
      category,
      endDate,
      isActive: true,
      createdByName: currentUser?.name ? `${currentUser.name} (${currentUser.role === 'yonetici' ? 'Yönetici' : 'Sakin'})` : 'Bina Yöneticisi',
      options: options.map((opt, idx) => ({
        id: `opt-${Date.now()}-${idx}`,
        text: opt,
        votes: 0,
      })),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-purple-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Vote className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight">Yeni Bina Oylaması Başlat</h3>
              <p className="text-[11px] text-slate-300">
                Yönetici seçimi, tadilat ve bina yenilikleri için ortak karar
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
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Oylama Konusu / Başlığı *
            </label>
            <input
              type="text"
              required
              placeholder="Örn: Bina Dış Cephe Yalıtım ve Renk Seçimi"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PollCategory)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-purple-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Son Oylama Tarihi
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Açıklama & Detaylar
            </label>
            <textarea
              rows={2}
              placeholder="Bina sakinlerine oylama hakkında ön bilgi verin..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Options */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Oylama Seçenekleri (En az 2 seçenek) *
              </label>
              {options.length < 6 && (
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Seçenek Ekle
                </button>
              )}
            </div>

            <div className="space-y-2">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    required
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Seçenek ${idx + 1}`}
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-purple-500"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
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
              id="btn-submit-add-poll"
              className="w-2/3 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md shadow-purple-600/20 transition-colors flex items-center justify-center gap-1.5"
            >
              <Vote className="w-3.5 h-3.5" />
              Oylamayı Başlat
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
