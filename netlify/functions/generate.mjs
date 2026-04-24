export const handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const { jobDesc, cvText } = JSON.parse(event.body);

    const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.API_KEY_LLAMA}`
      },
      body: JSON.stringify({
        model: "llama3.1-8b",
        messages: [
          { 
            role: "system", 
            content: `Kamu adalah pakar HR dan ATS (Applicant Tracking System). 
            Buatkan Curriculum Vitae (CV) yang ATS-Friendly dalam Bahasa Indonesia. 
            Format harus bersih menggunakan Markdown: 
            - Nama Lengkap (Paling Atas, Bold)
            - Kontak (Email, LinkedIn, Lokasi)
            - Ringkasan Profesional (3-4 baris)
            - Pengalaman Kerja (Urutan waktu terbalik, gunakan bullet points untuk pencapaian)
            - Pendidikan
            - Skill Utama (relevan dengan Job Description)
            Jangan berikan teks pembuka AI, langsung berikan isi CV-nya saja.` 
          },
          { 
            role: "user", 
            content: `TARGET LOWONGAN:\n${jobDesc}\n\nDATA DIRI/PENGALAMAN SAYA:\n${cvText}` 
          }
        ],
        temperature: 0.5 // Lebih rendah agar formatnya lebih konsisten/kaku
      })
    });

    const data = await response.json();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result: data.choices[0].message.content })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};