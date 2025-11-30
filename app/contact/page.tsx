import { DashboardLayout } from "@/components/dashboard-layout" // Importiert das Layout
// KORREKTUR: Importiere ContactForm als Standard-Import
import ContactForm from "@/components/contact-form"

export default function ContactPage() {
  return (
    // Umschließt das Kontaktformular mit dem Dashboard-Layout
    <DashboardLayout>
        <ContactForm />
    </DashboardLayout>
  )
}