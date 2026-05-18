import { useMemo, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const monthlyData = [
  { day: '1', waste: 18 },
  { day: '5', waste: 24 },
  { day: '10', waste: 19 },
  { day: '15', waste: 28 },
  { day: '20', waste: 21 },
  { day: '25', waste: 16 },
  { day: '30', waste: 31 }
];

const categoryData = [
  { name: 'Rice', value: 42 },
  { name: 'Chicken', value: 25 },
  { name: 'Vegetables', value: 21 },
  { name: 'Bread', value: 12 }
];

const branchData = [
  { name: 'Branch A', score: 87 },
  { name: 'Branch B', score: 74 },
  { name: 'Branch C', score: 91 },
  { name: 'Branch D', score: 68 }
];

export default function Home() {
  const [lang, setLang] = useState('ar');
  const [result, setResult] = useState(null);
  const [form, setForm] = useState({ restaurant: 'مطعم النخيل', food_type: 'Rice', weight: 12 });

  const isAr = lang === 'ar';

  const t = useMemo(() => isAr ? {
    title: 'منصة الاستدامة الغذائية',
    subtitle: 'Food Sustainability AI',
    hero: 'ذكاء يقلل الهدر الغذائي',
    desc: 'منصة SaaS ذكية تساعد المطاعم والفنادق على تحليل فائض الطعام، تقليل الخسائر، ورفع مؤشر الاستدامة عبر تقارير تشغيلية وتوقعات ذكية.',
    language: 'English',
    dashboard: 'لوحة التحكم',
    totalWaste: 'إجمالي الهدر',
    cost: 'الخسائر المالية',
    meals: 'وجبات يمكن إنقاذها',
    co2: 'خفض الانبعاثات',
    trend: 'اتجاه الهدر الشهري',
    distribution: 'توزيع الهدر حسب الصنف',
    branches: 'مقارنة الفروع',
    analyze: 'تحليل الهدر',
    restaurant: 'اسم المنشأة',
    foodType: 'نوع الطعام',
    weight: 'الوزن / كجم',
    run: 'تشغيل التحليل',
    score: 'مؤشر الاستدامة',
    recommendation: 'التوصية الذكية',
    esg: 'تقرير ESG مختصر',
    status: 'المنصة تعمل الآن على الإنترنت'
  } : {
    title: 'Food Sustainability Platform',
    subtitle: 'Food Sustainability AI',
    hero: 'Smart Food. Zero Waste.',
    desc: 'A SaaS platform helping restaurants and hotels analyze food waste, reduce losses, and improve sustainability performance through smart reporting and prediction.',
    language: 'العربية',
    dashboard: 'Dashboard',
    totalWaste: 'Total Waste',
    cost: 'Financial Loss',
    meals: 'Meals Saved',
    co2: 'CO₂ Reduction',
    trend: 'Monthly Waste Trend',
    distribution: 'Waste by Category',
    branches: 'Branch Comparison',
    analyze: 'Waste Analysis',
    restaurant: 'Facility Name',
    foodType: 'Food Type',
    weight: 'Weight / KG',
    run: 'Run Analysis',
    score: 'Sustainability Score',
    recommendation: 'Smart Recommendation',
    esg: 'ESG Summary',
    status: 'Platform is live'
  }, [isAr]);

  async function runAnalysis() {
    if (!API_URL) {
      setResult({
        sustainability_score: Math.max(0, 100 - Number(form.weight) * 2),
        recommendation: isAr ? 'قلل كمية الإنتاج غدًا بنسبة 10٪ للصنف المحدد.' : 'Reduce tomorrow production by 10% for the selected item.',
        estimated_weight: form.weight,
        food_type: form.food_type
      });
      return;
    }

    const response = await fetch(`${API_URL}/waste/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restaurant: form.restaurant,
        food_type: form.food_type,
        weight: Number(form.weight)
      })
    });

    const data = await response.json();
    setResult(data);
  }

  return (
    <main dir={isAr ? 'rtl' : 'ltr'} className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">🍃</div>
          <div>
            <h2>{t.title}</h2>
            <p>{t.subtitle}</p>
          </div>
        </div>

        <nav>
          <a>{t.dashboard}</a>
          <a>{t.analyze}</a>
          <a>{t.esg}</a>
          <a>{t.recommendation}</a>
        </nav>

        <div className="live">{t.status}</div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <h1>{t.hero}</h1>
            <p>{t.desc}</p>
          </div>
          <button onClick={() => setLang(isAr ? 'en' : 'ar')}>{t.language}</button>
        </header>

        <section className="cards">
          <Metric title={t.totalWaste} value="248.6" unit="KG" />
          <Metric title={t.cost} value="8,947" unit="SAR" />
          <Metric title={t.meals} value="672" unit={isAr ? 'وجبة' : 'Meals'} />
          <Metric title={t.co2} value="496" unit="KG CO₂" />
        </section>

        <section className="grid">
          <div className="panel wide">
            <h3>{t.trend}</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlyData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="waste" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="panel">
            <h3>{t.distribution}</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" innerRadius={55} outerRadius={90} label />
                {categoryData.map((_, i) => <Cell key={i} />)}
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="panel">
            <h3>{t.branches}</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={branchData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="panel analysis">
            <h3>{t.analyze}</h3>
            <label>{t.restaurant}</label>
            <input value={form.restaurant} onChange={e => setForm({ ...form, restaurant: e.target.value })} />
            <label>{t.foodType}</label>
            <input value={form.food_type} onChange={e => setForm({ ...form, food_type: e.target.value })} />
            <label>{t.weight}</label>
            <input type="number" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} />
            <button onClick={runAnalysis}>{t.run}</button>
            {result && (
              <div className="result">
                <b>{t.score}: {result.sustainability_score}/100</b>
                <p>{t.recommendation}: {result.recommendation}</p>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

function Metric({ title, value, unit }) {
  return (
    <div className="metric">
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{unit}</small>
    </div>
  );
}
