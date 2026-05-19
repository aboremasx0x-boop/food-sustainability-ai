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

  const [totalWaste, setTotalWaste] = useState(0);
  const [financialLoss, setFinancialLoss] = useState(0);
  const [expectedSavings, setExpectedSavings] = useState(0);
  const [donationKg, setDonationKg] = useState(0);
  const [recyclingKg, setRecyclingKg] = useState(0);
  const [forecast, setForecast] = useState(0);
  const [riskLevel, setRiskLevel] = useState("Low");
  const [sustainabilityScore, setSustainabilityScore] = useState(0);

  const [topBranch, setTopBranch] = useState("-");
  const [worstBranch, setWorstBranch] = useState("-");
  const [topFood, setTopFood] = useState("-");
  const [topCity, setTopCity] = useState("-");
  const [bestPath, setBestPath] = useState("-");

  const [branchStats, setBranchStats] = useState([]);
  const [foodStats, setFoodStats] = useState([]);
  const [cityStats, setCityStats] = useState([]);
  const [priorityActions, setPriorityActions] = useState([]);

  function decidePath(food, edible) {
    const f = (food || "").toLowerCase();

    if (edible === "yes") return "Donation / Food Rescue";
    if (["rice", "bread"].includes(f)) return "Animal Feed / Compost";
    if (["vegetables", "fruits"].includes(f)) return "Compost / Biofertilizer";
    if (f === "coffee") return "Compost / Biofuel";
    if (["chicken", "meat", "fish"].includes(f)) return "Protein Recycling / Biogas";
    return "Compost / Biogas";
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
      let loss = 0;
      let donation = 0;
      let recycling = 0;

      const branches = {};
      const foods = {};
      const cities = {};
      const paths = {};
      const actions = [];

      rows.forEach((row) => {
        const cols = row.split(",");

        const branch = cols[1]?.trim();
        const category = cols[2]?.trim();
        const food = cols[3]?.trim();
        const wasteKg = parseFloat(cols[4]);
        const city = cols[5]?.trim();
        const unitCost = parseFloat(cols[6]) || 0;
        const edible = cols[7]?.trim().toLowerCase();

        if (!branch || !food || isNaN(wasteKg)) return;

        const rowLoss = wasteKg * unitCost;
        const path = decidePath(food, edible);

        total += wasteKg;
        loss += rowLoss;

        if (edible === "yes") donation += wasteKg;
        else recycling += wasteKg;

        branches[branch] = branches[branch] || { waste: 0, loss: 0 };
        branches[branch].waste += wasteKg;
        branches[branch].loss += rowLoss;

        foods[food] = (foods[food] || 0) + wasteKg;
        cities[city] = (cities[city] || 0) + wasteKg;
        paths[path] = (paths[path] || 0) + wasteKg;

        actions.push({
          branch,
          food,
          category,
          city,
          wasteKg,
          loss: Math.round(rowLoss),
          path,
          priority: rowLoss > 200 || wasteKg > 20 ? "High" : "Medium",
        });
      });

      const branchArray = Object.entries(branches)
        .map(([name, data]) => ({
          name,
          waste: Math.round(data.waste),
          loss: Math.round(data.loss),
          score: Math.max(0, Math.min(100, Math.round(100 - data.waste * 0.8 - data.loss / 60))),
        }))
        .sort((a, b) => b.score - a.score);

      const foodArray = Object.entries(foods)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      const cityArray = Object.entries(cities)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      const pathArray = Object.entries(paths)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      const expectedSave = Math.round(loss * 0.12);
      const nextForecast = rows.length ? Math.round((total / rows.length) * 1.15) : 0;
      const risk = nextForecast >= 40 ? "High" : nextForecast >= 20 ? "Medium" : "Low";

      const donationImpact = total ? Math.round((donation / total) * 100) : 0;
      const recyclingImpact = total ? Math.round((recycling / total) * 100) : 0;
      const wasteEfficiency = Math.max(0, Math.min(100, Math.round(100 - total / 5)));
      const financialOptimization = loss ? Math.round((expectedSave / loss) * 100) : 0;
      const forecastStability = risk === "Low" ? 90 : risk === "Medium" ? 70 : 45;

      const finalScore = Math.round(
        wasteEfficiency * 0.25 +
          donationImpact * 0.2 +
          recyclingImpact * 0.2 +
          financialOptimization * 0.15 +
          forecastStability * 0.2
      );

      const topActions = actions.sort((a, b) => b.loss - a.loss).slice(0, 3);

      setTotalWaste(Math.round(total));
      setFinancialLoss(Math.round(loss));
      setExpectedSavings(expectedSave);
      setDonationKg(Math.round(donation));
      setRecyclingKg(Math.round(recycling));
      setForecast(nextForecast);
      setRiskLevel(risk);
      setSustainabilityScore(finalScore);

      setTopBranch(branchArray[0]?.name || "-");
      setWorstBranch(branchArray[branchArray.length - 1]?.name || "-");
      setTopFood(foodArray[0]?.name || "-");
      setTopCity(cityArray[0]?.name || "-");
      setBestPath(pathArray[0]?.name || "-");

      setBranchStats(branchArray);
      setFoodStats(foodArray);
      setCityStats(cityArray);
      setPriorityActions(topActions);

      setAnalysis(`
نتائج التحليل الموحد:

• إجمالي الهدر: ${Math.round(total)} KG
• إجمالي الخسارة المالية: ${Math.round(loss)} SAR
• التوفير المتوقع: ${expectedSave} SAR
• كمية قابلة للتبرع: ${Math.round(donation)} KG
• كمية للتدوير: ${Math.round(recycling)} KG
• أفضل فرع: ${branchArray[0]?.name || "-"}
• أسوأ فرع: ${branchArray[branchArray.length - 1]?.name || "-"}
• أكثر نوع طعام هدرًا: ${foodArray[0]?.name || "-"}
• أعلى مدينة في الهدر: ${cityArray[0]?.name || "-"}
• أفضل مسار استفادة: ${pathArray[0]?.name || "-"}
• توقع الهدر القادم: ${nextForecast} KG
• مستوى الخطر: ${risk}
• Sustainability Score: ${finalScore}/100

قرار النظام:
ابدأ بمعالجة ${topActions[0]?.food || "-"} في فرع ${topActions[0]?.branch || "-"} لأنه أعلى أولوية من حيث الهدر والخسارة.
`);
    };

    reader.readAsText(file);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: darkMode ? "#0f172a" : "#f3f4f6",
      padding: "40px 20px",
      fontFamily: "Arial",
      color: darkMode ? "white" : "#111827",
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>
          Food Sustainability AI
        </h1>

        <p style={{ fontSize: "20px", marginBottom: "30px" }}>
          Unified Dashboard لتحليل الهدر الغذائي، الفروع، التبرع، التدوير، الخسائر، والتوقعات
        </p>

        <div style={{ display: "flex", gap: "12px", marginBottom: "35px", flexWrap: "wrap" }}>
          <button onClick={() => setDarkMode(!darkMode)} style={buttonStyle(darkMode)}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <button onClick={() => window.print()} style={buttonStyle(darkMode)}>
            Export Report PDF
          </button>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))",
          gap: "20px",
          marginBottom: "35px",
        }}>
          <Card title="Sustainability Score" value={`${sustainabilityScore}/100`} color="#22c55e" darkMode={darkMode} />
          <Card title="Total Waste" value={`${totalWaste} KG`} color="#ef4444" darkMode={darkMode} />
          <Card title="Financial Loss" value={`${financialLoss} SAR`} color="#dc2626" darkMode={darkMode} />
          <Card title="Expected Savings" value={`${expectedSavings} SAR`} color="#16a34a" darkMode={darkMode} />
          <Card title="Donation Eligible" value={`${donationKg} KG`} color="#22c55e" darkMode={darkMode} />
          <Card title="Recycling Waste" value={`${recyclingKg} KG`} color="#84cc16" darkMode={darkMode} />
          <Card title="Forecast" value={`${forecast} KG`} color="#f97316" darkMode={darkMode} />
          <Card title="Risk Level" value={riskLevel} color={riskLevel === "High" ? "#dc2626" : riskLevel === "Medium" ? "#f59e0b" : "#16a34a"} darkMode={darkMode} />
          <Card title="Best Branch" value={topBranch} color="#22c55e" darkMode={darkMode} />
          <Card title="Worst Branch" value={worstBranch} color="#f97316" darkMode={darkMode} />
          <Card title="Top Food" value={topFood} color="#8b5cf6" darkMode={darkMode} />
          <Card title="Top City" value={topCity} color="#06b6d4" darkMode={darkMode} />
          <Card title="Best Path" value={bestPath} color="#10b981" darkMode={darkMode} />
        </div>

        <Section darkMode={darkMode}>
          <h2>Upload Unified CSV</h2>
          <p>CSV: Date, Branch, Category, FoodType, WasteKG, Location, UnitCostSAR, Edible</p>
          <input type="file" accept=".csv" onChange={handleFileUpload} />
          {fileName && <p style={{ marginTop: "15px" }}>تم رفع الملف: {fileName}</p>}
          {analysis && (
            <div style={{
              marginTop: "20px",
              background: darkMode ? "#111827" : "#f9fafb",
              padding: "20px",
              borderRadius: "12px",
              lineHeight: "2",
              whiteSpace: "pre-line",
            }}>
              {analysis}
            </div>
          )}
        </Section>

        <ChartSection title="Branch Comparison" data={branchStats} bars={[
          { key: "waste", color: "#ef4444" },
          { key: "loss", color: "#f59e0b" },
          { key: "score", color: "#22c55e" },
        ]} darkMode={darkMode} />

        <ChartSection title="Food Waste Analytics" data={foodStats} bars={[
          { key: "value", color: "#14b8a6" },
        ]} darkMode={darkMode} />

        <ChartSection title="City Waste Analytics" data={cityStats} bars={[
          { key: "value", color: "#06b6d4" },
        ]} darkMode={darkMode} />

        <Section darkMode={darkMode}>
          <h2>AI Decision Engine — Priority Actions</h2>
          {priorityActions.length === 0 ? (
            <p>ارفع ملف CSV لعرض أولويات القرار.</p>
          ) : (
            priorityActions.map((item, index) => (
              <div key={index} style={{
                padding: "18px",
                marginBottom: "15px",
                borderRadius: "12px",
                background: darkMode ? "#111827" : "#f9fafb",
                border: darkMode ? "1px solid #334155" : "1px solid #e5e7eb",
              }}>
                <h3 style={{ color: item.priority === "High" ? "#ef4444" : "#f59e0b" }}>
                  Priority {index + 1}: {item.food} — {item.branch}
                </h3>
                <p><strong>Waste:</strong> {item.wasteKg} KG</p>
                <p><strong>Loss:</strong> {item.loss} SAR</p>
                <p><strong>Path:</strong> {item.path}</p>
                <p><strong>Priority:</strong> {item.priority}</p>
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
    <div style={{
      background: darkMode ? "#1e293b" : "white",
      padding: "28px",
      borderRadius: "18px",
      boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    }}>
      <h3>{title}</h3>
      <h1 style={{ color, fontSize: "32px" }}>{value}</h1>
    </div>
  );
}

function Section({ children, darkMode }) {
  return (
    <div style={{
      background: darkMode ? "#1e293b" : "white",
      padding: "30px",
      borderRadius: "18px",
      marginBottom: "35px",
      boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    }}>
      {children}
    </div>
  );
}

function ChartSection({ title, data, bars, darkMode }) {
  return (
    <Section darkMode={darkMode}>
      <h2>{title}</h2>
      <div style={{ width: "100%", height: 420 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {bars.map((bar) => (
              <Bar key={bar.key} dataKey={bar.key} fill={bar.color} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Section>
  );
}
