'use client';

import { useCallback, useState } from 'react';

export type PendudukLookupResult = {
  id: string;
  nik: string;
  no_kk: string;
  nama: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: 'Laki-laki' | 'Perempuan';
  golongan_darah?: string | null;
  agama: string;
  status_kawin: string;
  status_perkawinan?: string | null;
  pekerjaan: string | null;
  pendidikan: string | null;
  alamat: string;
  dusun: string;
  rt: string;
  rw: string;
};

type LookupStatus = 'idle' | 'loading' | 'success' | 'error';

export type LookupState = {
  status: LookupStatus;
  message?: string;
};

const normalizeDateOnly = (value: string | null | undefined) => {
  if (!value) return "";
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    return date.toISOString().slice(0, 10);
  }
  if (typeof value === "string" && value.length >= 10) {
    return value.slice(0, 10);
  }
  return "";
};

export const usePendudukLookup = (
  onSuccess: (data: PendudukLookupResult) => void,
) => {
  const [state, setState] = useState<LookupState>({ status: 'idle' });

  const reset = useCallback(() => {
    setState({ status: 'idle' });
  }, []);

  const lookupByNik = useCallback(
    async (rawNik: string) => {
      const nik = rawNik.trim();

      if (!nik) {
        setState({ status: 'error', message: 'NIK tidak boleh kosong.' });
        return;
      }

      if (nik.length !== 16) {
        setState({ status: 'error', message: 'NIK harus terdiri dari 16 digit.' });
        return;
      }

      setState({ status: 'loading', message: 'Mencari data penduduk...' });

      try {
        const response = await fetch(
          `/api/penduduk?nik=${encodeURIComponent(nik)}`,
          { cache: 'no-store' },
        );

        if (response.status === 404) {
          setState({
            status: 'error',
            message: 'Data penduduk tidak ditemukan.',
          });
          return;
        }

        if (!response.ok) {
          throw new Error(`Lookup failed with status ${response.status}`);
        }

        const data = (await response.json()) as PendudukLookupResult | null;

        if (!data) {
          setState({
            status: 'error',
            message: 'Data penduduk tidak ditemukan.',
          });
          return;
        }

        onSuccess({
          ...data,
          tanggal_lahir: normalizeDateOnly(data.tanggal_lahir),
        });
        setState({
          status: 'success',
          message: 'Data pemohon berhasil dimuat dari NIK.',
        });
      } catch (error) {
        console.error('lookupByNik error:', error);
        setState({
          status: 'error',
          message: 'Terjadi kesalahan saat mengambil data penduduk.',
        });
      }
    },
    [onSuccess],
  );

  return {
    lookupState: state,
    lookupByNik,
    resetLookupState: reset,
  };
};
