import { useState, useEffect } from "react";
import client from "../api/client";

// --- COMPONENTE DE CURADORIA (O RETÂNGULO DE VIDRO) ---
function MediaCurator({ jobData, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const currentTopic = jobData[currentIndex];
  const currentImageData = currentTopic?.imagens[0];

  useEffect(() => {
    if (currentImageData) {
      handleSearch(currentImageData.frase_de_busca);
    }
  }, [currentIndex]);

  async function handleSearch(term) {
    setLoading(true);
    setSearchTerm(term);
    try {
      const res = await client.get(`/scraper/search?q=${encodeURIComponent(term)}`);
      setImages(res.data.urls || []); 
    } catch (err) {
      console.error("Erro ao buscar imagens", err);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }

  function handleContinue() {
    currentImageData.path = selectedUrl; 

    if (currentIndex < jobData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedUrl("");
    } else {
      onFinish(jobData);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div 
        style={{ transform: 'scale(0.8)', transformOrigin: 'center' }}
        className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-[2rem] shadow-2xl w-full max-w-4xl text-white"
      >
        
        {/* Cabeçalho */}
        <div className="mb-8 text-center">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-tighter mb-2">
            Passo {currentIndex + 1} de {jobData.length}
          </p>
          <h2 className="text-2xl font-medium leading-relaxed">
            "{currentImageData?.frase_dita}"
          </h2>
        </div>

        {/* Busca */}
        <div className="flex gap-3 mb-8">
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar imagens..."
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button 
            onClick={() => handleSearch(searchTerm)}
            className="bg-white/10 hover:bg-white/20 px-6 rounded-2xl transition-colors"
          >
            Buscar
          </button>
        </div>

        {/* Grid de Imagens */}
        {loading ? (
          <div className="h-72 flex flex-col items-center justify-center space-y-4">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
             <p className="text-white/50 animate-pulse">Buscando as melhores imagens...</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6 mb-10">
            {images.map((url, i) => (
              <div 
                key={i}
                onClick={() => setSelectedUrl(url)}
                className={`group relative aspect-video rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                  selectedUrl === url 
                  ? 'ring-4 ring-blue-500 scale-[1.02] shadow-blue-500/20' 
                  : 'opacity-60 hover:opacity-100 border border-white/5'
                }`}
              >
                <img src={url} alt="opção" className="w-full h-full object-cover" />
                {selectedUrl === url && (
                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center"></div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Rodapé de Ações */}
        <div className="flex justify-between items-center border-t border-white/10 pt-6">
          <button className="px-6 py-4 rounded-2xl text-sm text-white/70 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300">
            Upload Imagem
          </button>
          
          <button 
            disabled={!selectedUrl}
            onClick={handleContinue}
            className={`px-10 py-4 rounded-2xl font-bold transition-all duration-300 ${
              selectedUrl 
              ? 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30' 
              : 'bg-white/5 text-white/20 cursor-not-allowed'
            }`}
          >
            {currentIndex < jobData.length - 1 ? "Próxima Imagem" : "Concluir e Renderizar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL (SEU FORMULÁRIO) ---
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

  const [curationData, setCurationData] = useState(null);

  async function uploadFile(file) {
    const res = await client.post("/s3/upload-url", { fileName: file.name });
    const { url, key } = res.data;
    await fetch(url, { method: "PUT", body: file, headers: { "Content-Type": file.type || "application/octet-stream" } });
    return key;
  }

  function startPolling(id) {
    const interval = setInterval(async () => {
      try {
        const res = await client.get(`/videos/${id}`);
        const job = res.data;

        setProgress(job.progress || 0);
        setStatus(job.status || "");

        if (job.status === "WAITING_CURATION") {
          clearInterval(interval);
          
          if (job.outputUrl) {
            setMsg("Baixando dados do roteiro...");
            const jsonRes = await fetch(job.outputUrl);
            const jsonData = await jsonRes.json();
            
            setLoading(false);
            setMsg("");
            setCurationData(jsonData); 
          } else {
             setMsg("Erro: URL do JSON não encontrada.");
             setLoading(false);
          }
          return;
        }

        if (job.status === "COMPLETED" || job.status === "DONE") {
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
        clearInterval(interval);
        setLoading(false);
        setMsg("Erro ao consultar status.");
      }
    }, 2000);
  }

  // 🚀 RETOMAR APÓS CURADORIA (AJUSTADO APENAS A CHAVE DE ENVIO)
  async function finishCuration(updatedJson) {
    setCurationData(null);
    setLoading(true);
    setMsg("Enviando escolhas e iniciando renderização final...");

    try {
      const URLsEscolhidas = updatedJson.map(topic => topic.imagens[0].path);

      // Enviando para a rota do Java que continuará o fluxo
      await client.post(`/videos/${jobId}/finalize`, { 
        urlsEscolhidas: URLsEscolhidas 
      });
      
      startPolling(jobId);
    } catch (error) {
      setMsg("Erro ao salvar curadoria.");
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setMsg("Enviando arquivos...");
      if (!roteiro || !intro || !transicao || !musica) {
        setMsg("Selecione todos os arquivos!");
        setLoading(false);
        return;
      }
      const [r, i, t, m] = await Promise.all([uploadFile(roteiro), uploadFile(intro), uploadFile(transicao), uploadFile(musica)]);
      const jobPayload = { caminhos: { roteiro: r, intro: i, transicao: t, musica: m }, tema, modo, token: "" };
      const response = await client.post("/videos", { input: JSON.stringify(jobPayload) });
      setJobId(response.data.id);
      startPolling(response.data.id);
      setMsg("Processando vídeo...");
    } catch (error) {
      setMsg("Erro ao processar.");
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      {curationData && (
        <MediaCurator 
          jobData={curationData} 
          onFinish={finishCuration} 
        />
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-2xl space-y-4 border border-slate-800">
        <div><label className="block mb-1 text-slate-400">Roteiro (.txt)</label><input type="file" onChange={(e) => setRoteiro(e.target.files[0])} className="text-sm" /></div>
        <div><label className="block mb-1 text-slate-400">Intro (.mp4)</label><input type="file" onChange={(e) => setIntro(e.target.files[0])} className="text-sm" /></div>
        <div><label className="block mb-1 text-slate-400">Transição (.gif)</label><input type="file" onChange={(e) => setTransicao(e.target.files[0])} className="text-sm" /></div>
        <div><label className="block mb-1 text-slate-400">Música (.mp3)</label><input type="file" onChange={(e) => setMusica(e.target.files[0])} className="text-sm" /></div>
        
        <input value={tema} onChange={(e) => setTema(e.target.value)} placeholder="Tema do Vídeo" className="w-full p-3 rounded bg-slate-800 text-white outline-none focus:ring-2 focus:ring-blue-500" />
        
        <select value={modo} onChange={(e) => setModo(e.target.value)} className="w-full p-3 rounded bg-slate-800 text-white outline-none">
          <option value="manual">Modo Manual (com Curadoria)</option>
          <option value="auto">Modo Automático</option>
        </select>

        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-xl font-bold transition-colors">
          {loading ? "Processando..." : "Gerar Vídeo"}
        </button>

        {msg && <div className="text-sm text-blue-400 text-center mt-2">{msg}</div>}

        {loading && (
          <div className="space-y-2 mt-4">
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-center text-xs text-slate-500">{progress}% - {status}</div>
          </div>
        )}

        {videoUrl && (
          <div className="space-y-4 mt-6">
            <video controls className="w-full rounded-xl border border-white/10" src={videoUrl} />
            <a href={videoUrl} target="_blank" download className="block bg-green-600 hover:bg-green-700 p-3 rounded-xl text-center font-bold">Baixar Resultado</a>
          </div>
        )}
      </form>
    </div>
  );
}