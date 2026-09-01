const statusColors = {
  "Not Started": "var(--danger)",
  "In Progress": "var(--warning)",
  "Completed": "var(--success)",
};

export default function AssignmentCard({ assignment }) {
  return (
    <div className="card">
      <h3 style={{ fontSize: 16, marginBottom: 6 }}>{assignment.title}</h3>
      <p style={{ fontSize: 13, color: "var(--black-soft)", marginBottom: 10 }}>
        {assignment.description}
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: statusColors[assignment.status] }}>
          ● {assignment.status}
        </span>
        <button className="btn btn-outline">
          {assignment.status === "Completed" ? "View" : "Solve"}
        </button>
      </div>
    </div>
  );
}