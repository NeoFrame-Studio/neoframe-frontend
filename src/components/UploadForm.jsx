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

  const [jobId, setJobId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);

  // 🚀 Upload direto S3 (corrigido)
  async function uploadFile(file) {
    console.log("🔑 Pedindo URL assinada para:", file.name);

    const res = await client.post("/s3/upload-url", {
      fileName: file.name
    });

    const { url, key } = res.data;

    console.log("⬆️ Fazendo upload direto:", file.name);

    const uploadRes = await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type || "application/octet-stream"
      }
    });

    if (!uploadRes.ok) {
      throw new Error(`Erro upload: ${uploadRes.status}`);
    }

    console.log("✅ Upload finalizado:", key);

    return key;
  }

  // 📡 POLLING DO JOB
  function startPolling(id) {
    console.log("📡 Iniciando polling:", id);

    const interval = setInterval(async () => {
      try {
        const res = await client.get(`/videos/${id}`);
        const job = res.data;

        console.log("📦 UPDATE JOB:", job);

        setProgress(job.progress || 0);
        setStatus(job.status || "");

        if (job.status === "DONE") {
          clearInterval(interval);
          setLoading(false);
          setMsg("Vídeo pronto!");
          setVideoUrl(job.outputUrl);
        }

        if (job.status === "ERROR") {
          clearInterval(interval);
          setLoading(false);
          setMsg("Erro ao gerar vídeo.");
        }

      } catch (err) {
        console.error("❌ ERRO POLLING:", err);
        clearInterval(interval);
        setLoading(false);
        setMsg("Erro ao consultar status.");
      }
    }, 2000);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    console.log("🟢 CLIQUEI NO BOTÃO");

    try {
      setLoading(true);
      setMsg("Enviando arquivos...");

      if (!roteiro || !intro || !transicao || !musica) {
        setMsg("Selecione todos os arquivos!");
        setLoading(false);
        return;
      }

      // 🚀 uploads paralelos
      const [roteiroPath, introPath, transicaoPath, musicaPath] =
        await Promise.all([
          uploadFile(roteiro),
          uploadFile(intro),
          uploadFile(transicao),
          uploadFile(musica)
        ]);

      const caminhos = {
        roteiro: roteiroPath,
        intro: introPath,
        transicao: transicaoPath,
        musica: musicaPath
      };

      console.log("📦 CAMINHOS =", caminhos);

      setMsg("Criando job...");

      const jobPayload = {
        caminhos,
        tema,
        modo,
        token: ""
      };

      const response = await client.post("/videos", {
        input: JSON.stringify(jobPayload)
      });

      const createdJobId = response.data.id;

      console.log("🆔 JOB ID:", createdJobId);

      setJobId(createdJobId);

      startPolling(createdJobId);

      setMsg("Processando vídeo...");

    } catch (error) {
      console.error("❌ ERRO COMPLETO:", error);
      setMsg("Erro ao processar.");
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

      {loading && (
        <div className="space-y-2 mt-4">
          <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="text-sm text-slate-300">
            {progress}% - {status}
          </div>
        </div>
      )}

      {videoUrl && (
        <div className="space-y-4 mt-6">
          <video
            controls
            className="w-full rounded-xl"
            src={videoUrl}
          />

          <a
            href={videoUrl}
            target="_blank"
            download
            className="block bg-green-600 hover:bg-green-700 p-3 rounded-xl text-center font-semibold"
          >
            Baixar Vídeo
          </a>
        </div>
      )}
    </form>
  );
}