import React from "react";
import ProgressBar from "../components/ProgressBar.jsx";

const learntSkills = [
  { name: "C Programming", percent: 80 },
  { name: "Python", percent: 50 },
  { name: "HTML", percent: 100 },
];

export default function Learnt() {
  return (
    <div className="page">
      <h1 style={{ fontSize: 26, color: "var(--black-soft)", marginBottom: 20 }}>
        My Learning
      </h1>
      <div className="card">
        {learntSkills.map((s) => (
          <ProgressBar key={s.name} label={s.name} percent={s.percent} />
        ))}
      </div>
    </div>
  );
}