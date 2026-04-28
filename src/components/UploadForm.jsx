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

    try {
      setLoading(true);
      setMsg("Enviando arquivos...");

      const formData = new FormData();
      formData.append("roteiro", roteiro);
      formData.append("intro", intro);
      formData.append("transicao", transicao);
      formData.append("musica", musica);

      const uploadResponse = await client.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      const caminhos = uploadResponse.data;

      setMsg("Criando job...");

      console.log("UPLOAD RESPONSE =", uploadResponse.data)

        console.log("JOB ENVIADO =", {
        caminhos: uploadResponse.data,
        tema,
        modo
        })

      await client.post("/videos", {
        input: JSON.stringify({
          caminhos,
          tema,
          modo,
          token: ""
        })
      });

      setMsg("Job enviado com sucesso.");
    } catch (error) {
      console.error(error);
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