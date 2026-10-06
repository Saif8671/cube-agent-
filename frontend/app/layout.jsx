import "./globals.css";
import { WorkspaceProvider } from "../context/WorkspaceContext";
import AppShell from "../components/AppShell";

export const metadata = {
  title: "Recovery Manager — Evidence-First Recovery Ops",
  description: "Internal operations console for marketplace fee dispute recovery. Evidence first, claim second.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-gray-900 min-h-screen antialiased">
        <WorkspaceProvider>
          <AppShell>
            {children}
          </AppShell>
        </WorkspaceProvider>
      </body>
    </html>
  );
}
