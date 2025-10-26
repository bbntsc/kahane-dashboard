"use client"

import { useState, useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import { CrisisDetailModal } from "./crisis-detail-modal"
import { Switch } from "@/components/ui/switch"

Chart.register(...registerables)

interface Crisis {
  id: string
  year: number
  name: string
  color: string
  description: string
  impact: string[]
  recovery: string[]
  recoveryTime: string
  dos: string[]
  donts: string[]
}

export function MarketView() {
  const [timeframe, setTimeframe] = useState<"40" | "30" | "20" | "10" | "5">("40")
  const [selectedCrisis, setSelectedCrisis] = useState<Crisis | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showInsights, setShowInsights] = useState(true)

  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const chartContainerRef = useRef<HTMLDivElement>(null)

  const crises: Crisis[] = [
    {
      id: "black-monday",
      year: 1987,
      name: "Schwarzer Montag",
      color: "#668273",
      description:
        "Am 19. Oktober 1987 stürzte der Dow Jones um 22,6% ab - der größte Tagesverlust in der Geschichte. Computergestützter Handel, Überbewertung und geopolitische Spannungen führten zu einem Dominoeffekt an den globalen Märkten.",
      impact: [
        "MSCI World Total Return: ca. -30% innerhalb weniger Wochen",
        "Globale Marktpanik und Liquiditätskrise",
        "Einführung von 'Circuit Breakers' an Börsen",
      ],
      recovery: [
        "Break-Even: Mitte 1989 wieder Vorkrisenniveau erreicht",
        "Schnelle Erholung durch entschlossene Zentralbankmaßnahmen",
      ],
      recoveryTime: "ca. 2 Jahre",
      dos: [
        "Qualitätsaktien halten: Fundamentalwerte setzten sich durch",
        "Antizyklisch handeln: Kaufgelegenheiten nutzen",
        "Diversifikation: Nicht nur auf einen Markt setzen",
      ],
      donts: [
        "Panikverkäufe: Emotionale Entscheidungen führten zu Verlusten",
        "Market Timing: Niemand konnte die schnelle Erholung vorhersagen",
        "Zu viel Fremdkapital: Hebelwirkung verstärkte Verluste",
      ],
    },
    {
      id: "japan-bubble",
      year: 1990,
      name: "Japan-Blase",
      color: "#668273",
      description:
        "Nach Jahren extremer Preissteigerungen kollabierten Aktien- und Immobilienpreise in Japan. Der Nikkei fiel von fast 39.000 Punkten auf unter 15.000 Punkte in wenigen Jahren.",
      impact: [
        "Nikkei-Index: -60% in drei Jahren",
        "Immobilienpreise in Tokio: -80% über die nächsten Jahrzehnte",
        "Beginn der 'Verlorenen Jahrzehnte' für Japan",
      ],
      recovery: [
        "Keine vollständige Erholung bis heute (Nikkei erreichte erst 2021 wieder 30.000 Punkte)",
        "Langanhaltende Deflation und wirtschaftliche Stagnation",
      ],
      recoveryTime: "über 30 Jahre (teilweise bis heute)",
      dos: [
        "Bewertungen beachten: Extreme KGVs und Immobilienpreise waren Warnsignale",
        "Geduld haben: Langfristige Perspektive bewahren",
        "Global diversifizieren: Nicht zu stark auf einen Markt setzen",
      ],
      donts: [
        "Dem Hype folgen: 'Diesmal ist alles anders' ist ein gefährliches Mantra",
        "Übermäßige Kreditaufnahme für Investments",
        "Ignorieren makroökonomischer Ungleichgewichte",
      ],
    },
    {
      id: "asia-crisis",
      year: 1997,
      name: "Asienkrise",
      color: "#668273",
      description:
        "Währungs- und Finanzkrise, die in Thailand begann und sich auf ganz Südostasien ausbreitete. Übermäßige Fremdwährungsverschuldung und spekulative Angriffe auf Währungen führten zu massiven Abwertungen und Markteinbrüchen.",
      impact: [
        "Thailändischer Baht: -50% gegenüber dem US-Dollar",
        "Indonesische Rupiah: -80% gegenüber dem US-Dollar",
        "MSCI Emerging Markets Asia: -60%",
      ],
      recovery: [
        "Break-Even für globale Märkte: ca. 1999",
        "Lokale Märkte erholten sich unterschiedlich schnell (3-7 Jahre)",
      ],
      recoveryTime: "ca. 2-3 Jahre für globale Märkte",
      dos: [
        "Währungsrisiken beachten: Fremdwährungsschulden waren Hauptproblem",
        "Auf Fundamentaldaten achten: Länder mit soliden Bilanzen erholten sich schneller",
        "Selektiv in Schwellenländer investieren",
      ],
      donts: [
        "Blind auf Wachstumsraten vertrauen ohne Beachtung der Risiken",
        "Kurzfristige Kapitalströme überbewerten",
        "Politische Risiken unterschätzen",
      ],
    },
    {
      id: "dotcom",
      year: 2000,
      name: "Dotcom-Blase",
      color: "#668273",
      description:
        "Die Dotcom-Blase war eine Spekulationsblase, die im März 2000 platzte. Überbewertete Internetunternehmen verloren rapide an Wert, nachdem jahrelang in unrentable Geschäftsmodelle investiert wurde.",
      impact: [
        "MSCI World Total Return: ca. -49% von März 2000 bis Oktober 2002",
        "Nasdaq verlor über 75% seines Wertes",
        "Viele Internetunternehmen gingen bankrott",
      ],
      recovery: [
        "Break-Even: Ende 2006 wieder Vorkrisenniveau erreicht",
        "Dauer: ca. 6-7 Jahre bis zur vollständigen Erholung",
      ],
      recoveryTime: "ca. 7 Jahre",
      dos: [
        "Fundamentalanalyse nutzen: Auf Unternehmen mit soliden Geschäftsmodellen und Gewinnen setzen",
        "Diversifikation: Nicht nur auf einen Sektor setzen",
        "Bewertungskennzahlen beachten: KGV, KUV und andere Metriken im historischen Kontext betrachten",
      ],
      donts: [
        "Hype folgen: Nicht in Unternehmen investieren, nur weil sie im Trend liegen",
        "FOMO (Fear of Missing Out): Nicht aus Angst, etwas zu verpassen, überteuert einsteigen",
        "Kreditfinanzierte Investments: Keine Kredite aufnehmen, um in spekulative Aktien zu investieren",
      ],
    },
    {
      id: "financial",
      year: 2008,
      name: "Finanzkrise",
      color: "#668273",
      description:
        "Die globale Finanzkrise wurde durch den US-Hypothekenmarkt ausgelöst. Schlechte Kredite (Subprime) wurden in undurchsichtige Finanzprodukte verpackt. Als Hauspreise fielen, platzte das System. Banken gerieten ins Wanken, Lehman Brothers kollabierte – das Vertrauen war weg. Die Krise griff weltweit auf Kapitalmärkte, Realwirtschaft und Staaten über.",
      impact: [
        "MSCI World Total Return: ca. -53% von Oktober 2007 bis März 2009",
        "Zusammenbruch großer Finanzinstitute",
        "Weltweite Rezession mit hoher Arbeitslosigkeit",
      ],
      recovery: [
        "Break-Even: Ende 2012 wieder Vorkrisenniveau erreicht",
        "Dauer: ca. 5 Jahre bis zur vollständigen Erholung",
      ],
      recoveryTime: "ca. 5 Jahre",
      dos: [
        "Langfristig bleiben: Wer nicht verkaufte, wurde belohnt",
        "Rebalancing nutzen: Nachkäufe in der Krise führten zu starkem Plus",
        "Risikoprofil treu bleiben: Portfolios, die zum Anleger passten, halfen durchzuhalten",
        "Verstehen, was man besitzt: Qualität zahlt sich aus",
      ],
      donts: [
        "Panikverkäufe: Viele stiegen am Tiefpunkt aus – mit fatalen Folgen",
        'Blinder Vertrauensverlust: Wer "alles verkauft" hat, verpasste die Rallye',
        "Überreaktion auf Medien: Crash-Schlagzeilen verstärkten irrationale Entscheidungen",
        "Kreditfinanzierte Investments: Leverage potenzierte Verluste",
      ],
    },
    {
      id: "euro-crisis",
      year: 2011,
      name: "Euro-Krise",
      color: "#668273",
      description:
        "Staatsschuldenkrise mehrerer europäischer Länder (Griechenland, Irland, Portugal, Spanien, Italien). Hohe Staatsverschuldung, Bankenkrise und strukturelle Probleme der Eurozone führten zu Vertrauensverlust und steigenden Renditen für Staatsanleihen.",
      impact: [
        "MSCI Europe: ca. -25% in 2011",
        "Griechische Staatsanleihen: Haircut von über 50%",
        "Renditen für südeuropäische Staatsanleihen stiegen auf über 7%",
      ],
      recovery: [
        'Break-Even: Nach Draghis "Whatever it takes" 2012 begann die Erholung',
        "Vollständige Erholung: ca. 2015-2016",
      ],
      recoveryTime: "ca. 4-5 Jahre",
      dos: [
        "Auf Qualität setzen: Unternehmen mit starken Bilanzen überstanden die Krise besser",
        "Politische Entwicklungen beobachten: Politische Entscheidungen waren entscheidend",
        "Diversifikation über Währungsräume hinweg",
      ],
      donts: [
        "Blind auf Staatsanleihen vertrauen: Auch Staatsanleihen können riskant sein",
        "Regionale Klumpenrisiken eingehen",
        "Kurzfristige politische Nachrichten überinterpretieren",
      ],
    },
    {
      id: "china-crash",
      year: 2015,
      name: "China-Crash",
      color: "#668273",
      description:
        "Der chinesische Aktienmarkt verlor innerhalb weniger Monate über 40%. Eine spekulative Blase, Margin Trading und Konjunkturabschwächung führten zu einem rapiden Kursverfall und globalen Marktturbulenzen.",
      impact: [
        "Shanghai Composite: -45% in wenigen Monaten",
        "Globale Märkte: vorübergehende Turbulenzen",
        "Kapitalflucht aus Schwellenländern",
      ],
      recovery: [
        "Globale Märkte: Relativ schnelle Erholung innerhalb von 6-12 Monaten",
        "Chinesischer Markt: Längere Erholungsphase von 2-3 Jahren",
      ],
      recoveryTime: "ca. 1 Jahr für globale Märkte",
      dos: [
        "Staatliche Eingriffe berücksichtigen: China intervenierte massiv",
        "Volatilität als Chance sehen: Übertriebene Reaktionen boten Kaufgelegenheiten",
        "Langfristige Trends von kurzfristigen Schwankungen trennen",
      ],
      donts: [
        "Übermäßiges Vertrauen in staatliche Markteingriffe",
        "Margin Trading in volatilen Märkten",
        "Panikverkäufe bei temporären Marktturbulenzen",
      ],
    },
    {
      id: "covid",
      year: 2020,
      name: "COVID-Crash",
      color: "#668273",
      description:
        "Der COVID-Crash war ein plötzlicher und schwerer Markteinbruch, ausgelöst durch die globale Coronavirus-Pandemie. Lockdowns und wirtschaftliche Unsicherheit führten zu einem der schnellsten Börsencrashs der Geschichte.",
      impact: [
        "MSCI World Total Return: ca. -34% von Februar bis März 2020",
        "Extrem hohe Volatilität in kurzer Zeit",
        "Massive staatliche Hilfsprogramme und Zentralbankinterventionen",
      ],
      recovery: [
        "Break-Even: Bereits Ende 2020 wieder Vorkrisenniveau erreicht",
        "Dauer: Nur wenige Monate bis zur vollständigen Erholung",
      ],
      recoveryTime: "ca. 6 Monate",
      dos: [
        "Ruhe bewahren: Der schnellste Crash führte zur schnellsten Erholung",
        "Antizyklisch handeln: Wer in der Krise kaufte, erzielte außergewöhnliche Renditen",
        "Qualitätsunternehmen bevorzugen: Solide Geschäftsmodelle erholten sich schneller",
      ],
      donts: [
        "Kurzfristige Prognosen: Niemand konnte die V-förmige Erholung vorhersagen",
        "Markttiming: Viele verpassten die Erholung, weil sie auf weitere Rückgänge warteten",
        "Panikverkäufe: Wer verkaufte, verpasste die schnelle Erholung",
      ],
    },
    {
      id: "inflation",
      year: 2022,
      name: "Inflationskrise",
      color: "#668273",
      description:
        "Höchste Inflationsraten seit den 1980er Jahren in vielen Industrieländern. Pandemie-Nachwirkungen, Lieferkettenprobleme, expansive Geldpolitik und der Ukraine-Krieg führten zu starken Zinserhöhungen und einem gleichzeitigen Rückgang bei Aktien und Anleihen.",
      impact: [
        "MSCI World: ca. -20% in 2022",
        "Anleihen: Einer der schlechtesten Anleihenmärkte der Geschichte",
        "Technologieaktien besonders betroffen mit Rückgängen von über 30%",
      ],
      recovery: ["Teilweise Erholung: 2023 starke Erholung bei Aktien", "Vollständige Erholung: Noch andauernd"],
      recoveryTime: "ca. 1-2 Jahre (noch andauernd)",
      dos: [
        "Inflationsschutz einbauen: Sachwerte und Unternehmen mit Preissetzungsmacht",
        "Diversifikation über Anlageklassen hinweg",
        "Geduld haben: Zinserhöhungszyklen enden irgendwann",
      ],
      donts: [
        "Zu stark auf Duration setzen: Langfristige Anleihen litten besonders",
        "Historische Korrelationen als gegeben annehmen",
        "Inflationsrisiken unterschätzen",
      ],
    },
    {
      id: "trump",
      year: 2024,
      name: "Trump-Unsicherheit",
      color: "#668273",
      description:
        "Die aktuelle Marktunsicherheit im Zusammenhang mit Donald Trumps möglicher Wiederwahl und seinen angekündigten Wirtschaftspolitiken, insbesondere Zöllen und Handelskonflikten, sorgt für erhöhte Volatilität an den Märkten.",
      impact: [
        "Erhöhte Marktvolatilität durch politische Unsicherheit",
        "Sektorrotation: Bestimmte Branchen profitieren, andere leiden",
        "Potenzielle Auswirkungen auf globale Lieferketten und Inflation",
      ],
      recovery: [
        "Noch unbekannt - Entwicklung abhängig vom tatsächlichen politischen Kurs",
        "Historisch haben sich Märkte an politische Veränderungen angepasst",
      ],
      recoveryTime: "noch unbekannt",
      dos: [
        "Diversifikation: Breite Streuung über Regionen und Sektoren",
        "Langfristig denken: Politische Zyklen sind temporär",
        "Qualitätsunternehmen mit Preissetzungsmacht bevorzugen",
      ],
      donts: [
        "Überreaktion auf Schlagzeilen: Nicht jede politische Äußerung führt zu langfristigen Marktveränderungen",
        "Portfolioumschichtung aus rein politischen Gründen",
        "Spekulative Wetten auf bestimmte Trump-Unternehmen",
      ],
    },
  ]

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    //  Generate MSCI World historical data
    const generateMSCIData = () => {
      // Base data points for 40 years (1985-2025)
      const baseData = [
        { year: 1985, value: 100 },
        { year: 1986, value: 130 },
        { year: 1987, value: 170 }, // Pre-Black Monday
        { year: 1988, value: 150 }, // Black Monday crash
        { year: 1989, value: 180 },
        { year: 1990, value: 160 }, // Japan bubble burst
        { year: 1991, value: 180 },
        { year: 1992, value: 190 },
        { year: 1993, value: 210 },
        { year: 1994, value: 205 },
        { year: 1995, value: 230 },
        { year: 1996, value: 260 },
        { year: 1997, value: 300 }, // Pre-Asian crisis
        { year: 1998, value: 280 }, // Asian crisis
        { year: 1999, value: 330 },
        { year: 2000, value: 320 }, // Dotcom peak
        { year: 2001, value: 280 },
        { year: 2002, value: 230 }, // Dotcom bottom
        { year: 2003, value: 270 },
        { year: 2004, value: 300 },
        { year: 2005, value: 320 },
        { year: 2006, value: 350 },
        { year: 2007, value: 380 }, // Pre-financial crisis
        { year: 2008, value: 220 }, // Financial crisis
        { year: 2009, value: 280 },
        { year: 2010, value: 310 },
        { year: 2011, value: 290 }, // Euro crisis
        { year: 2012, value: 320 },
        { year: 2013, value: 370 },
        { year: 2014, value: 390 },
        { year: 2015, value: 380 }, // China crash
        { year: 2016, value: 400 },
        { year: 2017, value: 450 },
        { year: 2018, value: 420 },
        { year: 2019, value: 500 }, // Pre-COVID
        { year: 2020, value: 420 }, // COVID crash
        { year: 2021, value: 580 },
        { year: 2022, value: 510 }, // Inflation crisis
        { year: 2023, value: 580 },
        { year: 2024, value: 620 }, // Trump uncertainty
        { year: 2025, value: 640 },
      ]

      // Filter based on selected timeframe
      const currentYear = 2025
      const startYear = currentYear - Number.parseInt(timeframe)
      return baseData.filter((d) => d.year >= startYear)
    }

    const msciData = generateMSCIData()
    const years = msciData.map((d) => d.year)
    const values = msciData.map((d) => d.value)

    // Filter crises based on the selected timeframe
    const filteredCrises = crises.filter((crisis) => {
      const currentYear = 2025
      const startYear = currentYear - Number.parseInt(timeframe)
      return crisis.year >= startYear && crisis.year <= currentYear
    })

    // Create chart
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: years,
        datasets: [
          {
            label: "MSCI World",
            data: values,
            borderColor: "#1b251d",
            backgroundColor: "rgba(27, 37, 29, 0.1)",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: (context) => `MSCI World: ${context.parsed.y}`,
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: true,
              color: "#f0f0f0",
            },
            ticks: {
              font: {
                size: 12,
                family: "Times New Roman",
              },
              callback: (value, index) => {
                // Zeige nur alle 5 Jahre an, außer bei kleinem Zeitraum
                const year = years[index]
                if (Number.parseInt(timeframe) <= 10) {
                  return year
                } else {
                  return year % 5 === 0 ? year : ""
                }
              },
            },
          },
          y: {
            grid: {
              display: true,
              color: "#f0f0f0",
            },
            ticks: {
              font: {
                size: 12,
                family: "Times New Roman",
              },
            },
            title: {
              display: true,
              text: "Index (1985 = 100)",
              font: {
                size: 12,
                family: "Times New Roman",
              },
            },
          },
        },
        onClick: (event, elements) => {
          if (!showInsights) return

          // Wenn kein Element angeklickt wurde, nichts tun
          if (!elements || elements.length === 0) return

          // Finde das nächste Krisenjahr zum angeklickten Punkt
          const clickedIndex = elements[0].index
          const clickedYear = years[clickedIndex]

          // Finde die nächstgelegene Krise
          let closestCrisis = null
          let minDistance = Number.MAX_VALUE

          filteredCrises.forEach((crisis) => {
            const distance = Math.abs(crisis.year - clickedYear)
            if (distance < minDistance) {
              minDistance = distance
              closestCrisis = crisis
            }
          })

          // Wenn eine Krise in der Nähe ist (max. 2 Jahre Abstand), zeige Details
          if (closestCrisis && minDistance <= 2) {
            setSelectedCrisis(closestCrisis)
            setShowModal(true)
          }
        },
      },
    })

    // Add crisis markers if insights are enabled
    if (showInsights) {
      const drawCrisisMarkers = (chart) => {
        const ctx = chart.ctx
        const xAxis = chart.scales.x
        const yAxis = chart.scales.y
        const meta = chart.getDatasetMeta(0)

        filteredCrises.forEach((crisis) => {
          // Finde den nächsten Datenpunkt zum Krisenjahr
          const yearIndex = years.findIndex((y) => y === crisis.year)
          if (yearIndex === -1) return

          // Hole die Position des Datenpunkts
          const point = meta.data[yearIndex]
          const xPos = point.x
          const yPos = point.y

          // Zeichne den roten Punkt
          ctx.beginPath()
          ctx.arc(xPos, yPos, 6, 0, 2 * Math.PI)
          ctx.fillStyle = "#e57373"
          ctx.fill()
          ctx.strokeStyle = "white"
          ctx.lineWidth = 1.5
          ctx.stroke()

          // Zeichne die vertikale Linie
          ctx.beginPath()
          ctx.moveTo(xPos, yAxis.bottom)
          ctx.lineTo(xPos, yPos + 6)
          ctx.strokeStyle = "#e57373"
          ctx.lineWidth = 1
          ctx.setLineDash([3, 3])
          ctx.stroke()
          ctx.setLineDash([])

          // Zeichne den Namen der Krise in einem Kasten
          const crisisName = crisis.name
          const textWidth = ctx.measureText(crisisName).width + 10 // Padding
          const textHeight = 20
          const boxX = xPos - textWidth / 2
          const boxY = yPos - 30

          // Hintergrund für den Text
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
          ctx.strokeStyle = "#e57373"
          ctx.lineWidth = 1

          // Zeichne abgerundetes Rechteck für den Hintergrund
          if (ctx.roundRect) {
            ctx.beginPath()
            ctx.roundRect(boxX, boxY, textWidth, textHeight, 4)
            ctx.fill()
            ctx.stroke()
          } else {
            // Fallback für Browser ohne roundRect
            ctx.fillRect(boxX, boxY, textWidth, textHeight)
            ctx.strokeRect(boxX, boxY, textWidth, textHeight)
          }

          // Zeichne den Text
          ctx.fillStyle = "#1b251d"
          ctx.font = "bold 10px Arial"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(crisisName, xPos, boxY + textHeight / 2)

          // Zeichne eine Linie vom Punkt zum Textkasten
          ctx.beginPath()
          ctx.moveTo(xPos, yPos - 6)
          ctx.lineTo(xPos, boxY + textHeight)
          ctx.strokeStyle = "#e57373"
          ctx.lineWidth = 1
          ctx.stroke()
        })
      }

      if (chartInstance.current && chartInstance.current.options && chartInstance.current.options.plugins) {
        chartInstance.current.options.plugins.afterDatasetsDraw = drawCrisisMarkers
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [timeframe, showInsights])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h2 className="mb-6 text-center text-2xl font-medium text-gray-900">Ein Blick in den Markt</h2>

        <div className="mb-4 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Anlagehorizont (Jahre)</h3>
            <div className="mt-2 flex space-x-2">
              {["40", "30", "20", "10", "5"].map((years) => (
                <button
                  key={years}
                  onClick={() => setTimeframe(years as "40" | "30" | "20" | "10" | "5")}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    timeframe === years ? "bg-[#1b251d] text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {years}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Insights:</span>
            <Switch checked={showInsights} onCheckedChange={setShowInsights} />
          </div>
        </div>

        <div className="mb-4 rounded-md bg-gray-100 p-4">
          <h4 className="mb-2 text-sm font-medium text-gray-900">Historische Betrachtung: {timeframe} Jahre</h4>
          <div className="space-y-1 text-xs text-gray-700">
            <p>Jährliche Extremwerte im Zeitraum:</p>
            <p>Maximaler Verlust: -53% (2008, Finanzkrise)</p>
            <p>Maximaler Gewinn: +33.8% (2003, nach Dotcom-Blase)</p>
          </div>
          <div className="mt-2 text-sm font-medium text-gray-900">
            Durchschnittliche Rendite p.a.: <span className="text-[#1b251d]">8.6%</span>
          </div>
        </div>

        <div className="relative h-[400px] rounded-lg border border-gray-200 bg-white p-4" ref={chartContainerRef}>
          <div className="absolute right-4 top-4 flex items-center space-x-2">
            <div className="text-sm font-medium text-gray-900">100% Aktienquote (MSCI World)</div>
            <div className="text-xs text-gray-500">Einblick: {timeframe} Jahre</div>
          </div>
          <canvas ref={chartRef} />
        </div>
      </div>

      {selectedCrisis && (
        <CrisisDetailModal crisis={selectedCrisis} isOpen={showModal} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}

// Polyfill for roundRect if not available
if (typeof CanvasRenderingContext2D !== "undefined" && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
    if (width < 2 * radius) radius = width / 2
    if (height < 2 * radius) radius = height / 2
    this.beginPath()
    this.moveTo(x + radius, y)
    this.arcTo(x + width, y, x + width, y + height, radius)
    this.arcTo(x + width, y + height, x, y + height, radius)
    this.arcTo(x, y + height, x, y, radius)
    this.arcTo(x, y, x + width, y, radius)
    this.closePath()
    return this
  }
}
