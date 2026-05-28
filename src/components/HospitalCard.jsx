import { Building2 } from 'lucide-react'
import WorkOrderRow from './WorkOrderRow'

function HospitalCard({ hospital }) {
  // const personNames = [...new Set(hospital.orders.map((order) => order.personName).filter(Boolean))]

  return (
    <section className="hospital-card">
      <aside className="hospital-site">
        <div className="site-icon">
          <Building2 size={25} aria-hidden="true" />
        </div>
        <div>
          <h2>{hospital.name || 'Unknown Hospital'}</h2>
          {/* {personNames.length ? <p>{personNames.join(', ')}</p> : null} */}
          <span>
            {hospital.orders.length} work {hospital.orders.length === 1 ? 'order' : 'orders'}
          </span>
        </div>
      </aside>
      <div className="work-orders-list">
        {hospital.orders.map((order) => (
          <WorkOrderRow key={order.id} order={order} />
        ))}
      </div>
    </section>
  )
}

export default HospitalCard
