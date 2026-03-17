import { Outlet, useNavigate, useLocation } from "react-router";
import { useEffect } from "react";
import { Heart, LogOut } from "lucide-react";
import { useApp } from "../../context/AppContext";
import type { Nurse } from "../../data/mockData";

export default function NurseLayout() {
  const { currentUser, userRole, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!currentUser || userRole !== "perawat") navigate("/", { replace: true });
  }, [currentUser, userRole, navigate]);

  const nurse = currentUser as Nurse;
  const isDetail = location.pathname.includes("/perawat/pasien/");

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="min-h-screen" style={{ background: "#F0EDF8" }}>
      <div className="max-w-2xl mx-auto min-h-screen flex flex-col" style={{ background: "white" }}>
        {/* Top navbar */}
        {!isDetail && (
          <header className="px-5 pt-10 pb-4 flex items-center justify-between" style={{ background: "linear-gradient(135deg, #EEE9F9, #DDD5F8)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #A08EC8, #8B7EC4)" }}>
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#2D2D3E", fontSize: "1rem" }}>SNEfi Care</div>
                <div style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.72rem", color: "#8B7EC4" }}>Dashboard Perawat</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#2D2D3E", fontSize: "0.8rem" }}>{nurse?.name?.split(",")[0]}</div>
                <div style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.7rem", color: "#9B9BAE" }}>{nurse?.department}</div>
              </div>
              <button onClick={handleLogout} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.7)" }}>
                <LogOut className="w-4 h-4" style={{ color: "#8B7EC4" }} />
              </button>
            </div>
          </header>
        )}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}