import React, { useState } from 'react';
import { 
  Building, 
  User, 
  Poll, 
  PollCategory 
} from '../../types';
import { 
  Vote, 
  Plus, 
  CheckCircle2, 
  Users, 
  Calendar, 
  Clock, 
  Award, 
  ShieldCheck, 
  BarChart3, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface VotingViewProps {
  building: Building;
  currentUser: User | null;
  polls: Poll[];
  onOpenAddPollModal: () => void;
  onCastVote: (pollId: string, optionId: string) => void;
}

export const VotingView: React.FC<VotingViewProps> = ({
  building,
  currentUser,
  polls,
  onOpenAddPollModal,
  onCastVote,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const toggleDetails = (pollId: string) => {
    setExpandedDetails(prev => ({ ...prev, [pollId]: !prev[pollId] }));
  };

  const handleSelectOption = (pollId: string, optionId: string) => {
    setSelectedOptions(prev => ({ ...prev, [pollId]: optionId }));
  };

  const handleVoteSubmit = (pollId: string) => {
    const chosenOptionId = selectedOptions[pollId];
    if (chosenOptionId) {
      onCastVote(pollId, chosenOptionId);
    }
  };

  const filteredPolls = polls.filter(p => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[11px] font-bold uppercase tracking-wider border border-purple-200">
              Demokratik Bina Yönetimi
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Her Daire 1 Oy Hakkı
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Bina İçi Oylama & Seçim Sistemi
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Yönetici seçimi, mantolama rengi ve bina yenilikleri için ortak karar verin
          </p>
        </div>

        {currentUser?.role === 'yonetici' && (
          <button
            id="btn-open-add-poll"
            onClick={onOpenAddPollModal}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Yeni Oylama Başlat
          </button>
        )}
      </div>

      {/* 2. Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-100 p-2 rounded-2xl border border-slate-200 text-xs font-bold">
        {['all', 'Yönetici Seçimi', 'Bina & Site Yenilikleri', 'Tadilat & Onarım Kararı'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-white text-purple-950 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat === 'all' ? 'Tüm Oylamalar' : cat}
          </button>
        ))}
      </div>

      {/* 3. Polls List */}
      <div className="space-y-6">
        {filteredPolls.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <Vote className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-700 text-sm">Aktif oylama bulunamadı</h3>
            <p className="text-xs text-slate-500 mt-1">Yöneticiniz yeni bir anket başlattığında burada yer alacaktır.</p>
          </div>
        ) : (
          filteredPolls.map((poll) => {
            const userVote = currentUser ? poll.votes[currentUser.id] : null;
            const totalVotes = Object.keys(poll.votes).length;
            const totalApartments = building.totalApartments || 10;
            const participationRate = Math.round((totalVotes / totalApartments) * 100);
            const currentSelected = selectedOptions[poll.id] || (userVote ? userVote.optionId : '');
            const isExpanded = expandedDetails[poll.id];

            return (
              <div
                key={poll.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
              >
                {/* Poll Top Header */}
                <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider border ${
                        poll.category === 'Yönetici Seçimi' 
                          ? 'bg-amber-100 text-amber-900 border-amber-200'
                          : 'bg-purple-100 text-purple-900 border-purple-200'
                      }`}>
                        {poll.category}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Son Gün: {new Date(poll.endDate).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                      {poll.title}
                    </h2>
                  </div>

                  {/* Participation Badge */}
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs self-start sm:self-auto">
                    <Users className="w-4 h-4 text-purple-600" />
                    <div>
                      <span className="text-xs font-bold text-slate-800">
                        {totalVotes} / {totalApartments} Daire Oy Verdi
                      </span>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        Katılım Oranı: %{participationRate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Poll Body */}
                <div className="p-4 sm:p-6 space-y-4">
                  
                  {poll.description && (
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-purple-50/40 p-3 rounded-xl border border-purple-100">
                      {poll.description}
                    </p>
                  )}

                  {/* Voting Options & Progress Bars */}
                  <div className="space-y-2.5">
                    {poll.options.map((option) => {
                      const isOptionSelected = currentSelected === option.id;
                      const isVotedByUser = userVote?.optionId === option.id;
                      const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

                      return (
                        <div
                          key={option.id}
                          onClick={() => handleSelectOption(poll.id, option.id)}
                          className={`p-3 sm:p-3.5 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                            isOptionSelected
                              ? 'border-purple-600 bg-purple-50/50 shadow-xs'
                              : 'border-slate-200 hover:border-purple-300 bg-slate-50/40'
                          }`}
                        >
                          {/* Progress fill behind */}
                          <div 
                            className="absolute inset-y-0 left-0 bg-purple-100/70 -z-0 transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />

                          <div className="relative z-10 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isOptionSelected ? 'border-purple-600 bg-purple-600 text-white' : 'border-slate-300 bg-white'
                              }`}>
                                {isOptionSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                              </div>
                              <span className="text-xs sm:text-sm font-bold text-slate-900">
                                {option.text}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {isVotedByUser && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-600 text-white shadow-2xs">
                                  Benim Oyum
                                </span>
                              )}
                              <span className="text-xs font-black text-purple-950 min-w-[50px] text-right">
                                %{percentage} <span className="text-[10px] font-normal text-slate-500">({option.votes} oy)</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Vote Action Bar */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
                    
                    <div className="text-xs">
                      {userVote ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          Oyunuz sistemde kaydedildi (İsterseniz değiştirebilirsiniz)
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium">
                          {currentUser ? `Daire ${currentUser.apartmentNo} adına seçiminizi yapıp onaylayınız` : 'Oy kullanmak için giriş yapınız'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {currentUser && (
                        <button
                          id={`btn-cast-vote-${poll.id}`}
                          onClick={() => handleVoteSubmit(poll.id)}
                          disabled={!currentSelected || currentSelected === userVote?.optionId}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                            !currentSelected || currentSelected === userVote?.optionId
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20'
                          }`}
                        >
                          <Vote className="w-3.5 h-3.5" />
                          {userVote ? 'Oyu Güncelle' : 'Oyumu Gönder'}
                        </button>
                      )}

                      <button
                        onClick={() => toggleDetails(poll.id)}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>{isExpanded ? 'Daire Dağılımını Gizle' : 'Kim Ne Oy Verdi?'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                  </div>

                  {/* Expanded Transparent Voter Table */}
                  {isExpanded && (
                    <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 animate-in fade-in">
                      <div className="flex items-center justify-between font-bold text-slate-700 border-b border-slate-200 pb-1.5">
                        <span>Daire ve Sakin Katılımı</span>
                        <span>Verilen Tercih</span>
                      </div>
                      
                      {Object.keys(poll.votes).length === 0 ? (
                        <p className="text-slate-400 italic text-center py-2">Henüz oy kullanılmadı.</p>
                      ) : (
                        <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                          {(Object.values(poll.votes) as Array<{ optionId: string; votedAt: string; apartmentNo: number; userName: string }>).map((v, i) => {
                            const option = poll.options.find(o => o.id === v.optionId);
                            return (
                              <div key={i} className="py-1.5 flex items-center justify-between">
                                <span className="font-semibold text-slate-800">
                                  Daire {v.apartmentNo} - {v.userName}
                                </span>
                                <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 text-[11px]">
                                  {option?.text || 'Bilinmiyor'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
