import { useState } from 'react'
import { Check, Copy, UserRound } from 'lucide-react'

const salesforceUrl = 'https://philipsb2bsc.my.salesforce.com/console'

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
  const [isCopied, setIsCopied] = useState(false)
  const workOrder = order.workOrder || 'No work order'

  const copyWorkOrder = async () => {
    if (!order.workOrder) {
      return
    }

    await navigator.clipboard.writeText(order.workOrder)
    setIsCopied(true)
    window.setTimeout(() => setIsCopied(false), 1200)
  }

  return (
    <article className="work-order-row">
      <div className="order-main">
        <div className="work-order-title">
          <a href={salesforceUrl} target="_blank" rel="noreferrer">
            <strong>{workOrder}</strong>
          </a>
          <button
            className="copy-order-button"
            type="button"
            onClick={copyWorkOrder}
            disabled={!order.workOrder}
            title={isCopied ? 'Copied' : 'Copy work order number'}
            aria-label={isCopied ? 'Copied work order number' : 'Copy work order number'}
          >
            {isCopied ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
          </button>
        </div>
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
