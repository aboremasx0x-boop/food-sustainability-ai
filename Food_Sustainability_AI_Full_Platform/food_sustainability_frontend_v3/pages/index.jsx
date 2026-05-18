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

      const sortedCategories = Object.entries(categories)
        .map(([name, value]) => ({
          name,
          value,
        }))
        .sort((a, b) => b.value - a.value);

      const highest = sortedCategories[0]?.name || "Unknown";

      const predictedReduction = Math.round(total * 0.12);

      const esgScore = Math.max(
        0,
        Math.min(100, Math.round(100 - total / 5))
      );

      setTotalWaste(total);
      setReduction(predictedReduction);
      setESG(esgScore);
      setTopCategory(highest);
      setCategoryStats(sortedCategories);

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

  const pageStyle = {
    minHeight: "100vh",
    padding: "40px",
    fontFamily: "Arial",
    background: darkMode ? "#111827" : "#f3f4f6",
    color: darkMode ? "white" : "#111827",
  };

  const cardStyle = {
    background: darkMode ? "#1f2937" : "white",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };

  return (
    <div style={pageStyle}>
      <h1 style={{ fontSize: "48px" }}>
        Food Sustainability AI
      </h1>

      <p style={{ marginBottom: "25px" }}>
        منصة ذكية لتحليل الهدر الغذائي باستخدام الذكاء الاصطناعي
      </p>

      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          padding: "12px 20px",
          borderRadius: "10px",
          border: "none",
          background: darkMode ? "#2563eb" : "#111827",
          color: "white",
          marginBottom: "30px",
          cursor: "pointer",
        }}
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(240px,1fr))",
          gap: "20px",
          marginBottom: "35px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Waste</h3>
          <h1 style={{ color: "#ef4444" }}>
            {totalWaste} KG
          </h1>
        </div>

        <div style={cardStyle}>
          <h3>ESG Score</h3>
          <h1 style={{ color: "#3b82f6" }}>
            {esg}/100
          </h1>
        </div>

        <div style={cardStyle}>
          <h3>Predicted Reduction</h3>
          <h1 style={{ color: "#10b981" }}>
            {reduction} KG
          </h1>
        </div>

        <div style={cardStyle}>
          <h3>Top Waste Sector</h3>
          <h1 style={{ color: "#f59e0b" }}>
            {topCategory}
          </h1>
        </div>
      </div>

      <div style={{ ...cardStyle, marginBottom: "35px" }}>
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
              padding: "20px",
              borderRadius: "12px",
              background: darkMode
                ? "#111827"
                : "#f9fafb",
              whiteSpace: "pre-line",
              lineHeight: "2",
            }}
          >
            {analysis}
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <h2>Waste Analytics Chart</h2>

        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <BarChart data={categoryStats}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
