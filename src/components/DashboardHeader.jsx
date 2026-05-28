import philipsLogo from '../assets/Phillips-Logo.jpg'

function PhilipsMark() {
  return <img className="philips-mark" src={philipsLogo} alt="Philips logo" />
}

function DashboardHeader({ totalOrders, scheduledOrders, remainingOrders }) {
  return (
    <header className="dashboard-header">
      <div className="brand-word">PHILIPS</div>
      <div className="summary-title">
        <h1>Scheduling Summary</h1>
        <p>
          <strong>{scheduledOrders}</strong> out of <strong>{totalOrders}</strong> work orders already scheduled
        </p>
        <span>{remainingOrders} work orders remaining</span>
      </div>
      <PhilipsMark />
    </header>
  )
}

export default DashboardHeader
