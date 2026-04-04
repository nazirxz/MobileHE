import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Heart, BookOpen, Music, Mic, PenLine, ChevronRight, CheckCircle, Lock, Star, Clock, AlertCircle, Headphones } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { sessions } from "../../data/mockData";
import type { Patient } from "../../data/mockData";
import { PROGRAM_CONTACT } from "../../data/programContact";

const greetings = ["Selamat pagi", "Selamat siang", "Selamat sore", "Selamat malam"];
function getGreeting() {
  const h = new Date().getHours();
  if (h < 11) return greetings[0];
  if (h < 15) return greetings[1];
  if (h < 18) return greetings[2];
  return greetings[3];
}

const motivationalQuotes = [
  "Kamu lebih kuat dari yang kamu kira. 💗",
  "Setiap hari yang kamu lalui adalah bukti keberanianmu. 🌸",
  "Langkah kecil tetap adalah langkah maju. ✨",
  "Kamu tidak sendirian dalam perjalanan ini. 🤍",
  "Tubuhmu berjuang, dan kamu mendukungnya. 🌺",
];

const moduleIcons = [
  { icon: BookOpen, label: "Edukasi", color: "#C96B8A", bg: "#F7E8EE" },
  { icon: Music, label: "Musik", color: "#8B7EC4", bg: "#EEE9F9" },
  { icon: Mic, label: "Afirmasi", color: "#6BAF8F", bg: "#E8F5EE" },
  { icon: PenLine, label: "Refleksi", color: "#C49A40", bg: "#F5EDD8" },
];

