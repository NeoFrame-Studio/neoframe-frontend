import { useState } from 'react';
import client from '../api/client';
import { uploadToS3 } from '../services/uploadService';

export function Dashboard() {
  const [urls, setUrls] = useState({ scriptUrl: '', bgMusicUrl: '', introUrl: '', transitionUrl: '' });
  const [uploading, setUploading] = useState({ script: false, music: false, intro: false, transition: false });
  const [status, setStatus] = useState('');

  // Função genérica para lidar com a seleção e upload do arquivo
  const handleFileUpload = async (event, fieldName, typeKey) => {
    const file = event.target.files[0];
    if (!file) return;

    // Ativa o estado de "carregando" apenas para este botão
    setUploading(prev => ({ ...prev, [typeKey]: true }));
    setStatus(`Fazendo upload de ${file.name}...`);

    try {
      const finalUrl = await uploadToS3(file, typeKey);
      
      // Salva a URL retornada no estado do formulário
      setUrls(prev => ({ ...prev, [fieldName]: finalUrl }));
      setStatus(`✅ Upload de ${file.name} concluído!`);
    } catch (error) {
      setStatus(`❌ Erro no upload: ${error.message}`);
    } finally {
      setUploading(prev => ({ ...prev, [typeKey]: false }));
    }
  };

  const handleSubmitJob = async (e) => {
    e.preventDefault();
    if (!urls.scriptUrl || !urls.bgMusicUrl || !urls.introUrl || !urls.transitionUrl) {
      setStatus('⚠️ Aguarde o upload de todos os 4 arquivos antes de enviar.');
      return;
    }

    setStatus('🚀 Enviando para a fila de renderização...');
    try {
      const response = await api.post('/videos', urls);
      setStatus(`✅ Sucesso! Job criado na fila. ID: ${response.data.jobId}`);
      setUrls({ scriptUrl: '', bgMusicUrl: '', introUrl: '', transitionUrl: '' }); // Reseta
    } catch (err) {
      setStatus(`❌ Erro ao criar o vídeo: ${err.response?.data?.error || 'Falha na requisição.'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Novo Vídeo (Starter)</h1>
        <p className="text-gray-400 mb-8">Faça o upload dos 4 arquivos obrigatórios.</p>

        <form onSubmit={handleSubmitJob} className="flex flex-col gap-6">
          
          {/* 1. Roteiro */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-blue-400">1. Roteiro (.txt)</label>
            <input type="file" accept=".txt" onChange={(e) => handleFileUpload(e, 'scriptUrl', 'script')} 
                   className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" />
            {uploading.script && <span className="text-xs text-yellow-500">Fazendo upload...</span>}
            {urls.scriptUrl && <span className="text-xs text-green-500 truncate">Pronto: {urls.scriptUrl}</span>}
          </div>

          {/* 2. Música */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-blue-400">2. Música de Fundo (.mp3)</label>
            <input type="file" accept="audio/mpeg" onChange={(e) => handleFileUpload(e, 'bgMusicUrl', 'music')}
                   className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" />
            {uploading.music && <span className="text-xs text-yellow-500">Fazendo upload...</span>}
            {urls.bgMusicUrl && <span className="text-xs text-green-500 truncate">Pronto: {urls.bgMusicUrl}</span>}
          </div>

          {/* 3. Intro */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-blue-400">3. Vídeo de Introdução (.mp4)</label>
            <input type="file" accept="video/mp4" onChange={(e) => handleFileUpload(e, 'introUrl', 'intro')}
                   className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" />
            {uploading.intro && <span className="text-xs text-yellow-500">Fazendo upload...</span>}
            {urls.introUrl && <span className="text-xs text-green-500 truncate">Pronto: {urls.introUrl}</span>}
          </div>

          {/* 4. Transição */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-blue-400">4. Vídeo de Transição (.mp4)</label>
            <input type="file" accept="video/mp4" onChange={(e) => handleFileUpload(e, 'transitionUrl', 'transition')}
                   className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" />
            {uploading.transition && <span className="text-xs text-yellow-500">Fazendo upload...</span>}
            {urls.transitionUrl && <span className="text-xs text-green-500 truncate">Pronto: {urls.transitionUrl}</span>}
          </div>

          {/* Status Geral */}
          {status && <div className="p-3 bg-gray-700 rounded text-center text-sm font-medium border border-gray-600">{status}</div>}

          <button type="submit" 
            disabled={!urls.scriptUrl || !urls.bgMusicUrl || !urls.introUrl || !urls.transitionUrl}
            className="mt-2 p-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold text-lg transition-colors">
            Gerar Vídeo Automático
          </button>
        </form>
      </div>
    </div>
  );
}