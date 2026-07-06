import type { menuType } from "./types";

interface Props {
  menus: menuType[];
}

export default function BottomNav({ menus }: Props) {
  return (
    <div
      className={`bg-blue-100 rounded-t-[60px] flex items-center justify-around p-4 py-8 w-full -mt-17 fixed bottom-0 z-50 max-w-lg left-1/2 -translate-x-1/2 ${menus.length <= 0 && "hidden"}`}
    >
      {menus.map((item) => {
        const NavIcon = item.icon;

        return (
          <button
            key={item.name}
            type="button"
            aria-label={item.name}
            title={item.name}
            className={
              (item.isActive ? "rounded-2xl bg-blue-500 text-white " : "") +
              "p-2 h-12 w-12 flex justify-center items-center"
            }
          >
            <NavIcon className="w-8! h-8!" />
          </button>
        );
      })}
    </div>
  );
}
