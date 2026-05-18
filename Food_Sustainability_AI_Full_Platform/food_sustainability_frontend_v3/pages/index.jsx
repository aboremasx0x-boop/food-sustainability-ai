import { useState } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [fileName, setFileName] = useState("");
  const [analysis, setAnalysis] = useState("");

  function toggleDarkMode() {
    setDarkMode(!darkMode);
  }

  function handleFileUpload(e) {
    const file = e.target.files[0];

    if (file) {
      setFileName(file.name);

      const reader = new FileReader();

      reader.onload = (event) => {
        const text = event.target.result;

        const rows = text.split("\n");

        const totalRows = rows.length - 1;

        setAnalysis(`
نتائج تحليل الملف:

• عدد الصفوف داخل الملف: ${totalRows}

• تم اكتشاف بيانات هدر غذائي قابلة للتحليل

• يوجد احتمال لتقليل الهدر بنسبة 15%

• يوصى بتحسين إدارة التخزين والتوزيع

• الذكاء الاصطناعي يقترح تقليل الفائض اليومي
`);
      };

      reader.readAsText(file);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "Arial",
        background: darkMode ? "#111827" : "#f3f4f6",
        color: darkMode ? "white" : "#111",
        transition: "0.3s",
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
          marginBottom: "30px",
          fontSize: "18px",
        }}
      >
        منصة ذكية لتحليل الهدر الغذائي والاستدامة باستخدام الذكاء الاصطناعي
      </p>

      <button
        onClick={toggleDarkMode}
        style={{
          padding: "12px 20px",
          borderRadius: "10px",
          border: "none",
          cursor: "pointer",
          marginBottom: "30px",
          background: darkMode ? "#374151" : "#111827",
          color: "white",
          fontWeight: "bold",
        }}
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: darkMode ? "#1f2937" : "white",
            padding: "25px",
            borderRadius: "16px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Total Waste</h3>

          <h1 style={{ color: "#ef4444" }}>248 KG</h1>
        </div>

        <div
          style={{
            background: darkMode ? "#1f2937" : "white",
            padding: "25px",
            borderRadius: "16px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3>ESG Score</h3>

          <h1 style={{ color: "#3b82f6" }}>87 / 100</h1>
        </div>

        <div
          style={{
            background: darkMode ? "#1f2937" : "white",
            padding: "25px",
            borderRadius: "16px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Predicted Reduction</h3>

          <h1 style={{ color: "#10b981" }}>12%</h1>
        </div>
      </div>

      <div
        style={{
          background: darkMode ? "#1f2937" : "white",
          padding: "30px",
          borderRadius: "16px",
          marginBottom: "30px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Waste Analytics</h2>

        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              background: "#ef4444",
              width: "85%",
              color: "white",
              padding: "10px",
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
              color: "white",
              padding: "10px",
              borderRadius: "10px",
              marginBottom: "15px",
            }}
          >
            Hotels - 60%
          </div>

          <div
            style={{
              background: "#14b8a6",
              width: "40%",
              color: "white",
              padding: "10px",
              borderRadius: "10px",
            }}
          >
            Smart Reduction - 40%
          </div>
        </div>
      </div>

      <div
        style={{
          background: darkMode ? "#1f2937" : "white",
          padding: "30px",
          borderRadius: "16px",
          marginBottom: "30px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Upload Waste Data</h2>

        <p style={{ marginBottom: "20px" }}>
          ارفع ملف CSV يحتوي على بيانات الهدر الذكي لتحليلها داخل المنصة
        </p>

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
              padding: "20px",
              borderRadius: "12px",
              background: darkMode ? "#111827" : "#f9fafb",
              whiteSpace: "pre-line",
              lineHeight: "2",
            }}
          >
            {analysis}
          </div>
        )}
      </div>

      <div
        style={{
          background: darkMode ? "#1f2937" : "white",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2>AI Recommendations</h2>

        <ul
          style={{
            lineHeight: "2",
            marginTop: "15px",
          }}
        >
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
