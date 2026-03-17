import { useState, useEffect, useRef, type ReactNode } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, BookOpen, Music, Mic, PenLine,
  CheckCircle, Play, Pause, RotateCcw,
  Sparkles, Heart, Volume2, Clock
} from "lucide-react";
import { sessions } from "../../data/mockData";
import { useApp } from "../../context/AppContext";
import type { Patient } from "../../data/mockData";

const MODULES = [
  { id: "edukasi", label: "Edukasi", icon: BookOpen, color: "#C96B8A", bg: "#F7E8EE" },
  { id: "musik", label: "Musik Terapi", icon: Music, color: "#8B7EC4", bg: "#EEE9F9" },
  { id: "afirmasi", label: "Afirmasi", icon: Mic, color: "#6BAF8F", bg: "#E8F5EE" },
  { id: "refleksi", label: "Refleksi", icon: PenLine, color: "#C49A40", bg: "#F5EDD8" },
];

const MOODS = [
  { value: 1, emoji: "😢", label: "Sangat Berat" },
  { value: 2, emoji: "😟", label: "Berat" },
  { value: 3, emoji: "😐", label: "Biasa Saja" },
  { value: 4, emoji: "🙂", label: "Cukup Baik" },
  { value: 5, emoji: "😊", label: "Sangat Baik" },
];

function MusicPlayer({ duration, title, musicType }: { duration: number; title: string; musicType: string }) {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const barCount = 20;

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setElapsed((e) => {
          if (e + 1 >= duration) { clearInterval(timerRef.current!); setPlaying(false); setDone(true); return duration; }
          return e + 1;
        });
      }, 1000);
    } else clearInterval(timerRef.current!);
    return () => clearInterval(timerRef.current!);
  }, [playing, duration]);

  const fmtTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const pct = elapsed / duration;

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Waveform */}
      <div className="flex items-center gap-1 h-16">
        {Array.from({ length: barCount }, (_, i) => {
          const baseH = 8 + Math.abs(Math.sin(i * 0.8)) * 24 + Math.random() * 8;
          return (
            <motion.div key={i} className="w-2 rounded-full" style={{ background: `linear-gradient(180deg, #A08EC8, #8B7EC4)`, height: baseH }}
              animate={playing ? { height: [baseH, baseH * (0.5 + Math.random()), baseH * (1.2 + Math.random() * 0.5), baseH] } : { height: baseH }}
              transition={{ duration: 0.6 + Math.random() * 0.4, repeat: Infinity, repeatType: "mirror" }}
            />
          );
        })}
      </div>

      {/* Track info */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Volume2 className="w-4 h-4" style={{ color: "#8B7EC4" }} />
          <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#2D2D3E" }}>{title}</span>
        </div>
        <span className="text-xs px-3 py-1 rounded-full" style={{ background: "#EEE9F9", color: "#8B7EC4", fontFamily: "Nunito, sans-serif" }}>{musicType}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full">
        <div className="w-full h-2 rounded-full" style={{ background: "#EEE9F9" }}>
          <motion.div className="h-2 rounded-full" style={{ background: "linear-gradient(90deg, #A08EC8, #8B7EC4)", width: `${pct * 100}%` }} />
        </div>
        <div className="flex justify-between mt-1">
          <span style={{ fontSize: "0.75rem", color: "#9B9BAE", fontFamily: "Nunito, sans-serif" }}>{fmtTime(elapsed)}</span>
          <span style={{ fontSize: "0.75rem", color: "#9B9BAE", fontFamily: "Nunito, sans-serif" }}>{fmtTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button onClick={() => { setElapsed(0); setDone(false); setPlaying(false); }} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#EEE9F9" }}>
          <RotateCcw className="w-4 h-4" style={{ color: "#8B7EC4" }} />
        </button>
        <button onClick={() => setPlaying(!playing)} className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, #A08EC8, #8B7EC4)" }}>
          {playing ? <Pause className="w-7 h-7 text-white" /> : <Play className="w-7 h-7 text-white ml-1" />}
        </button>
        <div className="w-10 h-10" />
      </div>

      {done && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full px-4 py-3 rounded-2xl flex items-center gap-2" style={{ background: "#E8F5EE" }}>
          <CheckCircle className="w-5 h-5" style={{ color: "#6BAF8F" }} />
          <span style={{ fontFamily: "Nunito, sans-serif", color: "#4A8F6A", fontWeight: 600, fontSize: "0.9rem" }}>Terapi musik selesai. Semoga hatimu lebih tenang 💚</span>
        </motion.div>
      )}
      {!done && !playing && elapsed === 0 && (
        <p className="text-center text-sm" style={{ color: "#9B9BAE", fontFamily: "Nunito, sans-serif" }}>Tekan tombol putar untuk memulai</p>
      )}
      {playing && (
        <p className="text-center text-sm" style={{ color: "#8B7EC4", fontFamily: "Nunito, sans-serif" }}>✨ Tutup matamu dan bernapaslah perlahan...</p>
      )}
    </div>
  );
}

