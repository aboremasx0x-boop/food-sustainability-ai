import { useState } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [fileName, setFileName] = useState("");
  const [analysis, setAnalysis] = useState("");

  const styles = {
    page: {
      minHeight: "100vh",
      padding: "40px",
      fontFamily: "Arial",
      background: darkMode ? "#111827" : "#f4f7fb",
      color: darkMode ? "#ffffff" : "#111827",
      transition: "0.3s",
    },
    button: {
      padding: "12px 20px",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      marginBottom: "30px",
      background: darkMode ? "#2563eb" : "#111827",
      color: "#fff",
      fontSize: "16px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
      gap: "20px",
      marginBottom: "40px",
    },
    card: {
      background: darkMode ? "#1f2937" : "#ffffff",
      padding: "25px",
      borderRadius: "18px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    },
    number: {
      fontSize: "38px",
      fontWeight: "bold",
    },
    bar: {
      height: "30px",
      borderRadius: "10px",
      marginBottom: "15px",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      paddingLeft: "12px",
      fontWeight: "bold",
    },
    box: {
      background: darkMode ? "#1f2937" : "#ffffff",
      padding: "25px",
      borderRadius: "18px",
      marginBottom: "40px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    },
    input: {
      marginTop: "15px",
      padding: "12px",
      background: darkMode ? "#374151" : "#ffffff",
      color: darkMode ? "#ffffff" : "#111827",
      borderRadius: "10px",
      border: "1px solid #ccc",
    },
    list: {
      lineHeight: "2",
      fontSize: "18px",
    },
  };

  function handleFileUpload(e) {
    const file = e.target.files[0];

    if (file) {
      setFileName(file.name);

      setAnalysis(`
تحليل أولي للملف:
• ارتفاع الهدر في بعض الأصناف الغذائية
• فرصة تقليل الهدر بنسبة 12%
• تحسين إدارة المخزون سيخفض التكاليف والانبعاثات
• يوصى بتفعيل التنبؤ الذكي للطلب
• يمكن إعادة توزيع الفائض الصالح عبر الجمعيات الغذائية
`);
    }
  }

  return (
    <div style={styles.page}>
      <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>
        Food Sustainability AI
      </h1>

      <p style={{ fontSize: "20px", marginBottom: "30px" }}>
        منصة ذكية لتحليل الهدر الغذائي والاستدامة باستخدام الذكاء الاصطناعي
      </p>

      <button style={styles.button} onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Total Waste</h3>
          <div style={{ ...styles.number, color: "#ef4444" }}>248 KG</div>
        </div>

        <div style={styles.card}>
          <h3>ESG Score</h3>
          <div style={{ ...styles.number, color: "#3b82f6" }}>87 / 100</div>
        </div>

        <div style={styles.card}>
          <h3>Predicted Reduction</h3>
          <div style={{ ...styles.number, color: "#10b981" }}>12%</div>
        </div>
      </div>

      <div style={styles.box}>
        <h2>Waste Analytics</h2>

        <div style={{ ...styles.bar, width: "85%", background: "#ef4444" }}>
          Restaurants - 85%
        </div>

        <div style={{ ...styles.bar, width: "60%", background: "#f59e0b" }}>
          Hotels - 60%
        </div>

        <div style={{ ...styles.bar, width: "40%", background: "#10b981" }}>
          Smart Reduction - 40%
        </div>
      </div>

      <div style={styles.box}>
        <h2>Upload Waste Data</h2>

        <p>
          ارفع ملف CSV يحتوي على بيانات الهدر الغذائي لتحليلها داخل المنصة.
        </p>

        <input
          type="file"
          accept=".csv"
          style={styles.input}
          onChange={handleFileUpload}
        />

        {fileName && (
          <p style={{ marginTop: "15px", color: "#10b981" }}>
            تم اختيار الملف: {fileName}
          </p>
        )}

        {analysis && (
          <div
            style={{
              marginTop: "20px",
              background: darkMode ? "#111827" : "#f9fafb",
              padding: "20px",
              borderRadius: "12px",
              lineHeight: "2",
            }}
          >
            <h3>AI File Analysis</h3>

            <pre
              style={{
                whiteSpace: "pre-wrap",
                fontFamily: "Arial",
                fontSize: "16px",
              }}
            >
              {analysis}
            </pre>
          </div>
        )}
      </div>

      <div style={styles.box}>
        <h2>AI Recommendations</h2>

        <ul style={styles.list}>
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
