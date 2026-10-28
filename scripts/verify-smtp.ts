import { readSmtpConfig, smtpTransport } from "../src/lib/server/smtp";
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
async function main() {
  const config = readSmtpConfig();
  if (!config) {
    console.error(
      "SMTP no configurado: completa .env.local y establece CONTACT_FORM_ENABLED=true.",
    );
    process.exitCode = 1;
  } else {
    const transport = smtpTransport(config);
    try {
      await transport.verify();
      console.log(
        "Conexión, TLS y autenticación SMTP verificadas. No se ha enviado ningún correo.",
      );
    } catch {
      console.error(
        "No se pudo verificar el SMTP. Revisa host, puerto, TLS y credenciales. No se ha enviado ningún correo.",
      );
      process.exitCode = 1;
    } finally {
      transport.close();
    }
  }
}
void main();
