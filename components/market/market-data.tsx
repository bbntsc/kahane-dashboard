// Interface für eine Krise
export interface Crisis {
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

// Interface für einen Datenpunkt (Jahr/Wert)
export interface PortfolioDataPoint {
  year: number
  value: number // Berechneter Portfoliowert
}

// Array mit allen Krisen-Objekten
export const crises: Crisis[] = [
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

// Historische Basis-Datenpunkte für den Chart
export const baseMSCIData = [
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

// Funktion zur Berechnung der Portfolio-Historie
export function calculatePortfolioHistory(
  startCapital: number,
  monthlyInvest: number,
  stockQuota: number, // 0 bis 100
  startYear: number,
  endYear: number
): PortfolioDataPoint[] {
  const stockRatio = stockQuota / 100
  const bondRatio = 1 - stockRatio
  
  const filteredMSCI = baseMSCIData.filter(d => d.year >= startYear - 1 && d.year <= endYear)
  
  if (filteredMSCI.length < 2) return []

  const annualBondReturn = 0.02 

  let portfolioValue = startCapital 
  const history: PortfolioDataPoint[] = []

  // Erster Datenpunkt
  history.push({ year: startYear, value: startCapital })
  
  for (let i = 1; i < filteredMSCI.length; i++) {
    const prevMSCI = filteredMSCI[i - 1];
    const currentMSCI = filteredMSCI[i];
    
    // Berechne die prozentuale Veränderung des Aktienindex im aktuellen Jahr
    const msciReturn = (currentMSCI.value / prevMSCI.value) - 1;
    
    // Portfolio-Rendite (Aktien und Bonds gewichtet)
    const portfolioReturn = (msciReturn * stockRatio) + (annualBondReturn * bondRatio);
    
    // Zuwachs/Verlust des aktuellen Kapitals
    portfolioValue *= (1 + portfolioReturn);

    // Füge die monatliche Investition hinzu (einfache Endjahres-Summierung)
    portfolioValue += monthlyInvest * 12; 

    history.push({
      year: currentMSCI.year,
      value: Math.round(portfolioValue),
    })
  }

  return history.filter(d => d.year >= startYear); // Filtert das unnötige Vorjahr raus, falls es enthalten ist
}

// NEU: Funktion für die statistischen Kennzahlen der Box unten
export function calculateScenarioStatistics( // EXPORT HINZUGEFÜGT
  stockQuota: number,
  horizonYears: number
) {
  const currentYear = 2025;
  const startYear = currentYear - horizonYears;
  
  // Wir filtern die Basisdaten auf den gewählten Zeitraum (brauchen Vorjahr für Renditeberechnung)
  const relevantData = baseMSCIData.filter(d => d.year >= startYear - 1 && d.year <= currentYear);
  
  let maxDrawdown = 0;
  let maxDrawdownYear = 0;
  let maxGain = -Infinity;
  let maxGainYear = 0;
  let totalReturnSum = 0;
  let count = 0;

  const stockRatio = stockQuota / 100;
  const safeRatio = 1 - stockRatio;
  const safeRate = 0.02; // 2% für den sicheren Teil

  // Wir iterieren durch die Jahre und berechnen die fiktive Strategie-Rendite
  for (let i = 1; i < relevantData.length; i++) {
    const prev = relevantData[i - 1];
    const curr = relevantData[i];
    
    const marketReturn = (curr.value / prev.value) - 1;
    const strategyReturn = (marketReturn * stockRatio) + (safeRate * safeRatio);
    
    // Statistiken aktualisieren
    if (strategyReturn < maxDrawdown) {
      maxDrawdown = strategyReturn;
      maxDrawdownYear = curr.year;
    }
    
    if (strategyReturn > maxGain) {
      maxGain = strategyReturn;
      maxGainYear = curr.year;
    }

    totalReturnSum += strategyReturn;
    count++;
  }

  const averageReturn = count > 0 ? (totalReturnSum / count) : 0;

  return {
    averageReturn: averageReturn * 100, // In Prozent
    maxDrawdown: maxDrawdown * 100,     // In Prozent (ist negativ)
    maxDrawdownYear,
    maxGain: maxGain * 100,             // In Prozent
    maxGainYear
  };
}

// Hilfsfunktion, um zu prüfen, ob ein Jahr eine benannte Krise war
export function getCrisisName(year: number): string | null {
  const crisis = crises.find(c => c.year === year || c.year === year - 1); // Manche Krisen wirken im Folgejahr
  return crisis ? crisis.name : null;
}