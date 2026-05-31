import { useMemo, useRef, useState } from 'react'
import { ClipboardList, Heart, Play } from 'lucide-react'
import DashboardHeader from '../components/DashboardHeader'
import ExportButton from '../components/ExportButton'
import HospitalCard from '../components/HospitalCard'
import SearchFilterBar from '../components/SearchFilterBar'
import UploadSection from '../components/UploadSection'
import philipsLogo from '../assets/Phillips-Logo.png'
// import philipsLogo2 from '../assets/Phillips-Logo.webp'
import { exportNodeAsPng } from '../utils/exportImage'
import { parseScheduleFile } from '../utils/excelParser'

const groupByHospital = (rows) => {
  const groups = rows.reduce((acc, row) => {
    const key = row.hospitalName || 'Unknown Hospital'
    if (!acc.has(key)) {
      acc.set(key, { name: key, orders: [] })
    }
    acc.get(key).orders.push(row)
    return acc
  }, new Map())

  return [...groups.values()].sort((a, b) => a.name.localeCompare(b.name))
}

const demoRows = [
  ['Riverbend Regional Medical Center', 'FCO83921470', 'WO-78264193', 'Mark', 'Sam', 'Kevin', 'Unscheduled'],
  ['Cedar Valley Heart Institute', 'FCO10458732', 'WO-61839427', 'Ben', 'Sam', 'Kevin', 'Unscheduled'],
  ['Cedar Valley Heart Institute', 'FCO59021684', 'WO-92573106', 'Ben', 'Sam', 'Kevin', 'Unscheduled'],
  ['Oak Hollow University Hospital', 'FCO80431296', 'WO-65021874', 'Francisco', 'Antwan', 'Ben', 'scheduled'],
  ['Maple Grove Covenant Hospital', 'FCO52690471', 'WO-47260518', 'Antwan', 'Francisco', 'Sam', 'Unscheduled'],
].map(([hospitalName, personName, workOrder, primaryFc, secondaryFc, tertiaryFc, scheduledStatus], index) => ({
  id: `demo-${index}`,
  hospitalName,
  personName,
  workOrder,
  primaryFc,
  secondaryFc,
  tertiaryFc,
  scheduledStatus,
}))

const isUnscheduled = (row) => row.scheduledStatus.trim().toLowerCase() === 'unscheduled'

const isScheduled = (row) => {
  const status = row.scheduledStatus.trim().toLowerCase()

  if (status) {
    return status !== 'unscheduled'
  }

  return Boolean(row.primaryFc || row.secondaryFc || row.tertiaryFc)
}

const PAGE_SIZE = 10

