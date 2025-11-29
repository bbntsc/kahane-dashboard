import { DashboardLayout } from "@/components/dashboard-layout"
import { FaqContent } from "@/components/faq-content"

/**
 * Die FAQ-Seite, die das DashboardLayout verwendet und die FaqContent-Komponente anzeigt.
 */
export default function FaqPage() {
  return (
    <DashboardLayout>
      <FaqContent />
    </DashboardLayout>
  )
}