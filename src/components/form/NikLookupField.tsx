'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { LookupState } from '@/app/surat-pengantar/usePendudukLookup';
import { cn } from '@/lib/utils';
import type { ChangeEvent } from 'react';

type NikLookupFieldProps = {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  lookupState: LookupState;
  isLoading: boolean;
  helperText?: string;
  className?: string;
  inputClassName?: string;
  buttonLabel?: string;
};

export function NikLookupField({
  label,
  value,
  onChange,
  onSearch,
  lookupState,
  isLoading,
  helperText = 'Pastikan sesuai KTP elektronik.',
  className,
  inputClassName,
  buttonLabel,
}: NikLookupFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label className="text-sm font-semibold text-slate-700">{label}</Label>
      <div className="rounded-xl bg-slate-100 p-4">
        <div className="flex items-center gap-2">
          <Input
            value={value}
            onChange={onChange}
            placeholder="Nomor Induk Kependudukan"
            inputMode="numeric"
            maxLength={16}
            className={inputClassName}
          />
          <Button
            type="button"
            onClick={onSearch}
            disabled={isLoading}
            className="h-12 rounded-xl bg-[#0f0f0f] px-6 text-sm font-semibold text-white hover:bg-[#1f1f1f]"
          >
            {isLoading ? 'Mencari...' : buttonLabel ?? 'Cari'}
          </Button>
        </div>
        {helperText && <p className="mt-2 text-xs text-slate-500">{helperText}</p>}
        {lookupState.status !== 'idle' && lookupState.message && (
          <p
            className={`mt-1 text-xs ${
              lookupState.status === 'error'
                ? 'text-red-600'
                : lookupState.status === 'success'
                  ? 'text-emerald-600'
                  : 'text-slate-500'
            }`}
          >
            {lookupState.message}
          </p>
        )}
      </div>
    </div>
  );
}
