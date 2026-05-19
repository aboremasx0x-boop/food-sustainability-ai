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

  const [topCategory, setTopCategory] = useState("Restaurant");
  const [topFood, setTopFood] = useState("Rice");
  const [topLocation, setTopLocation] = useState("Jeddah");
  const [bestPath, setBestPath] = useState("Animal Feed / Compost");

  const [foodStats, setFoodStats] = useState([]);
  const [cityStats, setCityStats] = useState([]);
  const [utilizationTips, setUtilizationTips] = useState([]);

  const utilizationMap = {
    Rice: {
      path: "Animal Feed / Compost",
      ar: "تحويله إلى أعلاف أو سماد عضوي بعد المعالجة المناسبة",
    },
    Bread: {
      path: "Animal Feed",
      ar: "استخدامه كعلف حيواني أو تحويله إلى سماد عضوي",
    },
    Vegetables: {
      path: "Compost / Biofertilizer",
      ar: "تحويله إلى كومبوست أو سماد حيوي",
    },
    Fruits: {
      path: "Compost / Extracts",
      ar: "إنتاج سماد عضوي أو مستخلصات طبيعية",
    },
    Coffee: {
      path: "Compost / Biofuel",
      ar: "استخدامه في السماد أو الوقود الحيوي أو منتجات التقشير",
    },
    Chicken: {
      path: "Protein Recycling",
      ar: "إعادة تدوير البروتين الحيواني وفق اشتراطات السلامة",
    },
    Meat: {
      path: "Biogas / Protein Recycling",
      ar: "معالجة متخصصة لإنتاج طاقة حيوية أو تدوير بروتيني",
    },
    Fish: {
      path: "Protein Recycling / Organic Fertilizer",
      ar: "إعادة تدوير بروتيني أو تحويله إلى سماد عضوي متخصص",
    },
  };

  function getUtilization(food) {
    return (
      utilizationMap[food] || {
        path: "Compost / Biogas",
        ar: "إعادة تدوير غذائي أو تحويله إلى سماد أو طاقة حيوية حسب نوع المخلف",
      }
    );
  }

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split("\n").slice(1).filter((row) => row.trim() !== "");

      let total = 0;
      const categories = {};
      const foods = {};
      const locations = {};
      const paths = {};

      rows.forEach((row) => {
        const cols = row.split(",");

        const category = cols[1]?.trim();
        const food = cols[2]?.trim();
        const wasteKg = parseFloat(cols[3]);
        const location = cols[4]?.trim();

        if (!isNaN(wasteKg)) {
          total += wasteKg;

          if (category) categories[category] = (categories[category] || 0) + wasteKg;
          if (food) {
            foods[food] = (foods[food] || 0) + wasteKg;
            const utilization = getUtilization(food);
            paths[utilization.path] = (paths[utilization.path] || 0) + wasteKg;
          }
          if (location) locations[location] = (locations[location] || 0) + wasteKg;
        }
      });

      const sortedCategories = Object.entries(categories)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      const sortedFoods = Object.entries(foods)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      const sortedLocations = Object.entries(locations)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      const sortedPaths = Object.entries(paths)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      const highestCategory = sortedCategories[0]?.name || "Unknown";
      const highestFood = sortedFoods[0]?.name || "Unknown";
      const highestLocation = sortedLocations[0]?.name || "Unknown";
      const strongestPath = sortedPaths[0]?.name || "Compost / Biogas";

      const predictedReduction = Math.round(total * 0.12);
      const esgScore = Math.max(0, Math.min(100, Math.round(100 - total / 5)));

      const tips = sortedFoods.map((item) => {
        const utilization = getUtilization(item.name);

        return {
          food: item.name,
          amount: item.value,
          path: utilization.path,
          suggestion: utilization.ar,
        };
      });

      setTotalWaste(total);
      setReduction(predictedReduction);
      setESG(esgScore);
      setTopCategory(highestCategory);
      setTopFood(highestFood);
      setTopLocation(highestLocation);
      setBestPath(strongestPath);
      setFoodStats(sortedFoods);
      setCityStats(sortedLocations);
      setUtilizationTips(tips);

      setAnalysis(`
نتائج التحليل الذكي:

• إجمالي الهدر: ${total} KG
• عدد السجلات: ${rows.length}
• أعلى قطاع هدر: ${highestCategory}
• أكثر نوع طعام هدرًا: ${highestFood}
• أعلى مدينة في الهدر: ${highestLocation}
• أفضل مسار للاستفادة: ${strongestPath}
• التخفيض المتوقع: ${predictedReduction} KG
• مؤشر ESG: ${esgScore}/100

التوصية:
تقليل هدر ${highestFood} داخل قطاع ${highestCategory} في مدينة ${highestLocation}، مع توجيه الهدر إلى مسار ${strongestPath}.
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
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>
          Food Sustainability AI
        </h1>

        <p style={{ fontSize: "20px", marginBottom: "30px" }}>
          منصة ذكية لتحليل الهدر الغذائي وتحويله إلى قيمة
        </p>

        <div style={{ display: "flex", gap: "12px", marginBottom: "35px", flexWrap: "wrap" }}>
          <button onClick={() => setDarkMode(!darkMode)} style={buttonStyle(darkMode)}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <button onClick={() => window.print()} style={buttonStyle(darkMode)}>
            Export Report PDF
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
            gap: "20px",
            marginBottom: "35px",
          }}
        >
          <Card title="Total Waste" value={`${totalWaste} KG`} color="#ef4444" darkMode={darkMode} />
          <Card title="ESG Score" value={`${esg}/100`} color="#3b82f6" darkMode={darkMode} />
          <Card title="Predicted Reduction" value={`${reduction} KG`} color="#10b981" darkMode={darkMode} />
          <Card title="Top Sector" value={topCategory} color="#f59e0b" darkMode={darkMode} />
          <Card title="Top Food Waste" value={topFood} color="#8b5cf6" darkMode={darkMode} />
          <Card title="Top Waste City" value={topLocation} color="#06b6d4" darkMode={darkMode} />
          <Card title="Best Utilization Path" value={bestPath} color="#22c55e" darkMode={darkMode} />
        </div>

        <Section darkMode={darkMode}>
          <h2>Upload Waste Data</h2>
          <p>ارفع ملف CSV بهذا الترتيب: Date, Category, FoodType, WasteKG, Location</p>

          <input type="file" accept=".csv" onChange={handleFileUpload} />

          {fileName && <p style={{ marginTop: "15px" }}>تم رفع الملف: {fileName}</p>}

          {analysis && (
            <div
              style={{
                marginTop: "20px",
                background: darkMode ? "#111827" : "#f9fafb",
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
          <h2>Food Waste Analytics</h2>
          <div style={{ width: "100%", height: 420 }}>
            <ResponsiveContainer>
              <BarChart data={foodStats}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#14b8a6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section darkMode={darkMode}>
          <h2>City Waste Analytics</h2>
          <div style={{ width: "100%", height: 420 }}>
            <ResponsiveContainer>
              <BarChart data={cityStats}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section darkMode={darkMode}>
          <h2>Smart Waste Utilization</h2>
          <p>اقتراحات ذكية للاستفادة من الهدر وتحويله إلى قيمة اقتصادية وبيئية.</p>

          {utilizationTips.length === 0 ? (
            <p>ارفع ملف CSV لعرض طرق الاستفادة من أنواع الهدر.</p>
          ) : (
            utilizationTips.map((tip, index) => (
              <div
                key={index}
                style={{
                  padding: "18px",
                  marginBottom: "15px",
                  borderRadius: "12px",
                  background: darkMode ? "#111827" : "#f9fafb",
                  border: darkMode ? "1px solid #334155" : "1px solid #e5e7eb",
                }}
              >
                <h3 style={{ marginBottom: "8px", color: "#10b981" }}>
                  {tip.food} — {tip.amount} KG
                </h3>

                <p style={{ margin: "0 0 8px", lineHeight: "1.8" }}>
                  <strong>Utilization Path:</strong> {tip.path}
                </p>

                <p style={{ margin: 0, lineHeight: "1.8" }}>
                  {tip.suggestion}
                </p>
              </div>
            ))
          )}
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
    background: darkMode ? "#2563eb" : "#111827",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
  };
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
      <h3>{title}</h3>
      <h1 style={{ color, fontSize: "34px" }}>{value}</h1>
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
