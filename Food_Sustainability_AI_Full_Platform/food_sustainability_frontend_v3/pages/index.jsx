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

  const [totalWaste, setTotalWaste] = useState(248);
  const [esg, setESG] = useState(87);
  const [reduction, setReduction] = useState(12);
  const [topCategory, setTopCategory] = useState("Restaurants");

  const [categoryStats, setCategoryStats] = useState([]);

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

      let total = 0;

      const categories = {};

      rows.forEach((row) => {
        const cols = row.split(",");

        const category = cols[1]?.trim();
        const wasteKg = parseFloat(cols[2]);

        if (category && !isNaN(wasteKg)) {
          total += wasteKg;

          categories[category] =
            (categories[category] || 0) + wasteKg;
        }
      });

      const sorted = Object.entries(categories).map(
        ([name, value]) => ({
          name,
          value,
        })
      );

      const highest =
        sorted.sort((a, b) => b.value - a.value)[0]?.name ||
        "Unknown";

      const predictedReduction = Math.round(total * 0.12);

      const esgScore = Math.max(
        0,
        Math.min(100, Math.round(100 - total / 5))
      );

      setTotalWaste(total);
      setReduction(predictedReduction);
      setESG(esgScore);
      setTopCategory(highest);
      setCategoryStats(sorted);

      setAnalysis(`
نتائج التحليل الذكي:

• إجمالي الهدر: ${total} KG
• عدد السجلات: ${rows.length}
• أعلى قطاع هدر: ${highest}
• التخفيض المتوقع: ${predictedReduction} KG
• مؤشر ESG: ${esgScore}/100

التوصية:
ابدأ بتقليل الهدر في قطاع ${highest}.
      `);
    };

    reader.readAsText(file);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: darkMode ? "#0f172a" : "#f3f4f6",
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
          منصة ذكية لتحليل الهدر الغذائي باستخدام الذكاء الاصطناعي
        </p>

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: "14px 24px",
            border: "none",
            borderRadius: "12px",
            background: darkMode ? "#2563eb" : "#111827",
            color: "white",
            cursor: "pointer",
            marginBottom: "35px",
            fontSize: "16px",
          }}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
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
            title="ESG Score"
            value={`${esg}/100`}
            color="#3b82f6"
            darkMode={darkMode}
          />

          <Card
            title="Predicted Reduction"
            value={`${reduction} KG`}
            color="#10b981"
            darkMode={darkMode}
          />

          <Card
            title="Top Waste Sector"
            value={topCategory}
            color="#f59e0b"
            darkMode={darkMode}
          />
        </div>

        <Section darkMode={darkMode}>
          <h2>Upload Waste Data</h2>

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
          <h2>Waste Analytics Chart</h2>

          <div style={{ width: "100%", height: 450 }}>
            <ResponsiveContainer>
              <BarChart data={categoryStats}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#14b8a6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Card({ title, value, color, darkMode }) {
  return (
    <div
      style={{
        background: darkMode ? "#1e293b" : "white",
        padding: "30px",
        borderRadius: "18px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
      }}
    >
      <h3
        style={{
          marginBottom: "15px",
          fontSize: "20px",
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          color,
          fontSize: "40px",
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
        background: darkMode ? "#1e293b" : "white",
        padding: "30px",
        borderRadius: "18px",
        marginBottom: "35px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
      }}
    >
      {children}
    </div>
  );
}
