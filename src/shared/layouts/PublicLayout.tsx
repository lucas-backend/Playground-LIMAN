import { Outlet } from "react-router-dom";

// Host untuk route publik (mis. /login) yang tidak memakai shell aplikasi.
// Titik tunggal bila chrome publik dibutuhkan kelak.
export default function PublicLayout() {
  return <Outlet />;
}
