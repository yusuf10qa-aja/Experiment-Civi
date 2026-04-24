import { useState } from 'react'

function App() {
  const [jobDesc, setJobDesc] = useState('')
  const [cvText, setCvText] = useState('')
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false) // State baru untuk loading PDF

  const handleGenerate = async () => {
    if (!jobDesc || !cvText) {
      alert("Isi data lowongan dan pengalaman dulu ya!")
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
        // Membersihkan simbol bintang (**) dari Markdown AI agar lebih rapi
        const cleanText = data.result.replace(/\*\*/g, '');
        setResult(cleanText)
      } else {
        throw new Error(data.error || "Gagal membuat CV")
      }
    } catch (error) {
      alert("Error: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Fungsi PDF yang sudah diperbaiki
  const downloadPDF = () => {
    const element = document.getElementById('cv-preview');
    
    if (!window.html2pdf) {
      alert("Library PDF belum termuat. Pastikan ada koneksi internet dan refresh halaman.");
      return;
    }

    setIsDownloading(true);

    const opt = {
      margin:       0.7,
      filename:     'CV_ATS_Saya.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true }, // useCORS bantu mencegah error render
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    // Proses download dengan notifikasi
    window.html2pdf().from(element).set(opt).save()
      .then(() => {
        setIsDownloading(false);
      })
      .catch(err => {
        console.error(err);
        alert("Gagal membuat PDF. Coba gunakan browser Chrome.");
        setIsDownloading(false);
      });
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-800 mb-2">📄 ATS CV Generator</h1>
          <p className="text-slate-600">Bantu kamu tingkatkan peluang lolos kerja </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Input */}
          <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">TARGET LOWONGAN</label>
              <textarea 
                className="w-full p-4 border border-slate-200 rounded-xl h-32 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Paste deskripsi kerja di sini..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">DATA DIRI & PENGALAMAN</label>
              <textarea 
                className="w-full p-4 border border-slate-200 rounded-xl h-64 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Tulis nama, kontak, pengalaman, skill, dan pendidikan kamu..."
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
              />
            </div>
            <button 
              onClick={handleGenerate}
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all active:scale-95 ${
                isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'
              }`}
            >
              {isLoading ? '🤖 AI Sedang Mempersiapkan CV-mu...' : '✨ Generate CV ATS'}
            </button>
          </div>

          {/* Preview & Download */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">Preview CV</h2>
              {result && (
                <button 
                  onClick={downloadPDF}
                  disabled={isDownloading}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-white flex items-center gap-2 transition-all active:scale-95 ${
                    isDownloading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 shadow-md'
                  }`}
                >
                  {isDownloading ? '⏳ Memproses PDF...' : '📥 Download PDF'}
                </button>
              )}
            </div>
            
            {/* Area CV yang akan diubah jadi PDF */}
            <div 
              id="cv-preview" 
              className="bg-white p-12 shadow-md border border-slate-200 min-h-[700px] text-slate-800 leading-loose font-sans text-[15px] whitespace-pre-wrap"
            >
              {result ? result : <p className="text-slate-400 italic text-center mt-32">Hasil CV akan muncul di sini...</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;