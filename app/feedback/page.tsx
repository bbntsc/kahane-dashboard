import { DashboardLayout } from "@/components/dashboard-layout"
// KORREKTUR: Importiere FeedbackContent als Standard-Import
import FeedbackContent from "@/components/feedback-content" 

export default function FeedbackPage() {
  return (
    // Die Seite gibt nur das DashboardLayout zurück, das den Inhalt (children) rendert.
    <DashboardLayout>
      <FeedbackContent />
    </DashboardLayout>
  )
}