export default function PatientDashboard() {
  const { currentUser, getPatientSessions, getEffectiveCurrentDay } = useApp();
  const navigate = useNavigate();
  const patient = currentUser as Patient;
  const allSessions = getPatientSessions(patient?.id ?? "");
  const quote = motivationalQuotes[new Date().getDay() % motivationalQuotes.length];

  const completedCount = allSessions.filter((s) => s.status === "selesai").length;
  const progressPct = Math.round((completedCount / 15) * 100);

  const todayDay = getEffectiveCurrentDay(patient?.id ?? "");
  const todaySessionDef = sessions.find((s) => s.day === todayDay);
  const todayModuleIcons = todayDay === 1 ? moduleIcons : moduleIcons.slice(1);
  const todayRecord = allSessions.find((s) => s.day === todayDay);
  const isTodayCompleted = todayRecord?.status === "selesai";
  const todayApproval = todayRecord?.approvalStatus; // 'menunggu' | 'disetujui' | 'ditolak' | undefined

  const recentCompleted = allSessions.filter((s) => s.status === "selesai" && s.approvalStatus === "disetujui").slice(-3).reverse();

  // Determine dot state per day
  function getDotState(d: number) {
    const rec = allSessions.find((s) => s.day === d);
    if (!rec || rec.status !== "selesai") {
      return d === todayDay ? "current" : d < todayDay ? "missed" : "locked";
    }
    if (rec.approvalStatus === "disetujui") return "approved";
    if (rec.approvalStatus === "menunggu") return "pending";
    if (rec.approvalStatus === "ditolak") return "rejected";
    return "approved"; // fallback for old data
  }

  return (
    <div className="flex flex-col" style={{ minHeight: "100%", background: "#FEF9F7" }}>
      {/* Header gradient */}
      <div className="px-5 pt-12 pb-6" style={{ background: "linear-gradient(160deg, #F7E8EE 0%, #EEE4F8 100%)" }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-1">
            <div>
              <p style={{ color: "#9B7B8A", fontFamily: "Nunito, sans-serif", fontSize: "0.85rem" }}>{getGreeting()},</p>
              <h1 style={{ color: "#2D2D3E", fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.3rem" }}>{patient?.name?.split(" ")[0]} 🌸</h1>
            </div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #E8789A, #C96B8A)" }}>
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
          </div>
          {/* Quote */}
          <div className="mt-3 px-4 py-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.7)" }}>
            <p style={{ color: "#8B6B8A", fontFamily: "Nunito, sans-serif", fontSize: "0.85rem", fontStyle: "italic" }}>{quote}</p>
          </div>
        </motion.div>
      </div>

      <div className="px-5 flex flex-col gap-5 py-5">
        {/* Progress strip */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="rounded-2xl p-4" style={{ background: "white", boxShadow: "0 2px 12px rgba(201,107,138,0.1)" }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#2D2D3E", fontSize: "0.9rem" }}>Program 15 Hari</span>
              <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#C96B8A", fontSize: "0.9rem" }}>{progressPct}%</span>
            </div>
            <div className="w-full h-3 rounded-full mb-2" style={{ background: "#F7E8EE" }}>
              <motion.div className="h-3 rounded-full" style={{ background: "linear-gradient(90deg, #E8789A, #C96B8A)", width: `${progressPct}%` }} initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
            </div>
            <div className="flex items-center justify-between">
              <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.75rem", color: "#9B9BAE" }}>{completedCount} dari 15 sesi selesai</span>
              <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.75rem", color: "#9B9BAE" }}>Hari ke-{todayDay}</span>
            </div>
            {/* Day dots */}
            <div className="flex gap-1 mt-3 flex-wrap">
              {Array.from({ length: 15 }, (_, i) => i + 1).map((d) => {
                const state = getDotState(d);
                const dotColors: Record<string, { bg: string; border: string }> = {
                  approved: { bg: "#6BAF8F", border: "none" },
                  pending: { bg: "#F5A623", border: "2px solid #D4891A" },
                  rejected: { bg: "#E85858", border: "none" },
                  current: { bg: "#F7E8EE", border: "2px solid #C96B8A" },
                  missed: { bg: "#F0EDF5", border: "none" },
                  locked: { bg: "#F0EDF5", border: "none" },
                };
                const style = dotColors[state] ?? dotColors.locked;
                return (
                  <div key={d} className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: style.bg, border: style.border }}>
                    {state === "approved" && <CheckCircle className="w-3 h-3 text-white" />}
                    {state === "pending" && <Clock className="w-2.5 h-2.5 text-white" />}
                    {state === "rejected" && <span style={{ fontSize: "0.45rem", color: "white", fontWeight: 700 }}>✗</span>}
                    {(state === "current" || state === "missed" || state === "locked") && (
                      <span style={{ fontSize: "0.55rem", color: state === "current" ? "#C96B8A" : "#C0B8D0", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>{d}</span>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Legend */}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {[
                { color: "#6BAF8F", label: "Disetujui" },
                { color: "#F5A623", label: "Menunggu" },
                { color: "#E85858", label: "Ditinjau" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                  <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.6rem", color: "#9B9BAE" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Today's session */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="mb-3" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#2D2D3E", fontSize: "1rem" }}>Sesi Hari Ini</h2>
          {todaySessionDef ? (
            <div className="rounded-2xl overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(201,107,138,0.15)" }}>
              <div className="p-5" style={{ background: `linear-gradient(135deg, ${todaySessionDef.colorFrom}, ${todaySessionDef.colorTo})` }}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.3)", color: "white", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>Hari ke-{todayDay}</span>
                    <h3 className="mt-2" style={{ color: "white", fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.1rem" }}>{todaySessionDef.title}</h3>
                    <p style={{ color: "rgba(255,255,255,0.85)", fontFamily: "Nunito, sans-serif", fontSize: "0.8rem" }}>{todaySessionDef.theme}</p>
                  </div>
                  {isTodayCompleted && todayApproval === "disetujui" && (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.3)" }}>
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  )}
                  {isTodayCompleted && todayApproval === "menunggu" && (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.3)" }}>
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  {todayModuleIcons.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.25)" }}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.8)", fontFamily: "Nunito, sans-serif" }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4" style={{ background: "white" }}>
                {/* State: completed and approved */}
                {isTodayCompleted && todayApproval === "disetujui" && (
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5" style={{ color: "#6BAF8F" }} />
                    <span style={{ fontFamily: "Nunito, sans-serif", color: "#6BAF8F", fontWeight: 700 }}>Sesi hari ini disetujui perawat 🎉</span>
                  </div>
                )}
                {/* State: completed, waiting for approval */}
                {isTodayCompleted && todayApproval === "menunggu" && (
                  <div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-2" style={{ background: "#FFF8E8", border: "1px solid #F0D090" }}>
                      <Clock className="w-5 h-5 shrink-0" style={{ color: "#C49A40" }} />
                      <div>
                        <p style={{ fontFamily: "Nunito, sans-serif", color: "#8A6A20", fontWeight: 700, fontSize: "0.88rem" }}>Menunggu persetujuan perawat ⏳</p>
                        <p style={{ fontFamily: "Nunito, sans-serif", color: "#B09040", fontSize: "0.75rem", marginTop: "0.15rem" }}>Perawatmu akan meninjau progresmu sebelum kamu lanjut ke sesi berikutnya.</p>
                      </div>
                    </div>
                  </div>
                )}
                {/* State: completed, rejected / needs review */}
                {isTodayCompleted && todayApproval === "ditolak" && (
                  <div>
                    <div className="flex items-start gap-3 px-4 py-3 rounded-xl mb-3" style={{ background: "#FFF0F0", border: "1px solid #F0C8C8" }}>
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#C85858" }} />
                      <div>
                        <p style={{ fontFamily: "Nunito, sans-serif", color: "#8A3838", fontWeight: 700, fontSize: "0.88rem" }}>Sesi perlu ditinjau ulang</p>
                        {todayRecord?.approvalNote && (
                          <p style={{ fontFamily: "Nunito, sans-serif", color: "#9B5858", fontSize: "0.78rem", marginTop: "0.25rem", lineHeight: 1.5 }}>
                            📋 Catatan perawat: "{todayRecord.approvalNote}"
                          </p>
                        )}
                        <p style={{ fontFamily: "Nunito, sans-serif", color: "#B07070", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                          Silakan hubungi perawatmu untuk informasi lebih lanjut.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/pasien/sesi/${todayDay}`)}
                      className="w-full py-3 rounded-xl text-white transition-transform active:scale-95"
                      style={{ background: `linear-gradient(135deg, ${todaySessionDef.colorFrom}, ${todaySessionDef.colorTo})`, fontFamily: "Nunito, sans-serif", fontWeight: 700 }}
                    >
                      Ulangi Sesi Hari Ini →
                    </button>
                  </div>
                )}
                {/* State: not yet completed */}
                {!isTodayCompleted && (
                  <button onClick={() => navigate(`/pasien/sesi/${todayDay}`)} className="w-full py-3 rounded-xl text-white transition-transform active:scale-95" style={{ background: `linear-gradient(135deg, ${todaySessionDef.colorFrom}, ${todaySessionDef.colorTo})`, fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>
                    Mulai Sesi Hari Ini →
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </motion.div>

        {/* Upcoming sessions */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="flex items-center justify-between mb-3">
            <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#2D2D3E", fontSize: "1rem" }}>Sesi Berikutnya</h2>
            <button onClick={() => navigate("/pasien/kemajuan")} style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.8rem", color: "#C96B8A", fontWeight: 600 }}>Lihat semua</button>
          </div>
          <div className="flex flex-col gap-3">
            {sessions.filter((s) => s.day > todayDay).slice(0, 3).map((s) => (
              <div key={s.day} className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#F5F0F8" }}>
                  <Lock className="w-4 h-4" style={{ color: "#C0B8D0" }} />
                </div>
                <div className="flex-1">
                  <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#2D2D3E", fontSize: "0.85rem" }}>Hari {s.day}: {s.title}</div>
                  <div style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.72rem", color: "#9B9BAE" }}>{s.theme}</div>
                </div>
                <ChevronRight className="w-4 h-4" style={{ color: "#D0C8E0" }} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent completed & approved */}
        {recentCompleted.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="mb-3" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#2D2D3E", fontSize: "1rem" }}>Sesi Terselesaikan</h2>
            <div className="flex flex-col gap-2">
              {recentCompleted.map((s) => {
                const def = sessions.find((sd) => sd.day === s.day);
                return (
                  <div key={s.day} className="rounded-xl p-3 flex items-center gap-3" style={{ background: "#F8F5FF" }}>
                    <CheckCircle className="w-5 h-5 shrink-0" style={{ color: "#6BAF8F" }} />
                    <div className="flex-1">
                      <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600, color: "#2D2D3E", fontSize: "0.82rem" }}>Hari {s.day}: {def?.title}</div>
                      <div style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.7rem", color: "#9B9BAE" }}>
                        {s.mood ? ["😢", "😟", "😐", "🙂", "😊"][s.mood - 1] : ""} Durasi: {s.durationMinutes} menit
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="rounded-2xl p-4 flex items-start gap-3" style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #F0E8EE" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#F7E8EE" }}>
            <Headphones className="w-5 h-5" style={{ color: "#C96B8A" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#2D2D3E", fontSize: "0.88rem" }}>Kontak pendamping</p>
            <p style={{ fontFamily: "Nunito, sans-serif", color: "#6B6B80", fontSize: "0.78rem", marginTop: "0.15rem" }}>{PROGRAM_CONTACT.name}</p>
            <a href={`tel:${PROGRAM_CONTACT.phoneTel}`} className="inline-block mt-1" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600, color: "#C96B8A", fontSize: "0.82rem" }}>
              {PROGRAM_CONTACT.phoneDisplay}
            </a>
          </div>
        </motion.div>

        <div className="h-4" />
      </div>
    </div>
  );
}
