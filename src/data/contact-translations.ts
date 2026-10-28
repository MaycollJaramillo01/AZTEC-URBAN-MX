import type { Locale } from "@/lib/i18n";

const en = {
  title: "Send us a note.",
  intro:
    "Have a question? Leave us a message. For current menus and hours, call your location directly.",
  name: "Your name",
  email: "Email address",
  locationId: "Location (optional)",
  general: "General question",
  message: "Your message",
  consent: "I agree to the use of my details to respond to this message.",
  privacy: "Read our privacy notice",
  honeypot: "Leave this field empty",
  submit: "Send message",
  sending: "Sending…",
  checking: "Checking availability…",
  unavailable: "This form is temporarily unavailable. Please email us instead.",
  success: "Thank you. Your message has been sent.",
  errors: {
    name: "Enter a name between 2 and 100 characters.",
    email: "Enter a valid email address.",
    message: "Write a message between 10 and 4,000 characters.",
    consent: "Please agree to the use of your details so we can respond.",
    locationId: "Choose a Broadway location or General question.",
    invalid: "Please check the form and try again.",
    rate_limited:
      "You’ve made several attempts. Please try again in 15 minutes or email us.",
    send_failed: "We couldn’t send your message. Please try again or email us.",
    unavailable:
      "This form is temporarily unavailable. Please email us instead.",
    too_large: "Your message is too long. Please shorten it and try again.",
    forbidden: "Please reload this page and try again.",
  },
};
const es: typeof en = {
  title: "Cuéntanos.",
  intro:
    "¿Tienes una pregunta? Déjanos un mensaje. Para consultar el menú y los horarios vigentes, llama directamente a tu sucursal.",
  name: "Tu nombre",
  email: "Correo electrónico",
  locationId: "Sucursal (opcional)",
  general: "Consulta general",
  message: "Tu mensaje",
  consent: "Acepto el uso de mis datos para responder a este mensaje.",
  privacy: "Lee nuestro aviso de privacidad",
  honeypot: "Deja este campo vacío",
  submit: "Enviar mensaje",
  sending: "Enviando…",
  checking: "Consultando disponibilidad…",
  unavailable:
    "Este formulario no está disponible por ahora. Escríbenos por correo.",
  success: "Gracias. Tu mensaje se ha enviado.",
  errors: {
    name: "Escribe un nombre de entre 2 y 100 caracteres.",
    email: "Escribe un correo electrónico válido.",
    message: "Escribe un mensaje de entre 10 y 4.000 caracteres.",
    consent: "Acepta el uso de tus datos para que podamos responderte.",
    locationId: "Elige una sucursal de Broadway o Consulta general.",
    invalid: "Revisa el formulario e inténtalo de nuevo.",
    rate_limited:
      "Has realizado varios intentos. Vuelve a intentarlo en 15 minutos o escríbenos por correo.",
    send_failed:
      "No pudimos enviar tu mensaje. Vuelve a intentarlo o escríbenos por correo.",
    unavailable:
      "Este formulario no está disponible por ahora. Escríbenos por correo.",
    too_large: "Tu mensaje es demasiado largo. Acórtalo e inténtalo de nuevo.",
    forbidden: "Recarga esta página e inténtalo de nuevo.",
  },
};
export function contactDictionary(locale: Locale) {
  return locale === "es" ? es : en;
}
