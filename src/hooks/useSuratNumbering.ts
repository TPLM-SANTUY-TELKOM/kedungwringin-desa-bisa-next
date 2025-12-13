"use client";

import { useState } from "react";

import { useToast } from "./use-toast";

type GenerateNumberParams = {
  jenisSurat: string;
  nomorUrutManual?: string | null;
};

type GenerateNumberResult = {
  reservedNumberId: string;
  nomorSurat: string;
  tanggalSurat: string;
};

export function useSuratNumbering() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateNumber = async ({ jenisSurat, nomorUrutManual }: GenerateNumberParams): Promise<GenerateNumberResult | null> => {
    setIsGenerating(true);
    try {
      const payload: Record<string, string> = { jenisSurat };

      if (nomorUrutManual && nomorUrutManual.trim() !== "") {
        payload.nomorUrutManual = nomorUrutManual.trim();
      }

      const response = await fetch("/api/surat-number", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Gagal menggenerate nomor surat" }));

        if (response.status === 409) {
          toast({
            variant: "destructive",
            title: "Nomor urut sudah digunakan",
            description:
              errorData.error ||
              "Nomor urut yang Anda masukkan sudah digunakan. Silakan gunakan nomor lain atau kosongkan untuk auto-generate.",
          });
          return null;
        }

        throw new Error(errorData.error || "Gagal menggenerate nomor surat");
      }

      const result = await response.json();
      const { id, nomorSurat, tanggalSurat } = result;

      if (!id || !nomorSurat) {
        throw new Error("Respons nomor surat tidak valid");
      }

      return {
        reservedNumberId: id,
        nomorSurat,
        tanggalSurat: tanggalSurat ?? new Date().toISOString().slice(0, 10),
      };
    } catch (error) {
      console.error("Error generating nomor surat:", error);
      throw error instanceof Error ? error : new Error("Gagal menggenerate nomor surat");
    } finally {
      setIsGenerating(false);
    }
  };

  return { isGenerating, generateNumber };
}
