import MainLayout from "../layouts/MainLayout";
import UploadForm from "../components/UploadForm";

export default function Dashboard() {
  return (
    <MainLayout>
      <h2 className="text-4xl font-bold mb-8">
        Criar Vídeo
      </h2>

      <UploadForm />
    </MainLayout>
  );
}