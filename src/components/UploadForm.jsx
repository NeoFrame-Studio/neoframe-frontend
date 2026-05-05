import { useState } from "react";
import client from "../api/client";

export default function UploadForm() {
  const [tema, setTema] = useState("");
  const [modo, setModo] = useState("manual");

  const [roteiro, setRoteiro] = useState(null);
  const [intro, setIntro] = useState(null);
  const [transicao, setTransicao] = useState(null);
  const [musica, setMusica] = useState(null);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    console.log("🟢 CLIQUEI NO BOTÃO");
    console.log("🌐 API URL:", import.meta.env.VITE_API_URL);

    try {
      setLoading(true);
      setMsg("Enviando arquivos...");

      // 🔍 DEBUG arquivos
      console.log("📁 FILES:", {
        roteiro,
        intro,
        transicao,
        musica
      });

      const formData = new FormData();
      formData.append("roteiro", roteiro);
      formData.append("intro", intro);
      formData.append("transicao", transicao);
      formData.append("musica", musica);

      // 🚀 UPLOAD
      console.log("⬆️ ENVIANDO /upload...");

      const uploadResponse = await client.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      const caminhos = uploadResponse.data;

      console.log("✅ UPLOAD RESPONSE =", caminhos);

      setMsg("Criando job...");

      // 🚀 JOB
      console.log("📤 CHAMANDO /videos...");

      const jobPayload = {
        caminhos,
        tema,
        modo,
        token: ""
      };

      console.log("📦 PAYLOAD =", jobPayload);

      await client.post("/videos", {
        input: JSON.stringify(jobPayload)
      });

      console.log("✅ JOB ENVIADO COM SUCESSO");

      setMsg("Job enviado com sucesso.");
    } catch (error) {
      console.error("❌ ERRO COMPLETO:", error);

      if (error.response) {
        console.error("📡 STATUS:", error.response.status);
        console.error("📄 DATA:", error.response.data);
      } else {
        console.error("🚫 SEM RESPONSE (CORS ou conexão)");
      }

      setMsg("Erro ao processar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900 p-6 rounded-2xl space-y-4 border border-slate-800"
    >
      <div>
        <label className="block mb-1">Roteiro (.txt)</label>
        <input type="file" onChange={(e) => setRoteiro(e.target.files[0])} />
      </div>

      <div>
        <label className="block mb-1">Intro (.mp4)</label>
        <input type="file" onChange={(e) => setIntro(e.target.files[0])} />
      </div>

      <div>
        <label className="block mb-1">Transição (.gif)</label>
        <input type="file" onChange={(e) => setTransicao(e.target.files[0])} />
      </div>

      <div>
        <label className="block mb-1">Música (.mp3)</label>
        <input type="file" onChange={(e) => setMusica(e.target.files[0])} />
      </div>

      <input
        value={tema}
        onChange={(e) => setTema(e.target.value)}
        placeholder="Tema"
        className="w-full p-3 rounded bg-slate-800"
      />

      <select
        value={modo}
        onChange={(e) => setModo(e.target.value)}
        className="w-full p-3 rounded bg-slate-800"
      >
        <option value="manual">Manual</option>
        <option value="auto">Automático</option>
      </select>

      <button
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-xl font-semibold"
      >
        {loading ? "Processando..." : "Gerar Vídeo"}
      </button>

      {msg && (
        <div className="text-sm text-slate-300 mt-2">
          {msg}
        </div>
      )}
    </form>
  );
}