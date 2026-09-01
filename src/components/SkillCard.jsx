export default function SkillCard({ skill }) {
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
        <h3 style={{ fontSize: 16, color: "var(--black-soft)" }}>{skill.name}</h3>
        <span className="tag">{skill.level}</span>
      </div>
      <p style={{ fontSize: 13, color: "var(--brown)", margin: "8px 0 14px" }}>
        {skill.category}
      </p>
      <button className="btn btn-primary" style={{ width: "100%" }}>
        {skill.mode === "learn" ? "Find a Teacher" : "Offer to Teach"}
      </button>
    </div>
  );
}