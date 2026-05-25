import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Importado para fazer a navegação
import client from "../api/client";

// --- COMPONENTE DE CURADORIA (O RETÂNGULO DE VIDRO) - INTACTO ---
function MediaCurator({ jobData, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const currentTopic = jobData[currentIndex];
  const currentImageData = currentTopic?.imagens?.[0];

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

      let rawData = res.data;

      if (typeof rawData === "string") {
        try {
          rawData = JSON.parse(rawData);
        } catch (e) {
          console.error("Erro ao fazer o parse do JSON:", e);
        }
      }

      const data = rawData.urls || rawData; 
      
      setImages(Array.isArray(data) ? data : []);
      
    } catch (err) {
      console.error("Erro na busca:", err);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }

  function handleContinue() {
    if (currentImageData) {
      currentImageData.path = selectedUrl;
    }

    if (currentIndex < jobData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedUrl("");
      setImages([]); 
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

// --- COMPONENTES AUXILIARES DE UI PARA O FORMULÁRIO ---
function FileInputDropzone({ label, accept, file, setFile, icon }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-400 px-1">{label}</label>
      <div className="relative group">
        <input 
          type="file" 
          accept={accept} 
          onChange={(e) => setFile(e.target.files[0])} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
        />
        <div className={`flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all ${
          file 
            ? 'bg-indigo-500/10 border-indigo-500/30' 
            : 'bg-white/[0.02] border-white/[0.05] group-hover:bg-white/[0.04] group-hover:border-white/[0.1]'
        }`}>
          <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${
            file ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/[0.05] text-slate-500'
          }`}>
            {icon}
          </div>
          <div className="flex flex-col truncate">
            {file ? (
              <>
                <span className="text-sm font-medium text-indigo-300 truncate">{file.name}</span>
                <span className="text-xs text-indigo-400/70">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </>
            ) : (
              <>
                <span className="text-sm font-medium text-slate-300">Selecionar arquivo</span>
                <span className="text-xs text-slate-500">Formatos: {accept}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL ---
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

  async function uploadFile(file, uploadUrl) {
    if (!uploadUrl) {
      throw new Error("URL de upload não fornecida.");
    }

    // Deixamos o fetch gerenciar o body sem forçar headers complexos
    // que possam quebrar a assinatura estrita do token do Supabase
    const response = await fetch(uploadUrl, { 
      method: "PUT", 
      body: file,
      headers: {
        // Forçar 'multipart/form-data' ou remover o header resolve o 400 do Supabase
        "Content-Type": file.type || "application/octet-stream"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Falha no upload do Supabase: ${response.status} - ${errorText}`);
    }
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

  async function finishCuration(updatedJson) {
    setCurationData(null);
    setLoading(true);
    setMsg("Enviando escolhas e iniciando renderização final...");

    try {
      const URLsEscolhidas = updatedJson.map(topic => topic.imagens[0].path);

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

      // PASSO A: Faz UM ÚNICO POST para pegar as 4 URLs do lote
      const resUrls = await client.post('/storage/upload-urls', { 
        fileTypes: ["script", "background_music", "intro_video", "transition_video"] 
      });

      const urlsDoSupabase = resUrls.data;

      // PASSO B: Envia os 4 arquivos em paralelo, cada um para a sua respectiva 'uploadUrl'
      await Promise.all([
        uploadFile(roteiro, urlsDoSupabase.script?.uploadUrl),
        uploadFile(intro, urlsDoSupabase.intro_video?.uploadUrl),
        uploadFile(transicao, urlsDoSupabase.transition_video?.uploadUrl),
        uploadFile(musica, urlsDoSupabase.background_music?.uploadUrl)
      ]);

      // PASSO C: Monta o payload para o Python/Core usando a 'finalUrl' (Link público do arquivo)
      const jobPayload = { 
        caminhos: { 
          roteiro: urlsDoSupabase.script?.finalUrl, 
          intro: urlsDoSupabase.intro_video?.finalUrl, 
          transicao: urlsDoSupabase.transition_video?.finalUrl, 
          musica: urlsDoSupabase.background_music?.finalUrl 
        }, 
        tema, 
        modo, 
        token: "" 
      };

      // CORREÇÃO: Envia o payload puro, sem envelopar em string
      const response = await client.post("/videos/jobs", jobPayload);

      const realJobId = response.data.jobId; 
      setJobId(realJobId);
      startPolling(realJobId);
      setMsg("Processando vídeo...");

    } catch (error) {
      console.error("Erro no fluxo de upload:", error);
      setMsg("Erro ao processar o upload dos arquivos.");
      setLoading(false);
    }
  }

  return (
    // Ajustado o padding top (pt-32) para dar espaço à navegação flutuante
    <div className="relative min-h-screen bg-[#09090b] text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30 pt-32 pb-20 px-6">
      
      {/* EFEITO AMBIENT LIGHT / LIQUID GLASS */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-teal-600/10 blur-[120px] pointer-events-none" />

      {/* NAVEGAÇÃO FLUTUANTE PADRÃO NEOFRAME */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-6 px-6 py-3 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.05] rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <Link to="/dashboard" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-teal-300 tracking-wider hover:opacity-80 transition-opacity">
            NEOFRAME
          </Link>
          <div className="w-[1px] h-4 bg-white/10" />
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors group"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Voltar ao Studio
          </Link>
        </div>
      </nav>

      {/* MODAL DE CURADORIA */}
      {curationData && (
        <MediaCurator 
          jobData={curationData} 
          onFinish={finishCuration} 
        />
      )}

      {/* ÁREA CENTRAL DO FORMULÁRIO */}
      <div className="relative z-10 max-w-3xl mx-auto">
        
        {/* Cabeçalho */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-100 mb-3">
            Setup da Renderização
          </h1>
          <p className="text-slate-400">Faça o upload dos 4 arquivos base e configure a engine.</p>
        </header>

        {/* Card Glass Principal */}
        <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl shadow-2xl">
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            
            {/* Grid de Uploads (2 colunas em telas maiores) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <FileInputDropzone 
                label="1. Roteiro" 
                accept=".txt" 
                file={roteiro} 
                setFile={setRoteiro} 
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>}
              />

              <FileInputDropzone 
                label="2. Música de Fundo" 
                accept="audio/mpeg" 
                file={musica} 
                setFile={setMusica} 
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>}
              />

              <FileInputDropzone 
                label="3. Vídeo de Introdução" 
                accept="video/mp4" 
                file={intro} 
                setFile={setIntro} 
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>}
              />

              <FileInputDropzone 
                label="4. Vídeo de Transição" 
                accept="video/mp4, image/gif" 
                file={transicao} 
                setFile={setTransicao} 
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>}
              />

            </div>

            <div className="w-full h-[1px] bg-white/[0.05]" />

            {/* Configurações Extras (Tema e Modo) */}
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2 px-1">Tema / Contexto do Vídeo</label>
                <input 
                  value={tema} 
                  onChange={(e) => setTema(e.target.value)} 
                  placeholder="Ex: Curiosidades sobre Marte" 
                  className="w-full px-5 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] focus:border-indigo-500/50 focus:bg-white/[0.05] text-slate-200 outline-none transition-all placeholder:text-slate-600" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2 px-1">Workflow da IA</label>
                <div className="relative">
                  <select 
                    value={modo} 
                    onChange={(e) => setModo(e.target.value)} 
                    className="w-full px-5 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] focus:border-indigo-500/50 focus:bg-white/[0.05] text-slate-200 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="manual" className="bg-slate-900 text-slate-200">Modo Manual (Curadoria no Meio do Processo)</option>
                    <option value="auto" className="bg-slate-900 text-slate-200">Modo Automático (A IA decide tudo)</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Mensagens de Feedback */}
            {msg && (
              <div className={`p-4 rounded-2xl border text-sm flex items-center gap-3 ${
                msg.includes("Erro") 
                  ? "bg-red-500/10 border-red-500/20 text-red-400" 
                  : "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
              }`}>
                {loading && !msg.includes("Erro") && (
                  <div className="w-4 h-4 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
                )}
                <span>{msg}</span>
              </div>
            )}

            {/* Barra de Progresso Glass */}
            {loading && (
              <div className="space-y-3 p-5 rounded-2xl bg-white/[0.01] border border-white/[0.03]">
                <div className="flex justify-between text-xs font-medium text-slate-400">
                  <span>{status || 'Iniciando...'}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-teal-400 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              </div>
            )}

            {/* Botão de Submit */}
            <button 
              type="submit"
              disabled={loading} 
              className="mt-2 w-full flex items-center justify-center px-6 py-4 rounded-full bg-white text-black font-medium hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {loading ? "Renderização em Andamento..." : "Iniciar Pipeline"}
            </button>

            {/* Resultado Final (Download) */}
            {videoUrl && (
              <div className="mt-4 p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/20 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center gap-3 text-indigo-300 font-medium px-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  Renderização Concluída
                </div>
                
                <video 
                  controls 
                  className="w-full rounded-2xl border border-white/10 shadow-2xl bg-black" 
                  src={videoUrl} 
                />
                
                <a 
                  href={videoUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  download 
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors shadow-lg"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Baixar Arquivo Final
                </a>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}