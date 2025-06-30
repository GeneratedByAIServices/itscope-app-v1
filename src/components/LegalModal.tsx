import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTranslation, I18nextProvider } from 'react-i18next';
import { i18n } from 'i18next';

interface LegalModalProps {
  type: 'terms' | 'privacy' | null;
  onClose: () => void;
  i18n: i18n;
}

const LegalModalContent: React.FC<{type: 'terms' | 'privacy' | null}> = ({ type }) => {
  const { t } = useTranslation('auth');
  const title = type === 'terms' ? t('legal_terms_title') : t('legal_privacy_title');
  const content = type === 'terms' ? t('legal_terms_content') : t('legal_privacy_content');

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">
          {title}
        </DialogTitle>
      </DialogHeader>
      <div className="overflow-y-auto max-h-[60vh] pr-4">
        <pre className="whitespace-pre-wrap text-sm text-zinc-300 leading-relaxed font-noto">
          {content}
        </pre>
      </div>
    </>
  )
}

const LegalModal: React.FC<LegalModalProps> = ({ type, onClose, i18n }) => {
  return (
    <Dialog open={type !== null} onOpenChange={() => onClose()}>
      <DialogContent className="w-11/12 sm:max-w-2xl max-h-[80vh] bg-zinc-900 text-white border-zinc-800">
        <I18nextProvider i18n={i18n}>
          <LegalModalContent type={type} />
        </I18nextProvider>
      </DialogContent>
    </Dialog>
  );
};

export default LegalModal;
