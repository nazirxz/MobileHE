import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import PatientLayout from "./pages/patient/PatientLayout";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientSession from "./pages/patient/PatientSession";
import PatientProgress from "./pages/patient/PatientProgress";
import PatientProfile from "./pages/patient/PatientProfile";
import NurseLayout from "./pages/nurse/NurseLayout";
import NurseDashboard from "./pages/nurse/NurseDashboard";
import NursePatientDetail from "./pages/nurse/NursePatientDetail";

export const router = createBrowserRouter([
  { path: "/", Component: Login },
  {
    path: "/pasien",
    Component: PatientLayout,
    children: [
      { index: true, Component: PatientDashboard },
      { path: "sesi/:hari", Component: PatientSession },
      { path: "kemajuan", Component: PatientProgress },
      { path: "profil", Component: PatientProfile },
    ],
  },
  {
    path: "/perawat",
    Component: NurseLayout,
    children: [
      { index: true, Component: NurseDashboard },
      { path: "pasien/:id", Component: NursePatientDetail },
    ],
  },
]);
