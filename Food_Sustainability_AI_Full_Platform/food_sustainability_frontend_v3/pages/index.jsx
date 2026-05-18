export default function Home() {
  return (
    <div style={{
      fontFamily: "Arial",
      background: "#f4f7f9",
      minHeight: "100vh",
      padding: "40px"
    }}>
      
      <h1 style={{
        fontSize: "42px",
        color: "#1b4332",
        marginBottom: "10px"
      }}>
        Food Sustainability AI
      </h1>

      <p style={{
        fontSize: "20px",
        color: "#555",
        marginBottom: "40px"
      }}>
        منصة ذكية لتحليل الهدر الغذائي والاستدامة
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px"
      }}>

        <div style={{
          background: "white",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
          <h2>Total Waste</h2>
          <h1 style={{ color: "#d00000" }}>248 KG</h1>
        </div>

        <div style={{
          background: "white",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
          <h2>ESG Score</h2>
          <h1 style={{ color: "#2d6a4f" }}>87 / 100</h1>
        </div>

        <div style={{
          background: "white",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
          <h2>Predicted Reduction</h2>
          <h1 style={{ color: "#0077b6" }}>12%</h1>
        </div>

      </div>

      <div style={{
        marginTop: "40px",
        background: "white",
        padding: "30px",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        <h2>AI Recommendations</h2>

        <ul style={{
          lineHeight: "2",
          fontSize: "18px"
        }}>
          <li>تقليل الهدر في قسم الخضروات بنسبة 18%</li>
          <li>إعادة توزيع الفائض على الجمعيات الغذائية</li>
          <li>تحسين التنبؤ بالطلب باستخدام الذكاء الاصطناعي</li>
          <li>تحليل المنتجات الأعلى هدرًا يوميًا</li>
        </ul>
      </div>

    </div>
  );
}
