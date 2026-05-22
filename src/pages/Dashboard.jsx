import { useState } from "react";
import { Link } from "react-router-dom";

export function Dashboard() {
  // ESTADOS
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  
  // Mantive apenas para controle visual da badge na navbar
  const [hasPlan, setHasPlan] = useState(false); 
  const userPlan = hasPlan ? "PRO" : "Gratuito";

  // DADOS DA API
  const recentVideos = [
    {
      id: 1,
      title: "Curiosidades sobre Marte",
      status: "Pronto",
      date: "Hoje, 14:30",
      duration: "01:15",
    },
    {
      id: 2,
      title: "Mistérios do Oceano",
      status: "Processando",
      date: "Hoje, 15:45",
      duration: "--:--",
    },
    {
      id: 3,
      title: "Como funciona a IA",
      status: "Pronto",
      date: "Ontem",
      duration: "02:40",
    },
  ];

  // Filtros
  const readyVideos = recentVideos.filter((video) => video.status === "Pronto");
  const processingVideos = recentVideos.filter((video) => video.status === "Processando").length;

  return (
    <div className="relative min-h-screen bg-[#09090b] text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* EFEITO AMBIENT LIGHT */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-teal-600/10 blur-[120px] pointer-events-none" />

      {/* NAVEGAÇÃO FLUTUANTE */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-6 px-6 py-2.5 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.05] rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-teal-300 tracking-wider">
            NEOFRAME
          </div>
          
          <div className="w-[1px] h-4 bg-white/10" />
          
          <div className="flex items-center gap-4 text-sm font-medium">
            <span
              className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                hasPlan
                  ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-400"
                  : "border-white/10 bg-white/5 text-slate-400"
              }`}
            >
              {userPlan}
            </span>

            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs text-white transition hover:bg-white/10"
            >
              US
            </button>
          </div>
        </div>
      </nav>

      {/* PAYWALL (Agora só abre manualmente pelo perfil) */}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
          <div className="relative w-full max-w-4xl rounded-[2rem] border border-white/10 bg-[#09090b] p-8 shadow-2xl">
            <button
              onClick={() => setShowPaywall(false)}
              className="absolute right-6 top-6 text-slate-500 hover:text-white transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold text-white mb-2 tracking-tight">
                Desbloqueie o NeoFrame
              </h2>
              <p className="text-slate-400 text-sm">
                Escale sua produção com renderização inteligente.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Starter */}
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <h3 className="text-lg font-medium text-white mb-2">Starter</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-white">R$ 47</span>
                  <span className="text-xs text-slate-500">/mês</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-400 mb-6">
                  <li>✓ Upload manual</li>
                  <li>✓ Música automática</li>
                  <li>✓ Introduções</li>
                </ul>
                <button className="w-full rounded-xl bg-white/10 py-2.5 text-sm text-white transition hover:bg-white/20">Assinar</button>
              </div>

              {/* PRO */}
              <div className="relative scale-[1.02] rounded-2xl border border-indigo-500/40 bg-indigo-500/10 p-6 shadow-2xl shadow-indigo-500/10">
                <div className="absolute left-1/2 top-[-10px] -translate-x-1/2 rounded-full bg-indigo-500 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Recomendado
                </div>
                <h3 className="text-lg font-medium text-indigo-300 mb-2">PRO</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-white">R$ 127</span>
                  <span className="text-xs text-indigo-200/50">/mês</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300 mb-6">
                  <li>✓ Tudo do Starter</li>
                  <li>✓ IA automatizada</li>
                  <li>✓ Prioridade de render</li>
                </ul>
                <button className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500">Assinar PRO</button>
              </div>

              {/* SaaS */}
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <h3 className="text-lg font-medium text-white mb-2">SaaS</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-white">R$ 197</span>
                  <span className="text-xs text-slate-500">/mês</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-400 mb-6">
                  <li>✓ API integrada</li>
                  <li>✓ Multi conexões</li>
                  <li>✓ Suporte VIP</li>
                </ul>
                <button className="w-full rounded-xl bg-white/10 py-2.5 text-sm text-white transition hover:bg-white/20">Assinar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <main className="relative z-10 max-w-5xl mx-auto pt-32 pb-20 px-6">
        
        {/* CABEÇALHO */}
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-100 mb-2">
            Bem-vindo de volta.
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            Seu estúdio criativo está pronto. O que vamos gerar hoje?
          </p>
        </header>

        {/* GRID DE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Card Principal: Nova Geração */}
          <div className="md:col-span-2 group relative p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl overflow-hidden hover:bg-white/[0.03] transition-colors">
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
            
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Engine Online
                </div>
                <h2 className="text-2xl font-medium mb-2 text-white">Criar novo vídeo</h2>
                <p className="text-sm text-slate-400 max-w-sm">Suba seu roteiro, áudios e vídeos base. A IA cuida da curadoria e renderização.</p>
              </div>
              
              <div className="mt-8">
                {/* 
                  O botão agora é um Link direto sem bloqueio no frontend. 
                  A verificação de limite ficará para a tela seguinte ou pro backend.
                */}
                <Link to="/upload" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-black font-medium text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  Iniciar Renderização
                </Link>
              </div>
            </div>
          </div>

          {/* Card: Processando */}
          <div className="p-8 rounded-[2rem] bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/10 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Background Tasks
              </div>
              <p className="text-slate-500 text-sm font-medium mb-1">Processando agora</p>
              <p className="text-4xl font-light text-slate-200">
                {processingVideos}
                <span className="text-sm text-slate-500 ml-2 font-normal">vídeos</span>
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-6 leading-relaxed">
              Vídeos aparecerão automaticamente na lista após a conclusão.
            </p>
          </div>
        </div>

        {/* LISTA DE PROJETOS */}
        <section>
          <div className="flex items-center justify-between mb-6 px-2">
            <div>
              <h3 className="text-lg font-medium text-slate-300">Criações Recentes</h3>
              <p className="text-xs text-slate-500 mt-1">Somente vídeos renderizados com sucesso.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {readyVideos.length > 0 ? (
              readyVideos.map((video) => (
                <div key={video.id} className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.01] border border-transparent hover:bg-white/[0.02] hover:border-white/[0.05] transition-all cursor-pointer">
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-white/[0.05] transition-all">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-200 text-sm sm:text-base">{video.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-500">{video.date} • {video.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                      <span className="text-xs text-slate-400 hidden sm:block">Pronto</span>
                    </div>
                    
                    <button className="opacity-0 group-hover:opacity-100 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 text-xs font-medium transition-all hover:bg-indigo-500/20">
                      <span>Baixar MP4</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center px-6 py-12 text-center rounded-2xl bg-white/[0.01] border border-white/[0.02]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.03] text-slate-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </div>
                <h3 className="mb-1 text-sm font-medium text-white">Nenhum vídeo finalizado</h3>
                <p className="text-xs text-slate-500">Inicie uma renderização no card acima.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* SIDEBAR DO PERFIL */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          onClick={() => setIsProfileOpen(false)}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 h-full w-[300px] border-l border-white/[0.05] bg-[#09090b] p-6 shadow-2xl"
          >
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight text-white">
                Sua Conta
              </h2>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="text-slate-500 transition hover:text-white"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="space-y-2">
              <button className="w-full rounded-xl p-3 text-left text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white">
                Editar Perfil
              </button>

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  setShowPaywall(true); // O modal agora só abre por aqui
                }}
                className="flex w-full items-center justify-between rounded-xl p-3 text-left text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                Assinatura e Planos
                {!hasPlan && (
                  <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    Upgrade
                  </span>
                )}
              </button>

              <div className="my-4 h-px bg-white/5" />

              <button className="w-full rounded-xl p-3 text-left text-sm font-medium text-red-400 transition hover:bg-red-500/10">
                Sair da Conta
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}