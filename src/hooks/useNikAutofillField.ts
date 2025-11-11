'use client';

import { useCallback, useRef, type ChangeEvent } from 'react';

import {
  usePendudukLookup,
  type PendudukLookupResult,
  type LookupState,
} from '@/app/surat-pengantar/usePendudukLookup';

type UseNikAutofillFieldParams = {
  nikValue: string;
  onNikValueChange: (value: string) => void;
  onApplyData: (data: PendudukLookupResult) => void;
};

type UseNikAutofillFieldReturn = {
  lookupState: LookupState;
  isLookupLoading: boolean;
  handleNikChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleNikLookup: () => void;
};

export const useNikAutofillField = ({
  nikValue,
  onNikValueChange,
  onApplyData,
}: UseNikAutofillFieldParams): UseNikAutofillFieldReturn => {
  const lastSuccessfulNikRef = useRef<string | null>(null);

  const handleApplyData = useCallback(
    (data: PendudukLookupResult) => {
      lastSuccessfulNikRef.current = data.nik;
      onNikValueChange(data.nik ?? nikValue);
      onApplyData(data);
    },
    [nikValue, onApplyData, onNikValueChange],
  );

  const { lookupState, lookupByNik, resetLookupState } = usePendudukLookup(handleApplyData);

  const handleNikChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.replace(/\D/g, '');
      onNikValueChange(value);
      if (lastSuccessfulNikRef.current && lastSuccessfulNikRef.current !== value) {
        lastSuccessfulNikRef.current = null;
      }
      resetLookupState();
    },
    [onNikValueChange, resetLookupState],
  );

  const handleNikLookup = useCallback(() => {
    const nik = nikValue.trim();
    if (!nik || nik === lastSuccessfulNikRef.current) {
      return;
    }
    void lookupByNik(nik);
  }, [nikValue, lookupByNik]);

  return {
    lookupState,
    isLookupLoading: lookupState.status === 'loading',
    handleNikChange,
    handleNikLookup,
  };
};

export type { PendudukLookupResult } from '@/app/surat-pengantar/usePendudukLookup';
