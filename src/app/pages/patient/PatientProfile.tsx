import { motion } from "motion/react";
import { User, Phone, Activity, Calendar, LogOut, Heart, Shield, Info } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useNavigate } from "react-router";
import type { Patient } from "../../data/mockData";

export default function PatientProfile() {
  const { currentUser, logout, getPatientSessions } = useApp();
  const navigate = useNavigate();
  const patient = currentUser as Patient;
  const sessions = getPatientSessions(patient?.id ?? "");
  const completed = sessions.filter((s) => s.status === "selesai");

  const handleLogout = () => { logout(); navigate("/"); };

  const infoItems = [
    { icon: User, label: "Nama Lengkap", value: patient?.name },
    { icon: Activity, label: "Diagnosis", value: patient?.diagnosis },
    { icon: Heart, label: "Siklus Kemoterapi", value: patient?.chemoCycle },
    { icon: Calendar, label: "Tanggal Mulai Program", value: patient?.startDate ? new Date(patient.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "—" },
    { icon: Phone, label: "Nomor Telepon", value: patient?.phone },
  ];

  return (
    <div className="flex flex-col" style={{ background: "#FEF9F7", minHeight: "100%" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-8 flex flex-col items-center gap-3" style={{ background: "linear-gradient(160deg, #F7E8EE 0%, #EEE4F8 100%)" }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #E8789A, #C96B8A)", boxShadow: "0 8px 24px rgba(201,107,138,0.3)" }}>
            <User className="w-10 h-10 text-white" />
          </div>
        </motion.div>
        <div className="text-center">
          <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#2D2D3E", fontSize: "1.2rem" }}>{patient?.name}</h2>
          <p style={{ fontFamily: "Nunito, sans-serif", color: "#9B7B8A", fontSize: "0.82rem" }}>Pasien SNEfi Care</p>
        </div>
        <div className="flex gap-3">
          {[
            { label: "Sesi Selesai", value: completed.length },
            { label: "Hari Aktif", value: patient?.currentDay ?? 1 },
          ].map(({ label, value }) => (
            <div key={label} className="px-5 py-3 rounded-2xl text-center" style={{ background: "rgba(255,255,255,0.7)" }}>
              <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#C96B8A", fontSize: "1.2rem" }}>{value}</div>
              <div style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.7rem", color: "#9B7B8A" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-5 flex flex-col gap-4">
        {/* Patient info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl overflow-hidden" style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div className="px-4 py-3" style={{ borderBottom: "1px solid #F0E8EE" }}>
            <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#2D2D3E", fontSize: "0.9rem" }}>Informasi Pasien</span>
          </div>
          {infoItems.map(({ icon: Icon, label, value }, i) => (
            <div key={label} className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: i < infoItems.length - 1 ? "1px solid #F8F5FF" : "none" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#F7E8EE" }}>
                <Icon className="w-4 h-4" style={{ color: "#C96B8A" }} />
              </div>
              <div className="flex-1">
                <div style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.72rem", color: "#9B9BAE" }}>{label}</div>
                <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600, color: "#2D2D3E", fontSize: "0.88rem" }}>{value}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* About program */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl p-4" style={{ background: "#EEE9F9" }}>
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4" style={{ color: "#8B7EC4" }} />
            <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#4A3A7A", fontSize: "0.9rem" }}>Tentang Program</span>
          </div>
          <p style={{ fontFamily: "Nunito, sans-serif", color: "#5A4A8A", fontSize: "0.82rem", lineHeight: 1.7 }}>
            Program SNEfi Care dirancang khusus untuk mendampingi pasien kanker payudara pasca mastektomi yang menjalani kemoterapi. Program ini bersifat pendukung dan tidak menggantikan pengobatan medis.
          </p>
        </motion.div>

        {/* Privacy */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl p-4" style={{ background: "#E8F5EE" }}>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4" style={{ color: "#6BAF8F" }} />
            <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#2A5A3A", fontSize: "0.9rem" }}>Kerahasiaan Data</span>
          </div>
          <p style={{ fontFamily: "Nunito, sans-serif", color: "#3A7A5A", fontSize: "0.82rem", lineHeight: 1.7 }}>
            Semua data refleksi dan afirmasimu bersifat rahasia dan hanya dapat diakses oleh tim medis yang merawatmu. Kamu aman berbagi perasaan yang sesungguhnya.
          </p>
        </motion.div>

        {/* Logout */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <button onClick={handleLogout} className="w-full py-4 rounded-2xl flex items-center justify-center gap-3" style={{ background: "white", border: "2px solid #F7E8EE", fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#C96B8A" }}>
            <LogOut className="w-5 h-5" />
            Keluar dari Akun
          </button>
        </motion.div>

        <div className="h-4" />
      </div>
    </div>
  );
}