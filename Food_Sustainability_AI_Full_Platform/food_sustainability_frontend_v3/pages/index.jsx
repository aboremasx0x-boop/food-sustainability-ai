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

  const [financialLoss, setFinancialLoss] = useState(0);
  const [expectedSavings, setExpectedSavings] = useState(0);
  const [topLossFood, setTopLossFood] = useState("Rice");

  const [nextWasteForecast, setNextWasteForecast] = useState(0);
  const [riskLevel, setRiskLevel] = useState("Low");
  const [operationAdvice, setOperationAdvice] = useState("Upload CSV to generate forecast.");

  const [donationKg, setDonationKg] = useState(0);
  const [recyclingKg, setRecyclingKg] = useState(0);
  const [beneficiary, setBeneficiary] = useState("Food Bank / Charity");

  const [foodStats, setFoodStats] = useState([]);
  const [cityStats, setCityStats] = useState([]);
  const [utilizationTips, setUtilizationTips] = useState([]);

  const utilizationMap = {
    Rice: { path: "Donation / Animal Feed / Compost", ar: "إذا كان صالحًا: تبرع غذائي، وإذا غير صالح: أعلاف أو سماد عضوي" },
    Bread: { path: "Donation / Animal Feed", ar: "إذا كان صالحًا: تبرع غذائي، وإذا غير صالح: علف حيواني" },
    Vegetables: { path: "Donation / Compost", ar: "إذا كانت صالحة: تبرع غذائي، وإذا غير صالحة: كومبوست أو سماد حيوي" },
    Fruits: { path: "Donation / Compost / Extracts", ar: "إذا كانت صالحة: تبرع غذائي، وإذا غير صالحة: سماد أو مستخلصات طبيعية" },
    Coffee: { path: "Compost / Biofuel", ar: "استخدامه في السماد أو الوقود الحيوي أو منتجات التقشير" },
    Chicken: { path: "Donation if safe / Protein Recycling", ar: "إذا كان صالحًا وآمنًا: تبرع غذائي، وإلا تدوير بروتيني وفق الاشتراطات" },
    Meat: { path: "Donation if safe / Biogas", ar: "إذا كان صالحًا وآمنًا: تبرع غذائي، وإلا طاقة حيوية أو تدوير بروتيني" },
    Fish: { path: "Donation if safe / Protein Recycling", ar: "إذا كان صالحًا وآمنًا: تبرع غذائي، وإلا تدوير بروتيني أو سماد متخصص" },
  };

  function getUtilization(food) {
    return (
      utilizationMap[food] || {
        path: "Donation / Compost / Biogas",
        ar: "إذا كان صالحًا: تبرع غذائي، وإذا غير صالح: سماد أو طاقة حيوية",
      }
    );
  }

  function calculateRisk(forecast) {
    if (forecast >= 40) return "High";
    if (forecast >= 20) return "Medium";
    return "Low";
  }

  function getAdvice(risk, topFood, topCategory) {
    if (risk === "High") {
      return `خفض إنتاج ${topFood} في قطاع ${topCategory} بنسبة 15–20% خلال اليوم القادم.`;
    }
    if (risk === "Medium") {
      return `مراقبة تجهيز ${topFood} وتقليل الكمية بنسبة 8–10% حسب الطلب الفعلي.`;
    }
    return "مستوى الهدر منخفض، استمر في المتابعة اليومية وتحسين التوزيع.";
  }

  function suggestedBeneficiary(city) {
    if (city === "Jeddah") return "جمعية إطعام / بنك الطعام السعودي - جدة";
    if (city === "Riyadh") return "جمعية إطعام / بنك الطعام السعودي - الرياض";
    if (city === "Makkah" || city === "Mecca") return "جمعية حفظ النعمة - مكة";
    if (city === "Dammam") return "جمعية إطعام - المنطقة الشرقية";
    return "Food Bank / Local Charity";
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
      let totalLoss = 0;
      let edibleTotal = 0;
      let recyclingTotal = 0;

      const categories = {};
      const foods = {};
      const locations = {};
      const paths = {};
      const foodLosses = {};

      rows.forEach((row) => {
        const cols = row.split(",");

        const category = cols[1]?.trim();
        const food = cols[2]?.trim();
        const wasteKg = parseFloat(cols[3]);
        const location = cols[4]?.trim();
        const unitCost = parseFloat(cols[5]) || 0;
        const edible = cols[6]?.trim().toLowerCase();

        if (!isNaN(wasteKg)) {
          const rowLoss = wasteKg * unitCost;

          total += wasteKg;
          totalLoss += rowLoss;

          if (edible === "yes") {
            edibleTotal += wasteKg;
          } else {
            recyclingTotal += wasteKg;
          }

          if (category) categories[category] = (categories[category] || 0) + wasteKg;
          if (location) locations[location] = (locations[location] || 0) + wasteKg;

          if (food) {
            foods[food] = (foods[food] || 0) + wasteKg;
            foodLosses[food] = (foodLosses[food] || 0) + rowLoss;

            const utilization = getUtilization(food);
            paths[utilization.path] = (paths[utilization.path] || 0) + wasteKg;
          }
        }
      });

      const sortedCategories = Object.entries(categories).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
      const sortedFoods = Object.entries(foods).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
      const sortedLocations = Object.entries(locations).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
      const sortedPaths = Object.entries(paths).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
      const sortedFoodLosses = Object.entries(foodLosses).map(([name, value]) => ({ name, value: Math.round(value) })).sort((a, b) => b.value - a.value);

      const highestCategory = sortedCategories[0]?.name || "Unknown";
      const highestFood = sortedFoods[0]?.name || "Unknown";
      const highestLocation = sortedLocations[0]?.name || "Unknown";
      const strongestPath = edibleTotal > recyclingTotal ? "Donation / Food Rescue" : (sortedPaths[0]?.name || "Compost / Biogas");
      const highestLossFood = sortedFoodLosses[0]?.name || "Unknown";

      const predictedReduction = Math.round(total * 0.12);
      const esgScore = Math.max(0, Math.min(100, Math.round(100 - total / 5)));

      const roundedLoss = Math.round(totalLoss);
      const savings = Math.round(totalLoss * 0.12);

      const averageWaste = rows.length > 0 ? total / rows.length : 0;
      const forecast = Math.round(averageWaste * 1.15);
      const risk = calculateRisk(forecast);
      const advice = getAdvice(risk, highestFood, highestCategory);

      const tips = sortedFoods.map((item) => {
        const utilization = getUtilization(item.name);
        const loss = Math.round(foodLosses[item.name] || 0);

        return {
          food: item.name,
          amount: item.value,
          loss,
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
      setFinancialLoss(roundedLoss);
      setExpectedSavings(savings);
      setTopLossFood(highestLossFood);
      setNextWasteForecast(forecast);
      setRiskLevel(risk);
      setOperationAdvice(advice);
      setDonationKg(edibleTotal);
      setRecyclingKg(recyclingTotal);
      setBeneficiary(suggestedBeneficiary(highestLocation));
      setFoodStats(sortedFoods);
      setCityStats(sortedLocations);
      setUtilizationTips(tips);

      setAnalysis(`
نتائج التحليل الذكي:

• إجمالي الهدر: ${total} KG
• كمية قابلة للتبرع: ${edibleTotal} KG
• كمية للتدوير/الاستفادة: ${recyclingTotal} KG
• الجهة المقترحة: ${suggestedBeneficiary(highestLocation)}
• عدد السجلات: ${rows.length}
• أعلى قطاع هدر: ${highestCategory}
• أكثر نوع طعام هدرًا: ${highestFood}
• أعلى مدينة في الهدر: ${highestLocation}
• أفضل مسار للاستفادة: ${strongestPath}
• إجمالي الخسارة المالية: ${roundedLoss} SAR
• أعلى صنف مسبب للخسارة: ${highestLossFood}
• التوفير المتوقع: ${savings} SAR
• توقع الهدر القادم: ${forecast} KG
• مستوى الخطر: ${risk}
• مؤشر ESG: ${esgScore}/100

التوصية التشغيلية:
${advice}

مسار التبرع:
توجيه ${edibleTotal} KG من الفائض الصالح إلى ${suggestedBeneficiary(highestLocation)}.
`);
    };

    reader.readAsText(file);
  }

  return (
    <div style={{ minHeight: "100vh", background: darkMode ? "#0f172a" : "#f3f4f6", padding: "40px 20px", fontFamily: "Arial", color: darkMode ? "white" : "#111827" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>Food Sustainability AI</h1>

        <p style={{ fontSize: "20px", marginBottom: "30px" }}>
          منصة ذكية لتحليل الهدر الغذائي وتحويله إلى تبرع أو قيمة اقتصادية وبيئية
        </p>

        <div style={{ display: "flex", gap: "12px", marginBottom: "35px", flexWrap: "wrap" }}>
          <button onClick={() => setDarkMode(!darkMode)} style={buttonStyle(darkMode)}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <button onClick={() => window.print()} style={buttonStyle(darkMode)}>
            Export Report PDF
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "20px", marginBottom: "35px" }}>
          <Card title="Total Waste" value={`${totalWaste} KG`} color="#ef4444" darkMode={darkMode} />
          <Card title="Donation Eligible" value={`${donationKg} KG`} color="#22c55e" darkMode={darkMode} />
          <Card title="Recycling Waste" value={`${recyclingKg} KG`} color="#84cc16" darkMode={darkMode} />
          <Card title="Financial Loss" value={`${financialLoss} SAR`} color="#dc2626" darkMode={darkMode} />
          <Card title="Expected Savings" value={`${expectedSavings} SAR`} color="#16a34a" darkMode={darkMode} />
          <Card title="Next Waste Forecast" value={`${nextWasteForecast} KG`} color="#f97316" darkMode={darkMode} />
          <Card title="Risk Level" value={riskLevel} color={riskLevel === "High" ? "#dc2626" : riskLevel === "Medium" ? "#f59e0b" : "#16a34a"} darkMode={darkMode} />
          <Card title="ESG Score" value={`${esg}/100`} color="#3b82f6" darkMode={darkMode} />
          <Card title="Top Food Waste" value={topFood} color="#8b5cf6" darkMode={darkMode} />
          <Card title="Top Waste City" value={topLocation} color="#06b6d4" darkMode={darkMode} />
          <Card title="Best Utilization Path" value={bestPath} color="#22c55e" darkMode={darkMode} />
        </div>

        <Section darkMode={darkMode}>
          <h2>Upload Waste Data</h2>
          <p>ارفع ملف CSV بهذا الترتيب: Date, Category, FoodType, WasteKG, Location, UnitCostSAR, Edible</p>
          <input type="file" accept=".csv" onChange={handleFileUpload} />

          {fileName && <p style={{ marginTop: "15px" }}>تم رفع الملف: {fileName}</p>}

          {analysis && (
            <div style={{ marginTop: "20px", background: darkMode ? "#111827" : "#f9fafb", padding: "20px", borderRadius: "12px", lineHeight: "2", whiteSpace: "pre-line" }}>
              {analysis}
            </div>
          )}
        </Section>

        <Section darkMode={darkMode}>
          <h2>Donation & Recycling Route</h2>
          <p style={{ lineHeight: "2", fontSize: "18px" }}>
            <strong>Donation Eligible:</strong> {donationKg} KG
            <br />
            <strong>Recycling / Utilization:</strong> {recyclingKg} KG
            <br />
            <strong>Suggested Beneficiary:</strong> {beneficiary}
          </p>
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
          <h2>Operational Forecast</h2>
          <p style={{ lineHeight: "2", fontSize: "18px" }}>
            <strong>Next Waste Forecast:</strong> {nextWasteForecast} KG
            <br />
            <strong>Risk Level:</strong> {riskLevel}
            <br />
            <strong>Recommended Action:</strong> {operationAdvice}
          </p>
        </Section>

        <Section darkMode={darkMode}>
          <h2>Smart Waste Utilization</h2>

          {utilizationTips.length === 0 ? (
            <p>ارفع ملف CSV لعرض طرق الاستفادة من أنواع الهدر.</p>
          ) : (
            utilizationTips.map((tip, index) => (
              <div key={index} style={{ padding: "18px", marginBottom: "15px", borderRadius: "12px", background: darkMode ? "#111827" : "#f9fafb", border: darkMode ? "1px solid #334155" : "1px solid #e5e7eb" }}>
                <h3 style={{ marginBottom: "8px", color: "#10b981" }}>
                  {tip.food} — {tip.amount} KG — {tip.loss} SAR
                </h3>

                <p style={{ margin: "0 0 8px", lineHeight: "1.8" }}>
                  <strong>Utilization Path:</strong> {tip.path}
                </p>

                <p style={{ margin: 0, lineHeight: "1.8" }}>{tip.suggestion}</p>
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
    <div style={{ background: darkMode ? "#1e293b" : "white", padding: "30px", borderRadius: "18px", boxShadow: "0 4px 14px rgba(0,0,0,0.08)" }}>
      <h3>{title}</h3>
      <h1 style={{ color, fontSize: "34px" }}>{value}</h1>
    </div>
  );
}

function Section({ children, darkMode }) {
  return (
    <div style={{ background: darkMode ? "#1e293b" : "white", padding: "30px", borderRadius: "18px", marginBottom: "35px", boxShadow: "0 4px 14px rgba(0,0,0,0.08)" }}>
      {children}
    </div>
  );
}
