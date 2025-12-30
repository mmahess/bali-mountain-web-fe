import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast"; 

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "SobatMuncak - Teman Pendakianmu",
  description: "Platform komunitas pendaki gunung Indonesia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${poppins.variable} font-sans antialiased`}>
        {/* 2. Pasang Toaster di sini */}
        <Toaster 
          position="top-center" 
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}