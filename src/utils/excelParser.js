import * as XLSX from 'xlsx'

const SUPPORTED_EXTENSIONS = ['xlsx', 'xls', 'csv']

const columnAliases = {
  hospitalName: ['hospital name', 'hospital', 'site'],
  personName: ['person name', 'person', 'contact name', 'contact'],
  workOrder: ['work order', 'workorder', 'wo', 'work order id'],
  primaryFc: ['primary fc', 'primary fse', 'primary'],
  secondaryFc: ['secondary fc', 'secondary fse', 'secondary'],
  tertiaryFc: ['tertiary fc', 'tertiary fse', 'tertiary'],
}

const normalizeHeader = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')

const getCell = (row, aliases) => {
  const entries = Object.entries(row)
  const match = entries.find(([key]) => aliases.includes(normalizeHeader(key)))
  return match ? String(match[1] || '').trim() : ''
}

export async function parseScheduleFile(file) {
  const extension = file.name.split('.').pop()?.toLowerCase()

  if (!SUPPORTED_EXTENSIONS.includes(extension)) {
    throw new Error('Upload an Excel or CSV file.')
  }

  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]

  if (!sheet) {
    throw new Error('No worksheet was found in this file.')
  }

  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

  if (!rows.length) {
    return []
  }

  return rows
    .map((row, index) => ({
      id: `${getCell(row, columnAliases.workOrder) || 'row'}-${index}`,
      hospitalName: getCell(row, columnAliases.hospitalName),
      personName: getCell(row, columnAliases.personName),
      workOrder: getCell(row, columnAliases.workOrder),
      primaryFc: getCell(row, columnAliases.primaryFc),
      secondaryFc: getCell(row, columnAliases.secondaryFc),
      tertiaryFc: getCell(row, columnAliases.tertiaryFc),
    }))
    .filter((row) => row.hospitalName || row.workOrder)
}
