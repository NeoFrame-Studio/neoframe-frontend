import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="p-8 max-w-5xl mx-auto">
        {children}
      </main>
    </div>
  );
}