'use client';
import { createContext, useContext, useState } from 'react';

const EnquiryContext = createContext({ open: false, prefill: '', openModal: (subject = '') => {}, closeModal: () => {} });

export function EnquiryProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState('');

  function openModal(subject = '') {
    setPrefill(subject);
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setPrefill('');
  }

  return (
    <EnquiryContext.Provider value={{ open, prefill, openModal, closeModal }}>
      {children}
    </EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error('useEnquiry must be used inside EnquiryProvider');
  return ctx;
}
