import { NavLink } from "react-router-dom";
import {
  DashboardIcon,
  WorkoutsIcon,
  HabitsIcon,
  NutritionIcon,
  PhotosIcon,
} from "./icons";

const TABS = [
  { to: "/", label: "Dashboard", Icon: DashboardIcon },
  { to: "/workouts", label: "Workouts", Icon: WorkoutsIcon },
  { to: "/habits", label: "Habits", Icon: HabitsIcon },
  { to: "/nutrition", label: "Nutrition", Icon: NutritionIcon },
  { to: "/photos", label: "Photos", Icon: PhotosIcon },
];

export default function TabBar() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/90 backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)", boxShadow: "0 -8px 24px rgba(0,0,0,0.3)" }}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {TABS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className="relative flex flex-1 flex-col items-center gap-1 py-2.5 transition-colors duration-200 active:scale-95"
          >
            {({ isActive }) => (
              <>
                {isActive && <span className="absolute inset-x-3 top-1 bottom-1 rounded-btn bg-accent/10" />}
                <Icon
                  width={22}
                  height={22}
                  className="relative transition-all duration-200"
                  style={{ color: isActive ? "#5AB4FF" : "#6e7a8a", transform: isActive ? "scale(1.08)" : "scale(1)" }}
                />
                <span
                  className="relative text-[11px] font-medium transition-colors duration-200"
                  style={{ color: isActive ? "#5AB4FF" : "#6e7a8a" }}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
