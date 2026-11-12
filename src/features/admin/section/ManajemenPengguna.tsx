import { useCallback, useEffect, useState } from "react";
import { createUser, listUsers, updateUser, type AdminUser } from "../api/usersApi";
import type { RoleCode } from "../../auth/api/types";
import { ApiErrorState, EmptyState } from "../../../shared/components/ApiState";

const roles: RoleCode[] = ["siswa", "guru_mapel", "guru_wali", "guru_bk", "admin"];

export default function ManajemenPengguna() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<RoleCode | "">("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newRole, setNewRole] = useState<RoleCode>("siswa");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<unknown>(null);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const response = await listUsers({ q: search, role: role || undefined, page, pageSize: 20 });
      setUsers(response.items ?? []);
      setTotal(response.total ?? response.items?.length ?? 0);
    } catch (loadError) { setError(loadError); } finally { setLoading(false); }
  }, [page, role, search]);

  useEffect(() => {
    const timer = globalThis.setTimeout(() => { void load(); }, 0);
    return () => globalThis.clearTimeout(timer);
  }, [load]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await createUser({ fullName: name, email, password, roles: [newRole] });
      setName(""); setEmail(""); setPassword(""); setNotice("Pengguna berhasil dibuat."); await load();
    } catch (submitError) { setError(submitError); }
  }

  async function toggleStatus(user: AdminUser) {
    if (!user.id) return;
    try {
      await updateUser(user.id, { status: user.status === "active" ? "inactive" : "active" });
      setNotice("Status pengguna berhasil diperbarui."); await load();
    } catch (updateError) { setError(updateError); }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
      <p className="mt-1 text-sm text-gray-600">Operasi mengikuti endpoint pengguna yang tersedia; tidak ada aksi hapus.</p>
      {notice && <p className="mt-4 rounded bg-green-50 p-3 text-sm text-green-800">{notice}</p>}
      {Boolean(error) && <div className="mt-4"><ApiErrorState error={error} onRetry={() => void load()} /></div>}
      <form onSubmit={submit} className="mt-6 grid gap-2 rounded-lg bg-white p-5 shadow-sm sm:grid-cols-2">
        <h2 className="sm:col-span-2 font-semibold">Tambah pengguna</h2>
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" className="rounded border p-2 text-sm" />
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="rounded border p-2 text-sm" />
        <input required minLength={1} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Kata sandi" className="rounded border p-2 text-sm" />
        <select value={newRole} onChange={(e) => setNewRole(e.target.value as RoleCode)} className="rounded border p-2 text-sm">{roles.map((item) => <option key={item} value={item}>{item}</option>)}</select>
        <button className="rounded bg-blue-500 px-4 py-2 text-sm font-semibold text-white sm:col-span-2">Tambah pengguna</button>
      </form>
      <div className="mt-6 flex flex-wrap gap-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama/email" className="rounded border p-2 text-sm" />
        <select value={role} onChange={(e) => setRole(e.target.value as RoleCode | "")} className="rounded border p-2 text-sm"><option value="">Semua role</option>{roles.map((item) => <option key={item} value={item}>{item}</option>)}</select>
      </div>
      <div className="mt-4 overflow-x-auto rounded-lg bg-white shadow-sm"><table className="w-full min-w-[600px] text-left text-sm"><thead><tr className="border-b"><th className="p-4">Nama</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4">Aksi</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-b"><td className="p-4">{user.fullName ?? "-"}</td><td className="p-4">{user.email ?? "-"}</td><td className="p-4">{user.roles?.join(", ") ?? "-"}</td><td className="p-4">{user.status ?? "-"}</td><td className="p-4"><button className="text-blue-600 underline" onClick={() => void toggleStatus(user)}>{user.status === "active" ? "Nonaktifkan" : "Aktifkan"}</button></td></tr>)}</tbody></table>{!loading && users.length === 0 && <EmptyState>Tidak ada pengguna.</EmptyState>}</div>
      <div className="mt-3 flex items-center justify-between text-sm"><span>Halaman {page}</span><div className="flex gap-2"><button disabled={page === 1} onClick={() => setPage((value) => value - 1)} className="rounded border px-3 py-1 disabled:opacity-40">Sebelumnya</button><button disabled={page * 20 >= total} onClick={() => setPage((value) => value + 1)} className="rounded border px-3 py-1 disabled:opacity-40">Berikutnya</button></div></div>
    </div>
  );
}
