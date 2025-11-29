import { DashboardLayout } from "@/components/dashboard-layout"
import { FeedbackContent } from "@/components/feedback-content" // Importiert die neu erstellte Komponente

export default function FeedbackPage() {
  return (
    // Die Seite gibt nur das DashboardLayout zurück, das den Inhalt (children) rendert.
    <DashboardLayout>
      <FeedbackContent />
    </DashboardLayout>
  )
}