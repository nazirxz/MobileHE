import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Heart, Eye, EyeOff, ChevronRight, Stethoscope, User } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<"pasien" | "perawat" | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) { setError("Mohon isi username dan kata sandi."); return; }
    setIsLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 800));
    const result = login(username, password);
    if (result.success) {
      if (result.role === "pasien") navigate("/pasien");
      else navigate("/perawat");
    } else {
      setError("Username atau kata sandi tidak sesuai. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  const demoAccounts = selectedRole === "pasien"
    ? [{ label: "Siti Rahayu", username: "siti.rahayu", password: "siti123" }, { label: "Nur Indah", username: "nur.indah", password: "nur123" }, { label: "Dewi Lestari", username: "dewi.lestari", password: "dewi123" }]
    : [{ label: "Ns. Kartini", username: "ns.kartini", password: "kartini123" }, { label: "Ns. Budi", username: "ns.budi", password: "budi123" }];

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(160deg, #FDE8F0 0%, #EEE4F8 40%, #E4EFF8 100%)" }}>
      <div className="w-full max-w-sm mx-auto px-5 py-8 flex flex-col gap-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-4">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, #E8789A, #C96B8A)" }}>
              <Heart className="w-10 h-10 text-white fill-white" />
            </div>
          </div>
          <h1 className="text-3xl" style={{ color: "#C96B8A", fontFamily: "Nunito, sans-serif", fontWeight: 800 }}>SNEfi Care</h1>
          <p className="text-sm mt-1" style={{ color: "#8B6B8A", fontFamily: "Nunito, sans-serif" }}>Pendamping Digital Pejuang Kanker</p>
        </motion.div>

        {/* Role selection */}
        {!selectedRole ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-4">
            <p className="text-center text-sm" style={{ color: "#6B6B80", fontFamily: "Nunito, sans-serif" }}>Masuk sebagai:</p>
            <button
              onClick={() => setSelectedRole("pasien")}
              className="w-full rounded-2xl p-5 flex items-center gap-4 text-left transition-transform active:scale-98"
              style={{ background: "white", boxShadow: "0 4px 20px rgba(201,107,138,0.15)", border: "2px solid #F7E8EE" }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #F7E8EE, #EDD0DF)" }}>
                <User className="w-7 h-7" style={{ color: "#C96B8A" }} />
              </div>
              <div className="flex-1">
                <div style={{ color: "#2D2D3E", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "1rem" }}>Saya Pasien</div>
                <div style={{ color: "#9B9BAE", fontFamily: "Nunito, sans-serif", fontSize: "0.8rem", fontWeight: 400 }}>Akses program terapi harian</div>
              </div>
              <ChevronRight className="w-5 h-5" style={{ color: "#C96B8A" }} />
            </button>
            <button
              onClick={() => setSelectedRole("perawat")}
              className="w-full rounded-2xl p-5 flex items-center gap-4 text-left transition-transform active:scale-98"
              style={{ background: "white", boxShadow: "0 4px 20px rgba(139,126,196,0.15)", border: "2px solid #EEE9F9" }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #EEE9F9, #DDD0F0)" }}>
                <Stethoscope className="w-7 h-7" style={{ color: "#8B7EC4" }} />
              </div>
              <div className="flex-1">
                <div style={{ color: "#2D2D3E", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "1rem" }}>Perawat / Nakes</div>
                <div style={{ color: "#9B9BAE", fontFamily: "Nunito, sans-serif", fontSize: "0.8rem", fontWeight: 400 }}>Dashboard pemantauan pasien</div>
              </div>
              <ChevronRight className="w-5 h-5" style={{ color: "#8B7EC4" }} />
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
            {/* Back + Title */}
            <div className="flex items-center gap-3">
              <button onClick={() => { setSelectedRole(null); setError(""); setUsername(""); setPassword(""); }} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                <ChevronRight className="w-5 h-5 rotate-180" style={{ color: "#6B6B80" }} />
              </button>
              <div>
                <div style={{ color: "#2D2D3E", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>{selectedRole === "pasien" ? "Masuk sebagai Pasien" : "Masuk sebagai Perawat"}</div>
              </div>
            </div>

            {/* Form */}
            <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
              <div className="flex flex-col gap-1">
                <label style={{ color: "#6B6B80", fontFamily: "Nunito, sans-serif", fontSize: "0.85rem", fontWeight: 600 }}>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{ background: "#FEF9F7", border: "2px solid #F0E8EE", fontFamily: "Nunito, sans-serif", color: "#2D2D3E" }}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label style={{ color: "#6B6B80", fontFamily: "Nunito, sans-serif", fontSize: "0.85rem", fontWeight: 600 }}>Kata Sandi</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="w-full px-4 py-3 pr-12 rounded-xl outline-none"
                    style={{ background: "#FEF9F7", border: "2px solid #F0E8EE", fontFamily: "Nunito, sans-serif", color: "#2D2D3E" }}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  />
                  <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
                    {showPass ? <EyeOff className="w-4 h-4" style={{ color: "#9B9BAE" }} /> : <Eye className="w-4 h-4" style={{ color: "#9B9BAE" }} />}
                  </button>
                </div>
              </div>
              {error && <p className="text-sm rounded-xl p-3" style={{ background: "#FEF0F0", color: "#C0404A", fontFamily: "Nunito, sans-serif" }}>{error}</p>}
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full py-4 rounded-xl text-white transition-opacity"
                style={{ background: selectedRole === "pasien" ? "linear-gradient(135deg, #E8789A, #C96B8A)" : "linear-gradient(135deg, #A08EC8, #8B7EC4)", fontFamily: "Nunito, sans-serif", fontWeight: 700, opacity: isLoading ? 0.7 : 1 }}
              >
                {isLoading ? "Sedang Masuk..." : "Masuk"}
              </button>
            </div>

            {/* Demo accounts */}
            <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.6)", border: "1px dashed #D0C8E0" }}>
              <p className="text-xs mb-2" style={{ color: "#9B9BAE", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>Akun Demo:</p>
              <div className="flex flex-col gap-1">
                {demoAccounts.map((acc) => (
                  <button key={acc.username} onClick={() => { setUsername(acc.username); setPassword(acc.password); }} className="text-left text-xs px-3 py-2 rounded-lg transition-colors" style={{ background: "rgba(255,255,255,0.8)", fontFamily: "Nunito, sans-serif", color: "#6B6B80" }}>
                    <span style={{ fontWeight: 600, color: "#4A4A6A" }}>{acc.label}</span> — {acc.username} / {acc.password}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <p className="text-center text-xs pb-4" style={{ color: "#B0A8C0", fontFamily: "Nunito, sans-serif" }}>
          © 2026 SNEfi Care · Platform Terapi Digital
        </p>
      </div>
    </div>
  );
}