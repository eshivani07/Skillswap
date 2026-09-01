import React from "react";
import { useApp } from "../context/AppContext.jsx";
import { Link } from "react-router-dom";

export default function Home() {
  const { profile } = useApp();

  return (
    <div className="page">
      <h1 style={{ fontSize: 28, color: "var(--black-soft)" }}>
        Welcome, {profile?.name || "there"}!
      </h1>
      <p style={{ color: "var(--brown)", marginBottom: 24 }}>
        What do you want to learn today?
      </p>

      <div className="card" style={{ marginBottom: 24 }}>
        <input
          className="input"
          placeholder="Search skills... e.g. Python, Guitar"
        />
      </div>

      <div className="grid">
        <Link to="/discover" className="card" style={{ textDecoration: "none" }}>
          <h3 style={{ color: "var(--black-soft)", marginBottom: 6 }}>🔍 Discover</h3>
          <p style={{ fontSize: 13, color: "var(--brown)" }}>Find your next learning match</p>
        </Link>
        <Link to="/sessions" className="card" style={{ textDecoration: "none" }}>
          <h3 style={{ color: "var(--black-soft)", marginBottom: 6 }}>📅 Sessions</h3>
          <p style={{ fontSize: 13, color: "var(--brown)" }}>View upcoming & past sessions</p>
        </Link>
        <Link to="/assignments" className="card" style={{ textDecoration: "none" }}>
          <h3 style={{ color: "var(--black-soft)", marginBottom: 6 }}>📝 Assignments</h3>
          <p style={{ fontSize: 13, color: "var(--brown)" }}>Pending practice tasks</p>
        </Link>
        <Link to="/wallet" className="card" style={{ textDecoration: "none" }}>
          <h3 style={{ color: "var(--black-soft)", marginBottom: 6 }}>💰 Wallet</h3>
          <p style={{ fontSize: 13, color: "var(--brown)" }}>Check your SkillCoins</p>
        </Link>
      </div>
    </div>
  );
}