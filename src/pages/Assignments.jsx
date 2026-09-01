import React from "react";
import mockAssignments from "../data/mockAssignments.js";
import AssignmentCard from "../components/AssignmentCard.jsx";

export default function Assignments() {
  return (
    <div className="page">
      <h1 style={{ fontSize: 26, color: "var(--black-soft)", marginBottom: 6 }}>
        Assignments
      </h1>
      <p style={{ color: "var(--brown)", marginBottom: 20 }}>
        Practice tasks from your recent learning sessions
      </p>
      <div className="grid">
        {mockAssignments.map((a) => (
          <AssignmentCard key={a.id} assignment={a} />
        ))}
      </div>
    </div>
  );
}