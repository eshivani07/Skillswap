import { NavLink } from "react-router-dom";
import { Home, Compass, ClipboardList, BookOpen, User, Wallet as WalletIcon } from "lucide-react";

const navItems = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/assignments", label: "Assignments", icon: ClipboardList },
  { to: "/learnt", label: "Learnt", icon: BookOpen },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/wallet", label: "Wallet", icon: WalletIcon },
];

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>🔄 SkillSwap</div>
      <div style={styles.links}>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              ...styles.link,
              background: isActive ? "var(--brown)" : "transparent",
              color: isActive ? "#fff" : "var(--black-soft)",
            })}
          >
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 28px",
    background: "var(--beige)",
    borderBottom: "1px solid var(--beige-dark)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    flexWrap: "wrap",
    gap: 10,
  },
  logo: {
    fontWeight: 800,
    fontSize: 20,
    color: "var(--brown-dark)",
  },
  links: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 14px",
    borderRadius: 999,
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 600,
    transition: "all 0.2s ease",
  },
};