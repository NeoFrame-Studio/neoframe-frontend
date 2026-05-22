import client from '../api/client';
import axios from 'axios';

export const uploadToS3 = async (file, fileType) => {
  try {
    // 1. Pede ao seu backend Java uma URL segura de upload (Pre-signed URL)
    // fileType pode ser 'roteiro', 'musica', 'intro' ou 'transicao'
    const { data } = await client.post('/storage/presigned-url', {
      fileName: file.name,
      contentType: file.type,
      type: fileType 
    });

    const { uploadUrl, finalFileUrl } = data;

    // 2. Faz o upload DIRETO do navegador para o S3/Cloudflare R2
    // Usamos o axios normal aqui (não a nossa api) para não injetar o token JWT do Java no S3
    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type
      }
    });

    // 3. Retorna a URL final onde o arquivo ficou salvo no bucket
    return finalFileUrl;

  } catch (error) {
    console.error("Erro no upload para o S3:", error);
    throw new Error(`Falha ao fazer upload do arquivo ${file.name}`);
  }
};