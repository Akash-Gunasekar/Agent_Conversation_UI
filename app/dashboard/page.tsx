import ThreePanelLayout from "@/components/three-panel-layout"
import { Header } from "@/components/header"

export default function DashboardPage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <ThreePanelLayout />
      </div>
    </div>
  )
}
