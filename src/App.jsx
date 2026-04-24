import { useState } from 'react'

function App() {
  const [jobDesc, setJobDesc] = useState('')
  const [cvText, setCvText] = useState('')
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    // 1. Validasi Input
    if (!jobDesc || !cvText) {
      alert("Waduh, tolong isi Job Description dan CV/Pengalaman kamu dulu ya!")
      return
    }

    setIsLoading(true)
    setResult('')

    try {
      // 2. Memanggil Backend Netlify Function (generate.mjs)
      // Jalur ini akan bekerja jika kamu menjalankan: netlify dev
      const response = await fetch("/.netlify/functions/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobDesc, cvText }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal memanggil AI")
      }

      const data = await response.json()
      
      // 3. Menampilkan hasil
      if (data.result) {
        setResult(data.result)
      } else {
        setResult("AI tidak memberikan respon. Coba ulangi lagi.")
      }

    } catch (error) {
      console.error("Error detail:", error)
      setResult("Yah, ada error nih: " + error.message + ". Pastikan kamu menjalankan server dengan perintah 'netlify dev' dan bukan 'npm run dev'.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result)
    alert("Cover Letter berhasil disalin!")
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            🚀 AI <span className="text-blue-600">Cover Letter</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Gak usah pusing mikirin kata-kata. Masukkan info lowongan, 
            biar Llama-3 yang rakit surat lamaranmu dalam hitungan detik.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Kolom Kiri: Form Input */}
          <div className="space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                🎯 Deskripsi Pekerjaan
              </label>
              <textarea 
                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none bg-slate-50"
                rows="5"
                placeholder="Paste syarat & tanggung jawab pekerjaan di sini..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                👤 Pengalaman / Skill Kamu
              </label>
              <textarea 
                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none bg-slate-50"
                rows="8"
                placeholder="Paste ringkasan CV atau pengalaman kerjamu di sini..."
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
              ></textarea>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg transform transition-all active:scale-95 ${
                isLoading 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sedang Merakit Surat...
                </span>
              ) : '✨ Generate Surat Lamaran'}
            </button>
          </div>

          {/* Kolom Kanan: Output AI */}
          <div className="flex flex-col h-full bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider">📝 Hasil Surat</h2>
              {result && (
                <button 
                  onClick={copyToClipboard}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Salin Teks
                </button>
              )}
            </div>
            
            <div className="flex-grow p-6 bg-slate-50 border border-slate-200 rounded-xl overflow-y-auto whitespace-pre-wrap text-slate-700 leading-relaxed font-serif italic shadow-inner min-h-[400px]">
              {result ? result : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 2v4a2 2 0 002 2h4"></path>
                  </svg>
                  <p>Isi data di sebelah kiri dulu, lalu klik tombol.</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-400 text-sm">
          Built with ⚡ Speed by Cerebras Llama-3 • Vibe Coding Edition
        </footer>

      </div>
    </div>
  )
};

export default App;