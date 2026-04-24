import { useState } from 'react'

function App() {
  // State Input Lengkap (DIKUNCI)
  const [nama, setNama] = useState('')
  const [lokasi, setLokasi] = useState('')
  const [email, setEmail] = useState('')
  const [noHp, setNoHp] = useState('')
  const [linkedin, setLinkedin] = useState('')
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
      alert("Isi minimal Nama, Job Requirement, dan Working Experience dulu ya! 😅")
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
      alert("Waduh, ada error nih: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // REGEX PARSER (DIKUNCI)
  const formatCV = (text) => {
    if (!text) return { __html: '' };
    
    let formatted = text
      .replace(/^([A-Z\s]{4,})$/m, '<h1 class="text-2xl font-bold text-center uppercase tracking-widest mb-1">$1</h1>')
      .replace(/^([^|]+\|[^|]+\|[^|]+\|[^|]+)$/m, '<p class="text-sm text-center mb-5 text-slate-800">$1</p>')
      .replace(/## (.*?)\n/g, '<h2 class="text-[15px] font-bold mt-5 mb-2 text-black uppercase tracking-wide bg-slate-100/60 pl-2 py-0.5">$1</h2>\n')
      .replace(/\*\*(.*?)\*\* \| (.*?)\n/g, '<div class="flex justify-between items-baseline mt-3"><span class="font-bold text-[15px] text-black">$1</span><span class="text-sm font-semibold text-black">$2</span></div>\n')
      .replace(/\*(.*?)\* \| \*(.*?)\*\n/g, '<div class="flex justify-between items-baseline mb-1.5"><span class="italic text-[14px] text-slate-900">$1</span><span class="text-[14px] font-medium text-slate-900">$2</span></div>\n')
      .replace(/\*(.*?)\* \| (.*?)\n/g, '<div class="flex justify-between items-baseline mb-1.5"><span class="italic text-[14px] text-slate-900">$1</span><span class="text-[14px] font-medium text-slate-900">$2</span></div>\n')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-black">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-800">$1</em>')
      .replace(/\n- (.*?)/g, '<li class="ml-5 list-disc text-[14.5px] leading-relaxed pl-1 mb-1 text-black">$1</li>')
      .replace(/\n/g, '<br/>');

    return { __html: formatted };
  }

  // FUNGSI PDF SUPER STABIL (DIPERBAIKI)
  const downloadPDF = () => {
    const element = document.getElementById('cv-preview');
    
    if (!window.html2pdf) {
      alert("Library PDF belum siap. Tunggu beberapa detik.");
      return;
    }

    setIsDownloading(true);

    // Filter nama file agar aman
    const safeName = nama ? nama.replace(/[^a-zA-Z0-9]/g, '_') : 'Generated';

    const opt = {
      margin:       0.5,
      filename:     `CV_ATS_${safeName}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      // scrollY: 0 adalah kunci untuk memperbaiki error saat pengguna men-scroll web ke bawah
      html2canvas:  { scale: 2, useCORS: true, scrollY: 0 }, 
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    // Menggunakan format Promise klasik (tanpa await) yang lebih disukai oleh html2pdf
    window.html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        setIsDownloading(false);
      })
      .catch((err) => {
        console.error("Detail Error PDF:", err);
        alert("Gagal memproses PDF.");
        setIsDownloading(false);
      });
  }

  return (
    // UI GLASSMORPHISM & GRADIENT (DIKUNCI)
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 py-12 px-4 sm:px-6 font-sans text-slate-800">
      <div className="max-w-[1400px] mx-auto">
        
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Pro ATS CV Generator
            </span>
            🚀
          </h1>
          <p className="text-lg text-slate-600 font-medium">
            Format identik dengan standar rekrutmen Enterprise (Perbankan & Tech).
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* KOLOM KIRI */}
          <div className="lg:col-span-5 bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50 sticky top-6 overflow-y-auto max-h-[85vh] custom-scrollbar">
            
            <div className="space-y-5">
              {/* Personal Info */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-1">Data Pribadi</h3>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Nama Lengkap" className="p-3 border-2 border-slate-200 rounded-xl text-sm bg-white/80 outline-none focus:ring-2 focus:ring-purple-500" value={nama} onChange={e => setNama(e.target.value)} />
                  <input type="text" placeholder="Lokasi (Cth: Jakarta, ID)" className="p-3 border-2 border-slate-200 rounded-xl text-sm bg-white/80 outline-none focus:ring-2 focus:ring-purple-500" value={lokasi} onChange={e => setLokasi(e.target.value)} />
                  <input type="email" placeholder="Email" className="p-3 border-2 border-slate-200 rounded-xl text-sm bg-white/80 outline-none focus:ring-2 focus:ring-purple-500" value={email} onChange={e => setEmail(e.target.value)} />
                  <input type="text" placeholder="Nomor HP" className="p-3 border-2 border-slate-200 rounded-xl text-sm bg-white/80 outline-none focus:ring-2 focus:ring-purple-500" value={noHp} onChange={e => setNoHp(e.target.value)} />
                  <input type="text" placeholder="Link LinkedIn" className="col-span-2 p-3 border-2 border-slate-200 rounded-xl text-sm bg-white/80 outline-none focus:ring-2 focus:ring-purple-500" value={linkedin} onChange={e => setLinkedin(e.target.value)} />
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-1">Pengalaman & Target</h3>
                <textarea className="w-full p-3 border-2 border-slate-200 rounded-xl h-20 text-sm bg-white/80 outline-none focus:ring-2 focus:ring-purple-500 resize-none" placeholder="Job Requirement (Kriteria Lowongan)" value={jobReq} onChange={e => setJobReq(e.target.value)} />
                <textarea className="w-full p-3 border-2 border-slate-200 rounded-xl h-28 text-sm bg-white/80 outline-none focus:ring-2 focus:ring-purple-500 resize-none" placeholder="Working Experience (Perusahaan, Posisi, Bulan/Tahun, Tugas)" value={workExp} onChange={e => setWorkExp(e.target.value)} />
                <textarea className="w-full p-3 border-2 border-slate-200 rounded-xl h-16 text-sm bg-white/80 outline-none focus:ring-2 focus:ring-purple-500 resize-none" placeholder="Pendidikan Terakhir" value={pendidikan} onChange={e => setPendidikan(e.target.value)} />
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-1">Skills & Projects</h3>
                <input type="text" placeholder="Technical Skills" className="w-full p-3 border-2 border-slate-200 rounded-xl text-sm bg-white/80 outline-none focus:ring-2 focus:ring-purple-500" value={techSkills} onChange={e => setTechSkills(e.target.value)} />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Soft Skills" className="p-3 border-2 border-slate-200 rounded-xl text-sm bg-white/80 outline-none focus:ring-2 focus:ring-purple-500" value={softSkills} onChange={e => setSoftSkills(e.target.value)} />
                  <input type="text" placeholder="Bahasa" className="p-3 border-2 border-slate-200 rounded-xl text-sm bg-white/80 outline-none focus:ring-2 focus:ring-purple-500" value={language} onChange={e => setLanguage(e.target.value)} />
                </div>
                <textarea className="w-full p-3 border-2 border-slate-200 rounded-xl h-16 text-sm bg-white/80 outline-none focus:ring-2 focus:ring-purple-500 resize-none" placeholder="Projects (Opsional)" value={projects} onChange={e => setProjects(e.target.value)} />
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 active:scale-95 flex justify-center items-center gap-3 ${
                  isLoading 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:-translate-y-1'
                }`}
              >
                {isLoading ? '🤖 AI Merakit CV...' : '✨ Generate CV ATS'}
              </button>
            </div>
          </div>

          {/* KOLOM KANAN */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">📄 Preview CV</h2>
              {result && (
                <button 
                  onClick={downloadPDF}
                  disabled={isDownloading}
                  className={`px-6 py-2.5 rounded-xl font-bold text-white flex items-center gap-2 transition-all duration-300 active:scale-95 ${
                    isDownloading 
                    ? 'bg-emerald-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:-translate-y-1'
                  }`}
                >
                  {isDownloading ? '⏳ Mengekspor PDF...' : '📥 Download PDF'}
                </button>
              )}
            </div>
            
            <div className="bg-white p-2 rounded-2xl shadow-2xl border border-slate-200">
              <div 
                id="cv-preview" 
                className="bg-white px-10 py-12 min-h-[800px] text-black"
                style={{ fontFamily: "'Times New Roman', Times, serif" }}
              >
                {result ? (
                  <div dangerouslySetInnerHTML={formatCV(result)} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-[500px] text-slate-400 opacity-60 font-sans">
                    <p className="font-medium text-lg">Lembar CV masih kosong.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Footer (DIKUNCI) */}
        <footer className="mt-16 pb-8 text-center text-slate-500 font-medium">
          <p>
            Dibuat dengan 🔥 dan <span className="text-pink-500">❤️</span>. <br className="sm:hidden" />
            Support by <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-lg ml-1">muyAI</span>
          </p>
        </footer>

      </div>
    </div>
  )
}

export default App;