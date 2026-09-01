export default function SessionCard({ session, onStart }) {
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 style={{ fontSize: 16 }}>{session.skill}</h3>
        <span className="tag">{session.type}</span>
      </div>
      <p style={{ fontSize: 13, color: "var(--brown)", margin: "6px 0" }}>
        {session.level} • {session.duration} • {session.participants}
      </p>
      <p style={{ fontSize: 13, color: "var(--black-soft)", marginBottom: 14 }}>
        with <strong>{session.partner}</strong>
      </p>
      <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => onStart?.(session)}>
        Start Session
      </button>
    </div>
  );
}