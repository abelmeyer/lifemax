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
