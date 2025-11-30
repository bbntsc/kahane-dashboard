import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PortfolioPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          {/* HIER WIRD DIE ÜBERSCHRIFT AUF text-3xl REDUZIERT UND FONT-SERIF FÜR KONSISTENZ HINZUGEFÜGT */}
          <h1 className="text-3xl font-serif text-gray-900 dark:text-[#f8f3ef]">Portfolio</h1>
          <p className="mt-2 text-gray-600">Detaillierte Übersicht über Ihre Investments und Asset-Allokation</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Übersicht</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-gray-500">Portfolio-Ansicht wird noch implementiert...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}