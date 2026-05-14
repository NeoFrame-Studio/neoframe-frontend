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
  // Pegamos a frase de busca do primeiro item de imagem do tópico
  const currentImageData = currentTopic?.imagens?.[0];

  // Sincroniza o termo de busca quando muda o tópico
  useEffect(() => {
    if (currentImageData?.frase_de_busca) {
      setSearchTerm(currentImageData.frase_de_busca);
      handleSearch(currentImageData.frase_de_busca);
    }
  }, [currentIndex, currentImageData]);

  async function handleSearch(term) {
    if (!term) return;
    setLoading(true);
    try {
      const res = await client.get(`/scraper/search?q=${encodeURIComponent(term)}`);
      
      console.log("DADOS RECEBIDOS DO BACKEND:", res.data);

      // 1. Pega os dados recebidos
      let rawData = res.data;

      // 2. Se o backend mandou uma String, forçamos a conversão para Objeto/Array JavaScript
      if (typeof rawData === "string") {
        try {
          rawData = JSON.parse(rawData);
        } catch (e) {
          console.error("Erro ao fazer o parse do JSON:", e);
        }
      }

      // 3. Garante que estamos pegando o array (caso venha dentro de .urls ou direto na raiz)
      const data = rawData.urls || rawData; 
      
      // 4. Atualiza o estado verificando se realmente é um array
      setImages(Array.isArray(data) ? data : []);
      
    } catch (err) {
      console.error("Erro na busca:", err);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }

  function handleContinue() {
    // Salva a URL escolhida no objeto que será devolvido ao Python
    if (currentImageData) {
      currentImageData.path = selectedUrl;
    }

    if (currentIndex < jobData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedUrl("");
      setImages([]); // Limpa para carregar as próximas
    } else {
      onFinish(jobData);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
      <div className="bg-slate-900 border border-white/10 p-8 rounded-[2rem] shadow-2xl w-full max-w-5xl text-white">
        
        <div className="mb-6 flex justify-between items-end">
           <div>
              <p className="text-blue-400 text-xs font-bold uppercase mb-1">Tópico {currentIndex + 1} de {jobData.length}</p>
              <h2 className="text-xl font-semibold text-slate-200">"{currentImageData?.frase_dita}"</h2>
           </div>
           <p className="text-slate-500 text-sm">ID: {currentTopic?.id || 'N/A'}</p>
        </div>

        <div className="flex gap-2 mb-6">
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-blue-500"
          />
          <button onClick={() => handleSearch(searchTerm)} className="bg-blue-600 px-6 rounded-xl hover:bg-blue-500 transition-all">
            Buscar
          </button>
        </div>

        <div className="min-h-[400px]">
          {loading ? (
            <div className="h-72 flex flex-col items-center justify-center">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
               <p className="text-slate-400">Consultando bancos de imagens...</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {images.length > 0 ? images.map((img, i) => {
                // Resolve o problema de ser String ou Objeto
                const thumb = typeof img === 'string' ? img : img.thumbnail;
                const full = typeof img === 'string' ? img : img.url;

                return (
                  <div 
                    key={i}
                    onClick={() => setSelectedUrl(full)}
                    className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedUrl === full ? 'border-blue-500 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={thumb} className="w-full h-full object-cover" alt="preview" />
                    {selectedUrl === full && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <div className="bg-blue-500 rounded-full p-1">✓</div>
                      </div>
                    )}
                  </div>
                );
              }) : (
                <div className="col-span-3 h-72 flex items-center justify-center border border-dashed border-white/10 rounded-2xl">
                   <p className="text-slate-500">Nenhuma imagem encontrada. Tente outro termo.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end mt-8 pt-6 border-t border-white/5">
          <button 
            disabled={!selectedUrl || loading}
            onClick={handleContinue}
            className={`px-12 py-4 rounded-2xl font-bold transition-all ${
              selectedUrl && !loading ? 'bg-blue-600 hover:bg-blue-500 shadow-lg' : 'bg-slate-800 text-slate-500'
            }`}
          >
            {currentIndex < jobData.length - 1 ? "Próxima Etapa" : "Finalizar Renderização"}
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

  // 🚀 RETOMAR APÓS CURADORIA
  async function finishCuration(updatedJson) {
    setCurationData(null);
    setLoading(true);
    setMsg("Enviando escolhas e iniciando renderização final...");

    try {
      const URLsEscolhidas = updatedJson.map(topic => topic.imagens[0].path);

      // Enviando para a rota que continuará o fluxo
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