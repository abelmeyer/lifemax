function Icon({ children, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

export function DashboardIcon(props) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </Icon>
  );
}

export function WorkoutsIcon(props) {
  return (
    <Icon {...props}>
      <path d="M6.5 8.5v7" />
      <path d="M17.5 8.5v7" />
      <path d="M3 10v4" />
      <path d="M21 10v4" />
      <path d="M6.5 12h11" />
    </Icon>
  );
}

export function HabitsIcon(props) {
  return (
    <Icon {...props}>
      <path d="M20 7L9 18l-5-5" />
    </Icon>
  );
}

export function NutritionIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 3c.5 1.5-.5 2.5-1 3" />
      <path d="M12 8c-4 0-7 3.2-7 7.2C5 18.8 7.8 21 11 21c.5 0 1-.05 1-.05s.5.05 1 .05c3.2 0 6-2.2 6-5.8C19 11.2 16 8 12 8z" />
    </Icon>
  );
}

export function PhotosIcon(props) {
  return (
    <Icon {...props}>
      <rect x="3" y="5" width="18" height="15" rx="2" />
      <circle cx="9" cy="11" r="2" />
      <path d="M21 17l-4.5-4.5a1.5 1.5 0 00-2.1 0L8 19" />
    </Icon>
  );
}

export function ChevronIcon(props) {
  return (
    <Icon {...props}>
      <path d="M6 9l6 6 6-6" />
    </Icon>
  );
}

export function TrophyIcon(props) {
  return (
    <Icon {...props}>
      <path d="M8 4h8v4a4 4 0 01-8 0V4z" />
      <path d="M8 5H5a2 2 0 002 4h1" />
      <path d="M16 5h3a2 2 0 01-2 4h-1" />
      <path d="M10 14v2a2 2 0 002 2 2 2 0 002-2v-2" />
      <path d="M9 20h6" />
    </Icon>
  );
}

export function ActivityIcon(props) {
  return (
    <Icon {...props}>
      <path d="M3 12h4l2 7 4-14 2 7h6" />
    </Icon>
  );
}

export function SearchIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </Icon>
  );
}

export function CameraIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </Icon>
  );
}

export function CompareIcon(props) {
  return (
    <Icon {...props}>
      <rect x="3" y="4" width="8" height="16" rx="1.5" />
      <rect x="13" y="4" width="8" height="16" rx="1.5" />
    </Icon>
  );
}

export function XIcon(props) {
  return (
    <Icon {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Icon>
  );
}

export function ChevronLeftIcon(props) {
  return (
    <Icon {...props}>
      <path d="M15 6l-6 6 6 6" />
    </Icon>
  );
}

export function ChevronRightIcon(props) {
  return (
    <Icon {...props}>
      <path d="M9 6l6 6-6 6" />
    </Icon>
  );
}

export function CalendarIcon(props) {
  return (
    <Icon {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </Icon>
  );
}

export function SparkleIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
    </Icon>
  );
}

export function StarIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 4l2.2 4.9 5.3.6-4 3.7 1.1 5.3-4.6-2.7-4.6 2.7 1.1-5.3-4-3.7 5.3-.6L12 4z" />
    </Icon>
  );
}

export function StoreIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 8l1-4h14l1 4" />
      <path d="M4 8a2.5 2.5 0 005 0 2.5 2.5 0 005 0 2.5 2.5 0 005 0 2.5 2.5 0 005 0" />
      <path d="M5 8v11h14V8" />
    </Icon>
  );
}
