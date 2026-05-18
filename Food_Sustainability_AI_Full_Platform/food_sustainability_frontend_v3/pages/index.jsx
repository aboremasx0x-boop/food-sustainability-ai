import { useState } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [fileName, setFileName] = useState("");

  const styles = {
    page: {
      minHeight: "100vh",
      padding: "40px",
      fontFamily: "Arial",
      background: darkMode ? "#111827" : "#f4f7fb",
      color: darkMode ? "#ffffff" : "#111827",
      transition: "0.3s",
    },
    title: { fontSize: "42px", fontWeight: "bold", marginBottom: "10px" },
    subtitle: {
      fontSize: "20px",
      marginBottom: "30px",
      color: darkMode ? "#d1d5db" : "#4b5563",
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
    cardTitle: {
      fontSize: "18px",
      marginBottom: "15px",
      color: darkMode ? "#d1d5db" : "#6b7280",
    },
    number: { fontSize: "38px", fontWeight: "bold" },
    chartContainer: {
      background: darkMode ? "#1f2937" : "#ffffff",
      padding: "25px",
      borderRadius: "18px",
      marginBottom: "40px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
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
    list: { lineHeight: "2", fontSize: "18px" },
    input: {
      marginTop: "15px",
      padding: "12px",
      background: darkMode ? "#374151" : "#ffffff",
      color: darkMode ? "#ffffff" : "#111827",
      borderRadius: "10px",
      border: "1px solid #ccc",
    },
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Food Sustainability AI</h1>

      <p style={styles.subtitle}>
        منصة ذكية لتحليل الهدر الغذائي والاستدامة باستخدام الذكاء الاصطناعي
      </p>

      <button style={styles.button} onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Total Waste</div>
          <div style={{ ...styles.number, color: "#ef4444" }}>248 KG</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>ESG Score</div>
          <div style={{ ...styles.number, color: "#3b82f6" }}>87 / 100</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Predicted Reduction</div>
          <div style={{ ...styles.number, color: "#10b981" }}>12%</div>
        </div>
      </div>

      <div style={styles.chartContainer}>
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
          ارفع ملف CSV يحتوي على بيانات الهدر الغذائي لتحليلها لاحقًا داخل
          المنصة.
        </p>

        <input
          type="file"
          accept=".csv"
          style={styles.input}
          onChange={(e) => setFileName(e.target.files[0]?.name || "")}
        />

        {fileName && (
          <p style={{ marginTop: "15px", color: "#10b981" }}>
            تم اختيار الملف: {fileName}
          </p>
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
