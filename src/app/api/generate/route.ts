import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { createClient } from "@/utils/supabase/server";

// Define the exact JSON schema requested by the user
const flashcardSchema = z.object({
  term: z.string().describe("Istilah, konsep, atau nama rumus."),
  definition: z.string().describe("Definisi singkat, padat, dan jelas (maksimal 2 kalimat)."),
});

const quizSchema = z.object({
  question: z.string().describe("Pertanyaan ujian."),
  options: z.array(z.string()).length(4).describe("Tepat 4 pilihan jawaban (A, B, C, D)."),
  correct_answer: z.string().describe("Jawaban yang benar (harus sama persis dengan salah satu isi array options)."),
  explanation: z.string().describe("Penjelasan mengapa jawaban tersebut benar dan mengapa jebakan lainnya salah. JANGAN masukkan sitasi ke dalam teks penjelasan ini."),
  source_topic: z.string().describe("Topik spesifik dari materi yang menjadi sumber pertanyaan ini."),
  page_number: z.number().int().describe("Nomor halaman PDF tempat informasi ini ditemukan (berdasarkan penanda seperti '--- PAGE X ---')."),
});

const mindmapSchema = z.object({
  id: z.string().describe("ID unik node (misal: 'node_1')."),
  label: z.string().describe("Nama konsep utama atau sub-konsep."),
  parent_id: z.string().describe("ID dari node induknya. Gunakan 'root' jika ini adalah konsep paling utama."),
  page_number: z.number().int().optional().describe("Nomor halaman PDF tempat konsep mindmap ini banyak dibahas atau diuraikan, (cari berdasarkan penampakan atau penanda topik ini, layaknya '--- PAGE X ---'). Ambil satu yang paling relevan."),
});

const documentSchema = z.object({
  flashcards: z.array(flashcardSchema).describe("Daftar istilah dan definisi penting untuk hafalan cepat."),
  quiz: z.array(quizSchema).describe("Simulasi soal ujian pilihan ganda tingkat kesulitan menengah-sulit."),
  mindmap: z.array(mindmapSchema).describe("Relasi antar konsep untuk divisualisasikan menggunakan React Flow atau Mermaid.js."),
});

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-3.1-flash-lite-preview",
  maxOutputTokens: 8192,
  temperature: 0.2, // Low temp for more deterministic JSON
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  try {
    // Authenticate user securely
    const supabaseServer = await createClient();
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized. Please login first." }, { status: 401 });
    }

    const { title, content, file_url } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    // Force structured output using Zod schema
    const structuredLlm = llm.withStructuredOutput(documentSchema, { name: "study_material" });

    // Format prompt based precisely on user instructions
    const prompt = `
      System Configuration:
      - Role: Kamu adalah backend data engine untuk aplikasi edutech bernama 'kebut-recall'. Tugas utama kamu adalah membaca materi kuliah mentah dan mengekstrak intisarinya menjadi format JSON yang ketat.
      - Tone: Objektif, akademis, ringkas, dan sangat terstruktur.
      - Rules:
        1. DILARANG KERAS menghasilkan teks naratif atau percakapan (seperti 'Berikut adalah rangkumannya...').
        2. OUTPUT HARUS 100% valid JSON.
        3. DILARANG memasukkan referensi (seperti) di dalam teks/string. Gunakan key 'page_number' yang disediakan.
        4. Untuk referensi halaman, gunakan angka dari penanda halaman dokumen (misal dari '--- PAGE 14 ---' ambil angka 14), BUKAN nomor urut 'source'.
        5. Ekstrak hanya konsep paling krusial yang kemungkinan besar keluar di ujian.
        6. Gunakan bahasa Indonesia yang baku dan mudah dipahami mahasiswa.
        7. Minimal 10 flashcard, 15 quiz, dan mindmap yang sangat komprehensif.

      System Instructions:
      Analisis teks materi kuliah yang diberikan oleh user. Buat satu objek JSON utama yang memiliki 3 kunci (keys) array: 'flashcards', 'quiz', dan 'mindmap'. Ikuti skema output dengan presisi absolut.

      MATA KULIAH / JUDUL: ${title}

      [[Teks hasil ekstraksi PDF]]:
      ${content}
    `;

    // Execute LangChain and get strictly typed response
    console.log("Calling Gemini AI...");
    const aiResult = await structuredLlm.invoke(prompt);

    // Filter mindmap nodes to match our display logic (change "root" parent_id back to "" so UI works,
    // or we can adjust UI. Since UI checks for `!n.parent_id`, we map "root" and undefined to "")
    const cleanedMindmap = aiResult.mindmap.map((node) => ({
      ...node,
      parent_id: node.parent_id === "root" || !node.parent_id ? "" : node.parent_id,
    }));

    // Save to Supabase
    console.log("Saving to Supabase for user:", user.id);
    const { data: dbData, error } = await supabaseServer
      .from("study_documents")
      .insert({
        user_id: user.id, // Insert authentic user id mapped from Auth session
        title: title,
        file_url: file_url || null, // <-- Menyimpan referensi file cloudinary
        flashcards: aiResult.flashcards,
        quiz: aiResult.quiz,
        mindmap: cleanedMindmap,
        status: "completed",
      })
      .select("id")
      .single();

    if (error) {
       console.error("Supabase insert error:", error);
       return NextResponse.json({ error: "Failed to save to database: " + error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: dbData.id });

  } catch (err: any) {
    console.error("Error generating material:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

