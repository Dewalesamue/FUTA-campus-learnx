import { LecturerDashboard as LecturerDashboardComponent } from "../../components/LecturerDashboard";

interface LecturerDashboardProps {
  onLogout: () => void;
}

export function LecturerDashboard({ onLogout }: LecturerDashboardProps) {
  return <LecturerDashboardComponent onLogout={onLogout} />;
}