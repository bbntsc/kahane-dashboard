import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Einstellungen</h1>
          <p className="mt-2 text-gray-600">Verwalten Sie Ihre Account-Einstellungen und Präferenzen</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account Einstellungen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-gray-500">Einstellungen werden noch implementiert...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
