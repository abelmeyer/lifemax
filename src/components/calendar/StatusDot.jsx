const STYLES = {
  full: { background: "#5ab4ff", boxShadow: "0 0 6px rgba(90,180,255,0.6)" },
  partial: { background: "rgba(90,180,255,0.55)" },
  missed: { background: "rgba(255,255,255,0.14)" },
  rest: { background: "transparent", border: "1.5px solid #5ab4ff" },
  future: { background: "transparent" },
};

export default function StatusDot({ status, size = 6 }) {
  const style = STYLES[status] ?? STYLES.future;
  return <span className="inline-block rounded-full" style={{ width: size, height: size, ...style }} />;
}
