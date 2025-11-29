import { ContactForm } from "@/components/contact-form"
import { DashboardLayout } from "@/components/dashboard-layout" // Importiert das Layout

export default function ContactPage() {
  return (
    // Umschließt das Kontaktformular mit dem Dashboard-Layout
    <DashboardLayout>
        <ContactForm />
    </DashboardLayout>
  )
}