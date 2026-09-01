export default function ProgressBar({ label, percent = 0 }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--black-soft)" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--brown)" }}>{percent}%</span>
      </div>
      <div style={{ height: 10, borderRadius: 999, background: "var(--beige)", overflow: "hidden" }}>
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            borderRadius: 999,
            background: "linear-gradient(90deg, var(--brown-light), var(--brown))",
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}