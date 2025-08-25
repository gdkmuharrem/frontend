// app/[lang]/layout.tsx
import Navbar from "@/app/[lang]/Navbar";
import Footer from "@/app/[lang]/Footer";
import '../globals.css';

export default function LangLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-grow mainContent">
        {children}
      </main>
      <Footer />
    </>
  );
}
