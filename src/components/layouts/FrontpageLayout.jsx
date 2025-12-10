import Navbar from "../ui/navbar/Navbar";
import Footer from "../ui/footer/Footer";

export default function FrontpageLayout({ children }) {
  return (
    <main className="min-h-screen">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}