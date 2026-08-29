import React, { useState } from 'react';
import { Building, User } from '../../types';
import { X, Share2, Copy, CheckCircle2, MessageSquare, Building2, KeyRound, ArrowRight } from 'lucide-react';

interface ShareBuildingIdModalProps {
  isOpen: boolean;
  onClose: () => void;
  building: Building;
  currentUser: User | null;
}

export const ShareBuildingIdModal: React.FC<ShareBuildingIdModalProps> = ({
  isOpen,
  onClose,
  building,
  currentUser,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedFullMsg, setCopiedFullMsg] = useState(false);

  if (!isOpen) return null;

  const fullShareMessage = `🏢 *${building.name} Aidat ve Bina Yönetimi Uygulaması*\n\nDeğerli bina sakinlerimiz, aidatlarımızı makbuzla uğraşmadan IBAN üzerinden ödemek, harcama fişlerini, tadilat duyurularını ve oylamaları takip etmek için Aidatım uygulamasına katılın.\n\n🔑 *Binamızın Özel Kodu (Bina ID):* ${building.id}\n💳 *Aidat IBAN:* ${building.iban}\n\n👉 *Nasıl Kayıt Olunur?*\n1. Aidatım uygulamasını açın.\n2. "Hesap Oluştur" -> "Bina Sakini" seçeneğine tıklayın.\n3. Bina ID kısmına *${building.id}* kodunu girin, daire numaranızı seçip şifrenizi belirleyin.`;

  const copyOnlyId = () => {
    navigator.clipboard.writeText(building.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const copyFullMessage = () => {
    navigator.clipboard.writeText(fullShareMessage);
    setCopiedFullMsg(true);
    setTimeout(() => setCopiedFullMsg(false), 2000);
  };

  const shareViaWhatsApp = () => {
    const encoded = encodeURIComponent(fullShareMessage);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">Bina ID'sini Sakinlerle Paylaş</h3>
              <p className="text-[11px] text-emerald-300">
                Sakinler bu kod ile hesap açıp binanıza bağlanır
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

        {/* Content */}
        <div className="p-5 space-y-4">
          
          {/* Big Code Card */}
          <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-dashed border-emerald-300 text-center space-y-2">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              {building.name} Bina ID Kodu
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-mono font-black text-emerald-800 tracking-widest bg-white px-3 py-1 rounded-xl border border-emerald-200 shadow-2xs">
                {building.id}
              </span>
              <button
                onClick={copyOnlyId}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-2xs"
                title="Sadece Kodu Kopyala"
              >
                {copiedId ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-emerald-700">
              Sakinler "Hesap Oluştur" adımında bu kodu girerek binanıza dahil olur.
            </p>
          </div>

          {/* Prepared Message Preview */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700 block">
              Sakinler İçin Hazır WhatsApp / SMS Davet Metni:
            </span>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 whitespace-pre-wrap font-sans max-h-40 overflow-y-auto leading-relaxed">
              {fullShareMessage}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={shareViaWhatsApp}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp ile Sakinler Grubuna Gönder
            </button>

            <button
              onClick={copyFullMessage}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-colors flex items-center justify-center gap-2"
            >
              {copiedFullMsg ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copiedFullMsg ? 'Tüm Metin Kopyalandı!' : 'Hazır Metni Kopyala'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
