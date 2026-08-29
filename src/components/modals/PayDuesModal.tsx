import React, { useState } from 'react';
import { Building, DuesRecord, User } from '../../types';
import { 
  X, 
  CreditCard, 
  Copy, 
  CheckCircle2, 
  Upload, 
  FileCheck, 
  AlertCircle, 
  Send,
  Building2,
  Info,
  Sparkles
} from 'lucide-react';

interface PayDuesModalProps {
  isOpen: boolean;
  onClose: () => void;
  building: Building;
  duesRecord: DuesRecord;
  currentUser: User | null;
  onSubmitPayment: (
    recordId: string, 
    details: { paymentMethod: 'IBAN_HAVALE'; receiptImageUrl?: string; note?: string }
  ) => void;
}

export const PayDuesModal: React.FC<PayDuesModalProps> = ({
  isOpen,
  onClose,
  building,
  duesRecord,
  currentUser,
  onSubmitPayment,
}) => {
  const [copiedIban, setCopiedIban] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80'
  );
  const [note, setNote] = useState(`Daire ${duesRecord.apartmentNo} - ${duesRecord.residentName} - ${duesRecord.month} Aidatı FAST`);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const descriptionText = `Daire ${duesRecord.apartmentNo} ${duesRecord.residentName} ${duesRecord.month} Aidat`;

  const copyIban = () => {
    navigator.clipboard.writeText(building.iban.replace(/\s+/g, ''));
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  const copyDescription = () => {
    navigator.clipboard.writeText(descriptionText);
    setCopiedDesc(true);
    setTimeout(() => setCopiedDesc(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setReceiptUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    onSubmitPayment(duesRecord.id, {
      paymentMethod: 'IBAN_HAVALE',
      receiptImageUrl: receiptUrl || undefined,
      note: note,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight">IBAN ile Aidat Ödemesi Bildir</h3>
              <p className="text-[11px] text-emerald-300">
                Daire {duesRecord.apartmentNo} - {duesRecord.month} (Tutar: {duesRecord.amount} ₺)
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
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Step 1: IBAN Information Card */}
          <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-700" />
                1. Binanın Aidat IBAN Numarası:
              </span>
              <span className="text-[11px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                {building.bankName}
              </span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-emerald-300 flex items-center justify-between gap-2 shadow-2xs">
              <div>
                <span className="text-[10px] text-slate-500 font-semibold block">Alıcı: {building.ibanOwner}</span>
                <span className="font-mono text-xs sm:text-sm font-black text-slate-900 tracking-wider select-all">
                  {building.iban}
                </span>
              </div>
              <button
                type="button"
                id="btn-copy-iban-modal"
                onClick={copyIban}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shrink-0 shadow-xs"
              >
                {copiedIban ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedIban ? 'Kopyalandı' : 'IBAN Kopyala'}
              </button>
            </div>

            {/* Transfer Description Shortcut */}
            <div className="p-2.5 bg-white/80 rounded-lg border border-emerald-200 text-xs flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">Havale / EFT Açıklaması:</span>
                <span className="font-semibold text-slate-800">{descriptionText}</span>
              </div>
              <button
                type="button"
                onClick={copyDescription}
                className="text-[11px] text-emerald-700 font-bold hover:underline flex items-center gap-1 shrink-0"
              >
                {copiedDesc ? '✓ Kopyalandı' : 'Açıklamayı Kopyala'}
              </button>
            </div>
          </div>

          {/* Step 2: Upload Receipt (Dekont) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              2. Banka Dekontu / Fiş Ekran Görüntüsü Yükle (Önerilir)
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-emerald-400 rounded-xl p-3.5 bg-slate-50 text-center relative transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {receiptUrl ? (
                <div className="flex items-center justify-center gap-3">
                  <img
                    src={receiptUrl}
                    alt="Dekont Önizleme"
                    className="w-16 h-14 object-cover rounded-lg border border-emerald-400 shadow-xs"
                  />
                  <div className="text-left">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                      <FileCheck className="w-4 h-4 text-emerald-600" /> Dekont Görseli Seçildi
                    </span>
                    <span className="text-[10px] text-slate-500 block">Değiştirmek için dokunun veya tıklayın</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload className="w-6 h-6 text-emerald-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">Dekont / Ekran Görüntüsü Seç</p>
                  <p className="text-[10px] text-slate-500">Mobil bankacılık dekontu veya makbuz</p>
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Note / Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              3. Ekstra Açıklama veya Not (Opsiyonel)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Örn: Garanti Bankası FAST ile gönderildi"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Notice */}
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 text-[11px] flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              Bildirim gönderdikten sonra aidat durumunuz <strong>"Onay Bekliyor"</strong> olarak işaretlenecek ve bina yöneticisi banka hesabını kontrol edip onaylayacaktır.
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              id="btn-submit-pay-dues"
              disabled={isSubmitting}
              className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? 'Gönderiliyor...' : 'Ödemeyi Bildir'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
