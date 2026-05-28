import { Download } from 'lucide-react'

function ExportButton({ onExport, disabled, isExporting }) {
  return (
    <button className="export-button" type="button" onClick={onExport} disabled={disabled || isExporting}>
      <Download size={18} aria-hidden="true" />
      {isExporting ? 'Exporting...' : 'Export Dashboard as PNG'}
    </button>
  )
}

export default ExportButton
