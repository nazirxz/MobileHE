import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, CheckCircle, Clock, Activity, Heart, MessageSquare, Mic,
  Calendar, TrendingUp, BookOpen, Music, ClipboardCheck, XCircle, ChevronDown, ChevronUp, Send
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useApp } from "../../context/AppContext";
import { sessions } from "../../data/mockData";
import type { Patient } from "../../data/mockData";

const MOODS = ["😢", "😟", "😐", "🙂", "😊"];
const MOOD_LABELS = ["Sangat Berat", "Berat", "Biasa Saja", "Cukup Baik", "Sangat Baik"];

function ApprovalCard({
  patientId,
  session,
  onApprove,
}: {
  patientId: string;
  session: ReturnType<ReturnType<typeof useApp>["getPatientSessions"]>[number];
  onApprove: (day: number, status: "disetujui" | "ditolak", note: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [rejectMode, setRejectMode] = useState(false);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const def = sessions.find((s) => s.day === session.day);

  const handleApprove = () => {
    onApprove(session.day, "disetujui", "");
    setSubmitted(true);
  };

  const handleReject = () => {
    onApprove(session.day, "ditolak", note);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "#E8F5EE", border: "1px solid #B0DDB8" }}>
        <CheckCircle className="w-5 h-5 shrink-0" style={{ color: "#6BAF8F" }} />
        <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600, color: "#3A7A5A", fontSize: "0.85rem" }}>
          Hari {session.day} telah diproses ✓
        </p>
      </motion.div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1.5px solid #F0D090", background: "white" }}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3"
        style={{ background: "#FFFBF0" }}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#FFF3D0" }}>
          <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#C49A40", fontSize: "0.85rem" }}>H{session.day}</span>
        </div>
        <div className="flex-1 text-left">
          <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#2D2D3E", fontSize: "0.85rem" }}>
            {def?.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <Clock className="w-3 h-3" style={{ color: "#9B9BAE" }} />
            <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.7rem", color: "#9B9BAE" }}>
              {session.durationMinutes} mnt · {session.completedAt ? new Date(session.completedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}
            </span>
            {session.mood && <span style={{ fontSize: "0.85rem", marginLeft: "0.2rem" }}>{MOODS[session.mood - 1]}</span>}
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4" style={{ color: "#9B9BAE" }} /> : <ChevronDown className="w-4 h-4" style={{ color: "#9B9BAE" }} />}
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
            <div className="px-4 pb-4 pt-2 flex flex-col gap-3">
              {/* Refleksi answers */}
              {session.refleksiAnswers && Object.entries(session.refleksiAnswers).some(([, v]) => v) && (
                <div className="rounded-xl p-3" style={{ background: "#FFF8E8" }}>
                  <p className="mb-2" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#8A6A20", fontSize: "0.78rem" }}>📝 Refleksi Pasien:</p>
                  {Object.entries(session.refleksiAnswers).map(([key, answer]) => {
                    const q = def?.refleksi.questions.find((q) => q.id === key);
                    return answer ? (
                      <div key={key} className="mb-2">
                        <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.7rem", color: "#B09040", fontWeight: 600 }}>{q?.label}</p>
                        <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.78rem", color: "#4A4A6A", lineHeight: 1.5, marginTop: "0.15rem" }}>{answer}</p>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
              {/* Afirmasi note */}
              {session.afirmasiNote && (
                <div className="rounded-xl p-3" style={{ background: "#E8F5EE" }}>
                  <p className="mb-1" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#4A8F6A", fontSize: "0.78rem" }}>🎤 Catatan Afirmasi:</p>
                  <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.78rem", color: "#3A6A4A", fontStyle: "italic" }}>{session.afirmasiNote}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <div className="px-4 pb-4 flex flex-col gap-2">
        {!rejectMode ? (
          <div className="flex gap-2">
            <button
              onClick={handleApprove}
              className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
              style={{ background: "linear-gradient(135deg, #90D0A8, #6BAF8F)", fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "white", fontSize: "0.82rem" }}
            >
              <CheckCircle className="w-4 h-4" />
              Setujui Lanjut
            </button>
            <button
              onClick={() => setRejectMode(true)}
              className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
              style={{ background: "#FFF0F0", border: "1.5px solid #F0C8C8", fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#C85858", fontSize: "0.82rem" }}
            >
              <XCircle className="w-4 h-4" />
              Tinjau Ulang
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Tulis catatan untuk pasien (wajib diisi)..."
              className="w-full px-3 py-2 rounded-xl outline-none resize-none"
              style={{ background: "#FFF8F8", border: "2px solid #F0C8C8", fontFamily: "Nunito, sans-serif", color: "#2D2D3E", fontSize: "0.82rem" }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setRejectMode(false)}
                className="flex-1 py-2.5 rounded-xl"
                style={{ background: "#F5F0F8", fontFamily: "Nunito, sans-serif", fontWeight: 600, color: "#8B7EC4", fontSize: "0.82rem" }}
              >
                Batal
              </button>
              <button
                onClick={handleReject}
                disabled={!note.trim()}
                className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1 transition-transform active:scale-95"
                style={{ background: note.trim() ? "linear-gradient(135deg, #E87878, #C85858)" : "#E0D8D8", fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "white", fontSize: "0.82rem" }}
              >
                <Send className="w-3.5 h-3.5" />
                Kirim Catatan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NursePatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPatientById, getPatientSessions, approveSession } = useApp();

  const patient = getPatientById(id ?? "") as Patient | undefined;
  const allSessions = getPatientSessions(id ?? "");
  const completed = allSessions.filter((s) => s.status === "selesai");
  const pendingSessions = allSessions.filter((s) => s.approvalStatus === "menunggu");

  if (!patient) return (
    <div className="p-8 text-center" style={{ fontFamily: "Nunito, sans-serif", color: "#6B6B80" }}>
      Pasien tidak ditemukan.
    </div>
  );

  const adherencePct = Math.round((completed.length / 15) * 100);
  const totalDur = completed.reduce((a, s) => a + (s.durationMinutes ?? 0), 0);
  const avgMood = completed.length > 0 ? (completed.reduce((a, s) => a + (s.mood ?? 3), 0) / completed.length) : 0;
  const avgMoodLabel = completed.length > 0 ? MOOD_LABELS[Math.round(avgMood) - 1] : "—";

  const moodData = completed.map((s) => ({ hari: `H${s.day}`, mood: s.mood ?? 3 }));
  const recentReflections = completed.filter((s) => s.refleksiAnswers && Object.keys(s.refleksiAnswers).length > 0).reverse().slice(0, 3);
  const recentAfirmasi = completed.filter((s) => s.afirmasiNote).reverse().slice(0, 3);

  const handleApprove = (day: number, status: "disetujui" | "ditolak", note: string) => {
    if (id) approveSession(id, day, status, note);
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#FEF9F7" }}>
      {/* Header */}
      <div className="px-5 pt-10 pb-5" style={{ background: "linear-gradient(135deg, #EEE9F9, #F7E8EE)" }}>
        <button onClick={() => navigate("/perawat")} className="flex items-center gap-2 mb-4">
          <ArrowLeft className="w-5 h-5" style={{ color: "#8B7EC4" }} />
          <span style={{ fontFamily: "Nunito, sans-serif", color: "#8B7EC4", fontWeight: 600 }}>Kembali</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #A08EC8, #8B7EC4)" }}>
            <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "white", fontSize: "1.5rem" }}>{patient.name[0]}</span>
          </div>
          <div>
            <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#2D2D3E", fontSize: "1.1rem" }}>{patient.name}</h2>
            <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.78rem", color: "#9B7B8A" }}>{patient.diagnosis}</p>
            <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.78rem", color: "#9B9BAE" }}>{patient.chemoCycle} · Hari ke-{patient.currentDay}</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 flex flex-col gap-5">

        {/* ===== APPROVAL SECTION ===== */}
        {pendingSessions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="rounded-2xl overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(245,166,35,0.2)" }}>
              {/* Section header */}
              <div className="px-4 py-3 flex items-center gap-3" style={{ background: "linear-gradient(135deg, #FFF3D0, #FFE090)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.6)" }}>
                  <ClipboardCheck className="w-5 h-5" style={{ color: "#C49A40" }} />
                </div>
                <div className="flex-1">
                  <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#8A6A20", fontSize: "0.9rem" }}>
                    Perlu Persetujuanmu
                  </p>
                  <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.72rem", color: "#B09040" }}>
                    {pendingSessions.length} sesi menunggu untuk ditinjau
                  </p>
                </div>
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#C49A40" }}>
                  <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "white", fontSize: "0.75rem" }}>{pendingSessions.length}</span>
                </div>
              </div>
              {/* Explanation */}
              <div className="px-4 py-3" style={{ background: "#FFFBF0", borderBottom: "1px solid #F0E0A0" }}>
                <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.78rem", color: "#8A7040", lineHeight: 1.6 }}>
                  Tinjau progres pasien di bawah ini. Klik <strong>Setujui Lanjut</strong> agar pasien bisa meneruskan ke sesi berikutnya, atau <strong>Tinjau Ulang</strong> jika perlu evaluasi lebih lanjut.
                </p>
              </div>
              {/* Cards */}
              <div className="p-4 flex flex-col gap-3" style={{ background: "white" }}>
                {pendingSessions.sort((a, b) => a.day - b.day).map((session) => (
                  <ApprovalCard
                    key={session.day}
                    patientId={patient.id}
                    session={session}
                    onApprove={handleApprove}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Key stats */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 gap-3">
          {[
            { label: "Kepatuhan", value: `${adherencePct}%`, icon: TrendingUp, color: adherencePct >= 70 ? "#6BAF8F" : "#C96B8A", bg: adherencePct >= 70 ? "#E8F5EE" : "#F7E8EE" },
            { label: "Sesi Selesai", value: `${completed.length}/15`, icon: CheckCircle, color: "#8B7EC4", bg: "#EEE9F9" },
            { label: "Total Durasi", value: `${totalDur} mnt`, icon: Clock, color: "#C49A40", bg: "#F5EDD8" },
            { label: "Rata-rata Mood", value: completed.length > 0 ? `${avgMood.toFixed(1)}/5` : "—", icon: Heart, color: "#C96B8A", bg: "#F7E8EE" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="rounded-2xl p-4" style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: bg }}>
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                </div>
                <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.7rem", color: "#9B9BAE" }}>{label}</span>
              </div>
              <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#2D2D3E", fontSize: "1rem" }}>{value}</div>
            </div>
          ))}
        </motion.div>

        {/* Mood trend */}
        {moodData.length > 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }} className="rounded-2xl p-4" style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4" style={{ color: "#C96B8A" }} />
              <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#2D2D3E" }}>Tren Suasana Hati</span>
            </div>
            <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.75rem", color: "#9B9BAE", marginBottom: "0.75rem" }}>Rata-rata: {avgMood.toFixed(1)}/5 — {avgMoodLabel}</p>
            <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={moodData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="mGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C96B8A" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C96B8A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hari" tick={{ fontSize: 10, fontFamily: "Nunito, sans-serif", fill: "#9B9BAE" }} axisLine={false} tickLine={false} />
                <YAxis domain={[1, 5]} tick={{ fontSize: 10, fontFamily: "Nunito, sans-serif", fill: "#9B9BAE" }} axisLine={false} tickLine={false} ticks={[1, 3, 5]} />
                <Tooltip contentStyle={{ fontFamily: "Nunito, sans-serif", fontSize: "0.78rem", borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} formatter={(val: number) => [`${MOODS[val - 1]} ${MOOD_LABELS[val - 1]} (${val}/5)`, "Mood"]} />
                <Area type="monotone" dataKey="mood" stroke="#C96B8A" strokeWidth={2} fill="url(#mGrad)" dot={{ fill: "#C96B8A", r: 3 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Session history table */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl overflow-hidden" style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div className="px-4 py-3 flex items-center gap-2" style={{ background: "#F5F0F8" }}>
            <Calendar className="w-4 h-4" style={{ color: "#8B7EC4" }} />
            <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#2D2D3E" }}>Riwayat Sesi</span>
          </div>
          {/* Header row */}
          <div className="grid px-4 py-2" style={{ gridTemplateColumns: "36px 1fr 50px 50px 34px 52px", gap: "0.4rem", borderBottom: "1px solid #F5F0F8" }}>
            {["Hari", "Judul", "Durasi", "Selesai", "Mood", "Status"].map((h) => (
              <span key={h} style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.6rem", color: "#9B9BAE", fontWeight: 700 }}>{h}</span>
            ))}
          </div>
          {sessions.slice(0, patient.currentDay).map((s) => {
            const rec = allSessions.find((r) => r.day === s.day);
            const done = rec?.status === "selesai";
            const approval = rec?.approvalStatus;
            const approvalInfo = {
              disetujui: { label: "✓ OK", bg: "#E8F5EE", color: "#3A7A5A" },
              menunggu: { label: "⏳", bg: "#FFF3D0", color: "#8A6A20" },
              ditolak: { label: "⚠️", bg: "#FFF0F0", color: "#8A3838" },
            };
            const info = approval ? approvalInfo[approval] : null;
            return (
              <div key={s.day} className="grid px-4 py-3 items-center" style={{ gridTemplateColumns: "36px 1fr 50px 50px 34px 52px", gap: "0.4rem", borderBottom: "1px solid #FAF8FF" }}>
                <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.78rem", color: "#6B6B80", fontWeight: 600 }}>H{s.day}</span>
                <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.68rem", color: "#4A4A6A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</span>
                <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.68rem", color: "#9B9BAE" }}>{rec?.durationMinutes ? `${rec.durationMinutes}m` : "—"}</span>
                <div>{done ? <CheckCircle className="w-4 h-4" style={{ color: "#6BAF8F" }} /> : <div className="w-4 h-4 rounded-full" style={{ border: "2px solid #D0C8E0" }} />}</div>
                <span style={{ fontSize: "0.82rem" }}>{done && rec?.mood ? MOODS[rec.mood - 1] : "—"}</span>
                {info ? (
                  <span className="text-center rounded-lg px-1 py-0.5" style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.6rem", fontWeight: 700, background: info.bg, color: info.color }}>{info.label}</span>
                ) : <span />}
              </div>
            );
          })}
        </motion.div>

        {/* Module completion */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="rounded-2xl p-4" style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4" style={{ color: "#C96B8A" }} />
            <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#2D2D3E" }}>Keterlibatan per Modul</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Edukasi", count: completed.length, icon: BookOpen, color: "#C96B8A" },
              { label: "Musik Terapi", count: completed.length, icon: Music, color: "#8B7EC4" },
              { label: "Afirmasi (Dicatat)", count: completed.filter((s) => s.afirmasiNote).length, icon: Mic, color: "#6BAF8F" },
              { label: "Refleksi (Diisi)", count: completed.filter((s) => s.refleksiAnswers && Object.keys(s.refleksiAnswers).length > 0).length, icon: MessageSquare, color: "#C49A40" },
            ].map(({ label, count, icon: Icon, color }) => (
              <div key={label} className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "#FAF8FF" }}>
                <Icon className="w-4 h-4" style={{ color }} />
                <div>
                  <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#2D2D3E", fontSize: "0.9rem" }}>{count}</div>
                  <div style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.65rem", color: "#9B9BAE" }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent reflections */}
        {recentReflections.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl overflow-hidden" style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div className="px-4 py-3 flex items-center gap-2" style={{ background: "#FFF8E8" }}>
              <MessageSquare className="w-4 h-4" style={{ color: "#C49A40" }} />
              <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#2D2D3E" }}>Refleksi Terbaru</span>
            </div>
            {recentReflections.map((s) => {
              const def = sessions.find((sd) => sd.day === s.day);
              return (
                <div key={s.day} className="px-4 py-4" style={{ borderBottom: "1px solid #FAF8FF" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: "#F5EDD8", color: "#8A6A20", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>Hari {s.day}: {def?.title}</span>
                    {s.mood && <span style={{ fontSize: "1rem" }}>{MOODS[s.mood - 1]}</span>}
                  </div>
                  {s.refleksiAnswers && Object.entries(s.refleksiAnswers).map(([key, answer]) => {
                    const q = def?.refleksi.questions.find((q) => q.id === key);
                    return answer ? (
                      <div key={key} className="mb-2">
                        <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.72rem", color: "#9B9BAE", fontWeight: 600 }}>{q?.label}</p>
                        <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.82rem", color: "#4A4A6A", lineHeight: 1.6, marginTop: "0.2rem" }}>{answer}</p>
                      </div>
                    ) : null;
                  })}
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Recent affirmations */}
        {recentAfirmasi.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="rounded-2xl overflow-hidden" style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div className="px-4 py-3 flex items-center gap-2" style={{ background: "#E8F5EE" }}>
              <Mic className="w-4 h-4" style={{ color: "#6BAF8F" }} />
              <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#2D2D3E" }}>Catatan Afirmasi Terbaru</span>
            </div>
            {recentAfirmasi.map((s) => {
              const def = sessions.find((sd) => sd.day === s.day);
              return (
                <div key={s.day} className="px-4 py-4" style={{ borderBottom: "1px solid #F0FAF5" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: "#E8F5EE", color: "#4A8F6A", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>Hari {s.day}</span>
                    <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.7rem", color: "#9B9BAE" }}>{s.completedAt ? new Date(s.completedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : ""}</span>
                  </div>
                  <p className="mb-1" style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.78rem", color: "#4A8F6A", fontStyle: "italic" }}>"{def?.afirmasi.mainText}"</p>
                  <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.82rem", color: "#4A4A6A", lineHeight: 1.6 }}>{s.afirmasiNote}</p>
                </div>
              );
            })}
          </motion.div>
        )}

        <div className="h-4" />
      </div>
    </div>
  );
}
