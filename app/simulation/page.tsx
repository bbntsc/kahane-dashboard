import { DashboardLayout } from "@/components/dashboard-layout"
// KORREKTUR: Importiere SimulationApp als Standard-Import (ohne geschweifte Klammern)
import SimulationApp from "@/components/simulation-app"

export default function SimulationPage() {
  return (
    <DashboardLayout>
      <SimulationApp />
    </DashboardLayout>
  )
}