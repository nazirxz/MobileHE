import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { CheckCircle, Circle, Lock, TrendingUp, Clock, Star, Calendar, ClipboardList } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useApp } from "../../context/AppContext";
import { sessions } from "../../data/mockData";
import type { Patient } from "../../data/mockData";
import { isProgramInterventionComplete } from "../../data/researchQuestionnaire";

const MOODS = ["😢", "😟", "😐", "🙂", "😊"];

export default function PatientProgress() {
  const navigate = useNavigate();
  const { currentUser, getPatientSessions, getEffectiveCurrentDay, getQuestionnaireBundle } = useApp();
  const patient = currentUser as Patient;
  const allSessions = getPatientSessions(patient?.id ?? "");
  const todayDay = getEffectiveCurrentDay(patient?.id ?? "");

  const completed = allSessions.filter((s) => s.status === "selesai");
  const totalDuration = completed.reduce((acc, s) => acc + (s.durationMinutes ?? 0), 0);
  const avgMood = completed.length > 0 ? (completed.reduce((a, s) => a + (s.mood ?? 3), 0) / completed.length).toFixed(1) : "—";
  const adherencePct = Math.round((completed.length / 15) * 100);

  const moodData = completed.map((s) => ({
    hari: `H${s.day}`,
    mood: s.mood ?? 3,
    label: MOODS[(s.mood ?? 3) - 1],
  }));

  const qBundle = getQuestionnaireBundle(patient?.id ?? "");
  const needsPostTest =
    isProgramInterventionComplete(allSessions) && Boolean(qBundle.pre) && !qBundle.post;

  return (
    <div className="flex flex-col" style={{ background: "#FEF9F7", minHeight: "100%" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-5" style={{ background: "linear-gradient(160deg, #EEE9F9 0%, #F7E8EE 100%)" }}>
        <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#2D2D3E", fontSize: "1.3rem" }}>Kemajuanku 📈</h1>
        <p style={{ fontFamily: "Nunito, sans-serif", color: "#9B9BAE", fontSize: "0.85rem" }}>Program 15 Hari SNEfi Care</p>
      </div>

      <div className="px-5 py-5 flex flex-col gap-5">
        {needsPostTest && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: "#E8F5EE", border: "1.5px solid #B0DDB8" }}>
            <div className="flex items-start gap-3">
              <ClipboardList className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#4A8F6A" }} />
              <p style={{ fontFamily: "Nunito, sans-serif", color: "#2A5A3A", fontSize: "0.82rem", lineHeight: 1.55 }}>
                Program 15 hari telah selesai. Jangan lupa mengisi <strong>kuesioner pasca</strong> di Beranda.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/pasien/kuesioner/post")}
              className="w-full py-2.5 rounded-xl text-white"
              style={{ background: "linear-gradient(135deg, #90D0A8, #6BAF8F)", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.85rem" }}
            >
              Buka kuesioner pasca →
            </button>
          </motion.div>
        )}

        {/* Stats cards */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3">
          {[
            { label: "Sesi Selesai", value: `${completed.length}/15`, icon: CheckCircle, color: "#C96B8A", bg: "#F7E8EE" },
            { label: "Kepatuhan", value: `${adherencePct}%`, icon: TrendingUp, color: "#8B7EC4", bg: "#EEE9F9" },
            { label: "Total Waktu", value: `${totalDuration} mnt`, icon: Clock, color: "#6BAF8F", bg: "#E8F5EE" },
            { label: "Rata-rata Mood", value: completed.length > 0 ? `${avgMood} ${MOODS[Math.round(parseFloat(avgMood as string)) - 1] || ""}` : "—", icon: Star, color: "#C49A40", bg: "#F5EDD8" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="rounded-2xl p-4" style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.72rem", color: "#9B9BAE" }}>{label}</span>
              </div>
              <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#2D2D3E", fontSize: "1rem" }}>{value}</div>
            </div>
          ))}
        </motion.div>

        {/* Mood chart */}
        {moodData.length > 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl p-4" style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#F7E8EE" }}>
                <TrendingUp className="w-4 h-4" style={{ color: "#C96B8A" }} />
              </div>
              <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#2D2D3E" }}>Tren Suasana Hati</span>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={moodData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C96B8A" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C96B8A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hari" tick={{ fontSize: 10, fontFamily: "Nunito, sans-serif", fill: "#9B9BAE" }} axisLine={false} tickLine={false} />
                <YAxis domain={[1, 5]} tick={{ fontSize: 10, fontFamily: "Nunito, sans-serif", fill: "#9B9BAE" }} axisLine={false} tickLine={false} ticks={[1, 2, 3, 4, 5]} />
                <Tooltip
                  contentStyle={{ fontFamily: "Nunito, sans-serif", fontSize: "0.8rem", borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  formatter={(val: number) => [`${MOODS[val - 1]} (${val}/5)`, "Mood"]}
                />
                <Area type="monotone" dataKey="mood" stroke="#C96B8A" strokeWidth={2} fill="url(#moodGrad)" dot={{ fill: "#C96B8A", r: 4 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* 15-day calendar grid */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl p-4" style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#EEE9F9" }}>
              <Calendar className="w-4 h-4" style={{ color: "#8B7EC4" }} />
            </div>
            <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#2D2D3E" }}>Jadwal Sesi</span>
          </div>
          <div className="flex flex-col gap-2">
            {sessions.map((s) => {
              const rec = allSessions.find((r) => r.day === s.day);
              const done = rec?.status === "selesai";
              const today = s.day === todayDay;
              const locked = s.day > todayDay;
              const approval = rec?.approvalStatus;
              const bgDone = approval === "disetujui" ? "#E8F5EE" : approval === "menunggu" ? "#FFFBF0" : approval === "ditolak" ? "#FFF0F0" : "#E8F5EE";
              const iconColor = approval === "disetujui" ? "#6BAF8F" : approval === "menunggu" ? "#C49A40" : approval === "ditolak" ? "#C85858" : "#6BAF8F";
              return (
                <button key={s.day} onClick={() => { if (!locked) navigate(`/pasien/sesi/${s.day}`); }}
                  className="flex items-center gap-3 p-3 rounded-xl transition-colors text-left"
                  style={{ background: done ? bgDone : today ? "#FEF0F7" : "transparent", border: today ? "1px solid #F0C8D8" : "1px solid transparent" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: done ? iconColor : today ? `linear-gradient(135deg, ${s.colorFrom}, ${s.colorTo})` : locked ? "#F5F0F8" : "#F7E8EE" }}>
                    {done ? <CheckCircle className="w-5 h-5 text-white" /> : locked ? <Lock className="w-4 h-4" style={{ color: "#C0B8D0" }} /> : <Circle className="w-4 h-4" style={{ color: s.colorTo }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: locked ? "#C0B8D0" : "#2D2D3E", fontSize: "0.85rem" }}>Hari {s.day}: {s.title}</span>
                      {today && !done && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#F7E8EE", color: "#C96B8A", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>Hari Ini</span>}
                      {done && approval === "menunggu" && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#FFF3D0", color: "#8A6A20", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>⏳ Menunggu</span>}
                      {done && approval === "ditolak" && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#FFF0F0", color: "#8A3838", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>⚠️ Tinjau</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.72rem", color: "#9B9BAE" }}>{s.theme}</span>
                      {done && rec?.mood && <span style={{ fontSize: "0.75rem" }}>{MOODS[rec.mood - 1]}</span>}
                      {done && rec?.durationMinutes && <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.7rem", color: "#9B9BAE" }}>{rec.durationMinutes} mnt</span>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Motivation */}
        {completed.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg, #F7E8EE, #EEE9F9)" }}>
            <p style={{ fontFamily: "Nunito, sans-serif", color: "#6B4A8A", lineHeight: 1.7, fontSize: "0.9rem", textAlign: "center" }}>
              💗 Kamu telah menyelesaikan <strong>{completed.length} sesi</strong> dengan penuh keberanian. Tetap semangat — setiap langkah yang kamu ambil adalah bukti kekuatanmu yang luar biasa!
            </p>
          </motion.div>
        )}

        <div className="h-4" />
      </div>
    </div>
  );
}