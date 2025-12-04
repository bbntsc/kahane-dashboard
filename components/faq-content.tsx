"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { useSettings } from "@/lib/settings-context"
import { translations, useTranslation, type Language } from "@/lib/i18n"
import { ChevronDown, HelpCircle, BarChart3, TrendingUp, Mail, LayoutDashboard, PieChart, Star, Settings } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

// Typdefinition für die kombinierten FAQs
interface FaqItem {
  context: "overview" | "simulation" | "market" | "portfolio" | "feedback" | "settings" | "contact"
  icon: React.ElementType
  title: string
  questions: { question: string; answer: string }[]
}

/**
 * Holt und strukturiert alle FAQs aus den Übersetzungen.
 * WICHTIG: Diese Funktion wird exportiert und in ConciergeHelpModal verwendet!
 */
export function getCombinedFaqs(language: Language): FaqItem[] {
  const t = translations[language]

  // Fragen und Antworten aus ConciergeHelpModal (simulation-Kontext)
  const simulationHelp = [
    { 
      question: t.concierge.welcome, 
      answer: t.concierge.intro 
    },
    {
      question: language === "de" ? "Wie stelle ich die Regler ein?" : language === "fr" ? "Comment régler les curseurs ?" : language === "it" ? "Come regolo i cursori?" : "How do I set the sliders?",
      answer: language === "de" 
        ? "Ziehen Sie die Regler mit der Maus oder klicken Sie auf das Eingabefeld rechts daneben, um Werte direkt einzugeben." 
        : language === "fr" 
          ? "Faites glisser les curseurs avec la souris ou cliquez sur le champ de saisie à droite pour entrer directement les valeurs." 
          : language === "it" 
            ? "Trascina i cursori con il mouse o clicca sul campo di input a destra per inserire direttamente i valori." 
            : "Drag the sliders with the mouse or click the input field to the right to enter values directly.",
    },
    {
      question: language === "de" ? "Was bedeuten die drei Linien im Diagramm?" : language === "fr" ? "Que signifient les trois lignes du graphique ?" : language === "it" ? "Cosa significano le tre linee del grafico?" : "What do the three lines in the chart mean?",
      answer: language === "de" 
        ? "Die obere Linie zeigt den optimistischen Fall, die mittlere das realistische Szenario und die untere den vorsichtigen Fall." 
        : language === "fr" 
          ? "La ligne supérieure montre le cas optimiste (90 % des simulations se situent en dessous), la ligne médiane le scénario réaliste (50 %) et la ligne inférieure le cas prudent (seulement 10 % se situent en dessous)." 
          : language === "it" 
            ? "La linea superiore mostra il caso ottimistico (90% delle simulazioni sono sotto), quella centrale lo scenario realistico (50%) und quella inferiore il caso prudente (solo il 10% è sotto)." 
            : "The upper line shows the optimistic case (90% of simulations are below), the middle one the realistic scenario (50%), and the lower one the cautious case (only 10% are below).",
    },
    {
      question: language === "de" ? "Was ist die Aktienquote?" : language === "fr" ? "Qu'est-ce que la part d'actions ?" : language === "it" ? "Cos'è la quota azionaria?" : "What is the equity allocation?",
      answer: language === "de" 
        ? "Die Aktienquote bestimmt, wie viel Ihres Portfolios in Aktien investiert wird. Höhere Aktienquoten bieten mehr Wachstumspotenzial, aber auch mehr Schwankungen." 
        : language === "fr" 
          ? "La part d'actions détermine la part de votre portefeuille investie en actions. Des parts d'actions plus élevées offrent un plus grand potentiel de croissance, mais aussi plus de fluctuations." 
          : language === "it" 
            ? "La quota azionaria determina quanto del tuo portafoglio è investito in azioni. Quote azionarie più elevate offrono un maggiore potenziale di crescita, ma anche più volatilità." 
            : "The equity allocation determines how much of your portfolio is invested in stocks. Higher equity allocations offer greater growth potential, but also more volatility.",
    },
    {
      question: language === "de" ? "Warum MSCI World vs. S&P 500?" : language === "fr" ? "Pourquoi MSCI World vs. S&P 500?" : language === "it" ? "Perché MSCI World vs. S&P 500?" : "Why MSCI World vs. S&P 500?",
      answer: language === "de" 
        ? "Der MSCI World investiert global in entwickelte Märkte, der S&P 500 konzentriert sich auf die 500 größten US-Unternehmen. Beide haben historisch unterschiedliche Renditen und Volatilitäten." 
        : language === "fr" 
          ? "Le MSCI World investit à l'échelle mondiale dans les marchés développés, le S&P 500 se concentre sur les 500 plus grandes entreprises américaines. Les deux ont historiquement des rendements et des volatilitäten différents." 
          : language === "it" 
            ? "L'asse X mostra il tempo in anni. Puoi vedere come il tuo investimento si sviluppa nel periodo selezionato." 
            : "The MSCI World invests globally in developed markets, the S&P 500 focuses on the 500 largest US companies. Both have historically different returns and volatilities.",
    },
  ]
  
  // Fragen und Antworten aus ConciergeHelpModal (market-Kontext)
  const marketHelp = [
    {
      question: language === "de" ? "Was zeigt mir diese Seite?" : language === "fr" ? "Que montre cette page ?" : language === "it" ? "Cosa mostra questa pagina?" : "What does this page show me?",
      answer: language === "de" 
        ? "Hier sehen Sie, wie sich der Markt tatsächlich über verschiedene Zeiträume entwickelt hat – inklusive aller Krisen und Erholungsphasen." 
        : language === "fr" 
          ? "Ici, vous voyez comment le marché a réellement évolué sur différentes périodes – y compris toutes les crises et phases de reprise." 
          : language === "it" 
            ? "Qui puoi vedere come il mercato si è effettivamente sviluppato in diversi periodi – comprese tutte le crisi e le fasi di recupero." 
            : "Here you can see how the market has actually developed over different periods – including all crises and recovery phases.",
    },
    {
      question: language === "de" ? "Wie klicke ich auf eine Krise?" : language === "fr" ? "Comment cliquer sur une crise ?" : language === "it" ? "Come clicco su una crisi?" : "How do I click on a crisis?",
      answer: language === "de" 
        ? "Die roten Punkte markieren historische Krisen. Klicken Sie darauf, um Details zu erfahren, was damals passiert ist und wie sich der Markt erholt hat." 
        : language === "fr" 
          ? "Les points rouges marquent les crises historiques. Cliquez dessus pour en savoir plus sur ce qui s'est passé à l'époque und comment le marché s'est redressé." 
          : language === "it" 
            ? "I punti rossi contrassegnano le crisi storiche. Clicca su di essi per scoprire i dettagli di ciò che è successo e come si è ripreso il mercato." 
            : "The red dots mark historical crises. Click on them to learn details about what happened and how the market recovered.",
    },
    {
      question: language === "de" ? "Warum sind Krisen normal?" : language === "fr" ? "Pourquoi les crises sont-elles normales ?" : language === "it" ? "Perché le crisi sono normali?" : "Why are crises normal?",
      answer: language === "de" 
        ? "Märkte durchlaufen Zyklen. Krisen gehören dazu, aber langfristig haben sich Märkte historisch immer wieder erholt und neue Höchststände erreicht." 
        : language === "fr" 
          ? "Les marchés traversent des cycles. Les crises en font partie, mais à long terme, les marchés se sont historiquement toujours rétablis et ont atteint de nouveaux sommets." 
          : language === "it" 
            ? "I mercati attraversano cicli. Le crisi ne fanno parte, ma a lungo termine i mercati si sono sempre ripresi e hanno raggiunto nuovi massimi storici." 
            : "Markets go through cycles. Crises are part of it, but in the long term, markets have historically always recovered and reached new highs.",
    },
  ]

  // Fragen und Antworten aus ConciergeHelpModal (contact-Kontext)
  const contactHelp = [
    {
      question: language === "de" ? "Warum diese Fragen im Kontaktformular?" : language === "fr" ? "Pourquoi ces questions dans le formulaire de contact ?" : language === "it" ? "Perché queste domande nel modulo di contatto?" : "Why these questions in the contact form?",
      answer: language === "de" 
        ? "Die Fragen helfen unseren Beratern, sich optimal auf Ihr Gespräch vorzubereiten und Ihnen die bestmögliche Unterstützung zu bieten." 
        : language === "fr" 
          ? "Les questions aident nos conseillers à se préparer au mieux à votre entretien et à vous offrir le meilleur soutien possible." 
          : language === "it" 
            ? "Le domande aiutano i nostri consulenti a prepararsi in modo ottimale per il tuo colloquio e offrirti il miglior supporto possibile." 
            : "The questions help our advisors to optimally prepare for your consultation and offer you the best possible support.",
    },
    {
      question: language === "de" ? "Sind meine Daten sicher?" : language === "fr" ? "Mes données sont-elles sécurisées ?" : language === "it" ? "I miei dati sono al sicuro?" : "Is my data secure?",
      answer: language === "de" 
        ? "Selbstverständlich. Ihre Daten werden vertraulich behandelt und ausschließlich für die Kontaktaufnahme verwendet." 
        : language === "fr" 
          ? "Bien sûr. Vos données sont traitées de manière confidentielle et utilisées uniquement pour la prise de contact." 
          : language === "it" 
            ? "Certamente. I tuoi dati sono trattati in modo confidenziale e utilizzati esclusivamente per scopi di contatto." 
            : "Of course. Your data is treated confidentially and used exclusively for contact purposes.",
    },
    {
      question: language === "de" ? "Wie schnell bekomme ich eine Antwort?" : language === "fr" ? "À quelle vitesse vais-je obtenir une réponse ?" : language === "it" ? "Quanto velocemente otterrò una risposta?" : "How quickly will I get a response?",
      answer: language === "de" ? "In der Regel meldet sich ein Berater innerhalb von 1-2 Werktagen bei Ihnen." : language === "fr" ? "En règle générale, un conseiller vous contactera dans un délai de 1 à 2 jours ouvrables." : language === "it" ? "Di solito, un consulente ti contatterà entro 1-2 giorni lavorativi." : "Typically, an advisor will contact you within 1-2 business days.",
    },
  ]
  
  // NEUE KATEGORIEN HINZUGEFÜGT
  const overviewHelp = [
    {
      question: language === "de" ? "Was sehe ich auf der Übersichtsseite?" : language === "fr" ? "Que vois-je sur la page d'aperçu ?" : language === "it" ? "Cosa vedo sulla pagina Panoramica?" : "What do I see on the Overview page?",
      answer: language === "de" ? "Die Übersichtsseite dient als Dashboard, das Ihnen einen schnellen Einblick in die wichtigsten Kennzahlen und Aktivitäten Ihres Portfolios sowie aktuelle Markt-Insights bietet." : language === "fr" ? "La page d'aperçu sert de tableau de bord, vous donnant un aperçu rapide des métriques clés et des activités de votre portefeuille, ainsi que des aperçus de marché actuels." : language === "it" ? "La pagina Panoramica funge da dashboard, offrendoti una rapida visione delle metriche chiave e delle attività del tuo portafoglio, insieme agli approfondimenti di mercato attuali." : "The overview page serves as a dashboard, giving you a quick insight into the key metrics and activities of your portfolio, along with current market insights.",
    },
    {
      question: language === "de" ? "Was sind 'Quick Actions'?" : language === "fr" ? "Que sont les 'Actions Rapides' ?" : language === "it" ? "Cosa sono le 'Azioni rapide'?" : "What are 'Quick Actions'?",
      answer: language === "de" ? "Die 'Quick Actions' bieten schnelle Verknüpfungen zu den Hauptfunktionen der Anwendung, wie der Vermögenssimulation und der Marktanalyse." : language === "fr" ? "Les 'Actions Rapides' fournissent des liens rapides vers les principales fonctionnalités de l'application, telles que la simulation de patrimoine et l'analyse du marché." : language === "it" ? "Le 'Azioni rapide' forniscono collegamenti rapidi alle funzionalità principali dell'applicazione, come la simulazione de patrimonio e l'analyse du marché." : "The 'Quick Actions' provide quick links to the main features of the application, such as the wealth simulation and market analysis.",
    },
  ];

  const portfolioHelp = [
    {
      question: language === "de" ? "Was finde ich unter 'Portfolio'?" : language === "fr" ? "Que puis-je trouver sous 'Portefeuille' ?" : language === "it" ? "Cosa posso trovare sotto 'Portafoglio'?" : "What can I find under 'Portfolio'?",
      answer: language === "de" ? "Die Portfolio-Seite bietet eine detaillierte, wenngleich derzeit vereinfachte, Übersicht über Ihre Investments, Asset-Allokation und Performance. (Funktionen werden noch erweitert.)" : language === "fr" ? "La page Portefeuille offre un aperçu détaillé, bien que actuellement simplifié, de vos investissements, de votre allocation d'actifs et de vos performances. (Les fonctionnalités sont toujours en cours d'extension.)" : language === "it" ? "La pagina Portafoglio offre una panoramica dettagliata, sebbene attualmente semplificata, dei tuoi investimenti, dell'allocazione degli asset e delle prestazioni. (Le funzionalità sono ancora in fase di espansione.)" : "The portfolio page offers a detailed, though currently simplified, overview of your investments, asset allocation, and performance. (Features are still being expanded.)",
    },
  ];

  const feedbackHelp = [
    {
      question: language === "de" ? "Wofür ist die Feedback-Seite?" : language === "fr" ? "À quoi sert la page Feedback ?" : language === "it" ? "A cosa serve la pagina Feedback?" : "What is the Feedback page for?",
      answer: language === "de" ? "Wir schätzen Ihre Meinung! Über diese Seite können Sie uns direkt Feedback zur Simulation und zur gesamten Plattform geben, um uns bei der stetigen Verbesserung zu helfen." : language === "fr" ? "Nous apprécions votre opinion! Grâce à cette page, vous pouvez nous donner directement des commentaires sur la simulation et l'ensemble de la plateforme pour nous aider à nous améliorer continuellement." : language === "it" ? "Apprezziamo la tua opinione! Attraverso questa pagina, puoi fornirci direttamente feedback sulla simulazione et l'ensemble de la plateforme pour nous aider à nous améliorer continuellement." : "We value your opinion! Through this page, you can give us direct feedback on the simulation and the entire platform to help us continuously improve.",
    },
  ];

  const settingsHelp = [
    {
      question: language === "de" ? "Was kann ich in den Einstellungen anpassen?" : language === "fr" ? "Que puis-je ajuster dans les paramètres ?" : language === "it" ? "Cosa posso regolare nelle Impostazioni?" : "What can I adjust in the Settings?",
      answer: language === "de" ? "Hier können Sie grundlegende Einstellungen wie das Design (Hell/Dunkel), die Schriftgröße und die Anzeigesprache der Applikation nach Ihren Wünschen konfigurieren." : language === "fr" ? "Ici, vous pouvez configurer les paramètres de base tels que le thème (clair/sombre), la taille de la police et la langue d'affichage de l'application selon vos préférences." : language === "it" ? "Qui puoi configurare le impostazioni di base come il tema (chiaro/scuro), la dimensione del carattere e la lingua di visualizzazione dell'applicazione in base alle tue preferenze." : "Here you can configure basic settings such as the theme (light/dark), font size, and the display language of the application according to your preferences.",
    },
  ];
  // ENDE NEUE KATEGORIEN

  const fullSimulationHelp = simulationHelp;

  return [
    {
      context: "overview",
      icon: LayoutDashboard,
      title: t.nav.overview,
      questions: overviewHelp,
    },
    {
      context: "simulation",
      icon: BarChart3,
      title: t.simulation.title,
      questions: fullSimulationHelp,
    },
    {
      context: "market",
      icon: TrendingUp,
      title: t.market.title,
      questions: marketHelp,
    },
    {
      context: "portfolio",
      icon: PieChart,
      // NEU: Greife auf den übersetzten Namen zu, auch wenn es nur "Portfolio" ist.
      title: t.nav.portfolio, // KORREKTUR: Nutzt jetzt t.nav.portfolio
      questions: portfolioHelp,
    },
    {
      context: "feedback",
      icon: Star,
      title: t.feedback.title,
      questions: feedbackHelp,
    },
    {
      context: "settings",
      icon: Settings,
      title: t.settings.title,
      questions: settingsHelp,
    },
    {
      context: "contact",
      icon: Mail,
      title: t.contact.title,
      questions: contactHelp,
    },
  ] as FaqItem[]
}

