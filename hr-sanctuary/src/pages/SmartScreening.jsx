import { useState, useEffect, useRef } from 'react'
import FadeIn from '../components/ui/FadeIn.jsx'
import SectionTag from '../components/ui/SectionTag.jsx'
import { getJobDescriptions, uploadResumes, getRankedCandidates, createJobDescription, deleteResume } from '../api/api'


export default function SmartScreening() {
  const [isDragOver, setIsDragOver] = useState(false)
  const [jobDescriptions, setJobDescriptions] = useState([])
  const [selectedJdId, setSelectedJdId] = useState('')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [isOthers, setIsOthers] = useState(false)
  const [customRole, setCustomRole] = useState('')
  const [customDescription, setCustomDescription] = useState('')
  const [selectedJdTitle, setSelectedJdTitle] = useState('')
  const [experience, setExperience] = useState('')
  const dropdownRef = useRef(null)

  useEffect(() => {
    getJobDescriptions()
      .then(res => {
        setJobDescriptions(res.data)
        if (res.data.length > 0) {
          setSelectedJdId(res.data[0].id)
          setSelectedJdTitle(res.data[0].title)
        }
      })
      .catch(() => setError('Failed to load job descriptions'))
  }, [])

  useEffect(() => {
    if (selectedJdId && !isOthers) {
      setLoading(true)
      getRankedCandidates(selectedJdId)
        .then(res => setCandidates(res.data))
        .catch(() => setCandidates([]))
        .finally(() => setLoading(false))
    }
  }, [selectedJdId, isOthers])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredJds = jobDescriptions.filter(jd =>
    jd.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectJd = (jd) => {
    setSelectedJdId(jd.id)
    setSelectedJdTitle(jd.title)
    setIsOthers(false)
    setCustomRole('')
    setSearchQuery('')
    setShowDropdown(false)
  }

  const handleSelectOthers = () => {
    setIsOthers(true)
    setSelectedJdId('')
    setSelectedJdTitle('Others')
    setSearchQuery('')
    setShowDropdown(false)
  }

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true) }
  const handleDragLeave = () => setIsDragOver(false)
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    setSelectedFiles(Array.from(e.dataTransfer.files))
  }
  const handleFileSelect = (e) => setSelectedFiles(Array.from(e.target.files))

  const handleUpload = async () => {
    if (!selectedFiles.length) return
    if (!selectedJdId && !isOthers) return
    if (isOthers && !customRole.trim()) {
      setError('Please enter a custom role name')
      return
    }

    setUploading(true)
    setError('')

    try {
      let jdId = selectedJdId

      // If Others, create a new JD first
      if (isOthers) {
        const expText = experience ? ` (${experience} years experience)` : ''
        const res = await createJobDescription({
          title: customRole.trim() + expText,
          description: customDescription.trim() ||
            `Looking for a ${customRole.trim()}${expText}. Please evaluate the candidate's relevant skills and experience.`
        })
        jdId = res.data.id
        setJobDescriptions(prev => [...prev, res.data])
        setSelectedJdId(jdId)
        setIsOthers(false)
      }

      await uploadResumes(selectedFiles, jdId)
      const res = await getRankedCandidates(jdId)
      setCandidates(res.data)
      setSelectedFiles([])
    } catch (err) {
      setError('Failed to upload resumes. Please try again.')
    } finally {
      setUploading(false)
    }
  }

 

  const handleDelete = async (resumeId) => {
    if (!window.confirm('Remove this candidate from the list?')) return
    try {
      await deleteResume(resumeId)
      setCandidates(prev => prev.filter(c => c.resumeId !== resumeId))
    } catch {
      setError('Failed to remove candidate.')
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-secondary'
    if (score >= 60) return 'text-primary'
    return 'text-on-surface-variant'
  }

  const experienceOptions = [
    { value: '', label: 'Any Experience' },
    { value: '0', label: 'Fresher (0 years)' },
    { value: '1', label: '1 year' },
    { value: '2', label: '2 years' },
    { value: '3', label: '3 years' },
    { value: '4', label: '4 years' },
    { value: '5', label: '5 years' },
    { value: '6-8', label: '6-8 years' },
    { value: '9-12', label: '9-12 years' },
    { value: '13+', label: '13+ years' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-12">
      <div className="fixed top-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none z-[-1]" />

      <FadeIn>
        <section className="mb-12 md:mb-16">
          <SectionTag className="mb-4">Smart Screening</SectionTag>
          <h2 className="display-section text-primary mb-4">Intelligent Candidate Ranking</h2>
          <p className="text-on-surface-variant text-base md:text-lg max-w-xl font-body leading-relaxed">
            Multi-file resume analysis and AI-driven ranking for your open positions.
          </p>
        </section>
      </FadeIn>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-body">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <FadeIn delay={0.1}>
          <div className="aveon-card p-8 flex flex-col gap-6 h-full">
            {/* Role selector */}
            <div>
              <SectionTag className="mb-4 text-[0.55rem]">Target Role</SectionTag>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="aveon-input w-full text-left flex items-center justify-between"
                >
                  <span className={selectedJdTitle ? 'text-on-surface' : 'text-on-surface-variant/50'}>
                    {selectedJdTitle || 'Select a role...'}
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant">
                    {showDropdown ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-outline-variant/20 rounded-xl shadow-lg z-50 overflow-hidden">
                    {/* Search inside dropdown */}
                    <div className="p-3 border-b border-outline-variant/15">
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                        <input
                          className="aveon-input pl-9 py-2 text-sm"
                          placeholder="Search roles..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Role list */}
                    <div className="max-h-52 overflow-y-auto custom-scrollbar">
                      {filteredJds.length === 0 && (
                        <div className="px-4 py-3 text-sm text-on-surface-variant font-body">
                          No roles found
                        </div>
                      )}
                      {filteredJds.map(jd => (
                        <button
                          key={jd.id}
                          onClick={() => handleSelectJd(jd)}
                          className={`w-full text-left px-4 py-3 text-sm font-body hover:bg-surface-container-low transition-colors ${selectedJdId === jd.id ? 'bg-secondary/10 text-secondary' : 'text-on-surface'}`}
                        >
                          {jd.title}
                        </button>
                      ))}
                      {/* Others option */}
                      <button
                        onClick={handleSelectOthers}
                        className={`w-full text-left px-4 py-3 text-sm font-body hover:bg-surface-container-low transition-colors border-t border-outline-variant/15 ${isOthers ? 'bg-secondary/10 text-secondary' : 'text-on-surface'}`}
                      >
                         Others (Custom Role)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Custom role input when Others selected */}
            {isOthers && (
              <div className="space-y-3">
                <input
                  className="aveon-input"
                  placeholder="Enter role name e.g. Java Trainee"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                />
                <textarea
                  className="aveon-input resize-none text-sm"
                  rows={3}
                  placeholder="Brief job description (optional)"
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                />
              </div>
            )}

            {/* Experience selector */}
            <div>
              <SectionTag className="mb-4 text-[0.55rem]">Experience Required</SectionTag>
              <div className="relative">
                <select
                  className="aveon-input appearance-none cursor-pointer pr-10"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                >
                  {experienceOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed font-body">
              Select a role or create a custom one. Experience level helps calibrate the AI scoring.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2} className="md:col-span-2">
          <div className={`aveon-card p-1 border-dashed transition-all group relative overflow-hidden h-full ${isDragOver ? '!border-secondary bg-secondary/5' : ''}`}>
            <div
              className="h-full w-full rounded-xl flex flex-col items-center justify-center py-12 px-6 cursor-pointer"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="w-16 h-16 rounded-full border border-outline-variant/30 flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-secondary text-3xl">upload_file</span>
              </div>
              <h3 className="font-headline text-2xl mb-2 text-primary">Drop Resumes Here</h3>
              <p className="text-on-surface-variant text-center max-w-xs mb-4 text-sm font-body">
                Support for PDF and Word files. Upload multiple at once.
              </p>
              {selectedFiles.length > 0 && (
                <div className="mb-4 text-sm text-secondary font-body text-center">
                  {selectedFiles.length} file(s) selected
                  <div className="text-xs text-on-surface-variant mt-1">
                    {selectedFiles.map(f => f.name).join(', ')}
                  </div>
                </div>
              )}
              <div className="flex gap-3 flex-wrap justify-center">
                <label className="aveon-btn aveon-btn-outline cursor-pointer">
                  <span className="material-symbols-outlined text-sm">folder_open</span>
                  <span>Select Files</span>
                  <input type="file" multiple accept=".pdf,.docx" className="hidden" onChange={handleFileSelect} />
                </label>
                {selectedFiles.length > 0 && (
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="aveon-btn aveon-btn-primary disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {uploading ? 'hourglass_empty' : 'auto_awesome'}
                    </span>
                    <span>{uploading ? 'Processing...' : 'Upload & Screen'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Results */}
      <div>
        <FadeIn>
          <div className="flex items-end justify-between mb-8 gap-4 pb-4 border-b border-outline-variant/20">
            <div>
              <SectionTag className="mb-3">Results</SectionTag>
              <h3 className="font-headline text-3xl text-primary">Ranked Candidates</h3>
              <p className="text-sm text-on-surface-variant font-body mt-1">
                {candidates.length} candidate(s) ranked
                {selectedJdTitle && ` for "${selectedJdTitle}"`}
                {experience && ` · ${experienceOptions.find(e => e.value === experience)?.label}`}
              </p>
            </div>
          </div>
        </FadeIn>

        {loading ? (
          <div className="text-center py-12 text-on-surface-variant font-body">
            Loading candidates...
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant font-body">
            No candidates yet. Upload resumes to get started.
          </div>
        ) : (
          <div className="space-y-5">
            {candidates
              .filter(c => {
                if (!experience) return true
                // Filter by experience if extracted (basic check)
                return true // LLM handles experience matching in score
              })
              .map((c, i) => (
                <FadeIn key={c.resumeId} delay={i * 0.1}>
                  <div className="glass-card p-6 md:p-8 rounded-2xl hover:translate-y-[-4px] transition-all duration-500">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-secondary text-2xl">person</span>
                        </div>
                        <div>
                          <h4 className="font-headline text-2xl text-primary">{c.candidateName}</h4>
                          <p className="text-sm text-on-surface-variant font-body">{c.candidateEmail}</p>
                          {c.extractedSkills && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {c.extractedSkills.split(',').slice(0, 5).map((skill, idx) => (
                                <span key={idx} className="status-badge !text-[0.55rem]">
                                  {skill.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <div className={`font-headline text-4xl ${getScoreColor(c.relevanceScore)}`}>
                          {c.relevanceScore}
                          <span className="text-sm opacity-60 ml-0.5">%</span>
                        </div>
                        <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest">
                          AI Score
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-outline-variant/15 flex items-center justify-between">
                      <span className={`text-xs font-body px-3 py-1 rounded-full ${c.status === 'DONE' ? 'bg-secondary/10 text-secondary' : 'bg-outline-variant/20 text-on-surface-variant'}`}>
                        {c.status}
                      </span>
                      <button
                        onClick={() => handleDelete(c.resumeId)}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors font-body flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                        Remove
                      </button>
                    </div>
                  </div>
                </FadeIn>
              ))}
          </div>
        )}
      </div>
    </div>
    
  )
}