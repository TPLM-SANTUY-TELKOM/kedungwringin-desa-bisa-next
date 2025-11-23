# 🎯 Implementation Guide: Auto-Generate Nomor Surat

## Status: Foundation Complete ✅

### Yang Sudah Selesai:
1. ✅ Database table `surat_numbers` 
2. ✅ API endpoint `/api/surat-number` (POST, PATCH, DELETE)
3. ✅ Types.ts - all defaults cleaned
4. ✅ Prefix mapping complete
5. ✅ **SuratFormUmum** & **PreviewUmum** - WORKING EXAMPLE

---

## 📋 Files to Update

Masih perlu update:
1. **SuratFormTidakMampu.tsx** (prefix 421)
2. **PreviewTidakMampu.tsx**
3. **SuratFormBelumPernahKawin.tsx** (prefix 145)
4. **PreviewBelumPernahKawin.tsx**
5. **SuratFormDomisiliTempatTinggal.tsx** (prefix 470)
6. **PreviewDomisiliTempatTinggal.tsx**
7. **SuratFormDomisiliUsaha.tsx** (prefix 470)
8. **PreviewDomisiliUsaha.tsx**
9. **SuratFormUsaha.tsx** (prefix 581)
10. **PreviewUsaha.tsx**

---

## 🔧 FORM COMPONENT - Step by Step

### Step 1: Add States (after existing useState)
```typescript
const [isGeneratingNumber, setIsGeneratingNumber] = useState(false);
const [reservedNumberId, setReservedNumberId] = useState<string | null>(null);
```

### Step 2: Update handlePreview Function
**FIND:**
```typescript
const handlePreview = () => {
  const requiredFields: Array<keyof SuratKeteranganXXXData> = [
    "nomorSurat",
    "tanggalSurat",
    // ... other fields
  ];
```

**REPLACE WITH:**
```typescript
const handlePreview = async () => {
  const requiredFields: Array<keyof SuratKeteranganXXXData> = [
    // REMOVE "nomorSurat" and "tanggalSurat"
    "nama",
    "nik",
    // ... keep only other required fields
  ];

  const missing = requiredFields.filter((field) => {
    const value = form[field];
    if (typeof value === "string") {
      return value.trim() === "";
    }
    return !value;
  });

  if (missing.length > 0) {
    setError("Lengkapi semua bidang wajib terlebih dahulu sebelum melakukan preview surat.");
    return;
  }

  try {
    setIsGeneratingNumber(true);
    setError(null);

    // Generate nomor surat
    const response = await fetch("/api/surat-number", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jenisSurat: surat.slug }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      console.error("API Error:", errorData);
      throw new Error(errorData.error || "Gagal menggenerate nomor surat");
    }

    const result = await response.json();
    console.log("Generated number:", result);
    
    const { id, nomorSurat } = result;
    
    if (!id || !nomorSurat) {
      throw new Error("Invalid response from server");
    }
    
    setReservedNumberId(id);

    // Auto-set tanggal surat to today
    const today = new Date().toISOString().split('T')[0];

    // Update form with generated number and date
    const updatedForm = { ...form, nomorSurat, tanggalSurat: today };
    setForm(updatedForm);

    const params = new URLSearchParams();
    params.set("data", JSON.stringify(updatedForm));
    params.set("reservedNumberId", id);
    if (entryId) {
      params.set("entryId", entryId);
    }
    if (from) {
      params.set("from", from);
    }
    router.push(`/surat-keterangan/${surat.slug}/preview?${params.toString()}`);
  } catch (err) {
    console.error("Error generating number:", err);
    setError(err instanceof Error ? err.message : "Gagal menggenerate nomor surat. Silakan coba lagi.");
  } finally {
    setIsGeneratingNumber(false);
  }
};
```

### Step 3: Remove Nomor & Tanggal Fields from JSX
**DELETE this section completely:**
```tsx
<div className="space-y-4">
  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Informasi Surat</p>
  <div className="grid gap-4 sm:grid-cols-2">
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-slate-700">Nomor Surat</Label>
      <Input value={form.nomorSurat} onChange={handleInputChange("nomorSurat")} ... />
    </div>
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-slate-700">Tanggal Surat</Label>
      <Input type="date" value={form.tanggalSurat} onChange={handleInputChange("tanggalSurat")} ... />
    </div>
  </div>
  <!-- Also remove tempatSurat if exists -->
</div>
```

### Step 4: Make Auto-filled Fields Readonly
For fields that are auto-filled from NIK lookup, add readonly and styling:

```tsx
<Input 
  value={form.nama} 
  onChange={handleInputChange("nama")} 
  placeholder="Contoh: Ahmad Syahrul Ramadhan"
  className={`${INPUT_BASE} ${lookupState.status === 'success' ? 'bg-slate-50' : ''}`}
  readOnly={lookupState.status === 'success'}
/>
{lookupState.status === 'success' && <p className="text-xs text-slate-500">Data dari NIK (otomatis)</p>}
```

Apply to all auto-filled fields: nama, jenisKelamin, tempatLahir, tanggalLahir, agama, pekerjaan, alamat

### Step 5: Update Button
```tsx
<Button 
  type="button" 
  onClick={handlePreview} 
  className="h-12 rounded-full bg-slate-900 px-8 hover:bg-slate-800"
  disabled={isGeneratingNumber}
>
  {isGeneratingNumber ? "Memproses..." : "Preview Surat"}
</Button>
```

---

## 🖼️ PREVIEW COMPONENT - Step by Step

### Step 1: Add Imports
```typescript
import { X, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
```

### Step 2: Add Prop Type
```typescript
type PreviewXXXProps = {
  surat: SuratKeteranganOption;
  data: SuratKeteranganXXXData;
  reservedNumberId?: string;  // ADD THIS
};

export function PreviewXXX({ surat, data, reservedNumberId }: PreviewXXXProps) {
```