function Dashboard() {
  const dashboardRef = useRef(null)
  const [rows, setRows] = useState([])
  const [fileName, setFileName] = useState('')
  const [search, setSearch] = useState('')
  const [fcFilter, setFcFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState('')

  const remainingRows = useMemo(() => {
    const hasScheduledStatus = rows.some((row) => row.scheduledStatus)
    return hasScheduledStatus ? rows.filter(isUnscheduled) : rows
  }, [rows])

  const fcOptions = useMemo(() => {
    const names = remainingRows.map((row) => row.primaryFc).filter(Boolean)
    return [...new Set(names)].sort((a, b) => a.localeCompare(b))
  }, [remainingRows])

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase()

    return remainingRows.filter((row) => {
      const matchesSearch =
        !query ||
        [row.hospitalName, row.personName, row.workOrder]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query))
      const matchesFc = !fcFilter || row.primaryFc === fcFilter

      return matchesSearch && matchesFc
    })
  }, [fcFilter, remainingRows, search])

  const totalPages = Math.max(Math.ceil(filteredRows.length / PAGE_SIZE), 1)
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedRows = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE
    return filteredRows.slice(startIndex, startIndex + PAGE_SIZE)
  }, [filteredRows, safeCurrentPage])
  const hospitals = useMemo(() => groupByHospital(paginatedRows), [paginatedRows])
  const scheduledOrders = rows.filter(isScheduled).length
  const remainingOrders = rows.some((row) => row.scheduledStatus)
    ? rows.filter(isUnscheduled).length
    : Math.max(rows.length - scheduledOrders, 0)

  const primaryCounts = useMemo(() => {
    const counts = filteredRows.reduce((acc, row) => {
      if (row.primaryFc) {
        acc[row.primaryFc] = (acc[row.primaryFc] || 0) + 1
      }
      return acc
    }, {})

    if (fcFilter) {
      return [[fcFilter, counts[fcFilter] || 0]]
    }

    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [fcFilter, filteredRows])

  const handleSearchChange = (value) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const handleFcFilterChange = (value) => {
    setFcFilter(value)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearch('')
    setFcFilter('')
    setCurrentPage(1)
  }

  const handleFileSelected = async (file) => {
    setIsLoading(true)
    setError('')

    try {
      const parsedRows = await parseScheduleFile(file)
      setRows(parsedRows)
      setFileName(file.name)
      setSearch('')
      setFcFilter('')
      setCurrentPage(1)
    } catch (fileError) {
      setError(fileError.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    setError('')

    try {
      await exportNodeAsPng(dashboardRef.current)
    } catch (exportError) {
      setError(exportError.message)
    } finally {
      setIsExporting(false)
    }
  }

  const loadDemoData = () => {
    setRows(demoRows)
    setFileName('Sample data demo')
    setSearch('')
    setFcFilter('')
    setCurrentPage(1)
    setError('')
  }

  if (!fileName) {
    return (
      <main className="first-upload-screen">
        <header className="first-upload-header">
          <div className="first-upload-brand-lockup">
            <div className="first-upload-brand">PHILIPS</div>
            <img className="first-upload-avatar" src={philipsLogo} alt="Philips logo" />
          </div>
          <div className="first-upload-summary">
            <h1>Scheduling Summary</h1>
          </div>
        </header>

        <section className="first-upload-body">
          <UploadSection
            onFileSelected={handleFileSelected}
            isLoading={isLoading}
            error={error}
            variant="hero"
          />
          <button className="sample-data-button" type="button" onClick={loadDemoData}>
            <Play size={13} fill="currentColor" aria-hidden="true" />
            Load sample data (demo)
          </button>
        </section>

        <footer className="first-upload-footer">
          <Heart size={13} fill="currentColor" aria-hidden="true" />
          <span>Together, we make life better</span>
        </footer>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <section className="dashboard-sheet" ref={dashboardRef}>
        <DashboardHeader totalOrders={rows.length} scheduledOrders={scheduledOrders} remainingOrders={remainingOrders} />
        <div className="control-panel">
          <UploadSection onFileSelected={handleFileSelected} isLoading={isLoading} error={error} />
          <SearchFilterBar
            search={search}
            onSearchChange={handleSearchChange}
            fcFilter={fcFilter}
            onFcFilterChange={handleFcFilterChange}
            fcOptions={fcOptions}
            onClear={clearFilters}
          />
          <ExportButton onExport={handleExport} disabled={!rows.length} isExporting={isExporting} />
        </div>
        <div className="dashboard-meta">
          <span>{fileName}</span>
          <span>{filteredRows.length} visible work orders</span>
        </div>

        <div className="table-header">
          <span>Site / # of work orders</span>
          <span>Work orders & FSE assignments</span>
        </div>

        {hospitals.length ? (
          <div className="hospital-list">
            {hospitals.map((hospital) => (
              <HospitalCard key={hospital.name} hospital={hospital} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <ClipboardList size={34} aria-hidden="true" />
            <h2>No schedule data</h2>
            <p>Upload a valid schedule file or clear the current filters.</p>
          </div>
        )}

        {filteredRows.length > PAGE_SIZE ? (
          <nav className="pagination-controls" aria-label="Work order pagination">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {safeCurrentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
              disabled={safeCurrentPage === totalPages}
            >
              Next
            </button>
          </nav>
        ) : null}

        <footer className="dashboard-footer">
          <strong>Primary WO count</strong>
          <div className="count-legend">
            {primaryCounts.map(([name, count], index) => (
              <span key={name}>
                <i style={{ '--dot-color': `var(--legend-${(index % 6) + 1})` }} />
                {name}: {count}
              </span>
            ))}
          </div>
        </footer>
        <footer className="first-upload-footer">
          <Heart size={13} fill="currentColor" aria-hidden="true" />
          <span>Together, we make life better</span>
        </footer>
      </section>
    </main>
  )
}

export default Dashboard
