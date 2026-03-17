import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Users, CheckCircle, TrendingUp, Clock, ChevronRight, AlertCircle, Star, Bell } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { patients, sessions } from "../../data/mockData";

const MOODS = ["😢", "😟", "😐", "🙂", "😊"];

function AdherenceBar({ pct }: { pct: number }) {
  const color = pct >= 80 ? "#6BAF8F" : pct >= 50 ? "#C49A40" : "#C96B8A";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full" style={{ background: "#F0EDF8" }}>
        <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.75rem", fontWeight: 700, color }}>{pct}%</span>
    </div>
  );
}

export default function NurseDashboard() {
  const navigate = useNavigate();
  const { getPatientSessions, getPendingApprovals } = useApp();

  const patientStats = patients.map((p) => {
    const sess = getPatientSessions(p.id);
    const completed = sess.filter((s) => s.status === "selesai");
    const adherence = Math.round((completed.length / 15) * 100);
    const todayDone = sess.find((s) => s.day === p.currentDay)?.status === "selesai";
    const lastMood = completed.length > 0 ? completed[completed.length - 1]?.mood : null;
    const totalDur = completed.reduce((a, s) => a + (s.durationMinutes ?? 0), 0);
    const pendingCount = sess.filter((s) => s.approvalStatus === "menunggu").length;
    return { ...p, completed: completed.length, adherence, todayDone, lastMood, totalDur, pendingCount };
  });

  const totalCompleted = patientStats.reduce((a, p) => a + p.completed, 0);
  const avgAdherence = Math.round(patientStats.reduce((a, p) => a + p.adherence, 0) / patientStats.length);
  const todayActive = patientStats.filter((p) => p.todayDone).length;
  const pendingApprovals = getPendingApprovals();
  const totalPending = pendingApprovals.length;

  const today = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="flex flex-col" style={{ background: "#FEF9F7", minHeight: "100%" }}>
      {/* Date bar */}
      <div className="px-5 py-3" style={{ background: "#F5F0F8" }}>
        <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.8rem", color: "#8B7EC4" }}>{today}</p>
      </div>

      <div className="px-5 py-5 flex flex-col gap-5">
        {/* Overview stats */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="mb-3" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#2D2D3E" }}>Ringkasan Hari Ini</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Total Pasien", value: patients.length, icon: Users, color: "#8B7EC4", bg: "#EEE9F9" },
              { label: "Sesi Selesai Hari Ini", value: todayActive, icon: CheckCircle, color: "#6BAF8F", bg: "#E8F5EE" },
              { label: "Total Sesi Terselesaikan", value: totalCompleted, icon: Star, color: "#C49A40", bg: "#F5EDD8" },
              { label: "Kepatuhan Rata-rata", value: `${avgAdherence}%`, icon: TrendingUp, color: "#C96B8A", bg: "#F7E8EE" },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="rounded-2xl p-4" style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                </div>
                <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#2D2D3E", fontSize: "1.1rem" }}>{value}</div>
                <div style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.72rem", color: "#9B9BAE", marginTop: "0.2rem" }}>{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pending Approvals Banner */}
        {totalPending > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <div className="rounded-2xl overflow-hidden" style={{ boxShadow: "0 4px 16px rgba(245,166,35,0.2)" }}>
              <div className="px-4 py-3 flex items-center gap-3" style={{ background: "linear-gradient(135deg, #FFF3D0, #FFE090)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.6)" }}>
                  <Bell className="w-5 h-5" style={{ color: "#C49A40" }} />
                </div>
                <div className="flex-1">
                  <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#8A6A20", fontSize: "0.9rem" }}>
                    {totalPending} sesi menunggu persetujuanmu
                  </p>
                  <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.75rem", color: "#B09040" }}>
                    Tinjau progres pasien untuk mengizinkan mereka lanjut
                  </p>
                </div>
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#C49A40" }}>
                  <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "white", fontSize: "0.75rem" }}>{totalPending}</span>
                </div>
              </div>
              {/* Quick pending list */}
              <div style={{ background: "white" }}>
                {pendingApprovals.slice(0, 3).map(({ patient, session }) => {
                  const def = sessions.find((s) => s.day === session.day);
                  return (
                    <button
                      key={`${patient.id}-${session.day}`}
                      onClick={() => navigate(`/perawat/pasien/${patient.id}`)}
                      className="w-full flex items-center gap-3 px-4 py-3"
                      style={{ borderBottom: "1px solid #FAF8FF" }}
                    >
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#EEE9F9" }}>
                        <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#8B7EC4", fontSize: "0.8rem" }}>{patient.name[0]}</span>
                      </div>
                      <div className="flex-1 text-left">
                        <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600, color: "#2D2D3E", fontSize: "0.82rem" }}>{patient.name}</p>
                        <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.7rem", color: "#9B9BAE" }}>
                          Hari {session.day}: {def?.title}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full shrink-0" style={{ background: "#FFF3D0", color: "#8A6A20", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>
                        Tinjau
                      </span>
                    </button>
                  );
                })}
                {totalPending > 3 && (
                  <div className="px-4 py-2 text-center">
                    <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.75rem", color: "#C49A40" }}>+{totalPending - 3} lainnya</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Alert for low adherence */}
        {patientStats.some((p) => p.adherence < 50) && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "#FFF0F0", border: "1px solid #F0C8C8" }}>
            <AlertCircle className="w-5 h-5 shrink-0" style={{ color: "#C85858" }} />
            <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.85rem", color: "#8A3838" }}>
              Beberapa pasien memiliki kepatuhan di bawah 50%. Pertimbangkan untuk menghubungi mereka.
            </p>
          </motion.div>
        )}

        {/* Patient list */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="mb-3" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#2D2D3E" }}>Daftar Pasien</h2>
          <div className="flex flex-col gap-3">
            {patientStats.map((p) => (
              <button key={p.id} onClick={() => navigate(`/perawat/pasien/${p.id}`)} className="w-full rounded-2xl p-4 text-left" style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: p.pendingCount > 0 ? "1.5px solid #F0D090" : "1px solid #F5F0F8" }}>
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #EEE9F9, #DDD5F8)" }}>
                    <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#8B7EC4", fontSize: "1.1rem" }}>{p.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#2D2D3E" }}>{p.name}</span>
                      <div className="flex items-center gap-2">
                        {p.pendingCount > 0 && (
                          <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: "#FFF3D0", color: "#8A6A20", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>
                            <Clock className="w-2.5 h-2.5" />
                            {p.pendingCount}
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4" style={{ color: "#C0B8D0" }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.72rem", color: "#9B9BAE" }}>{p.chemoCycle}</span>
                      <span className="w-1 h-1 rounded-full" style={{ background: "#D0C8E0" }} />
                      <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.72rem", color: "#9B9BAE" }}>Hari ke-{p.currentDay}</span>
                    </div>
                    {/* Stats row */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" style={{ color: "#6BAF8F" }} />
                        <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.72rem", color: "#4A8F6A", fontWeight: 600 }}>{p.completed}/15 sesi</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" style={{ color: "#8B7EC4" }} />
                        <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.72rem", color: "#6B5A8A", fontWeight: 600 }}>{p.totalDur} mnt</span>
                      </div>
                      {p.lastMood && (
                        <div className="flex items-center gap-1">
                          <span style={{ fontSize: "0.8rem" }}>{MOODS[p.lastMood - 1]}</span>
                          <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.7rem", color: "#9B9BAE" }}>Terakhir</span>
                        </div>
                      )}
                    </div>
                    {/* Adherence bar */}
                    <div className="mt-2">
                      <AdherenceBar pct={p.adherence} />
                    </div>
                    {/* Today status + pending */}
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-2 py-1 rounded-full" style={{ background: p.todayDone ? "#E8F5EE" : "#F7E8EE", color: p.todayDone ? "#4A8F6A" : "#C96B8A", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>
                        {p.todayDone ? "✓ Sesi hari ini selesai" : "○ Sesi hari ini belum selesai"}
                      </span>
                      {p.pendingCount > 0 && (
                        <span className="text-xs px-2 py-1 rounded-full" style={{ background: "#FFF3D0", color: "#8A6A20", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>
                          ⏳ {p.pendingCount} menunggu persetujuan
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        <div className="h-4" />
      </div>
    </div>
  );
}
