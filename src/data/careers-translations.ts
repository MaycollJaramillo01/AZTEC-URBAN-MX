import type { Locale } from "@/lib/i18n";

const en = {
  eyebrow: "WORK WITH US • TYLER, TEXAS",
  title: "Join our team.",
  intro:
    "Love good food, warm service, and a full table? We’re looking for people who want to make every guest feel at home.",
  teamTitle: "Behind every gathering, there’s a team.",
  teamBody:
    "From the kitchen to the bar and the front door, our people bring Aztec’s Mexican hospitality to life in Tyler.",
  apply: "Apply now",
  valuesTitle: "More than a shift. A team to grow with.",
  valuesBody:
    "We look for warmth, energy, and respect for good food. Experience helps, but attitude matters most.",
  values: [
    {
      title: "A team that has your back",
      body: "We work side by side, from the kitchen to the front of the house.",
    },
    {
      title: "Learn something every shift",
      body: "Share what you know and pick up new skills with people who love what they do.",
    },
    {
      title: "Proud of our roots",
      body: "Bring Mexican hospitality to life for our community in Tyler.",
    },
  ],
  rolesTitle: "Find your place.",
  rolesIntro:
    "Choose the area that fits you best and tell us about yourself in the form below.",
  positions: {
    kitchen: "Kitchen",
    service: "Service",
    bar: "Bar",
    host: "Host",
    management: "Management",
    other: "Other area",
  },
  roles: {
    kitchen: "Prep, line, and dish: where the flavor starts.",
    service: "Warm, attentive service at every table.",
    bar: "Cocktails, drinks, and easy conversation.",
    host: "The first welcome of every visit.",
    management: "Lead the team and the guest experience.",
    other: "Tell us how you’d like to join the team.",
  },
  formTitle: "Send us your application.",
  formIntro:
    "Fill out the form and attach your CV. If there’s a fit, we’ll be in touch.",
  name: "Full name",
  email: "Email address",
  phone: "Phone number",
  position: "Area of interest",
  choosePosition: "Choose an area",
  locationId: "Preferred location",
  anyLocation: "Any location",
  message: "Experience and availability (optional)",
  cv: "CV or resume",
  cvHint:
    "PDF, Word, JPG, or PNG, up to 4 MB. Please don’t include your Social Security number or bank details.",
  captcha: "Security check: type the result",
  consent: "I agree to the use of my details and CV to review my application.",
  privacy: "Read our privacy notice",
  honeypot: "Leave this field empty",
  submit: "Send application",
  sending: "Sending…",
  checking: "Checking availability…",
  unavailable:
    "This form is temporarily unavailable. Please email us your CV instead.",
  success: "Thank you. Your application has been sent.",
  errors: {
    name: "Enter a name between 2 and 100 characters.",
    email: "Enter a valid email address.",
    phone: "Enter a phone number with 7 to 15 digits.",
    position: "Choose an area of interest.",
    locationId: "Choose a Broadway location or Any location.",
    message: "Keep your message under 2,000 characters.",
    cv: "Attach a PDF, Word, JPG, or PNG file up to 4 MB.",
    consent: "Please agree so we can review your application.",
    captcha: "Type the correct result of the security check.",
    invalid: "Please check the form and try again.",
    rate_limited:
      "You’ve made several attempts. Please try again in 15 minutes or email us your CV.",
    send_failed:
      "We couldn’t send your application. Please try again or email us your CV.",
    unavailable:
      "This form is temporarily unavailable. Please email us your CV instead.",
    too_large: "Your file is too large. Attach a file up to 4 MB.",
    forbidden: "Please reload this page and try again.",
  },
};
const es: typeof en = {
  eyebrow: "TRABAJA CON NOSOTROS • TYLER, TEXAS",
  title: "Únete a nuestro equipo.",
  intro:
    "¿Te gusta la buena comida, el servicio cálido y una mesa llena? Buscamos personas que quieran hacer sentir en casa a cada invitado.",
  teamTitle: "Detrás de cada encuentro hay un equipo.",
  teamBody:
    "De la cocina a la barra y la recepción, nuestra gente hace realidad la hospitalidad mexicana de Aztec en Tyler.",
  apply: "Postúlate",
  valuesTitle: "Más que un turno. Un equipo para crecer.",
  valuesBody:
    "Buscamos calidez, energía y respeto por la buena comida. La experiencia suma, pero la actitud es lo que más cuenta.",
  values: [
    {
      title: "Un equipo que te respalda",
      body: "Trabajamos lado a lado, de la cocina al salón.",
    },
    {
      title: "Aprende en cada turno",
      body: "Comparte lo que sabes y aprende de personas a las que les encanta lo que hacen.",
    },
    {
      title: "Orgullo por nuestras raíces",
      body: "Lleva la hospitalidad mexicana a nuestra comunidad en Tyler.",
    },
  ],
  rolesTitle: "Encuentra tu lugar.",
  rolesIntro:
    "Elige el área que mejor va contigo y cuéntanos de ti en el formulario.",
  positions: {
    kitchen: "Cocina",
    service: "Servicio",
    bar: "Barra",
    host: "Recepción",
    management: "Gerencia",
    other: "Otra área",
  },
  roles: {
    kitchen: "Preparación, línea y lavado: donde empieza el sabor.",
    service: "Atención cálida y cercana en cada mesa.",
    bar: "Cocteles, bebidas y buena conversación.",
    host: "La primera bienvenida de cada visita.",
    management: "Lidera al equipo y la experiencia de cada invitado.",
    other: "Cuéntanos cómo te gustaría sumarte al equipo.",
  },
  formTitle: "Envíanos tu solicitud.",
  formIntro:
    "Completa el formulario y adjunta tu CV. Si tu perfil encaja, nos pondremos en contacto contigo.",
  name: "Nombre completo",
  email: "Correo electrónico",
  phone: "Teléfono",
  position: "Área de interés",
  choosePosition: "Elige un área",
  locationId: "Sucursal preferida",
  anyLocation: "Cualquier sucursal",
  message: "Experiencia y disponibilidad (opcional)",
  cv: "CV o currículum",
  cvHint:
    "PDF, Word, JPG o PNG, hasta 4 MB. No incluyas tu número de Seguro Social ni datos bancarios.",
  captcha: "Verificación de seguridad: escribe el resultado",
  consent: "Acepto el uso de mis datos y mi CV para revisar mi solicitud.",
  privacy: "Lee nuestro aviso de privacidad",
  honeypot: "Deja este campo vacío",
  submit: "Enviar solicitud",
  sending: "Enviando…",
  checking: "Consultando disponibilidad…",
  unavailable:
    "Este formulario no está disponible por ahora. Envíanos tu CV por correo.",
  success: "Gracias. Tu solicitud se ha enviado.",
  errors: {
    name: "Escribe un nombre de entre 2 y 100 caracteres.",
    email: "Escribe un correo electrónico válido.",
    phone: "Escribe un teléfono de 7 a 15 dígitos.",
    position: "Elige un área de interés.",
    locationId: "Elige una sucursal de Broadway o Cualquier sucursal.",
    message: "Tu mensaje debe tener menos de 2.000 caracteres.",
    cv: "Adjunta un archivo PDF, Word, JPG o PNG de hasta 4 MB.",
    consent: "Acepta el uso de tus datos para que podamos revisar tu solicitud.",
    captcha: "Escribe el resultado correcto de la verificación.",
    invalid: "Revisa el formulario e inténtalo de nuevo.",
    rate_limited:
      "Has realizado varios intentos. Vuelve a intentarlo en 15 minutos o envíanos tu CV por correo.",
    send_failed:
      "No pudimos enviar tu solicitud. Vuelve a intentarlo o envíanos tu CV por correo.",
    unavailable:
      "Este formulario no está disponible por ahora. Envíanos tu CV por correo.",
    too_large: "Tu archivo es demasiado grande. Adjunta uno de hasta 4 MB.",
    forbidden: "Recarga esta página e inténtalo de nuevo.",
  },
};
export function careersDictionary(locale: Locale) {
  return locale === "es" ? es : en;
}
