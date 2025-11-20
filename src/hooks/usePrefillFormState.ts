"use client";

import { useEffect, useRef, useState } from "react";

type UsePrefillFormStateArgs<T> = {
  createDefault: () => T;
  initialData?: Partial<T> | null;
  entryId?: string | null;
};

export function usePrefillFormState<T>({
  createDefault,
  initialData,
  entryId,
}: UsePrefillFormStateArgs<T>) {
  const [form, setForm] = useState<T>(() => {
    if (initialData) {
      return { ...createDefault(), ...initialData } as T;
    }
    return createDefault();
  });

  const lastEntryId = useRef<string | null>(entryId ?? null);

  useEffect(() => {
    const nextEntryId = entryId ?? null;
    if (lastEntryId.current === nextEntryId && !initialData) {
      return;
    }

    if (initialData) {
      setForm({ ...createDefault(), ...initialData } as T);
    } else if (lastEntryId.current !== nextEntryId) {
      setForm(createDefault());
    }

    lastEntryId.current = nextEntryId;
  }, [entryId, initialData, createDefault]);

  const resetToDefault = () => {
    setForm(createDefault());
    lastEntryId.current = null;
  };

  return { form, setForm, resetToDefault };
}
