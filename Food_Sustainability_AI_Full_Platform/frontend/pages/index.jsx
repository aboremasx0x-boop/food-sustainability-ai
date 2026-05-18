
export default function Home() {
  return (
    <div style={{padding:'40px',fontFamily:'Arial'}}>
      <h1>Food Sustainability AI</h1>
      <h2>منصة الاستدامة الغذائية</h2>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'20px'}}>
        <div style={{border:'1px solid #ccc',padding:'20px'}}>
          <h3>Total Waste</h3>
          <p>248 KG</p>
        </div>

        <div style={{border:'1px solid #ccc',padding:'20px'}}>
          <h3>ESG Score</h3>
          <p>87 / 100</p>
        </div>

        <div style={{border:'1px solid #ccc',padding:'20px'}}>
          <h3>Predicted Waste</h3>
          <p>12% reduction tomorrow</p>
        </div>
      </div>
    </div>
  )
}