/**
 * Komponente für einen einzelnen, aufklappbaren FAQ-Eintrag.
 */
function AccordionItem({ item, isActive, onClick }: { item: { question: string, answer: string }, isActive: boolean, onClick: () => void }) {
  return (
    <div className="border-b border-[#ede9e1] dark:border-gray-700">
      <button
        // SCHRIFT ANPASSUNG: text-base für die Frage
        className="flex justify-between items-center w-full py-4 text-left font-semibold text-[#1b251d] dark:text-[#f8f3ef] hover:text-[#4a5f52] dark:hover:text-[#668273] transition-colors focus:outline-none text-base"
        onClick={onClick}
      >
        <span className="text-base">{item.question}</span>
        <motion.div
          animate={{ rotate: isActive ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="h-5 w-5 flex-shrink-0 text-[#6b7280] dark:text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            {/* SCHRIFT ANPASSUNG: text-sm für die Antwort */}
            <p className="pb-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


/**
 * Hauptkomponente, die alle FAQ-Kategorien anzeigt.
 */
export function FaqContent() {
  const { language } = useSettings()
  // Hole die Übersetzungen einmal am Anfang
  const t = useTranslation(language) 
  
  // Verwenden Sie useMemo, um die Faqs nur neu zu berechnen, wenn sich die Sprache ändert
  const faqs = useMemo(() => getCombinedFaqs(language), [language])
  // Speichert den Index der aktuell geöffneten Frage (Kategorie, Frage)
  const [openIndex, setOpenIndex] = useState<{ category: number, question: number } | null>(null)

  const handleToggle = (category: number, question: number) => {
    setOpenIndex(prev => prev && prev.category === category && prev.question === question ? null : { category, question })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <header className="text-center mb-12">
        {/* HIER WIRD DIE ÜBERSCHRIFT DYNAMISCH ÜBERSETZT */}
        <h1 className="text-3xl font-serif font-bold text-[#1b251d] dark:text-[#f8f3ef] mb-3">
          <HelpCircle className="inline-block w-6 h-6 mr-3 text-[#4a5f52]" /> {/* Icon-Größe angepasst */}
          {t.settings.faqTitle}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {t.settings.faqSubtitle}
        </p>
      </header>

      {faqs.map((category, catIndex) => (
        <Card key={catIndex} className="mb-8 rounded-xl p-0 shadow-lg border-[#ede9e1] dark:border-gray-700">
            <header className="flex items-center gap-4 bg-[#f8f3ef] dark:bg-gray-800 p-6 rounded-t-xl border-b border-[#ede9e1] dark:border-gray-700">
                <category.icon className="h-6 w-6 text-[#1b251d] dark:text-[#f8f3ef] flex-shrink-0" />
                {/* Sektionsüberschrift auf text-xl reduziert */}
                <h2 className="text-xl font-serif font-bold text-[#1b251d] dark:text-[#f8f3ef]">
                    {category.title}
                </h2>
            </header>
          <CardContent className="p-6">
            <div className="space-y-0">
              {category.questions.map((q, qIndex) => (
                <AccordionItem
                  key={qIndex}
                  item={q}
                  isActive={openIndex?.category === catIndex && openIndex?.question === qIndex}
                  onClick={() => handleToggle(catIndex, qIndex)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

        <footer className="mt-12 text-center text-gray-600 dark:text-gray-400">
            <p>
                {/* HIER WIRD DER TEXT WEITERHIN DURCH WENN/DANN ÜBERSETZT, DA ES KOMPLEX IST */}
                {language === "de" 
                    ? "Haben Sie weitere Fragen? Kontaktieren Sie uns direkt über die"
                    : language === "fr"
                        ? "Avez-vous d'autres questions? Contactez-nous directement via la"
                        : language === "it"
                            ? "Hai altre domande? Contattaci direttamente tramite la"
                            : "Do you have further questions? Contact us directly via the"}
                {" "}
                <Link href="/contact" className="text-[#4a5f52] font-semibold hover:underline">
                    {t.nav.contact}
                </Link>
                -Seite.
            </p>
        </footer>
    </div>
  )
}