import { useCallback, useEffect, useState } from "react";
import {
  createClass,
  createSubject,
  listClasses,
  listStudents,
  listSubjects,
  updateClass,
  updateStudent,
  type ClassRecord,
  type StudentRecord,
  type SubjectRecord,
} from "../../academic/api/academicApi";
import { ApiErrorState, EmptyState } from "../../../shared/components/ApiState";
import { apiErrorMessage } from "../../../shared/components/apiErrorMessage";
import ScheduleAdminPanel from "../../jadwal/components/ScheduleAdminPanel";

function ListCard({ title, children, onSubmit, submitLabel }: {
  title: string;
  children: React.ReactNode;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  submitLabel: string;
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold">{title}</h2>
      <form className="mt-4 flex flex-wrap gap-2" onSubmit={onSubmit}>{children}<button className="rounded bg-blue-500 px-3 py-2 text-sm font-semibold text-white">{submitLabel}</button></form>
    </section>
  );
}

export default function AkademikDanJadwal() {
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [subjects, setSubjects] = useState<SubjectRecord[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [classSearch, setClassSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [className, setClassName] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentNis, setStudentNis] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [error, setError] = useState<unknown>(null);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [classResponse, subjectResponse, studentResponse] = await Promise.all([
        listClasses({ q: classSearch, page: 1, pageSize: 20 }),
        listSubjects({ page: 1, pageSize: 20 }),
        listStudents({ classId: selectedClassId || undefined, q: studentSearch, page, pageSize: 20 }),
      ]);
      setClasses(classResponse.items ?? []);
      setSubjects(subjectResponse.items ?? []);
      setStudents(studentResponse.items ?? []);
      setTotalStudents(studentResponse.total ?? studentResponse.items?.length ?? 0);
    } catch (loadError) {
      setError(loadError);
    } finally {
      setLoading(false);
    }
  }, [classSearch, page, selectedClassId, studentSearch]);

  useEffect(() => {
    const timer = globalThis.setTimeout(() => { void load(); }, 0);
    return () => globalThis.clearTimeout(timer);
  }, [load]);

  async function submitClass(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await createClass({ name: className, level: classLevel || undefined });
      setClassName(""); setClassLevel(""); setNotice("Kelas berhasil dibuat."); await load();
    } catch (submitError) { setError(submitError); }
  }

  async function submitSubject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await createSubject({ code: subjectCode, name: subjectName });
      setSubjectCode(""); setSubjectName(""); setNotice("Mata pelajaran berhasil dibuat."); await load();
    } catch (submitError) { setError(submitError); }
  }

  async function saveStudent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!studentId) return;
    try {
      await updateStudent(studentId, { nis: studentNis || undefined, classId: selectedClassId || null });
      setNotice("Profil siswa berhasil diperbarui."); await load();
    } catch (submitError) { setError(submitError); }
  }

  async function editClass(item: ClassRecord) {
    const name = window.prompt("Nama kelas", item.name);
    if (name === null) return;
    try {
      await updateClass(item.id, { name });
      setNotice("Kelas berhasil diperbarui."); await load();
    } catch (submitError) { setError(submitError); }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold">Akademik</h1>
      <p className="mt-1 text-sm text-gray-600">Data diambil dari API. ID tetap menggunakan UUID dari backend.</p>
      {notice && <p className="mt-4 rounded bg-green-50 p-3 text-sm text-green-800">{notice}</p>}
      {Boolean(error) && <div className="mt-4"><ApiErrorState error={error} onRetry={() => void load()} /><p className="mt-1 text-xs text-gray-500">{apiErrorMessage(error)}</p></div>}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <ListCard title="Kelas" onSubmit={submitClass} submitLabel="Tambah">
          <input required value={className} onChange={(e) => setClassName(e.target.value)} placeholder="Nama kelas" className="min-w-0 flex-1 rounded border p-2 text-sm" />
          <input value={classLevel} onChange={(e) => setClassLevel(e.target.value)} placeholder="Tingkat (opsional)" className="w-36 rounded border p-2 text-sm" />
        </ListCard>
        <ListCard title="Mata pelajaran" onSubmit={submitSubject} submitLabel="Tambah">
          <input required value={subjectCode} onChange={(e) => setSubjectCode(e.target.value)} placeholder="Kode" className="w-24 rounded border p-2 text-sm" />
          <input required value={subjectName} onChange={(e) => setSubjectName(e.target.value)} placeholder="Nama" className="min-w-0 flex-1 rounded border p-2 text-sm" />
        </ListCard>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="rounded-lg border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2"><h2 className="font-semibold">Daftar kelas</h2><input value={classSearch} onChange={(e) => setClassSearch(e.target.value)} placeholder="Cari" className="w-32 rounded border p-2 text-sm" /></div>
          <div className="mt-3 space-y-2">{classes.map((item) => <div key={item.id} className="flex items-center justify-between border-b py-2 text-sm"><span><b>{item.name}</b>{item.level ? ` · ${item.level}` : ""} · {item.studentCount ?? 0} siswa</span><button className="text-blue-600 underline" onClick={() => void editClass(item)}>Ubah</button></div>)}{!loading && classes.length === 0 && <EmptyState>Tidak ada kelas.</EmptyState>}</div>
        </section>
        <section className="rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Daftar mata pelajaran</h2>
          <div className="mt-3 space-y-2">{subjects.map((item) => <div key={item.id} className="border-b py-2 text-sm"><b>{item.code}</b> · {item.name}</div>)}{!loading && subjects.length === 0 && <EmptyState>Tidak ada mata pelajaran.</EmptyState>}</div>
        </section>
      </div>
      <section className="mt-6 rounded-lg border bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2"><h2 className="mr-auto font-semibold">Siswa</h2><select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="rounded border p-2 text-sm"><option value="">Semua kelas</option>{classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><input value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} placeholder="Cari siswa" className="w-36 rounded border p-2 text-sm" /></div>
        <div className="mt-3 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="p-2">Nama</th><th className="p-2">NIS</th><th className="p-2">Kelas</th><th className="p-2">Aksi</th></tr></thead><tbody>{students.map((item) => <tr key={item.userId} className="border-b"><td className="p-2">{item.fullName}</td><td className="p-2">{item.nis ?? "-"}</td><td className="p-2">{item.className ?? "-"}</td><td className="p-2"><button className="text-blue-600 underline" onClick={() => { setStudentId(item.userId); setStudentNis(item.nis ?? ""); setSelectedClassId(item.classId ?? ""); }}>Pilih</button></td></tr>)}</tbody></table>{!loading && students.length === 0 && <EmptyState>Tidak ada siswa.</EmptyState>}</div>
        {studentId && <form onSubmit={saveStudent} className="mt-4 flex flex-wrap gap-2 border-t pt-4"><input value={studentNis} onChange={(e) => setStudentNis(e.target.value)} placeholder="NIS" className="rounded border p-2 text-sm" /><button className="rounded bg-blue-500 px-3 py-2 text-sm font-semibold text-white">Simpan profil siswa</button></form>}
        <div className="mt-4 flex items-center justify-between text-sm"><span>Halaman {page}</span><div className="flex gap-2"><button disabled={page === 1} onClick={() => setPage((value) => value - 1)} className="rounded border px-3 py-1 disabled:opacity-40">Sebelumnya</button><button disabled={page * 20 >= totalStudents} onClick={() => setPage((value) => value + 1)} className="rounded border px-3 py-1 disabled:opacity-40">Berikutnya</button></div></div>
      </section>
      <ScheduleAdminPanel />
    </div>
  );
}
