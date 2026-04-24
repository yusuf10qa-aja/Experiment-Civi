import { useState } from 'react'

function App() {
  const [jobDesc, setJobDesc] = useState('')
  const [cvText, setCvText] = useState('')
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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

  // Fungsi sakti untuk download PDF
  const downloadPDF = () => {
    const element = document.getElementById('cv-preview');
    const opt = {
      margin:       1,
      filename:     'CV_ATS_Generated.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    // Memanggil library html2pdf yang kita panggil di index.html nanti
    if (window.html2pdf) {
      window.html2pdf().set(opt).from(element).save();
    } else {
      alert("Library PDF belum siap, tunggu sebentar atau refresh.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📄 ATS CV Generator</h1>
          <p className="text-gray-600">Buat CV standar industri yang lolos filter sistem ATS</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Input */}
          <div className="space-y-6 bg-white p-6 rounded-xl shadow-md">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">INFO LOWONGAN</label>
              <textarea 
                className="w-full p-3 border rounded-lg h-32 bg-gray-50 focus:ring-2 focus:ring-blue-500"
                placeholder="Paste deskripsi kerja di sini..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">DATA DIRI & PENGALAMAN</label>
              <textarea 
                className="w-full p-3 border rounded-lg h-64 bg-gray-50 focus:ring-2 focus:ring-blue-500"
                placeholder="Tulis pengalaman, skill, dan pendidikan kamu..."
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
              />
            </div>
            <button 
              onClick={handleGenerate}
              disabled={isLoading}
              className={`w-full py-4 rounded-lg font-bold text-white transition ${
                isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? '🤖 AI Sedang Menulis...' : '✨ Generate CV ATS'}
            </button>
          </div>

          {/* Preview & Download */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Preview CV</h2>
              {result && (
                <button 
                  onClick={downloadPDF}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 flex items-center gap-2"
                >
                  📥 Download PDF
                </button>
              )}
            </div>
            
            {/* Area CV yang akan diubah jadi PDF */}
            <div 
              id="cv-preview" 
              className="bg-white p-10 shadow-lg border border-gray-200 min-h-[600px] text-gray-800 leading-relaxed font-sans text-sm whitespace-pre-wrap"
            >
              {result ? result : <p className="text-gray-400 italic text-center mt-20">Hasil CV akan muncul di sini...</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App