interface RecordingSimulatorProps {
  text: string;
  onSave: (payload: { note: string; audioUrl?: string }) => void;
}

function RecordingSimulator({ text, onSave }: RecordingSimulatorProps) {
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [written, setWritten] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => {
        setElapsed((e) => {
          if (e >= 30) { clearInterval(timerRef.current!); setRecording(false); setRecorded(true); return 30; }
          return e + 1;
        });
      }, 1000);
    } else clearInterval(timerRef.current!);
    return () => clearInterval(timerRef.current!);
  }, [recording]);

  return (
    <div className="flex flex-col gap-4">
      {/* Affirmation card */}
      <div className="rounded-2xl p-5 text-center" style={{ background: "linear-gradient(135deg, #E8F5EE, #D0EDD8)" }}>
        <div className="flex justify-center mb-3"><Sparkles className="w-6 h-6" style={{ color: "#6BAF8F" }} /></div>
        <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#2A5A3A", fontSize: "1.05rem", lineHeight: 1.6 }}>"{text}"</p>
      </div>

      {/* Recording button */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm text-center" style={{ color: "#6B6B80", fontFamily: "Nunito, sans-serif" }}>Rekam suaramu membacakan afirmasi ini:</p>
        <button
          onClick={() => { if (!recorded) { setRecording(!recording); if (!recording) setElapsed(0); } }}
          className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95"
          style={{ background: recorded ? "linear-gradient(135deg, #90D0A8, #6BAF8F)" : recording ? "linear-gradient(135deg, #E87878, #C85858)" : "linear-gradient(135deg, #A8D0B8, #6BAF8F)" }}
        >
          <Mic className="w-8 h-8 text-white" />
        </button>
        {recording && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#E85858" }} />
            <span style={{ fontFamily: "Nunito, sans-serif", color: "#C85858", fontWeight: 600, fontSize: "0.85rem" }}>Merekam... {elapsed}s / 30s</span>
          </div>
        )}
        {recorded && <p className="text-sm" style={{ color: "#6BAF8F", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>✓ Rekaman tersimpan</p>}
        {!recording && !recorded && <p className="text-xs" style={{ color: "#9B9BAE", fontFamily: "Nunito, sans-serif" }}>Atau tulis catatan di bawah</p>}
      </div>

      {/* Text fallback */}
      <div>
        <label style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.85rem", color: "#6B6B80", fontWeight: 600 }}>Catatan Afirmasi (opsional):</label>
        <textarea
          value={written}
          onChange={(e) => setWritten(e.target.value)}
          rows={3}
          placeholder="Tulis perasaanmu setelah membaca afirmasi ini..."
          className="w-full mt-2 px-4 py-3 rounded-xl outline-none resize-none"
          style={{ background: "#FEF9F7", border: "2px solid #D8E8D0", fontFamily: "Nunito, sans-serif", color: "#2D2D3E" }}
        />
      </div>
      <button
        onClick={() =>
          onSave({
            note: written || (recorded ? "Rekaman suara afirmasi telah direkam." : ""),
            // Untuk prototipe, gunakan satu contoh URL audio yang sama.
            audioUrl: recorded ? "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav" : undefined,
          })
        }
        className="w-full py-3 rounded-xl text-white"
        style={{ background: "linear-gradient(135deg, #90D0A8, #6BAF8F)", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}
      >
        Simpan Afirmasi →
      </button>
    </div>
  );
}

export default function PatientSession() {
  const { hari } = useParams<{ hari: string }>();
  const navigate = useNavigate();
  const { currentUser, completeSession } = useApp();
  const patient = currentUser as Patient;

  const dayNum = parseInt(hari ?? "1", 10);
  const sessionDef = sessions.find((s) => s.day === dayNum);

  const [step, setStep] = useState(0); // 0=intro, 1=edukasi, 2=musik, 3=afirmasi, 4=refleksi, 5=done
  const [afirmasiNote, setAfirmasiNote] = useState("");
  const [afirmasiAudioUrl, setAfirmasiAudioUrl] = useState<string | undefined>(undefined);
  const [mood, setMood] = useState<number | null>(null);
  const [refleksiAnswers, setRefleksiAnswers] = useState<Record<string, string>>({});
  const [startTime] = useState(Date.now());

  if (!sessionDef) return <div className="p-8 text-center" style={{ fontFamily: "Nunito, sans-serif" }}>Sesi tidak ditemukan.</div>;

  const handleFinishRefleksi = () => {
    const durationMinutes = Math.max(1, Math.round((Date.now() - startTime) / 60000));
    completeSession(patient.id, {
      day: dayNum,
      status: "selesai",
      completedAt: new Date().toISOString(),
      durationMinutes,
      mood: mood ?? 3,
      refleksiAnswers,
      afirmasiNote,
      affirmationAudioUrl: afirmasiAudioUrl,
      modulesCompleted: ["edukasi", "musik", "afirmasi", "refleksi"],
    });
    setStep(5);
  };

  const stepContent: Record<number, ReactNode> = {
    0: (
      <div className="flex flex-col gap-5 items-center text-center">
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${sessionDef.colorFrom}, ${sessionDef.colorTo})` }}>
          <Heart className="w-12 h-12 text-white fill-white" />
        </div>
        <div>
          <span className="text-xs px-3 py-1 rounded-full" style={{ background: "#F7E8EE", color: "#C96B8A", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>Hari ke-{dayNum}</span>
          <h2 className="mt-2" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#2D2D3E", fontSize: "1.3rem" }}>{sessionDef.title}</h2>
          <p className="mt-1" style={{ fontFamily: "Nunito, sans-serif", color: "#9B9BAE" }}>{sessionDef.theme}</p>
        </div>
        <div className="w-full rounded-2xl p-4" style={{ background: "#FEF9F7", border: "1px solid #F0E8EE" }}>
          <p style={{ fontFamily: "Nunito, sans-serif", color: "#6B6B80", lineHeight: 1.7, fontSize: "0.9rem" }}>Selamat datang di sesi hari ini! Kamu akan melalui <strong style={{ color: "#C96B8A" }}>4 modul singkat</strong> yang dirancang untuk mendampingimu dengan penuh kasih. Lakukan dengan kecepatan dan kenyamananmu sendiri. Tidak ada yang terburu-buru. 💗</p>
        </div>
        <div className="grid grid-cols-4 gap-2 w-full">
          {MODULES.map(({ icon: Icon, label, color, bg }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: bg }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.65rem", color: "#6B6B80" }}>{label}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setStep(1)} className="w-full py-4 rounded-2xl text-white" style={{ background: `linear-gradient(135deg, ${sessionDef.colorFrom}, ${sessionDef.colorTo})`, fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>
          Mulai Sesi ✨
        </button>
      </div>
    ),
    1: (
      <div className="flex flex-col gap-4">
        {dayNum === 1 ? (
          <>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#F7E8EE" }}>
                <BookOpen className="w-5 h-5" style={{ color: "#C96B8A" }} />
              </div>
              <div>
                <h3 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#2D2D3E" }}>{sessionDef.edukasi.title}</h3>
                <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.75rem", color: "#C96B8A" }}>Edukasi Kesehatan</span>
              </div>
            </div>
            {sessionDef.edukasi.content.map((para, i) => (
              <div key={i} className="rounded-2xl p-4" style={{ background: i % 2 === 0 ? "white" : "#FEF9F7", border: "1px solid #F0E8EE" }}>
                <p style={{ fontFamily: "Nunito, sans-serif", color: "#4A4A6A", lineHeight: 1.8, fontSize: "0.9rem" }}>{para}</p>
              </div>
            ))}
            <div className="rounded-2xl p-4" style={{ background: "#F7E8EE" }}>
              <h4 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#C96B8A", marginBottom: "0.5rem" }}>💡 Poin Penting:</h4>
              {sessionDef.edukasi.keyPoints.map((point, i) => (
                <div key={i} className="flex items-start gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#C96B8A" }} />
                  <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.85rem", color: "#6B4A5A" }}>{point}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-2xl p-4" style={{ background: "#FEF9F7", border: "1px solid #F0E8EE" }}>
            <p style={{ fontFamily: "Nunito, sans-serif", color: "#6B6B80", lineHeight: 1.7, fontSize: "0.9rem" }}>
              Untuk hari ke-{dayNum}, belum ada materi edukasi tertulis khusus. Kamu bisa langsung melanjutkan ke modul{" "}
              <strong style={{ color: "#C96B8A" }}>Musik Terapi</strong> untuk mendapatkan dukungan relaksasi hari ini.
            </p>
          </div>
        )}
        <button
          onClick={() => setStep(2)}
          className="w-full py-4 rounded-2xl text-white"
          style={{ background: "linear-gradient(135deg, #E8789A, #C96B8A)", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}
        >
          Lanjut ke Musik Terapi →
        </button>
      </div>
    ),
    2: (
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#EEE9F9" }}>
            <Music className="w-5 h-5" style={{ color: "#8B7EC4" }} />
          </div>
          <div>
            <h3 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#2D2D3E" }}>Terapi Musik Relaksasi</h3>
            <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.75rem", color: "#8B7EC4" }}>Musik & Ketenangan</span>
          </div>
        </div>
        <div className="rounded-2xl p-4" style={{ background: "#EEE9F9" }}>
          <p style={{ fontFamily: "Nunito, sans-serif", color: "#5A4A8A", fontSize: "0.88rem", lineHeight: 1.7 }}>{sessionDef.musik.description}</p>
        </div>
        <div className="rounded-2xl p-5" style={{ background: "white", border: "2px solid #EEE9F9" }}>
          <MusicPlayer duration={sessionDef.musik.duration} title={sessionDef.musik.title} musicType={sessionDef.musik.musicType} />
        </div>
        <button onClick={() => setStep(3)} className="w-full py-4 rounded-2xl text-white" style={{ background: "linear-gradient(135deg, #A08EC8, #8B7EC4)", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>
          Lanjut ke Afirmasi Positif →
        </button>
      </div>
    ),
    3: (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#E8F5EE" }}>
            <Mic className="w-5 h-5" style={{ color: "#6BAF8F" }} />
          </div>
          <div>
            <h3 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#2D2D3E" }}>{sessionDef.afirmasi.title}</h3>
            <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.75rem", color: "#6BAF8F" }}>Afirmasi Positif</span>
          </div>
        </div>
        <div className="rounded-2xl p-4" style={{ background: "#E8F5EE" }}>
          <p style={{ fontFamily: "Nunito, sans-serif", color: "#4A8F6A", fontSize: "0.85rem", lineHeight: 1.7 }}>{sessionDef.afirmasi.instructions}</p>
        </div>
        <RecordingSimulator
          text={sessionDef.afirmasi.mainText}
          onSave={({ note, audioUrl }) => {
            setAfirmasiNote(note);
            setAfirmasiAudioUrl(audioUrl);
            setStep(4);
          }}
        />
      </div>
    ),
    4: (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#F5EDD8" }}>
            <PenLine className="w-5 h-5" style={{ color: "#C49A40" }} />
          </div>
          <div>
            <h3 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#2D2D3E" }}>{sessionDef.refleksi.title}</h3>
            <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.75rem", color: "#C49A40" }}>Refleksi Emosional</span>
          </div>
        </div>
        <div className="rounded-2xl p-4" style={{ background: "#FFF8E8" }}>
          <p style={{ fontFamily: "Nunito, sans-serif", color: "#8A6A20", fontSize: "0.85rem", lineHeight: 1.7 }}>Tidak ada jawaban yang salah. Tuliskan apa yang benar-benar kamu rasakan. Ini adalah ruang yang aman untuk jujur pada diri sendiri. 💛</p>
        </div>
        {/* Mood picker */}
        <div className="rounded-2xl p-4" style={{ background: "white", border: "1px solid #F0E8EE" }}>
          <p className="mb-3" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600, color: "#4A4A6A", fontSize: "0.9rem" }}>Bagaimana suasana hatimu hari ini?</p>
          <div className="flex justify-between">
            {MOODS.map((m) => (
              <button key={m.value} onClick={() => setMood(m.value)} className="flex flex-col items-center gap-1 p-2 rounded-xl transition-colors" style={{ background: mood === m.value ? "#F7E8EE" : "transparent", border: mood === m.value ? "2px solid #C96B8A" : "2px solid transparent" }}>
                <span style={{ fontSize: "1.5rem" }}>{m.emoji}</span>
                <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.6rem", color: mood === m.value ? "#C96B8A" : "#9B9BAE", fontWeight: mood === m.value ? 700 : 400 }}>{m.label}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Questions */}
        {sessionDef.refleksi.questions.map((q) => (
          <div key={q.id} className="flex flex-col gap-2">
            <label style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600, color: "#4A4A6A", fontSize: "0.88rem" }}>{q.label}</label>
            <textarea
              value={refleksiAnswers[q.id] ?? ""}
              onChange={(e) => setRefleksiAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
              rows={4}
              placeholder={q.placeholder}
              className="w-full px-4 py-3 rounded-xl outline-none resize-none"
              style={{ background: "#FEF9F7", border: "2px solid #F0E8EE", fontFamily: "Nunito, sans-serif", color: "#2D2D3E" }}
            />
          </div>
        ))}
        <button onClick={handleFinishRefleksi} className="w-full py-4 rounded-2xl text-white" style={{ background: "linear-gradient(135deg, #D0B060, #C49A40)", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>
          Selesaikan Sesi Hari Ini ✨
        </button>
      </div>
    ),
    5: (
      <div className="flex flex-col gap-5 items-center text-center py-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
          <div className="w-28 h-28 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #E8789A, #C96B8A)" }}>
            <Sparkles className="w-14 h-14 text-white" />
          </div>
        </motion.div>
        <div>
          <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#2D2D3E", fontSize: "1.4rem" }}>Luar Biasa! 🎉</h2>
          <p className="mt-1" style={{ fontFamily: "Nunito, sans-serif", color: "#9B9BAE" }}>Sesi Hari ke-{dayNum} selesai</p>
        </div>
        <div className="w-full rounded-2xl p-5" style={{ background: "linear-gradient(135deg, #F7E8EE, #EEE9F9)" }}>
          <p style={{ fontFamily: "Nunito, sans-serif", color: "#6B4A8A", lineHeight: 1.8, fontSize: "0.92rem" }}>
            Kamu telah menyelesaikan satu lagi hari dalam perjalananmu. Setiap sesi yang kamu selesaikan adalah bukti kekuatan luar biasa yang ada dalam dirimu. Bangga dengan dirimu sendiri — kamu pantas mendapatkan rasa bangga itu. 💗
          </p>
        </div>
        {/* Waiting for approval notice */}
        <div className="w-full rounded-2xl p-4 flex items-start gap-3" style={{ background: "#FFF8E8", border: "1.5px solid #F0D090" }}>
          <Clock className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#C49A40" }} />
          <div className="text-left">
            <p style={{ fontFamily: "Nunito, sans-serif", color: "#8A6A20", fontWeight: 700, fontSize: "0.88rem" }}>Menunggu persetujuan perawat ⏳</p>
            <p style={{ fontFamily: "Nunito, sans-serif", color: "#B09040", fontSize: "0.78rem", marginTop: "0.2rem", lineHeight: 1.5 }}>
              Progresmu telah dikirimkan kepada perawat. Setelah ditinjau dan disetujui, kamu bisa melanjutkan ke sesi hari berikutnya. Tetap semangat! 🌸
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <button onClick={() => navigate("/pasien")} className="w-full py-4 rounded-2xl text-white" style={{ background: "linear-gradient(135deg, #E8789A, #C96B8A)", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>
            Kembali ke Beranda
          </button>
          <button onClick={() => navigate("/pasien/kemajuan")} className="w-full py-3 rounded-2xl" style={{ background: "white", border: "2px solid #F0E8EE", fontFamily: "Nunito, sans-serif", fontWeight: 600, color: "#8B7EC4" }}>
            Lihat Kemajuanku
          </button>
        </div>
      </div>
    ),
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#FEF9F7" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center gap-3" style={{ background: `linear-gradient(135deg, ${sessionDef.colorFrom}60, ${sessionDef.colorTo}30)` }}>
        <button onClick={() => navigate("/pasien")} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.8)" }}>
          <ArrowLeft className="w-5 h-5" style={{ color: "#4A4A6A" }} />
        </button>
        <div className="flex-1">
          <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.75rem", color: "#9B9BAE" }}>Hari ke-{dayNum}</p>
          <h3 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#2D2D3E", fontSize: "0.95rem" }}>{sessionDef.title}</h3>
        </div>
      </div>

      {/* Step indicator */}
      {step > 0 && step < 5 && (
        <div className="px-5 py-3 flex items-center gap-2" style={{ background: "white", borderBottom: "1px solid #F0E8EE" }}>
          {MODULES.map((m, i) => {
            const done = i + 1 < step;
            const current = i + 1 === step;
            const Icon = m.icon;
            return (
              <div key={m.id} className="flex items-center gap-1 flex-1">
                <div className="flex flex-col items-center gap-0.5 flex-1">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: done ? m.color : current ? m.bg : "#F5F0F8", border: current ? `2px solid ${m.color}` : "none" }}>
                    {done ? <CheckCircle className="w-4 h-4 text-white" /> : <Icon className="w-3.5 h-3.5" style={{ color: current ? m.color : "#C0B8D0" }} />}
                  </div>
                  <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.55rem", color: current ? m.color : done ? m.color : "#C0B8D0", fontWeight: current ? 700 : 400 }}>{m.label}</span>
                </div>
                {i < 3 && <div className="h-0.5 flex-1 mx-1 rounded-full" style={{ background: done ? m.color : "#EEE8F5" }} />}
              </div>
            );
          })}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 px-5 py-5 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            {stepContent[step]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}