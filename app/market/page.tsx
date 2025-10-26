import { DashboardLayout } from "@/components/dashboard-layout"
import { MarketView } from "@/components/market-view"

export default function MarketPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ein Blick in den Markt</h1>
          <p className="mt-2 text-gray-600">Historische Marktentwicklung und Krisen im Überblick</p>
        </div>
        <MarketView />
      </div>
    </DashboardLayout>
  )
}
