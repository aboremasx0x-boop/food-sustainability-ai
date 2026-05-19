import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [fileName, setFileName] = useState("");
  const [analysis, setAnalysis] = useState("");

  const [branchStats, setBranchStats] = useState([]);
  const [bestBranch, setBestBranch] = useState("Branch A");
  const [worstBranch, setWorstBranch] = useState("Branch B");

  const [totalWaste, setTotalWaste] = useState(0);
  const [financialLoss, setFinancialLoss] = useState(0);
  const [sustainabilityScore, setSustainabilityScore] = useState(0);

  function handleFileUpload(e) {
    const file = e.target.files[0];

    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;

      const rows = text
        .split("\n")
        .slice(1)
        .filter((row) => row.trim() !== "");

      const branches = {};

      let totalWasteValue = 0;
      let totalLossValue = 0;

      rows.forEach((row) => {
        const cols = row.split(",");

        const branch = cols[1]?.trim();
        const wasteKg = parseFloat(cols[4]);
        const unitCost = parseFloat(cols[6]) || 0;

        if (!branch || isNaN(wasteKg)) return;

        const rowLoss = wasteKg * unitCost;

        totalWasteValue += wasteKg;
        totalLossValue += rowLoss;

        if (!branches[branch]) {
          branches[branch] = {
            waste: 0,
            loss: 0,
          };
        }

        branches[branch].waste += wasteKg;
        branches[branch].loss += rowLoss;
      });

      const stats = Object.entries(branches).map(
        ([name, data]) => {
          const score = Math.max(
            0,
            Math.min(
              100,
              Math.round(
                100 -
                  data.waste * 0.8 -
                  data.loss / 50
              )
            )
          );

          return {
            name,
            waste: Math.round(data.waste),
            loss: Math.round(data.loss),
            score,
          };
        }
      );

      stats.sort((a, b) => b.score - a.score);

      const best = stats[0]?.name || "Unknown";

      const worst =
        stats[stats.length - 1]?.name || "Unknown";

      const avgScore =
        stats.length > 0
          ? Math.round(
              stats.reduce(
                (sum, item) => sum + item.score,
                0
              ) / stats.length
            )
          : 0;

      setBranchStats(stats);
      setBestBranch(best);
      setWorstBranch(worst);

      setTotalWaste(Math.round(totalWasteValue));
      setFinancialLoss(Math.round(totalLossValue));
      setSustainabilityScore(avgScore);

      setAnalysis(`
نتائج مقارنة الفروع:

• إجمالي الهدر: ${Math.round(
        totalWasteValue
      )} KG

• إجمالي الخسائر:
${Math.round(totalLossValue)} SAR

• أفضل فرع:
${best}

• أسوأ فرع:
${worst}

• متوسط الاستدامة:
${avgScore}/100

التوصية:
تطبيق ممارسات ${best}
على بقية الفروع لتقليل الهدر والخسائر.
`);
    };

    reader.readAsText(file);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: darkMode
          ? "#0f172a"
          : "#f3f4f6",
        padding: "40px 20px",
        fontFamily: "Arial",
        color: darkMode ? "white" : "#111827",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            marginBottom: "10px",
          }}
        >
          Food Sustainability AI
        </h1>

        <p
          style={{
            fontSize: "20px",
            marginBottom: "30px",
          }}
        >
          منصة ذكية لمقارنة الفروع وتحليل
          الاستدامة والهدر الغذائي
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "35px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
            style={buttonStyle(darkMode)}
          >
            {darkMode
              ? "☀️ Light Mode"
              : "🌙 Dark Mode"}
          </button>

          <button
            onClick={() => window.print()}
            style={buttonStyle(darkMode)}
          >
            Export Report PDF
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(240px,1fr))",
            gap: "20px",
            marginBottom: "35px",
          }}
        >
          <Card
            title="Total Waste"
            value={`${totalWaste} KG`}
            color="#ef4444"
            darkMode={darkMode}
          />

          <Card
            title="Financial Loss"
            value={`${financialLoss} SAR`}
            color="#dc2626"
            darkMode={darkMode}
          />

          <Card
            title="Best Branch"
            value={bestBranch}
            color="#22c55e"
            darkMode={darkMode}
          />

          <Card
            title="Worst Branch"
            value={worstBranch}
            color="#f97316"
            darkMode={darkMode}
          />

          <Card
            title="Sustainability Score"
            value={`${sustainabilityScore}/100`}
            color="#3b82f6"
            darkMode={darkMode}
          />
        </div>

        <Section darkMode={darkMode}>
          <h2>Upload Branch Data</h2>

          <p>
            CSV:
            Date,Branch,Category,FoodType,WasteKG,Location,UnitCostSAR,Edible
          </p>

          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
          />

          {fileName && (
            <p style={{ marginTop: "15px" }}>
              تم رفع الملف: {fileName}
            </p>
          )}

          {analysis && (
            <div
              style={{
                marginTop: "20px",
                background: darkMode
                  ? "#111827"
                  : "#f9fafb",
                padding: "20px",
                borderRadius: "12px",
                lineHeight: "2",
                whiteSpace: "pre-line",
              }}
            >
              {analysis}
            </div>
          )}
        </Section>

        <Section darkMode={darkMode}>
          <h2>Branch Comparison Dashboard</h2>

          <div
            style={{
              width: "100%",
              height: 450,
            }}
          >
            <ResponsiveContainer>
              <BarChart data={branchStats}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Bar
                  dataKey="waste"
                  fill="#ef4444"
                />

                <Bar
                  dataKey="loss"
                  fill="#f59e0b"
                />

                <Bar
                  dataKey="score"
                  fill="#22c55e"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section darkMode={darkMode}>
          <h2>Branch Sustainability Ranking</h2>

          {branchStats.map((branch, index) => (
            <div
              key={index}
              style={{
                padding: "18px",
                marginBottom: "15px",
                borderRadius: "12px",
                background: darkMode
                  ? "#111827"
                  : "#f9fafb",
                border: darkMode
                  ? "1px solid #334155"
                  : "1px solid #e5e7eb",
              }}
            >
              <h3
                style={{
                  marginBottom: "10px",
                  color:
                    branch.score >= 90
                      ? "#facc15"
                      : branch.score >= 75
                      ? "#22c55e"
                      : branch.score >= 60
                      ? "#f59e0b"
                      : "#ef4444",
                }}
              >
                {branch.name}
              </h3>

              <p>
                Waste: {branch.waste} KG
              </p>

              <p>
                Financial Loss:
                {branch.loss} SAR
              </p>

              <p>
                Sustainability Score:
                {branch.score}/100
              </p>
            </div>
          ))}
        </Section>
      </div>
    </div>
  );
}

function buttonStyle(darkMode) {
  return {
    padding: "14px 24px",
    border: "none",
    borderRadius: "12px",
    background: darkMode
      ? "#2563eb"
      : "#111827",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
  };
}

function Card({
  title,
  value,
  color,
  darkMode,
}) {
  return (
    <div
      style={{
        background: darkMode
          ? "#1e293b"
          : "white",
        padding: "30px",
        borderRadius: "18px",
        boxShadow:
          "0 4px 14px rgba(0,0,0,0.08)",
      }}
    >
      <h3>{title}</h3>

      <h1
        style={{
          color,
          fontSize: "34px",
        }}
      >
        {value}
      </h1>
    </div>
  );
}

function Section({ children, darkMode }) {
  return (
    <div
      style={{
        background: darkMode
          ? "#1e293b"
          : "white",
        padding: "30px",
        borderRadius: "18px",
        marginBottom: "35px",
        boxShadow:
          "0 4px 14px rgba(0,0,0,0.08)",
      }}
    >
      {children}
    </div>
  );
}
