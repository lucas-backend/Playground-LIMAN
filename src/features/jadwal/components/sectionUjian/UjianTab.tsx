import { Navigate, Route, Routes } from "react-router-dom";
import UjianSubtab from "./components/UjianSubtab";

export default function UjianTab() {
  return (
    <Routes>
      <Route index element={<Navigate to={"ulangan-harian"} />} />
      <Route path="*" element={<UjianSubtab />} />
    </Routes>
  );
}
