import { StudentDashboard as StudentDashboardComponent } from "../../components/StudentDashboard";

interface StudentDashboardProps {
  onLogout: () => void;
  onVideoSelect: (video: any) => void;
}

export function StudentDashboard({ onLogout, onVideoSelect }: StudentDashboardProps) {
  return <StudentDashboardComponent onLogout={onLogout} onVideoSelect={onVideoSelect} />;
}