import "./globals.css";
import Link from "next/link";
export const metadata = {
  title: "Page not found | Página no encontrada | Aztec Urban MX",
  robots: { index: false, follow: false },
};
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main className="container section not-found">
          <p>Aztec Urban MX</p>
          <h1>Page not found.</h1>
          <p lang="es">Página no encontrada.</p>
          <Link href="/en" className="button">
            Home
          </Link>
          <Link href="/es" className="text-link" lang="es">
            Ir al inicio
          </Link>
        </main>
      </body>
    </html>
  );
}
