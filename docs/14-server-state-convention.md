# Konvensi Server-State LIMEN

## Status

Implementasi ini menetapkan TanStack Query sebagai pola server-state frontend.
Perubahan ini memasang fondasi dan pola penggunaan; migrasi halaman mock dilakukan
per domain tanpa mengubah UI existing.

## Query

- Provider dan default policy berada di `src/shared/server-state/queryClient.ts`.
- Semua key memakai factory di `src/shared/server-state/queryKeys.ts`.
- Key list selalu memuat filter ter-normalisasi, termasuk `page` dan filter domain.
- Filter `undefined`, `null`, dan string kosong tidak menjadi variasi key.
- Query 401/403 tidak di-retry otomatis; error lain dapat di-retry maksimal dua kali.

Domain key yang tersedia: `masterData`, `schedule`, `quiz`, `tasks`,
`assessment`, `reports`, `counseling`, `aptitude`, `passingGrade`, dan
`notification`.

## Tampilan state

Gunakan `QueryState` untuk membedakan urutan state berikut:

1. loading
2. forbidden
3. error dengan retry
4. empty
5. data

`EmptyState` tidak boleh dipakai untuk menggantikan error. Gunakan
`isForbiddenError` untuk memetakan error 403 atau kode `FORBIDDEN`.
`Pagination` menerima `page`, `pageSize`, dan `total`; perubahan halaman harus
diteruskan ke filter query sehingga key dan request berubah.

## Mutation

Gunakan `useAppMutation` untuk mutation baru. `invalidateKeys` wajib diisi
dengan key domain yang terdampak. Invalidation berjalan setelah mutation sukses,
tanpa optimistic update. Gunakan `mutateOnce` dan `isPending` untuk mencegah
double submit serta menampilkan state pending/success/error dari mutation.

## Render error

`AppErrorBoundary` dipasang di root aplikasi untuk error render yang tidak
tertangani. Error network/API tetap ditangani sebagai state query atau mutation,
bukan sebagai empty state.

## Verifikasi

`src/shared/server-state/serverState.test.ts` memverifikasi bahwa perubahan
filter/page menghasilkan key berbeda dan mutation hanya menginvalidasi key yang
dideklarasikan. Perbedaan empty/error dan retry disediakan oleh komponen state
yang terpisah.
