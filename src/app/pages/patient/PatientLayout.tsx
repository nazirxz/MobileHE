import { Outlet, useNavigate, useLocation } from "react-router";
import { useEffect } from "react";
import { Home, BarChart2, User } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function PatientLayout() {
  const { currentUser, userRole } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!currentUser || userRole !== "pasien") navigate("/", { replace: true });
  }, [currentUser, userRole, navigate]);

  const tabs = [
    { path: "/pasien", label: "Beranda", icon: Home },
    { path: "/pasien/kemajuan", label: "Kemajuan", icon: BarChart2 },
    { path: "/pasien/profil", label: "Profil", icon: User },
  ];

  const isSessionPage = location.pathname.includes("/pasien/sesi/");

  return (
    <div className="min-h-screen flex justify-center" style={{ background: "#F5F0F8" }}>
      <div className="w-full max-w-sm flex flex-col min-h-screen relative" style={{ background: "#FEF9F7" }}>
        <div className="flex-1 overflow-y-auto" style={{ paddingBottom: isSessionPage ? "0" : "80px" }}>
          <Outlet />
        </div>
        {!isSessionPage && (
          <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm z-50 border-t" style={{ background: "white", borderColor: "#F0E8EE" }}>
            <div className="flex items-center justify-around py-2">
              {tabs.map(({ path, label, icon: Icon }) => {
                const active = path === "/pasien" ? location.pathname === "/pasien" : location.pathname.startsWith(path);
                return (
                  <button key={path} onClick={() => navigate(path)} className="flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-colors">
                    <Icon className="w-5 h-5" style={{ color: active ? "#C96B8A" : "#B0A8C0" }} />
                    <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.7rem", fontWeight: active ? 700 : 400, color: active ? "#C96B8A" : "#B0A8C0" }}>{label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
