import { useState } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [fileName, setFileName] = useState("");
  const [analysis, setAnalysis] = useState("");

  const [totalWaste, setTotalWaste] = useState(248);
  const [esg, setESG] = useState(87);
  const [reduction, setReduction] = useState(12);

  function handleFileUpload(e) {
    const file = e.target.files[0];

    if (file) {
      setFileName(file.name);

      const reader = new FileReader();

      reader.onload = (event) => {
        const text = event.target.result;
        const rows = text.split("\n").slice(1).filter((row) => row.trim() !== "");

        let total = 0;

        rows.forEach((row) => {
          const cols = row.split(",");
          const wasteKg = parseFloat(cols[2]);

          if (!isNaN(wasteKg)) {
            total += wasteKg;
          }
        });

        const predictedReduction = Math.round(total * 0.12);
        const esgScore = Math.max(0, Math.min(100, Math.round(100 - total / 5)));

        setTotalWaste(total);
        setReduction(predictedReduction);
        setESG(esgScore);

        setAnalysis(`
نتائج تحليل الملف:

• إجمالي الهدر: ${total} KG

• عدد السجلات داخل الملف: ${rows.length}

• التخفيض المتوقع: ${predictedReduction} KG

• مؤشر ESG الحالي: ${esgScore}/100

• الذكاء الاصطناعي يقترح تحسين إدارة التخزين والتوزيع وتقليل الفائض اليومي.
`);
      };

      reader.readAsText(file);
    }
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
      <h1 style={{ fontSize: "46px", marginBottom: "10px" }}>
        Food Sustainability AI
      </h1>

      <p style={{ fontSize: "18px", marginBottom: "30px" }}>
        منصة ذكية لتحليل الهدر الغذائي والاستدامة باستخدام الذكاء الاصطناعي
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
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginBottom: "35px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Waste</h3>
          <h1 style={{ color: "#ef4444" }}>{totalWaste} KG</h1>
        </div>

        <div style={cardStyle}>
          <h3>ESG Score</h3>
          <h1 style={{ color: "#3b82f6" }}>{esg} / 100</h1>
        </div>

        <div style={cardStyle}>
          <h3>Predicted Reduction</h3>
          <h1 style={{ color: "#10b981" }}>{reduction} KG</h1>
        </div>
      </div>

      <div style={{ ...cardStyle, marginBottom: "35px" }}>
        <h2>Waste Analytics</h2>

        <div
          style={{
            background: "#ef4444",
            width: "85%",
            padding: "10px",
            color: "white",
            borderRadius: "10px",
            marginBottom: "15px",
          }}
        >
          Restaurants - 85%
        </div>

        <div
          style={{
            background: "#f59e0b",
            width: "60%",
            padding: "10px",
            color: "white",
            borderRadius: "10px",
            marginBottom: "15px",
          }}
        >
          Hotels - 60%
        </div>

        <div
          style={{
            background: "#10b981",
            width: "40%",
            padding: "10px",
            color: "white",
            borderRadius: "10px",
          }}
        >
          Smart Reduction - 40%
        </div>
      </div>

      <div style={{ ...cardStyle, marginBottom: "35px" }}>
        <h2>Upload Waste Data</h2>

        <p>ارفع ملف CSV يحتوي على بيانات الهدر الغذائي.</p>

        <input type="file" accept=".csv" onChange={handleFileUpload} />

        {fileName && (
          <p style={{ marginTop: "15px", color: "#10b981" }}>
            تم رفع الملف: {fileName}
          </p>
        )}

        {analysis && (
          <div
            style={{
              marginTop: "20px",
              background: darkMode ? "#111827" : "#f9fafb",
              padding: "20px",
              borderRadius: "12px",
              whiteSpace: "pre-line",
              lineHeight: "2",
            }}
          >
            {analysis}
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <h2>AI Recommendations</h2>

        <ul style={{ lineHeight: "2", fontSize: "17px" }}>
          <li>تقليل الهدر في قسم الخضروات بنسبة 18%</li>
          <li>إعادة توزيع الفائض عبر الجمعيات الغذائية</li>
          <li>تحسين التنبؤ بالطلب باستخدام الذكاء الاصطناعي</li>
          <li>تحليل المنتجات قريبة الانتهاء يوميًا</li>
          <li>تقليل الانبعاثات الكربونية الناتجة عن الهدر</li>
        </ul>
      </div>
    </div>
  );
}
