import XPadding from "../../../../components/XPadding";
import { jadwalDates, jadwalSections, jadwalTabs } from "../../../../data/jadwal/jadwalData";
import JadwalDateStrip from "./JadwalDateStrip";
import JadwalSection from "./JadwalSection";
import JadwalTabs from "./JadwalTabs";

export default function JadwalTab() {
  return (
    <XPadding className="mt-4 mb-8">
      <JadwalTabs tabs={jadwalTabs} />
      <JadwalDateStrip dates={jadwalDates} />

      {jadwalSections.map((section) => (
        <JadwalSection
          key={section.title}
          title={section.title}
          items={section.items}
        />
      ))}
    </XPadding>
  );
}
