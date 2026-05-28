import { UserRound } from 'lucide-react'

const badgeClass = {
  primary: 'fc-badge fc-primary',
  secondary: 'fc-badge fc-secondary',
  tertiary: 'fc-badge fc-tertiary',
}

function AssignmentBadge({ label, value, type }) {
  return (
    <span className={badgeClass[type]}>
      <UserRound size={12} aria-hidden="true" />
      <span className="fc-label">{label}:</span>
      <span className="fc-value">{value || 'Unassigned'}</span>
    </span>
  )
}

function WorkOrderRow({ order }) {
  return (
    <article className="work-order-row">
      <div className="order-main">
        <strong>{order.workOrder || 'No work order'}</strong>
        <span>{order.personName || 'No person listed'}</span>
      </div>
      <div className="assignment-grid">
        <AssignmentBadge label="Primary" value={order.primaryFc} type="primary" />
        <AssignmentBadge label="Secondary" value={order.secondaryFc} type="secondary" />
        <AssignmentBadge label="Tertiary" value={order.tertiaryFc} type="tertiary" />
      </div>
    </article>
  )
}

export default WorkOrderRow
