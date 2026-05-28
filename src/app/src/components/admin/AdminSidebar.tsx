import { Sidebar } from "../common/Sidebar";
import { 
  Home, 
  Users, 
  GraduationCap, 
  Video, 
  BarChart3,
  Settings,
  Shield
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'lecturers', label: 'Lecturers', icon: GraduationCap },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <Sidebar
      activeTab={activeTab}
      onTabChange={onTabChange}
      items={sidebarItems}
      title="Admin Panel"
      subtitle="System Management"
    />
  );
}