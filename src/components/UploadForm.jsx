import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";

// --- COMPONENTE DE CURADORIA ---
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
      const VITE_PYTHON_SEARCH_IMAGE_API =
        import.meta.env.VITE_PYTHON_SEARCH_IMAGE_API;

      const res = await axios.get(
        `${VITE_PYTHON_SEARCH_IMAGE_API}?q=${encodeURIComponent(term)}`
      );

      console.log("DADOS RECEBIDOS DO BACKEND:", res.data);

      let rawData = res.data;

      if (typeof rawData === "string") {
        try {
          rawData = JSON.parse(rawData);
        } catch (e) {
          console.error("Erro ao fazer parse do JSON:", e);
        }
      }

      const data = rawData.results || rawData.urls || rawData;

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
      setCurrentIndex((prev) => prev + 1);
      setSelectedUrl("");
      setImages([]);
    } else {
      onFinish(jobData);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-xl p-4">
      <div
        className="
          relative
          overflow-hidden
          bg-white/[0.04]
          border border-white/[0.08]
          p-8
          rounded-[2rem]
          shadow-[0_8px_32px_rgba(0,0,0,0.35)]
          w-full
          max-w-5xl
          text-white
          backdrop-blur-3xl
          backdrop-saturate-150
        "
      >
        <div className="mb-6 flex justify-between items-end">
          <div>
            <p className="text-blue-400 text-xs font-bold uppercase mb-1">
              Tópico {currentIndex + 1} de {jobData.length}
            </p>

            <h2 className="text-xl font-semibold text-slate-200">
              "{currentImageData?.frase_dita}"
            </h2>
          </div>

          <p className="text-slate-500 text-sm">
            ID: {currentTopic?.id || "N/A"}
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-blue-500"
          />

          <button
            onClick={() => handleSearch(searchTerm)}
            className="bg-blue-600 px-6 rounded-xl hover:bg-blue-500 transition-all"
          >
            Buscar
          </button>
        </div>

        <div className="min-h-[400px]">
          {loading ? (
            <div className="h-72 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>

              <p className="text-slate-400">
                Consultando bancos de imagens...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {images.length > 0 ? (
                images.map((img, i) => {
                  const thumb =
                    typeof img === "string" ? img : img.thumbnail;

                  const full =
                    typeof img === "string" ? img : img.url;

                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedUrl(full)}
                      className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        selectedUrl === full
                          ? "border-blue-500 scale-95"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={thumb}
                        className="w-full h-full object-cover"
                        alt="preview"
                      />

                      {selectedUrl === full && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                          <div className="bg-blue-500 rounded-full p-1">
                            ✓
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="col-span-3 h-72 flex items-center justify-center border border-dashed border-white/10 rounded-2xl">
                  <p className="text-slate-500">
                    Nenhuma imagem encontrada.
                  </p>
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
              selectedUrl && !loading
                ? "bg-blue-600 hover:bg-blue-500 shadow-lg"
                : "bg-slate-800 text-slate-500"
            }`}
          >
            {currentIndex < jobData.length - 1
              ? "Próxima Etapa"
              : "Finalizar Renderização"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- DROPZONE ---
function FileInputDropzone({
  label,
  accept,
  file,
  setFile,
  icon,
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-400 px-1">
        {label}
      </label>

      <div className="relative group">
        <input
          type="file"
          accept={accept}
          onChange={(e) => setFile(e.target.files[0])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        <div
          className={`flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all ${
            file
              ? "bg-indigo-500/10 border-indigo-500/30"
              : "bg-white/[0.02] border-white/[0.05]"
          }`}
        >
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-xl ${
              file
                ? "bg-indigo-500/20 text-indigo-400"
                : "bg-white/[0.05] text-slate-500"
            }`}
          >
            {icon}
          </div>

          <div className="flex flex-col truncate">
            {file ? (
              <>
                <span className="text-sm font-medium text-indigo-300 truncate">
                  {file.name}
                </span>

                <span className="text-xs text-indigo-400/70">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </>
            ) : (
              <>
                <span className="text-sm font-medium text-slate-300">
                  Selecionar arquivo
                </span>

                <span className="text-xs text-slate-500">
                  Formatos: {accept}
                </span>
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

  // =========================================================
  // NOVA LÓGICA ANTI-RACE CONDITION
  // =========================================================

  const isFinalizingRef = useRef(false);
  const pollingTimerRef = useRef(null);

  // =========================================================

  async function uploadFile(file, uploadUrl) {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type":
          file.type || "application/octet-stream",
      },
    });

    if (!response.ok) {
      throw new Error("Falha no upload");
    }
  }

  // =========================================================
  // POLLING RECURSIVO
  // =========================================================

  const pollJobStatus = async (currentJobId) => {
    if (isFinalizingRef.current) return;

    try {
      const response = await client.get(
        `/api/v1/videos/${currentJobId}`
      );

      const job = response.data;

      if (isFinalizingRef.current) return;

      setProgress(job.progress || 0);
      setStatus(job.status || "");

      if (job.status === "WAITING_CURATION") {
        setLoading(false);
        setCurationData(job);
        return;
      }

      if (
        job.status === "COMPLETED" ||
        job.status === "DONE"
      ) {
        setLoading(false);
        setMsg("Vídeo pronto!");
        setVideoUrl(job.outputUrl);
        return;
      }

      if (job.status === "ERROR") {
        setLoading(false);
        setMsg("Erro ao gerar vídeo.");
        return;
      }

      pollingTimerRef.current = setTimeout(() => {
        pollJobStatus(currentJobId);
      }, 3000);
    } catch (error) {
      console.error("Erro no polling:", error);
    }
  };

  // =========================================================
  // FINALIZAÇÃO SEGURA
  // =========================================================

  async function finishCuration(updatedJson) {
    try {
      isFinalizingRef.current = true;

      if (pollingTimerRef.current) {
        clearTimeout(pollingTimerRef.current);
      }

      setCurationData(null);

      await client.post(
        `/api/v1/videos/${jobId}/finalize`,
        updatedJson
      );

      setMsg("Renderização final iniciada...");
      setLoading(true);

      isFinalizingRef.current = false;

      pollJobStatus(jobId);
    } catch (err) {
      console.error("Falha ao finalizar curadoria:", err);

      isFinalizingRef.current = false;

      alert("Erro ao enviar dados.");
    }
  }

  // =========================================================

  useEffect(() => {
    return () => {
      if (pollingTimerRef.current) {
        clearTimeout(pollingTimerRef.current);
      }
    };
  }, []);

  // =========================================================

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setMsg("Enviando arquivos...");

      const resUrls = await client.post(
        "/storage/upload-urls",
        {
          fileTypes: [
            "script",
            "background_music",
            "intro_video",
            "transition_video",
          ],
        }
      );

      const urlsDoSupabase = resUrls.data;

      await Promise.all([
        uploadFile(
          roteiro,
          urlsDoSupabase.script?.uploadUrl
        ),

        uploadFile(
          intro,
          urlsDoSupabase.intro_video?.uploadUrl
        ),

        uploadFile(
          transicao,
          urlsDoSupabase.transition_video?.uploadUrl
        ),

        uploadFile(
          musica,
          urlsDoSupabase.background_music?.uploadUrl
        ),
      ]);

      const jobPayload = {
        caminhos: {
          roteiro: urlsDoSupabase.script?.finalUrl,
          intro: urlsDoSupabase.intro_video?.finalUrl,
          transicao:
            urlsDoSupabase.transition_video?.finalUrl,
          musica:
            urlsDoSupabase.background_music?.finalUrl,
        },

        tema,
        modo,
        token: "",
      };

      const response = await client.post(
        "/videos/jobs",
        jobPayload
      );

      const realJobId = response.data.jobId;

      setJobId(realJobId);

      pollJobStatus(realJobId);

      setMsg("Processando vídeo...");
    } catch (error) {
      console.error(error);

      setLoading(false);

      setMsg("Erro ao processar upload.");
    }
  }

  return (
    <div className="relative min-h-screen bg-[#09090b] text-slate-200">
      {curationData && (
        <MediaCurator
          jobData={curationData}
          onFinish={finishCuration}
        />
      )}

      {/* RESTANTE DO JSX CONTINUA IGUAL */}
    </div>
  );
}