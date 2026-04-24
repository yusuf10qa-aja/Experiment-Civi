export const handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };

  try {
    const data = JSON.parse(event.body);
    const { nama, email, noHp, linkedin, lokasi, pendidikan, jobReq, workExp, techSkills, softSkills, language, projects } = data;

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
            content: `Kamu adalah Senior HR & AI Resume Writer. Buatkan CV ATS-Friendly dengan struktur SANGAT KAKU meniru format di bawah ini. JANGAN ubah simbol asterisk (*) atau pipa (|) karena itu digunakan untuk formatting UI.

FORMAT WAJIB:
[NAMA LENGKAP KAPITAL]
[Lokasi] | [LinkedIn] | [No HP] | [Email]

## SUMMARY
[1 Paragraf padat bahasa Inggris/Indonesia merangkum pengalaman yang disesuaikan dengan Target Job]

## WORK EXPERIENCE
**[Nama Perusahaan]** | [Lokasi/Kota]
*[Jabatan] - [Tipe (Fulltime/Internship)]* | *[Bulan Tahun - Bulan Tahun]*
- [Gunakan bullet points. Fokus pada pencapaian metrik/angka]
- [Gunakan action verbs]

## EDUCATION
**[Nama Kampus]** | [Lokasi]
*[Gelar - Jurusan]* | *[Bulan Tahun - Bulan Tahun]*
- [IPK atau course relevan]

## SKILLS, INTERESTS, & LANGUAGES
**Technical Skills:** [Isi Technical Skills]
**Soft Skills:** [Isi Soft Skills]
**Interests:** [Bidang interest pekerjaan]
**Language:** [Isi Bahasa]

## PROJECTS
**[Nama Project]** | *[Bulan Tahun - Bulan Tahun]*
Details: [Deskripsi project]
Tools: [Tools yang digunakan]

JANGAN berikan teks pembuka/penutup. Langsung berikan isi CV.` 
          },
          { 
            role: "user", 
            content: `DATA KANDIDAT:
Nama: ${nama}
Email: ${email}
No HP: ${noHp}
LinkedIn: ${linkedin}
Lokasi: ${lokasi}
Pendidikan: ${pendidikan}
Pengalaman Kerja: ${workExp}
Technical Skills: ${techSkills}
Soft Skills: ${softSkills}
Language: ${language}
Projects: ${projects}

TARGET JOB REQUIREMENT:
${jobReq}

Tolong buatkan CV-nya sekarang!` 
          }
        ],
        temperature: 0.3 // Sangat rendah agar formatnya tidak meleset
      })
    });

    const apiData = await response.json();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result: apiData.choices[0].message.content })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};