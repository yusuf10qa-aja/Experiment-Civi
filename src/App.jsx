import { useState } from 'react'

function App() {
  const [jobDesc, setJobDesc] = useState('')
  const [cvText, setCvText] = useState('')
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleGenerate = async () => {
    if (!jobDesc || !cvText) {
      alert("Isi data lowongan dan pengalaman dulu ya, biar AI-nya gak bingung! 😅")
      return
    }

    setIsLoading(true)
    setResult('')

    try {
      const response = await fetch("/.netlify/functions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDesc, cvText }),
      })

      const data = await response.json()
      if (data.result) {
        // Pembersih Super: Hilangkan bintang, pagar, dan link markdown dari AI
        let cleanText = data.result
          .replace(/\*\*/g, '') // Hapus bold
          .replace(/### /g, '') // Hapus header 3
          .replace(/## /g, '')  // Hapus header 2
          .replace(/# /g, '')   // Hapus header 1
          .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1'); // Ubah [Teks](Link) jadi Teks saja

        setResult(cleanText)
      } else {
        throw new Error(data.error || "Gagal membuat CV")
      }
    } catch (error) {
      alert("Waduh, ada error nih: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Fungsi PDF Anti-Gagal (Menggunakan Async/Await)
  const downloadPDF = async () => {
    const element = document.getElementById('cv-preview');
    
    if (!window.html2pdf) {
      alert("Library PDF sedang dimuat. Mohon tunggu beberapa detik dan coba lagi.");
      return;
    }

    setIsDownloading(true);

    const opt = {
      margin:       0.8,
      filename:     'CV_ATS_Premium.pdf',
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    try {
      // Eksekusi PDF secara langsung tanpa chaining promise yang ribet
      await window.html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF Error:", err);
      alert("Gagal memproses PDF. Pastikan browser kamu mendukung fitur ini.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    // Background modern dengan gradient animasi
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 py-12 px-4 sm:px-6 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Kekinian */}
        <header className="text-center mb-14">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              ATS CV Generator
            </span>
            🚀
          </h1>
          <p className="text-lg text-slate-600 font-medium">
            Sulap pengalamanmu jadi CV standar industri yang lolos filter HRD.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Kolom Kiri: Form Input (Glassmorphism Effect) */}
          <div className="lg:col-span-5 space-y-8 bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 relative overflow-hidden">
            {/* Dekorasi blur di background card */}
            <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 z-0"></div>
            
            <div className="relative z-10">
              <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                🎯 Target Lowongan
              </label>
              <textarea 
                className="w-full p-4 border-2 border-slate-200 rounded-2xl h-36 bg-white/80 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all shadow-inner resize-none"
                placeholder="Paste Job Description (kriteria, tanggung jawab) di sini..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
              />
            </div>

            <div className="relative z-10">
              <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                👤 Data Diri & Pengalaman
              </label>
              <textarea 
                className="w-full p-4 border-2 border-slate-200 rounded-2xl h-64 bg-white/80 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all shadow-inner resize-none"
                placeholder="Tulis nama lengkap, kontak, riwayat kerja, skill, dan pendidikanmu..."
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isLoading}
              className={`relative z-10 w-full py-4 rounded-2xl font-bold text-white text-lg transition-all duration-300 active:scale-95 flex justify-center items-center gap-3 ${
                isLoading 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl hover:-translate-y-1'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Merakit CV...
                </>
              ) : '✨ Generate CV ATS'}
            </button>
          </div>

          {/* Kolom Kanan: Preview & Download */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                📄 Preview CV
              </h2>
              {result && (
                <button 
                  onClick={downloadPDF}
                  disabled={isDownloading}
                  className={`px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 transition-all duration-300 active:scale-95 ${
                    isDownloading 
                    ? 'bg-emerald-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl hover:-translate-y-1'
                  }`}
                >
                  {isDownloading ? '⏳ Sedang Menyimpan...' : '📥 Download PDF'}
                </button>
              )}
            </div>
            
            {/* Kertas CV */}
            <div className="relative bg-white p-2 rounded-2xl shadow-2xl border border-slate-200 flex-grow">
              {/* Pembungkus ini yang akan di-print oleh html2pdf */}
              <div 
                id="cv-preview" 
                className="bg-white px-12 py-16 h-full min-h-[800px] text-black leading-relaxed font-serif text-[15px] whitespace-pre-wrap"
              >
                {result ? result : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
                    <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    <p className="font-medium text-lg">Lembar CV masih kosong.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Footer Special Request */}
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