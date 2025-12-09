"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PEJABAT_DESA_OPTIONS } from "@/data/pejabat-desa";
import { cn } from "@/lib/utils";

type KepalaDesaSelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  triggerClassName?: string;
};

export function KepalaDesaSelect({ value, onValueChange, placeholder, triggerClassName }: KepalaDesaSelectProps) {
  const isKnownValue = value ? PEJABAT_DESA_OPTIONS.some((option) => option.nama === value) : false;

  return (
    <Select value={value || undefined} onValueChange={onValueChange}>
      <SelectTrigger className={cn(triggerClassName)}>
        <SelectValue placeholder={placeholder ?? "Pilih pejabat penandatangan"} />
      </SelectTrigger>
      <SelectContent>
        {PEJABAT_DESA_OPTIONS.map((option) => (
          <SelectItem key={option.id} value={option.nama}>
            {option.jabatan} - {option.nama}
          </SelectItem>
        ))}
        {!isKnownValue && value ? (
          <SelectItem value={value}>{`Saat ini: ${value}`}</SelectItem>
        ) : null}
      </SelectContent>
    </Select>
  );
}
