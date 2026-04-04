import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { useApp } from "../../context/AppContext";
import type { Patient } from "../../data/mockData";
import {
  SMSES_BC_ITEM_COUNT,
  createEmptyScoreState,
  isProgramInterventionComplete,
  isValidScores,
  type QuestionnaireDemographics,
  type QuestionnairePhase,
} from "../../data/researchQuestionnaire";
import { SMSES_BC_QUESTIONS } from "../../data/smssesBcQuestions";

const emptyDemo = (): QuestionnaireDemographics => ({
  respondentNumberNote: "",
  initials: "",
  age: "",
  sex: "",
  education: "",
  occupation: "",
  religion: "",
  ethnicity: "",
});

function isPhase(x: string | undefined): x is QuestionnairePhase {
  return x === "pre" || x === "post";
}

export default function PatientResearchQuestionnaire() {
  const { fase } = useParams<{ fase: string }>();
  const navigate = useNavigate();
  const { currentUser, getPatientSessions, getQuestionnaireBundle, saveQuestionnaireSubmission } = useApp();
  const patient = currentUser as Patient;

  const phase: QuestionnairePhase | null = isPhase(fase) ? fase : null;

  const [demographics, setDemographics] = useState<QuestionnaireDemographics>(emptyDemo);
  const [scores, setScores] = useState<(number | null)[]>(() => createEmptyScoreState());
  const [error, setError] = useState<string | null>(null);

  const allSessions = patient?.id ? getPatientSessions(patient.id) : [];
  const bundle = patient?.id ? getQuestionnaireBundle(patient.id) : {};
  const programComplete = isProgramInterventionComplete(allSessions);

  if (!patient) return <Navigate to="/" replace />;
  if (!phase) return <Navigate to="/pasien" replace />;
  if (phase === "pre" && bundle.pre) return <Navigate to="/pasien" replace />;
  if (phase === "post" && (!bundle.pre || !programComplete || bundle.post)) {
    return <Navigate to="/pasien" replace />;
  }

  const title =
    phase === "pre"
      ? "Kuesioner Pra (Pre-test)"
      : "Kuesioner Pasca (Post-test)";

  const setScore = (index: number, value: number | null) => {
    setScores((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const d = demographics;
    if (!d.initials.trim() || !d.age.trim() || !d.sex || !d.education.trim() || !d.occupation.trim() || !d.religion.trim() || !d.ethnicity.trim()) {
      setError("Lengkapi semua field pada Bagian A (karakteristik responden).");
      return;
    }

    const filled = scores.map((s) => (s === null ? NaN : s));
    if (!isValidScores(filled)) {
      setError(`Isi semua ${SMSES_BC_ITEM_COUNT} skor SMSES-BC (0–10, bilangan bulat).`);
      return;
    }

    saveQuestionnaireSubmission(patient.id, {
      phase,
      demographics: { ...d },
      scores: filled,
      submittedAt: new Date().toISOString(),
    });
    navigate("/pasien");
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: "Nunito, sans-serif",
    color: "#2D2D3E",
    background: "#FEF9F7",
    border: "2px solid #F0E8EE",
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#FEF9F7" }}>
      <div className="px-5 pt-12 pb-4 flex items-center gap-3" style={{ background: "linear-gradient(135deg, #E8A4C860, #C96B8A30)" }}>
        <button
          type="button"
          onClick={() => navigate("/pasien")}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.8)" }}
        >
          <ArrowLeft className="w-5 h-5" style={{ color: "#4A4A6A" }} />
        </button>
        <div className="flex-1 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 shrink-0" style={{ color: "#C96B8A" }} />
          <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#2D2D3E", fontSize: "0.95rem", lineHeight: 1.3 }}>
            {title}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 px-5 py-5 pb-28 overflow-y-auto flex flex-col gap-5">
        <div className="rounded-2xl p-4" style={{ background: "white", border: "1px solid #F0E8EE" }}>
          <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#2D2D3E", fontSize: "0.88rem", marginBottom: "0.5rem" }}>
            Kuesioner penelitian
          </p>
          <p style={{ fontFamily: "Nunito, sans-serif", color: "#6B6B80", fontSize: "0.78rem", lineHeight: 1.65 }}>
            Self efficacy pada pasien post mastektomi yang menjalani kemoterapi (SMSES-BC). Jawablah dengan jujur. Skor 0 = tidak percaya diri sama sekali, 10 = sangat percaya diri.
          </p>
          <p className="mt-2" style={{ fontFamily: "Nunito, sans-serif", color: "#9B9BAE", fontSize: "0.72rem" }}>
            No. responden (ID akun): <strong style={{ color: "#C96B8A" }}>{patient.id}</strong>
          </p>
        </div>

        <section className="rounded-2xl p-4" style={{ background: "#F7E8EE", border: "1px solid #F0D0DC" }}>
          <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#8B4A62", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
            A. Karakteristik responden
          </h2>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.72rem", color: "#6B4A5A", fontWeight: 600 }}>Catatan No. responden (opsional)</span>
              <input
                value={demographics.respondentNumberNote}
                onChange={(e) => setDemographics((p) => ({ ...p, respondentNumberNote: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl outline-none"
                style={inputStyle}
                placeholder="Jika ada kode khusus penelitian"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.72rem", color: "#6B4A5A", fontWeight: 600 }}>Nama (inisial)</span>
              <input
                value={demographics.initials}
                onChange={(e) => setDemographics((p) => ({ ...p, initials: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl outline-none"
                style={inputStyle}
                required
              />
            </label>
            <label className="flex flex-col gap-1">
              <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.72rem", color: "#6B4A5A", fontWeight: 600 }}>Umur</span>
              <input
                value={demographics.age}
                onChange={(e) => setDemographics((p) => ({ ...p, age: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl outline-none"
                style={inputStyle}
                required
              />
            </label>
            <div>
              <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.72rem", color: "#6B4A5A", fontWeight: 600 }}>Jenis kelamin</span>
              <div className="flex gap-4 mt-2">
                {(["laki-laki", "perempuan"] as const).map((s) => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sex"
                      checked={demographics.sex === s}
                      onChange={() => setDemographics((p) => ({ ...p, sex: s }))}
                      className="accent-[#C96B8A]"
                    />
                    <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.82rem", color: "#2D2D3E" }}>
                      {s === "laki-laki" ? "Laki-laki" : "Perempuan"}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <label className="flex flex-col gap-1">
              <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.72rem", color: "#6B4A5A", fontWeight: 600 }}>Pendidikan</span>
              <input
                value={demographics.education}
                onChange={(e) => setDemographics((p) => ({ ...p, education: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl outline-none"
                style={inputStyle}
                required
              />
            </label>
            <label className="flex flex-col gap-1">
              <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.72rem", color: "#6B4A5A", fontWeight: 600 }}>Pekerjaan</span>
              <input
                value={demographics.occupation}
                onChange={(e) => setDemographics((p) => ({ ...p, occupation: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl outline-none"
                style={inputStyle}
                required
              />
            </label>
            <label className="flex flex-col gap-1">
              <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.72rem", color: "#6B4A5A", fontWeight: 600 }}>Agama</span>
              <input
                value={demographics.religion}
                onChange={(e) => setDemographics((p) => ({ ...p, religion: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl outline-none"
                style={inputStyle}
                required
              />
            </label>
            <label className="flex flex-col gap-1">
              <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.72rem", color: "#6B4A5A", fontWeight: 600 }}>Suku</span>
              <input
                value={demographics.ethnicity}
                onChange={(e) => setDemographics((p) => ({ ...p, ethnicity: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl outline-none"
                style={inputStyle}
                required
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl p-4" style={{ background: "#EEE9F9", border: "1px solid #E0D8F0" }}>
          <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#4A3A7A", fontSize: "0.9rem", marginBottom: "0.35rem" }}>
            B. SMSES-BC
          </h2>
          <p style={{ fontFamily: "Nunito, sans-serif", color: "#5A4A8A", fontSize: "0.75rem", lineHeight: 1.6, marginBottom: "1rem" }}>
            Bacalah setiap pernyataan dan beri nilai 0–10 sesuai keyakinan Anda.
          </p>
          <div className="flex flex-col gap-4">
            {SMSES_BC_QUESTIONS.map((q, idx) => (
              <div key={idx} className="rounded-xl p-3" style={{ background: "white", border: "1px solid #E8E0F5" }}>
                <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.78rem", color: "#2D2D3E", lineHeight: 1.5, marginBottom: "0.5rem" }}>
                  <span style={{ color: "#8B7EC4", fontWeight: 700 }}>{idx + 1}.</span> Saya percaya diri dalam {q}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <label className="flex items-center gap-2">
                    <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.7rem", color: "#6B6B80" }}>Skor</span>
                    <select
                      value={scores[idx] === null ? "" : String(scores[idx])}
                      onChange={(e) => {
                        const v = e.target.value;
                        setScore(idx, v === "" ? null : parseInt(v, 10));
                      }}
                      className="px-2 py-1.5 rounded-lg outline-none"
                      style={{ ...inputStyle, minWidth: "4.5rem" }}
                    >
                      <option value="">—</option>
                      {Array.from({ length: 11 }, (_, n) => (
                        <option key={n} value={String(n)}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </label>
                  <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.65rem", color: "#9B9BAE" }}>0 = tidak percaya · 10 = sangat percaya</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {error ? (
          <p style={{ fontFamily: "Nunito, sans-serif", color: "#C85858", fontSize: "0.82rem", fontWeight: 600 }}>{error}</p>
        ) : null}

        <button
          type="submit"
          className="w-full py-4 rounded-2xl text-white shrink-0"
          style={{ background: "linear-gradient(135deg, #E8789A, #C96B8A)", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}
        >
          Kirim kuesioner
        </button>
      </form>
    </div>
  );
}
