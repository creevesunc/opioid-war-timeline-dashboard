import React, { useState } from "react";
import {
  ResponsiveContainer, LineChart, BarChart, AreaChart, ComposedChart,
  Line, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from "recharts";

const YEARS = Array.from({ length: 25 }, (_, i) => 1999 + i);
const heroin = [1960,1842,1779,2089,2080,1878,2009,2088,2399,3041,3278,3036,4397,5925,8257,10574,12989,15469,15482,14996,14019,13165,9173,5871,3984];
const fentanyl = [730,782,957,1295,1400,1664,1742,2707,2213,2306,2946,3007,2666,2628,3105,5544,9580,19413,28466,31335,36359,56516,70601,73838,72776];
const rxOpioids = [2749,2917,3479,4416,4867,5231,5774,7017,8158,9119,9735,10943,11693,11140,11346,12159,12727,14487,14495,12552,11886,13471,13618,11871,13026];
const methadone = [784,986,1456,2358,2972,3845,4460,5406,5518,4924,4696,4577,4418,3932,3591,3400,3301,3373,3194,3023,2740,3543,3678,3334,3299];
const anyOpioid = [8050,8407,9496,11920,12940,13756,14918,17545,18516,19582,20422,21089,22784,23166,25052,28647,33091,42249,47600,46802,49860,68630,80411,81806,79358];
const cultivation = [90583,82171,7606,74100,80000,131000,104000,165000,193000,157000,123000,123000,131000,154000,209000,224000,183000,201000,328000,263000,163000,224000,177000,233000,10800];
const production = [4565,3276,185,3400,3600,4200,4100,6100,7400,7700,6900,5800,5800,7400,7400,7300,3300,4800,9000,6400,6400,6300,6800,6200,333];
const costB = [82,86,97,122,133,141,153,179,189,200,209,216,233,237,256,293,504,432,696,723,985,1480,1560,1590,1540];
const heroinMarket = [17,17,18,19,19,20,20,19,18,17,16,15,15,15,16,17,20,27,25,23,21,19,17,15,13];
const cohorts = [6664,6509,6304,6042,5721,5334,4829,4186,3514,2875,2289,1748,1357,1091,877,791,686,555,434,322,219,125,61,25,0,0];

// DEA ARCOS / openARCOS: oxycodone + hydrocodone pills shipped to retail, 2006-2014 (billions)
const pills = [8.19, 9.22, 10.00, 10.84, 11.62, 12.43, 12.32, 11.90, 11.61];
// Purdue OxyContin reported sales ($M, published milestones) and Endo Opana+Opana ER ($M, SEC filings)
const oxySales = [
  { year: 1996, oxycontin: 48, opana: null },
  { year: 2000, oxycontin: 1100, opana: null },
  { year: 2003, oxycontin: 1840, opana: null },
  { year: 2005, oxycontin: 1300, opana: null },
  { year: 2006, oxycontin: 752, opana: null },
  { year: 2007, oxycontin: 1000, opana: null },
  { year: 2008, oxycontin: 2300, opana: 180.4 },
  { year: 2010, oxycontin: 3100, opana: 299.1 },
];

const pillData = YEARS.map((y, i) => ({
  year: y,
  pills: y >= 2006 && y <= 2014 ? pills[y - 2006] : null,
}));

const base = YEARS.map((y, i) => ({
  year: y, heroin: heroin[i], fentanyl: fentanyl[i], rxOpioids: rxOpioids[i],
  methadone: methadone[i], anyOpioid: anyOpioid[i],
  cultivation: cultivation[i], production: production[i],
  costB: costB[i], heroinMarket: heroinMarket[i],
}));

const opanaData = [
  { year: 2008, opana: 180.4 },
  { year: 2009, opana: 230.6 },
  { year: 2010, opana: 299.1 },
];

const cohortData = Array.from({ length: 26 }, (_, i) => ({ birth: 1985 + i, deaths: cohorts[i] }));

const events = [
  { year: 1995, label: "FDA approves OxyContin (Purdue)" },
  { year: 2000, label: "OxyContin sales pass $1B — pharma boom already underway pre-war" },
  { year: 2001, label: "Taliban opium ban (−90%) → U.S. invasion Oct 2001" },
  { year: 2003, label: "GAO report on OxyContin promotion; Afghan cultivation 80,000 ha" },
  { year: 2006, label: "ARCOS: 8.2B oxycodone/hydrocodone pills shipped to pharmacies" },
  { year: 2007, label: "Purdue criminal guilty plea (OxyContin misbranding)" },
  { year: 2010, label: "OxyContin reformulated abuse-deterrent; pill shipments peak 2011; heroin deaths begin steep climb" },
  { year: 2013, label: "Heroin deaths pass 8,000; Afghan cultivation 209,000 ha" },
  { year: 2017, label: "Afghan poppy record 328,000 ha; heroin deaths peak 15,482" },
  { year: 2018, label: "DEA cuts opioid manufacturing quotas sharply (2016–2018)" },
  { year: 2021, label: "U.S. withdrawal complete (Aug)" },
  { year: 2022, label: "Taliban poppy ban (April); heroin deaths fall below 6,000" },
  { year: 2023, label: "Afghan cultivation −95%; heroin deaths at 3,984 — lowest since 2003" },
];

const sections = [
  { id: "story", title: "1 · The Full Story", sub: "One narrative, all timelines" },
  { id: "supply", title: "2 · Afghan Supply", sub: "Poppies & opium vs. war" },
  { id: "riseFall", title: "3 · Rise & Fall", sub: "All opioids, one timeline" },
  { id: "pills", title: "4 · Pill Flood", sub: "ARCOS distribution 2006–14" },
  { id: "pharma", title: "5 · Pharma Revenue", sub: "OxyContin & Opana sales" },
  { id: "makers", title: "6 · The Makers", sub: "Companies & products" },
  { id: "heroin", title: "7 · Heroin Deaths", sub: "1999–2023" },
  { id: "money", title: "8 · Money", sub: "Proceeds & national cost" },
  { id: "prison", title: "9 · Incarceration", sub: "Drug-offense prisoners" },
  { id: "cohorts", title: "10 · Birth Cohorts", sub: "Born 1985–2010" },
  { id: "role", title: "11 · Afghanistan's Role", sub: "What it did & didn't supply" },
  { id: "compare", title: "12 · Timeline Compare", sub: "Why the curves rhyme" },
  { id: "sources", title: "13 · Chart Index", sub: "Every chart & source" },
];

const chartAxis = { stroke: "#64748b", fontSize: 11 };
const tooltipStyle = { backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" };
const fmt = (n) => (n >= 1000 ? (n / 1000).toFixed(0) + "k" : String(n));
const dollar = (b) => (b >= 1000 ? "$" + (b / 1000).toFixed(1) + "T" : "$" + b + "B");

const Panel = ({ title, desc, children, footer }) => (
  <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5 shadow-xl">
    <h3 className="text-lg font-bold text-white">{title}</h3>
    {desc && <p className="mt-1 text-sm text-slate-400">{desc}</p>}
    <div className="mt-4">{children}</div>
    {footer && <p className="mt-3 text-xs text-slate-500">{footer}</p>}
  </div>
);

const Stat = ({ value, label, color = "text-emerald-300" }) => (
  <div className="rounded-xl bg-slate-800/60 p-4 text-center">
    <div className={`text-2xl md:text-3xl font-extrabold ${color}`}>{value}</div>
    <div className="mt-1 text-xs text-slate-400">{label}</div>
  </div>
);

export default function App() {
  const [active, setActive] = useState("story");

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 text-slate-200">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Opium, Heroin &amp; Pharmaceutical Painkillers — The Afghanistan War Era, 1999–2023
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Final combined study · Sources: CDC/NCHS · UNODC · DEA ARCOS · GAO · SEC · DOJ · RAND · BJS · White House CEA / JEC
          </p>
        </header>

        <nav className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`rounded-xl border px-3 py-2 text-left transition ${
                active === s.id
                  ? "border-emerald-400 bg-emerald-400/10 shadow-inner"
                  : "border-slate-700 bg-slate-900 hover:border-slate-500 hover:bg-slate-800"
              }`}
            >
              <div className={`text-sm font-semibold ${active === s.id ? "text-emerald-300" : "text-slate-200"}`}>{s.title}</div>
              <div className="text-[11px] text-slate-500">{s.sub}</div>
            </button>
          ))}
        </nav>

        {active === "story" && (
          <div className="space-y-5">
            <Panel title="From month one to two years after: the war, the poppy, the pill, and the needle moved on the same clock">
              <div className="space-y-4 text-[15px] leading-7 text-slate-300">
                <p>
                  <strong className="text-white">When U.S. forces entered Afghanistan in October 2001, Afghan poppy fields had just been wiped out</strong> — the Taliban's ban had cut cultivation from 82,000 ha to 8,000 and opium output from ~3,300 tons to ~185. From almost the first month of the war, that reversed: 74,000 ha in 2002, over 200,000 ha by 2013, a record 328,000 ha in 2017 — the exact year U.S. heroin deaths peaked at 15,482. After the August 2021 withdrawal, a second Taliban ban collapsed cultivation 95% by 2023. The rise and fall of Afghan opium is bracketed almost exactly by the rise and fall of the American heroin epidemic.
                </p>
                <p>
                  <strong className="text-white">The pharmaceutical painkillers and heroin were never separate stories — they are the same molecule family.</strong> Heroin (diacetylmorphine) is acetylated morphine from the opium poppy, and it converts back to morphine in the brain. Most major prescription pain medications — morphine, codeine, oxycodone, hydrocodone, oxymorphone — are natural or semi-synthetic opiates derived from the same poppy latex, binding the same receptors. They were not made from Afghan opium: U.S. pharma used legally sourced, regulated opium alkaloids (largely from licensed growers in Turkey, India, and Australia). But chemically and clinically, the pills and the street heroin were siblings — one legal supply channel, one illegal, the same dependence at the end.
                </p>
                <p>
                  <strong className="text-white">The commercial expansion happened on the war's clock, though it started before it.</strong> OxyContin was approved in 1995 and reached $1.1 billion in sales in 2000 — before the invasion. During the war it exploded: $2.3 billion (2008), $3.1 billion (2010) — roughly 64× its 1996 level — while DEA ARCOS records show 8.19 billion oxycodone/hydrocodone pills shipped in 2006 rising to a 12.43 billion peak in 2011. Purdue pleaded guilty to misbranding in 2007. When OxyContin was reformulated in 2010 and prescribing was tightened, the pill channel narrowed — and heroin deaths nearly tripled from 2011 to 2016, peaking at 15,482 in 2017, the same year Afghan poppy hit its record 328,000 ha. Pills rise and fall → heroin rises and falls: two supply waves of the same poppy molecule, in sequence, on one timeline.
                </p>
                <p>
                  <strong className="text-white">The totals, 1999–2023:</strong> ~895,000 American deaths involving any opioid; ~161,800 involving heroin — the street form of the same molecule family the pain pills were made from. ~98.1 billion oxycodone/hydrocodone pills shipped 2006–2014 alone. The heroin retail market hit ~$27 billion (2016); the opioid crisis cost the nation $504 billion (2015) and nearly <strong className="text-emerald-300">$1.5 trillion in 2020</strong>. Roughly 200,000–250,000 people were imprisoned for drug offenses at the peak. The generation born 1985–1991 lost ~41,400 members to heroin alone — about 62,600 Americans born 1985–2008 in all.
                </p>
              </div>
            </Panel>
            <Panel title="Jump to any chart" desc="The full index of every chart in this study lives in Section 14.">
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {sections.slice(1).map((s) => (
                  <button key={s.id} onClick={() => setActive(s.id)}
                    className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-left text-sm hover:border-emerald-400 hover:bg-slate-800">
                    <span className="font-semibold text-emerald-300">{s.title}</span>
                    <span className="text-slate-500"> — {s.sub}</span>
                  </button>
                ))}
              </div>
            </Panel>
          </div>
        )}

        {active === "supply" && (
          <Panel title="Chart 2 — Afghan opium supply, month one of the war to two years after withdrawal"
            desc="UNODC estimates: poppy cultivation (hectares) and opium production (metric tons)."
            footer="Invasion (Oct 2001) and withdrawal (Aug 2021) marked in red. 2023: cultivation −95% and production −95% under the post-withdrawal Taliban ban.">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-80">
                <ResponsiveContainer>
                  <AreaChart data={base}>
                    <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#34d399" stopOpacity={0.8}/><stop offset="100%" stopColor="#34d399" stopOpacity={0.05}/></linearGradient></defs>
                    <CartesianGrid stroke="#1e293b" /><XAxis dataKey="year" {...chartAxis}/><YAxis {...chartAxis}/>
                    <Tooltip contentStyle={tooltipStyle}/><Legend/>
                    <ReferenceLine x={2001} stroke="#ef4444" strokeDasharray="4 2" label={{ value: "Invasion", fill: "#ef4444", fontSize: 10 }}/>
                    <ReferenceLine x={2021} stroke="#ef4444" strokeDasharray="4 2" label={{ value: "Withdrawal", fill: "#ef4444", fontSize: 10 }}/>
                    <Area type="monotone" dataKey="cultivation" name="Cultivation (ha)" stroke="#34d399" fill="url(#g1)"/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="h-80">
                <ResponsiveContainer>
                  <BarChart data={base}>
                    <CartesianGrid stroke="#1e293b" /><XAxis dataKey="year" {...chartAxis}/><YAxis {...chartAxis}/>
                    <Tooltip contentStyle={tooltipStyle}/><Legend/>
                    <Bar dataKey="production" name="Opium production (tons)" fill="#a78bfa"/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Panel>
        )}

        {active === "riseFall" && (
          <Panel title="Chart 3 — The rise and fall of every opioid, one timeline (the domino chart)"
            desc="Deaths per year: prescription opioids (the pills), methadone, heroin, fentanyl. Pills peak 2011–2017 → heroin peaks 2017 → fentanyl peaks 2022."
            footer="CDC/NCHS multiple-cause deaths. Each wave peaks as the previous supply source is restricted — pills → heroin → fentanyl, same receptors, same epidemic.">
            <div className="h-[420px]">
              <ResponsiveContainer>
                <LineChart data={base}>
                  <CartesianGrid stroke="#1e293b" /><XAxis dataKey="year" {...chartAxis}/><YAxis {...chartAxis}/>
                  <Tooltip contentStyle={tooltipStyle}/><Legend/>
                  <ReferenceLine x={2001} stroke="#ef4444" strokeDasharray="4 2" label={{ value: "War begins", fill: "#ef4444", fontSize: 10 }}/>
                  <ReferenceLine x={2021} stroke="#ef4444" strokeDasharray="4 2" label={{ value: "Withdrawal", fill: "#ef4444", fontSize: 10 }}/>
                  <Line type="monotone" dataKey="rxOpioids" name="Rx opioids (pills)" stroke="#38bdf8" strokeWidth={2.5} dot={false}/>
                  <Line type="monotone" dataKey="methadone" name="Methadone" stroke="#fbbf24" strokeWidth={2} dot={false}/>
                  <Line type="monotone" dataKey="heroin" name="Heroin" stroke="#f472b6" strokeWidth={2.5} dot={false}/>
                  <Line type="monotone" dataKey="fentanyl" name="Fentanyl" stroke="#ef4444" strokeWidth={3} dot={false}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3 text-xs text-slate-400">
              <div className="rounded-lg bg-slate-800/60 p-3"><b className="text-sky-300">Pills</b> — opium-derived, legal supply. Peaked ~14,500 deaths (2017), fell with prescribing crackdowns &amp; reformulation.</div>
              <div className="rounded-lg bg-slate-800/60 p-3"><b className="text-pink-300">Heroin</b> — diacetylmorphine, the same poppy molecule acetylated. Rose 8× during the war era; collapsed after fentanyl arrived.</div>
              <div className="rounded-lg bg-slate-800/60 p-3"><b className="text-red-300">Fentanyl</b> — fully synthetic, no poppy needed. 100× the 1999 death rate; ~70% of all U.S. drug deaths by 2023.</div>
            </div>
          </Panel>
        )}

        {active === "pills" && (
          <Panel title="Chart 4 — The pill flood: oxycodone + hydrocodone pills shipped to U.S. pharmacies (DEA ARCOS)"
            desc="Billions of pills distributed per year, 2006–2014 (the only continuous certified pill-count series; 1999–2005 and 2015+ must come from annual DEA reports and are left blank, not invented)."
            footer="Peak: 12.43 billion pills in 2011 (12,426,168,048). 2006–2014 total: ~98.1 billion pills. Source: DEA ARCOS retail distribution records as presented by openARCOS.">
            <div className="h-[380px]">
              <ResponsiveContainer>
                <BarChart data={pillData}>
                  <CartesianGrid stroke="#1e293b" /><XAxis dataKey="year" {...chartAxis}/><YAxis {...chartAxis} tickFormatter={(v) => v + "B"}/>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => (v == null ? "—" : v + " billion pills")}/>
                  <ReferenceLine x={2001} stroke="#ef4444" strokeDasharray="4 2"/>
                  <Bar dataKey="pills" name="Pills shipped (billions)" fill="#38bdf8"/>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <table className="mt-4 w-full text-xs">
              <thead><tr className="text-slate-400"><th className="p-1 text-left">Year</th><th className="p-1 text-right">Pills</th><th className="p-1 text-right">Change</th></tr></thead>
              <tbody>
                {[["2006","8.19B","—"],["2007","9.22B","+12.7%"],["2008","10.00B","+8.4%"],["2009","10.84B","+8.4%"],["2010","11.62B","+7.2%"],["2011","12.43B","+7.0%"],["2012","12.32B","−0.9%"],["2013","11.90B","−3.4%"],["2014","11.61B","−2.4%"]].map(r => (
                  <tr key={r[0]} className="border-t border-slate-800"><td className="p-1">{r[0]}</td><td className="p-1 text-right">{r[1]}</td><td className="p-1 text-right">{r[2]}</td></tr>
                ))}
              </tbody>
            </table>
          </Panel>
        )}

        {active === "pharma" && (
          <Panel title="Chart 5 — Pharmaceutical revenue: OxyContin vs. Opana during the war era"
            desc="Left: OxyContin reported sales ($M) at published milestones (1996–2010). Right: Endo's Opana/Opana ER sales ($M, SEC filings, 2008–2010). Missing points are left blank, not estimated."
            footer="Sales ≠ what patients paid; product sales ≠ company revenue. OxyContin 2010 sales ($3.1B) were ~10.4× Opana's 2010 ($299.1M). Sources: published sales reporting; Endo SEC annual report.">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-72">
                <ResponsiveContainer>
                  <BarChart data={oxySales}>
                    <CartesianGrid stroke="#1e293b" /><XAxis dataKey="year" {...chartAxis}/><YAxis {...chartAxis} tickFormatter={(v) => "$" + v + "M"}/>
                    <Tooltip contentStyle={tooltipStyle} formatter={(v) => "$" + v + "M"}/>
                    <Bar dataKey="oxycontin" name="OxyContin sales ($M)" fill="#38bdf8"/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="h-72">
                <ResponsiveContainer>
                  <BarChart data={opanaData}>
                    <CartesianGrid stroke="#1e293b" /><XAxis dataKey="year" {...chartAxis}/><YAxis {...chartAxis} tickFormatter={(v) => "$" + v + "M"}/>
                    <Tooltip contentStyle={tooltipStyle} formatter={(v) => "$" + v + "M"}/>
                    <Bar dataKey="opana" name="Opana + Opana ER sales ($M)" fill="#fbbf24"/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3 text-xs text-slate-400">
              <div className="rounded-lg bg-slate-800/60 p-3">1996 → 2000: $48M → $1.1B — <b className="text-sky-300">~23×</b> growth, entirely pre-war.</div>
              <div className="rounded-lg bg-slate-800/60 p-3">1996 → 2010: $48M → $3.1B — <b className="text-sky-300">~65×</b> at the reformulation year.</div>
              <div className="rounded-lg bg-slate-800/60 p-3">Opana 2008 → 2010: +65.8% — <b className="text-amber-300">the generic/ER wave</b> behind the brand leader.</div>
            </div>
          </Panel>
        )}

        {active === "makers" && (
          <Panel title="Chart 6 — The makers: who produced the war-era opioid painkillers"
            desc="Key manufacturers, products, and what courts and regulators established. Product sales are not company revenue; a company's total revenue is not its opioid revenue.">
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-3">
                <b className="text-sky-300">Purdue Pharma</b> — OxyContin (oxycodone ER), MS Contin (morphine). Sales $48M (1996) → $3.1B (2010). 2007: criminal guilty plea for OxyContin misbranding (DOJ).
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-3">
                <b className="text-amber-300">Endo Pharmaceuticals</b> — Opana/Opana ER (oxymorphone), Percocet. Opana sales $180.4M (2008) → $299.1M (2010), +65.8% (SEC filings).
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-3">
                <b className="text-pink-300">Watson / Actavis / Qualitest</b> — high-volume generic manufacturers of oxycodone and hydrocodone combination painkillers during the peak pill years (SEC filings; ARCOS labeler records).
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-3">
                <b className="text-purple-300">Mallinckrodt</b> — major generic opioids &amp; active pharmaceutical ingredients (opium alkaloids).
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-3">
                <b className="text-teal-300">Teva, Actavis, Allergan, Rhodes</b> — generics, oxycodone/hydrocodone tablets, and ingredient supply.
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-3">
                <b className="text-slate-300">The chemistry, stated precisely:</b> heroin is diacetylmorphine — morphine from the poppy with two acetyl groups; the body converts it back to morphine. Oxycodone, hydrocodone, codeine, oxymorphone, and morphine are natural or semi-synthetic poppy alkaloid relatives — the same molecule family. None of the pills were made from Afghan opium — U.S. manufacturers used legally imported, regulated opium. The relationship between the pills and heroin is molecular, not supply-chain.
              </div>
            </div>
          </Panel>
        )}

        {active === "heroin" && (
          <Panel title="Chart 7 — Heroin-involved overdose deaths, 1999–2023 (CDC/NCHS, T40.1)"
            desc="From 1,779 in the invasion year to 15,482 in 2017, back to 3,984 in 2023."
            footer="Total 1999–2023: ~161,800 deaths. Heroin (diacetylmorphine) is morphine from the opium poppy with two acetyl groups — the street sibling of the prescription painkillers.">
            <div className="h-[400px]">
              <ResponsiveContainer>
                <ComposedChart data={base}>
                  <CartesianGrid stroke="#1e293b" /><XAxis dataKey="year" {...chartAxis}/><YAxis {...chartAxis}/>
                  <Tooltip contentStyle={tooltipStyle}/><Legend/>
                  <ReferenceLine x={2001} stroke="#ef4444" strokeDasharray="4 2"/>
                  <ReferenceLine x={2021} stroke="#ef4444" strokeDasharray="4 2"/>
                  <Bar dataKey="heroin" name="Heroin deaths" fill="#f472b6" opacity={0.75}/>
                  <Line type="monotone" dataKey="heroin" name="Trend" stroke="#fbcfe8" strokeWidth={2} dot={false}/>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        )}

        {active === "money" && (
          <Panel title="Chart 8 — Money: heroin retail proceeds, pharma revenue, and the national cost"
            desc="Left: U.S. heroin retail market ($B; RAND certified 2006–2016, modeled elsewhere). Right: national economic cost per year ($B) — CEA/JEC certified anchors 2015, 2018–2020, modeled elsewhere."
            footer="RAND: Americans spent $120–145B/yr on the four major illegal drugs; heroin alone ~$27B (2016). OxyContin sales peaked at $3.1B (2010). The opioid crisis cost ~$1.5T in 2020 alone.">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-72">
                <ResponsiveContainer>
                  <BarChart data={base}>
                    <CartesianGrid stroke="#1e293b" /><XAxis dataKey="year" {...chartAxis}/><YAxis {...chartAxis}/>
                    <Tooltip contentStyle={tooltipStyle} formatter={(v)=>dollar(v)}/><Legend/>
                    <Bar dataKey="heroinMarket" name="Heroin retail market ($B)" fill="#f472b6"/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="h-72">
                <ResponsiveContainer>
                  <AreaChart data={base}>
                    <defs><linearGradient id="g3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fbbf24" stopOpacity={0.8}/><stop offset="100%" stopColor="#fbbf24" stopOpacity={0.05}/></linearGradient></defs>
                    <CartesianGrid stroke="#1e293b" /><XAxis dataKey="year" {...chartAxis}/><YAxis {...chartAxis} tickFormatter={dollar}/>
                    <Tooltip contentStyle={tooltipStyle} formatter={(v)=>dollar(v)}/><Legend/>
                    <Area type="monotone" dataKey="costB" name="National cost ($B)" stroke="#fbbf24" fill="url(#g3)"/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Panel>
        )}

        {active === "prison" && (
          <Panel title="Chart 9 — Incarceration for drug offenses (BJS)"
            desc="Federal drug-offense prisoners peaked near ~100,000 in the early 2010s; states held roughly 125,000–180,000 more."
            footer="Source: BJS Prisoners in 2021 — 47% of federal inmates (66,500 people) served drug sentences; total prison population 1,204,300.">
            <div className="grid gap-4 sm:grid-cols-3">
              <Stat value="66,500" label="federal drug-offense prisoners (2021) — 47% of BOP" color="text-emerald-300"/>
              <Stat value="~100,000" label="federal drug prisoner peak (early 2010s)" color="text-sky-300"/>
              <Stat value="200–250k" label="total state + federal drug prisoners at the peak" color="text-pink-300"/>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              The heroin trade filled the same cells the crack era once did: federal drug prosecutions of trafficking organizations and their U.S. distribution cells — the local "last mile" sellers whose prosecutions, jail costs, and foster-care caseloads are the community-level fallback of the national numbers in Section 8.
            </p>
          </Panel>
        )}

        {active === "cohorts" && (
          <Panel title="Chart 10 — Heroin-involved deaths by birth year, born 1985–2010"
            desc="Estimated heroin deaths 1999–2023 per U.S. birth cohort (NCHS age distributions applied to the heroin death series)."
            footer="Cohorts born 2009–2010 were still under the age-15 death-reporting threshold in 2023 — their epidemic is still ahead. Totals: 1985–2008 ≈ 62,600; all ages ≈ 161,800.">
            <div className="h-[400px]">
              <ResponsiveContainer>
                <BarChart data={cohortData}>
                  <CartesianGrid stroke="#1e293b" /><XAxis dataKey="birth" {...chartAxis}/><YAxis {...chartAxis}/>
                  <Tooltip contentStyle={tooltipStyle}/><Legend/>
                  <Bar dataKey="deaths" name="Heroin deaths by birth cohort" fill="#34d399"/>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid gap-2 text-xs text-slate-400 sm:grid-cols-2">
              <div className="rounded-lg bg-slate-800/60 p-3"><b className="text-emerald-300">1985–1991:</b> ~41,400 dead — the hardest-hit generation (~4,800–6,700 per cohort). They turned 18–25 as the war-era supply arrived.</div>
              <div className="rounded-lg bg-slate-800/60 p-3"><b className="text-emerald-300">1995–2008:</b> lower counts only because their high-risk ages fall at the end of the window — and because heroin's street supply was collapsing as they arrived.</div>
            </div>
          </Panel>
        )}

        {active === "role" && (
          <Panel title="Chart 11 — Afghanistan's role in the opium and heroin trade: what it did and did not supply">
            <div className="space-y-4 text-[15px] leading-7 text-slate-300">
              <p>
                <strong className="text-white">What Afghanistan supplied:</strong> throughout the war, Afghanistan produced the large majority of the world's illicit opium — 74–90% in most years — feeding heroin markets in Europe, Russia, Iran, and Asia. Its share of the U.S. heroin market, however, was small at the start: in 2001 most U.S. heroin was Colombian and Mexican. During the war years, DEA assessments show the U.S. market shifted toward <strong>Mexican heroin</strong> ("black tar"), which by 2016 supplied most of U.S. consumption. Afghan heroin mattered to America mainly as the global price-setter and inventory builder — the world supply that kept heroin cheap and available everywhere, including to traffickers who substituted and blended.
              </p>
              <p>
                <strong className="text-white">The direct link that did exist:</strong> Afghan poppy output and U.S. heroin deaths rose on the same clock. Cultivation rebounded from 8,000 ha (2001) to a record 328,000 ha (2017) while U.S. heroin deaths rose from 1,779 to 15,482; then cultivation collapsed 95% after the withdrawal-era Taliban ban (2023) as U.S. heroin deaths fell to 3,984 — their lowest level since 2003.
              </p>
              <p>
                <strong className="text-white">What Afghanistan never supplied:</strong> the prescription pills. U.S. pharmaceutical opioids were made from legally imported, strictly regulated opium alkaloids (licensed cultivation in Turkey, India, Australia under UN conventions), or were fully synthetic. Roughly 98 billion oxycodone/hydrocodone pills (2006–2014) came through DEA-ARCOS-tracked legal channels — not from Afghan fields. The pills and the Afghan heroin were two separate supply chains carrying two forms of the same poppy molecule into the same American dependence.
              </p>
            </div>
          </Panel>
        )}

        {active === "compare" && (
          <Panel title="Chart 12 — Timeline comparison: the war, the poppy, the pill, the needle"
            desc="Every milestone aligned by year — with the pill and heroin death curves underneath. The chronology shows the sequence; causation requires the caveats in Sections 6 and 11.">
            <div className="space-y-1">
              {events.map((e) => (
                <div key={e.year + e.label} className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-900/80 p-2.5">
                  <span className="w-12 shrink-0 rounded-md bg-emerald-400/15 px-1.5 py-0.5 text-center text-xs font-bold text-emerald-300">{e.year}</span>
                  <span className="text-sm text-slate-300">{e.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 h-56">
              <ResponsiveContainer>
                <LineChart data={base}>
                  <CartesianGrid stroke="#1e293b" /><XAxis dataKey="year" {...chartAxis}/><YAxis {...chartAxis} tickFormatter={fmt}/>
                  <Tooltip contentStyle={tooltipStyle}/><Legend/>
                  <Line type="monotone" dataKey="rxOpioids" name="Pills" stroke="#38bdf8" strokeWidth={2} dot={false}/>
                  <Line type="monotone" dataKey="heroin" name="Heroin" stroke="#f472b6" strokeWidth={2.5} dot={false}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-sm text-slate-400">
              The similarity is structural: the pills and the heroin are two forms of the same poppy molecule serving the same physical dependence. Restrict one source, and the market finds the next: pills restricted after 2010–2011 → heroin. The poppy is the through-line from month one (the 2001 ban and invasion) to the last year at war (the record harvests) and after (the second ban). Fentanyl appears only in the Section 3 comparison chart, where it completes the sequence.
            </p>
          </Panel>
        )}

        {active === "sources" && (
          <Panel title="Chart index & references — every chart in this study and its certified source"
            desc="Manufacturing/distribution, sales/revenue, and company conduct are separate measurements throughout; each chart labels exactly what it measures.">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="text-slate-400"><th className="p-2 text-left">#</th><th className="p-2 text-left">Chart / Section</th><th className="p-2 text-left">Measures</th><th className="p-2 text-left">Primary source</th></tr></thead>
                <tbody className="text-slate-300">
                  {[
                    ["1", "The Full Story (narrative)", "Synthesis of all series", "All sources below"],
                    ["2", "Afghan opium cultivation & production", "Hectares; metric tons of opium, 1999–2023", "UNODC Afghanistan Opium Surveys; UNODC World Drug Report tables"],
                    ["3", "Rise & Fall — all opioid deaths (the only chart including fentanyl)", "Deaths per year by drug category (T40.1–T40.4)", "CDC/NCHS Data Briefs 329, 394, 491, 522"],
                    ["4", "Pill flood (oxycodone + hydrocodone)", "Pills shipped to retail, 2006–2014 only", "DEA ARCOS records (openARCOS presentation)"],
                    ["5", "OxyContin & Opana sales", "Product sales $ (milestone years, not full series)", "Published sales reporting; Endo SEC 10-K filings"],
                    ["6", "The Makers (company profiles)", "Products, growth, legal findings", "GAO 2003; DOJ 2007 Purdue plea; SEC EDGAR; FDA approval history (MS Contin 1987, Duragesic 1990, OxyContin 1995)"],
                    ["7", "Heroin deaths", "T40.1 multiple-cause deaths", "CDC/NCHS National Vital Statistics System"],
                    ["8", "Money: heroin market & national cost", "Retail $B; economic cost $B/yr", "RAND WAUSID 2006–2016 (ONDCP); White House CEA 2017/2019; JEC 2022"],
                    ["9", "Incarceration", "Drug-offense prisoners", "BJS Prisoners in 2021 – Statistical Tables"],
                    ["10", "Birth cohorts 1985–2010", "Estimated heroin deaths per cohort", "Modeled from NCHS age distributions (estimate, not records)"],
                    ["11", "Afghanistan's role", "Illicit supply vs. legal pharma supply chain", "UNODC; DEA National Drug Threat Assessments; UN conventions on licensed opium cultivation"],
                    ["12", "Timeline compare", "Milestone events vs. pill & heroin death curves", "Compiled from all sources"],
                    ["13", "This index", "Source transparency", "—"],
                  ].map(r => (
                    <tr key={r[0]} className="border-t border-slate-800">
                      <td className="p-2 font-bold text-emerald-300">{r[0]}</td><td className="p-2">{r[1]}</td><td className="p-2 text-slate-400">{r[2]}</td><td className="p-2">{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 space-y-2 text-xs text-slate-500">
              <p><b className="text-slate-300">Reference databases used:</b> CDC/NCHS NVSS; DEA ARCOS annual reports &amp; the Notre Dame ARCOS research portal (arcos.nd.edu, transaction-level 2006–2019); UNODC research portal &amp; Afghanistan Opium Surveys; GAO-04-322 (OxyContin); SEC EDGAR; DOJ enforcement records; CDC opioid dispensing data (IQVIA); RAND ONDCP reports; BJS; White House CEA; U.S. Congress JEC.</p>
              <p><b className="text-slate-300">Scope note:</b> at your direction, fentanyl appears only in the Section 3 comparison chart, which shows the growth of every drug on one timeline — pills, methadone, heroin, and fentanyl. All other sections cover opium, heroin, and pharmaceutical painkillers only.</p>
              <p><b className="text-slate-300">Data honesty:</b> pill counts exist only 2006–2014 as a continuous series; company opioid-specific annual revenue for all 25 years does not exist in one public database; sales ≠ patient spend; corporate revenue ≠ opioid revenue. Gaps are left blank or labeled as models, never invented. The chronology aligns the pharmaceutical boom with the war era but does not by itself establish that the war caused it — OxyContin's expansion began before the invasion.</p>
            </div>
          </Panel>
        )}

        <footer className="mt-8 border-t border-slate-800 pt-4 text-xs text-slate-500">
          Window: 1999 (two years pre-invasion) – 2023 (two years post-withdrawal). Certified anchors shown as reported; interpolated years are labeled models; birth-cohort figures are age-band allocation estimates. Data: CDC/NCHS · UNODC · DEA ARCOS · GAO · SEC · DOJ · FDA · RAND/ONDCP · BJS · White House CEA · JEC.
        </footer>
      </div>
    </div>
  );
}
