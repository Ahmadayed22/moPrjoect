import { useRef, useState } from 'react'
import { FileSpreadsheet, FolderOpen, UploadCloud } from 'lucide-react'

function UploadSection({ onFileSelected, isLoading, error, variant = 'compact' }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const isHero = variant === 'hero'

  const handleFiles = (files) => {
    const file = files?.[0]
    if (file) {
      onFileSelected(file)
    }
  }

  return (
    <section
      className={`upload-section ${isHero ? 'upload-section-hero' : ''} ${isDragging ? 'is-dragging' : ''}`}
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault()
        setIsDragging(false)
        handleFiles(event.dataTransfer.files)
      }}
      onClick={() => {
        if (isHero && !isLoading) {
          inputRef.current?.click()
        }
      }}
    >
      <div className="upload-icon">
        {isHero ? <FolderOpen size={52} aria-hidden="true" /> : <UploadCloud size={28} aria-hidden="true" />}
      </div>
      <div className="upload-copy">
        <h2>{isHero ? 'Upload your scheduling Excel file' : 'Upload file'}</h2>
        <p>
          Drag & drop here, or click to browse
        </p>
        {isHero ? (
          <div className="file-type-pills">
            <span>.xlsx</span>
            <span>.xls</span>
            <span>.csv</span>
          </div>
        ) : null}
      </div>
      {!isHero ? (
        <button
          className="primary-action"
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isLoading}
        >
          <FileSpreadsheet size={18} aria-hidden="true" />
          {isLoading ? 'Parsing file...' : 'Choose file'}
        </button>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={(event) => handleFiles(event.target.files)}
      />
      {error ? <p className="form-error">{error}</p> : null}
    </section>
  )
}

export default UploadSection