### Step 3: Add States
```typescript
const [showConfirmDialog, setShowConfirmDialog] = useState(false);
const [isPrinting, setIsPrinting] = useState(false);
```

### Step 4: Replace handlePrint Function
**FIND:**
```typescript
const handlePrint = () => {
  window.print();
};
```

**REPLACE WITH:**
```typescript
const handlePrintClick = () => {
  setShowConfirmDialog(true);
};

const handleConfirmPrint = async () => {
  setShowConfirmDialog(false);

  if (reservedNumberId) {
    try {
      setIsPrinting(true);
      const response = await fetch("/api/surat-number", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reservedNumberId }),
      });

      if (!response.ok) {
        console.error("Failed to confirm number");
        alert("Gagal mengkonfirmasi nomor surat. Silakan coba lagi.");
        return;
      }
    } catch (error) {
      console.error("Error confirming number:", error);
      alert("Terjadi kesalahan saat mengkonfirmasi nomor surat.");
      return;
    } finally {
      setIsPrinting(false);
    }
  }
  window.print();
};

const handleCancelPrint = () => {
  setShowConfirmDialog(false);
};
```

### Step 5: Update Button onClick
**FIND:**
```tsx
<Button onClick={handlePrint} ...>
```

**REPLACE WITH:**
```tsx
<Button 
  onClick={handlePrintClick} 
  disabled={isPrinting}
  ...
>
  <Printer className="mr-2 h-4 w-4" />
  {isPrinting ? "Memproses..." : "Cetak"}
</Button>
```

### Step 6: Add Custom Dialog (Add after opening <div> of return statement)
```tsx
return (
  <div className="mx-auto mt-12 flex w-full max-w-4xl flex-col gap-10 print:mt-0 print:px-0">
    {/* ADD THIS CUSTOM DIALOG */}
    {showConfirmDialog && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm print-hidden">
        <div className="relative mx-4 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
          <div className="rounded-3xl border border-white/60 bg-white/95 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Konfirmasi Cetak Surat</h3>
                  <p className="text-xs text-slate-500">Pastikan data sudah benar</p>
                </div>
              </div>
              <button
                onClick={handleCancelPrint}
                className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-4 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />
                  <div className="text-sm text-slate-700">
                    <p className="mb-2 font-medium">Apakah Anda sudah yakin dengan data ini?</p>
                    <p className="text-slate-600">
                      Setelah dicetak, nomor surat <span className="font-semibold text-slate-900">{data.nomorSurat}</span> akan 
                      dikonfirmasi secara permanen dan tidak dapat dibatalkan.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleCancelPrint}
                  variant="outline"
                  className="flex-1 rounded-full border-slate-300 px-6 hover:bg-slate-50"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleConfirmPrint}
                  disabled={isPrinting}
                  className="flex-1 rounded-full bg-slate-900 px-6 text-white hover:bg-slate-800"
                >
                  <Printer className="mr-2 h-4 w-4" />
                  {isPrinting ? "Memproses..." : "Ya, Cetak"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    {/* END CUSTOM DIALOG */}

    {/* Rest of the component ... */}
```

### Step 7: Update preview/page.tsx
For each preview page, extract and pass reservedNumberId:

```typescript
const resolvedSearchParams = await searchParams;
const dataString = resolvedSearchParams?.data;
const reservedNumberId = resolvedSearchParams?.reservedNumberId; // ADD THIS

// ... in return statement:
<PreviewXXX 
  surat={surat} 
  data={data}
  reservedNumberId={reservedNumberId} // ADD THIS
/>
```

---

## ✅ Checklist Per Form

### SuratFormTidakMampu + PreviewTidakMampu
- [ ] Add states to form
- [ ] Update handlePreview (async + API call)
- [ ] Remove nomor & tanggal fields
- [ ] Make auto-fill readonly
- [ ] Update button disabled state
- [ ] Add reservedNumberId prop to Preview
- [ ] Add custom dialog to Preview
- [ ] Update handlePrint logic
- [ ] Update preview page to extract reservedNumberId

### Repeat for:
- [ ] BelumPernahKawin
- [ ] DomisiliTempatTinggal
- [ ] DomisiliUsaha
- [ ] Usaha

---

## 🎯 Quick Reference: Prefix Mapping

```typescript
"surat-keterangan-umum": "145" ✅
"surat-keterangan-belum-pernah-kawin": "145"
"surat-keterangan-tidak-mampu": "421"
"surat-keterangan-domisili-tempat-tinggal": "470"
"surat-keterangan-domisili-usaha": "470"
"surat-keterangan-usaha": "581"
"surat-keterangan-wali-hakim": "145"
```

---

## 🚀 Implementation Order (Recommended)

1. **SKTM** (prefix 421) - Different prefix, good test case
2. **Belum Pernah Kawin** (prefix 145) - Same as Umum
3. **Domisili Tempat Tinggal** (prefix 470)
4. **Domisili Usaha** (prefix 470) - Same prefix as Domisili
5. **Usaha** (prefix 581) - Different prefix

---

## 📝 Notes

- All auto-generate logic is in `/api/surat-number/route.ts`
- Database table `surat_numbers` handles race conditions with UNIQUE constraint
- Preview confirmation prevents accidental number confirmation
- System auto-increments nomor_urut per prefix per year
- Format: `{prefix}/{nomor_urut_4_digits}/{month_2_digits}/{year_4_digits}`

Example: `421/0001/11/2024`

---

**Status:** Foundation 100% complete. Template ready for implementation.
**Reference:** SuratFormUmum.tsx & PreviewUmum.tsx are working examples.
