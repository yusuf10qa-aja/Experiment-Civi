import { useState } from 'react'

function App() {
  // Semua State Input
  const [nama, setNama] = useState('')
  const [email, setEmail] = useState('')
  const [noHp, setNoHp] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [lokasi, setLokasi] = useState('')
  const [pendidikan, setPendidikan] = useState('')
  const [jobReq, setJobReq] = useState('')
  const [workExp, setWorkExp] = useState('')
  const [techSkills, setTechSkills] = useState('')
  const [softSkills, setSoftSkills] = useState('')
  const [language, setLanguage] = useState('')
  const [projects, setProjects] = useState('')
  
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleGenerate = async () => {
    if (!jobReq || !workExp || !nama) {
      alert("Mohon isi Nama, Job Requirement, dan Working Experience ya! 🚀")
      return
    }

    setIsLoading(true)
    setResult('')

    try {
      const payload = { nama, email, noHp, linkedin, lokasi, pendidikan, jobReq, workExp, techSkills, softSkills, language, projects }
      
      const response = await fetch("/.netlify/functions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (data.result) {
        setResult(data.result)
      } else {
        throw new Error(data.error || "Gagal membuat CV")
      }
    } catch (error) {
      alert("Error: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // REGEX PARSER: Mengubah Markdown AI jadi Layout Persis PDF Anda
  const formatCV = (text) => {
    if (!text) return { __html: '' };
    
    let formatted = text
      // 1. Nama Utama (Kapital semua di baris pertama)
      .replace(/^([A-Z\s]{4,})$/m, '<h1 class="text-[16pt] font-bold text-center uppercase tracking-widest mb-1">$1</h1>')
      
      // 2. Info Kontak (Lokasi | LinkedIn | HP | Email)
      .replace(/^([^|]+\|[^|]+\|[^|]+\|[^|]+)$/m, '<p class="text-[10pt] text-center mb-4 text-slate-800">$1</p>')
      
      // 3. Section Title (## SUMMARY, ## WORK EXPERIENCE)
      .replace(/## (.*?)\n/g, '<h2 class="text-[11pt] font-bold mt-4 mb-2 text-black uppercase tracking-wide bg-slate-100/50 pl-1">$1</h2>\n')
      
      // 4. Flexbox Kiri Kanan: Perusahaan & Lokasi (Contoh: **PT Budi** | Jakarta)
      .replace(/\*\*(.*?)\*\* \| (.*?)\n/g, '<div class="flex justify-between items-baseline mt-2"><span class="font-bold text-[11pt] text-black">$1</span><span class="text-[10pt] font-semibold text-black">$2</span></div>\n')
      
      // 5. Flexbox Kiri Kanan: Jabatan & Tanggal (Contoh: *QA Engineer* | *Jan 2020 - 2021*)
      .replace(/\*(.*?)\* \| \*(.*?)\*\n/g, '<div class="flex justify-between items-baseline mb-1"><span class="italic text-[10.5pt] text-slate-900">$1</span><span class="text-[10.5pt] font-medium text-slate-900">$2</span></div>\n')
      .replace(/\*(.*?)\* \| (.*?)\n/g, '<div class="flex justify-between items-baseline mb-1"><span class="italic text-[10.5pt] text-slate-900">$1</span><span class="text-[10.5pt] font-medium text-slate-900">$2</span></div>\n')
      
      // 6. Bold & Italic Biasa
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-black">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-800">$1</em>')
      
      // 7. Bullet Points
      .replace(/\n- (.*?)/g, '<li class="ml-5 list-disc text-[10.5pt] leading-relaxed pl-1 mb-0.5 text-black">$1</li>')
      
      // 8. Line Breaks
      .replace(/\n/g, '<br/>');

    return { __html: formatted };
  }

  const downloadPDF = async () => {
    const element = document.getElementById('cv-preview');
    if (!window.html2pdf) return alert("Library PDF sedang dimuat. Mohon tunggu.");
    
    setIsDownloading(true);
    const opt = {
      margin:       [0.6, 0.6, 0.6, 0.6], // Margin atas, kanan, bawah, kiri (dalam inci)
      filename:     `CV_ATS_${nama.replace(/\s+/g, '_') || 'Premium'}.pdf`,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    try {
      await window.html2pdf().set(opt).from(element).save();
    } catch (err) {
      alert("Gagal memproses PDF.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-[1400px] mx-auto">
        
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight mb-3 text-slate-800">
            Expert ATS CV Builder 🚀
          </h1>
          <p className="text-slate-600 font-medium">
            Format 100% identik dengan standar rekrutmen Enterprise (Perbankan & Tech)
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* KOLOM KIRI: FORM SUPER LENGKAP */}
          <div className="lg:col-span-5 space-y-5 bg-white p-6 rounded-2xl shadow-xl border border-slate-200 sticky top-6 overflow-y-auto max-h-[85vh] custom-scrollbar">
            
            {/* Personal Info */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 mb-4 border-b pb-2">PERSONAL INFO</h3>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Nama Lengkap" className="p-3 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500" value={nama} onChange={e => setNama(e.target.value)} />
                <input type="text" placeholder="Lokasi (Cth: Jakarta, ID)" className="p-3 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500" value={lokasi} onChange={e => setLokasi(e.target.value)} />
                <input type="email" placeholder="Email" className="p-3 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="text" placeholder="Nomor HP" className="p-3 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500" value={noHp} onChange={e => setNoHp(e.target.value)} />
                <input type="text" placeholder="LinkedIn URL" className="col-span-2 p-3 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500" value={linkedin} onChange={e => setLinkedin(e.target.value)} />
              </div>
            </div>

            {/* Experience & Target */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 mb-2 border-b pb-2">EXPERIENCE & TARGET</h3>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Target Job Requirement</label>
                <textarea className="w-full p-3 border rounded-lg h-24 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Paste kriteria lowongan di sini..." value={jobReq} onChange={e => setJobReq(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Working Experience</label>
                <textarea className="w-full p-3 border rounded-lg h-32 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Format: Perusahaan, Posisi, Bulan/Tahun, Deskripsi Tugas..." value={workExp} onChange={e => setWorkExp(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Pendidikan Terakhir</label>
                <textarea className="w-full p-3 border rounded-lg h-20 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Format: Universitas, Jurusan, Bulan/Tahun, IPK/Course..." value={pendidikan} onChange={e => setPendidikan(e.target.value)} />
              </div>
            </div>

            {/* Skills & Projects */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
              <h3 className="text-sm font-bold text-slate-800 mb-2 border-b pb-2">SKILLS & PROJECTS</h3>
              <input type="text" placeholder="Technical Skills (Cth: Selenium, JIRA, SQL)" className="w-full p-3 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500" value={techSkills} onChange={e => setTechSkills(e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Soft Skills" className="p-3 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500" value={softSkills} onChange={e => setSoftSkills(e.target.value)} />
                <input type="text" placeholder="Bahasa" className="p-3 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500" value={language} onChange={e => setLanguage(e.target.value)} />
              </div>
              <textarea className="w-full p-3 border rounded-lg h-20 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Projects (Nama Project, Tanggal, Deskripsi, Tools) *Opsional" value={projects} onChange={e => setProjects(e.target.value)} />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-bold text-white text-[15px] transition-all active:scale-95 flex justify-center items-center gap-2 ${
                isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#000000] hover:bg-slate-800 shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? '🤖 AI Merakit Data...' : '✨ Generate Format CV'}
            </button>
          </div>

          {/* KOLOM KANAN: PREVIEW KERTAS A4 */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">📄 Kertas Preview</h2>
              {result && (
                <button 
                  onClick={downloadPDF}
                  disabled={isDownloading}
                  className={`px-6 py-2.5 rounded-lg font-bold text-white flex items-center gap-2 transition-all active:scale-95 ${
                    isDownloading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700 shadow-md'
                  }`}
                >
                  {isDownloading ? '⏳ Mengekspor...' : '📥 Unduh PDF'}
                </button>
              )}
            </div>
            
            {/* Bungkus Kertas A4 */}
            <div className="relative bg-white shadow-2xl flex-grow max-w-[210mm] mx-auto w-full border border-slate-300">
              <div 
                id="cv-preview" 
                className="bg-white px-[40px] py-[50px] min-h-[297mm]"
                style={{ fontFamily: "'Times New Roman', Times, serif" }} // FONT KLASIK RESUME
              >
                {result ? (
                  <div dangerouslySetInnerHTML={formatCV(result)} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-300 mt-40 font-sans">
                    <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    <p className="font-medium">Isi form di kiri, lalu klik Generate.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="mt-16 pb-8 text-center text-slate-500 font-medium">
          <div className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white rounded-full shadow-sm border border-slate-200">
            <span>Dibuat dengan 🔥 & ❤️</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span>Supported by <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FF416C] to-[#FF4B2B] text-lg ml-1 hover:opacity-80 transition-opacity cursor-pointer">muyAI</span></span>
          </div>
        </footer>

      </div>
    </div>
  )
}

export default App;