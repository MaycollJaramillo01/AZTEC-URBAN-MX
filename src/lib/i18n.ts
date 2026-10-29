export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const pageSlugs = [
  "",
  "menu",
  "locations",
  "locations/broadway-7918",
  "locations/broadway-2127",
  "locations/fifth-street",
  "story",
  "gallery",
  "careers",
  "contact",
  "privacy",
] as const;
export type PageSlug = (typeof pageSlugs)[number];
export const navSlugs = [
  "menu",
  "locations",
  "story",
  "gallery",
  "careers",
  "contact",
] as const;
export function isLocale(value: string): value is Locale {
  return value === "en" || value === "es";
}
export function pathFor(locale: Locale, slug = "") {
  return `/${locale}${slug ? `/${slug}` : ""}`;
}
export function alternateLanguagePath(path: string, locale: Locale) {
  return path.replace(/^\/(en|es)(?=\/|[?#]|$)/, `/${locale}`);
}

const en = {
  nav: {
    menu: "Menus",
    locations: "Locations",
    story: "Our story",
    gallery: "Gallery",
    careers: "Careers",
    contact: "Contact",
    find: "Find your Aztec",
    home: "Home",
    privacy: "Privacy",
    open: "Open navigation",
    close: "Close navigation",
    label: "Main navigation",
    language: "Language",
    skip: "Skip to content",
  },
  common: {
    menus: "View menus",
    menu: "View menu",
    locations: "Find a location",
    directions: "Get directions",
    call: "Call location",
    hours: "Call for current hours",
    operational: "Welcoming you in Tyler",
    coming: "Coming soon",
    details: "Explore location",
    follow: "Follow our updates",
    vary: "Menus and availability vary by location.",
    email: "Email us",
    source: "View original post",
    copied: "Address copied",
    copy: "Copy address",
    copyFailed: "Select and copy the address above.",
    back: "Back to locations",
    selected: "Selected location",
    change: "Choose your location",
    phone: "Phone",
    address: "Address",
    opening: "Opening updates",
    close: "Close",
    next: "Next photo",
    previous: "Previous photo",
    photo: "Open photo",
    loading: "Loading",
    retry: "Try again",
    error: "Something went wrong. Please try again.",
    all: "All photos",
    food: "Food",
    drinks: "Drinks",
    atmosphere: "Atmosphere",
    gallery: "Explore the gallery",
    languageChanged: "Switch to Spanish",
    copyright: "All rights reserved.",
    social: "Find us on social",
    contact: "Get in touch",
    noResults: "There are no photos in this category.",
  },
  home: {
    eyebrow: "MEXICAN KITCHEN • TYLER, TEXAS",
    title: "Bold Mexican flavor. Your kind of gathering.",
    intro:
      "Food full of flavor, refreshing drinks, and a warm welcome in Tyler.",
    locationTitle: "Your next gathering starts here.",
    locationIntro:
      "Two Broadway locations. One warm welcome. Choose your Aztec.",
    flavorTitle: "Made for the middle of the table.",
    flavorIntro:
      "From tacos to the grill, find something worth gathering around.",
    grill: "From the grill",
    tacos: "A little crunch. A lot of flavor.",
    share: "Good food, better company.",
    experienceTitle: "Pull up a chair. Stay a little longer.",
    experienceIntro:
      "A family lunch. A catch-up with friends. A reason to celebrate. Make room for the moments that bring you together.",
    storyTitle: "Mexican roots. Urban spirit.",
    storyLink: "Meet Aztec",
    drinksTitle: "A fresh twist on getting together.",
    drinksIntro:
      "Colorful cocktails, easy conversation, and a little more time at the table.",
    comingTitle: "Something new is coming to 5th Street.",
    comingIntro:
      "Another place to share the Aztec experience in Tyler. Follow along for opening updates.",
    communityTitle: "A taste of life at Aztec.",
    communityIntro:
      "Food, drinks, and the moments in between. Take a look around.",
  },
  menu: {
    title: "Find your flavor.",
    intro:
      "First, choose your Aztec. Each location has its own menu and availability.",
    choose: "Choose a location to see its current menu information.",
    missing: "Contact this location for the current menu.",
    missingBody:
      "Give us a call for the latest food and drink selections, availability, and prices. We’ll help you plan your visit.",
    callPrefix: "Call",
    locationLink: "Location details",
    menuTitle: "Your menu at",
    pdf: "Download menu PDF",
    confirmed: "Menu confirmed",
    version: "Version",
  },
  locations: {
    title: "Find your Aztec.",
    intro: "Mexican flavor and a warm welcome, right here in Tyler.",
    futureIntro: "A new gathering place is on its way.",
    visitTitle: "Make it an Aztec day.",
    visitIntro:
      "Bring your appetite and your favorite people. We look forward to welcoming you.",
    planning: "Plan your visit",
    hoursTitle: "Hours",
    menuIntro: "Explore the food and drink options at this location.",
    futureBody:
      "Aztec Urban MX is coming to 1125 E. 5th Street. Follow our brand account for future opening updates.",
    futureLink: "Follow @aztecurbanmx",
    other: "Visit us on Broadway",
    otherBody:
      "While you look forward to 5th Street, find your Aztec at one of our two Broadway locations.",
  },
  story: {
    title: "Rooted in tradition. Made for today.",
    intro: "Mexican flavor. A contemporary spirit. A place to come together.",
    body: "Aztec Urban MX brings Mexican tradition and modern energy together in Tyler, Texas. Our name reflects that connection: Aztec speaks to the cultural heritage and traditions that inspire our identity, while Urban brings a fresh, creative perspective to the way we gather. Around the table, that means food full of flavor, refreshing drinks, and a welcoming atmosphere. Whether you’re meeting friends, sharing a family meal, or celebrating something special, we want you to feel at home. It’s a shared experience, rooted in Mexican culture and connected to the city we call home.",
    togetherTitle: "There’s room for your kind of gathering.",
    togetherBody:
      "From a relaxed lunch to a night catching up, the best part of the table is who you share it with.",
    value1: "Flavor that brings us together",
    value1body: "Mexican traditions inspire the food and the experience.",
    value2: "A welcome that feels like home",
    value2body: "A comfortable place for families, friends, and celebrations.",
    value3: "A spirit connected to Tyler",
    value3body: "Fresh energy and a shared table in our East Texas community.",
  },
  gallery: {
    title: "Take a look around.",
    intro:
      "A closer look at the food, drinks, and atmosphere of Aztec Urban MX.",
    label: "Filter photographs",
    count: "photos",
    position: "Photo",
    of: "of",
    sourceNote: "From our Instagram",
    captionNote: "Food and drink availability varies by location.",
  },
  contact: {
    title: "Let’s get together.",
    intro: "Planning a visit or have a question? We’d love to hear from you.",
    emailTitle: "Say hello",
    emailBody:
      "For general questions, write to us. For current menus and hours, call your Broadway location directly.",
    phoneTitle: "Talk to your Aztec",
    socialTitle: "Keep in touch",
    socialIntro: "Follow the food, the atmosphere, and what’s coming next.",
    nextTitle: "5th Street is coming soon.",
    nextBody: "Follow our brand account for opening updates.",
  },
  privacy: {
    title: "Your privacy.",
    intro: "How this website handles information.",
    review: "Last updated: October 29, 2026.",
    localTitle: "Your location preference",
    localBody:
      "If you choose a Broadway location, this website remembers its identifier in your browser’s local storage. It is used only to keep your menu selection consistent. You can change it on the Menus page or remove it by clearing this website’s browser data. We do not store your precise location or request geolocation.",
    analyticsTitle: "Cookies and analytics",
    analyticsBody:
      "This website does not load advertising tools, analytics services, social feeds, tracking pixels, or embedded maps, and it does not set nonessential cookies of its own. It does load a script from inKind, a restaurant credit and gift card service, that can show a promotional pop-up. When the script loads, inKind receives connection details such as your IP address, browser information, and the page you are viewing, and it may use cookies or similar browser storage for the pop-up. If you use the pop-up, inKind handles that information under its own privacy policy. No marketing subscriptions are enabled. Our interaction events stay within the page and are not sent to an analytics provider.",
    externalTitle: "Links to other services",
    externalBody:
      "Google Maps, Instagram, Facebook, your email application, and your phone application open only when you follow their links. Those services handle information under their own privacy policies. Local photos and fonts are served by this website.",
    contactTitle: "Contacting us",
    contactBody:
      "When available, the contact form sends your name, email address, message, optional Broadway location, language, and contact consent through Microsoft 365 to our contact inbox. These details are used to respond, not to subscribe you to marketing. The website does not save message contents in a database or browser storage. The server temporarily processes a salted hash of the connection address in memory to limit repeated submissions; it is not stored in a database. Email storage and retention depend on the email provider and inbox operator and must be confirmed before public launch. If the form is unavailable, you can email or call us directly. For privacy questions, contact info@aztecmx.com. Please avoid sending sensitive information.",
    careersTitle: "Job applications",
    careersBody:
      "When available, the careers form sends your name, email address, phone number, area and location of interest, optional message, the CV you attach, language, and application consent through Microsoft 365 to our contact inbox, only to review your application. The website does not save applications or CV files in a database, file storage, or browser storage; the file is held in server memory only while the email is sent. The security check is generated and verified by this website’s own server, without cookies or third-party services. The same in-memory limit on repeated submissions applies. Please do not include sensitive information such as your Social Security number, bank details, or health information. How long applications are kept depends on the inbox operator and must be confirmed before public launch. To ask about or withdraw your application, contact info@aztecmx.com.",
    hostingTitle: "Website delivery",
    hostingBody:
      "This website is hosted on Vercel. The hosting infrastructure processes connection details such as IP address and request time to deliver pages and protect the contact and careers forms from repeated requests. The responsible operator must confirm applicable hosting and email retention practices before the final public launch.",
  },
  meta: {
    home: "Aztec Urban MX | Mexican Food & Cocktails in Tyler, TX",
    description:
      "Mexican tradition meets modern energy at Aztec Urban MX in Tyler, Texas. Explore our Broadway locations, food, drinks, and welcoming atmosphere.",
    menu: "Menus",
    locations: "Locations in Tyler",
    story: "Our story",
    gallery: "Food, Drinks & Atmosphere",
    careers: "Careers",
    contact: "Contact",
    privacy: "Privacy",
    future: "5th Street | Coming soon",
  },
  footer: {
    description:
      "Mexican tradition. Modern urban energy. A warm welcome in Tyler, Texas.",
    explore: "Come on over",
    social: "Stay in the loop",
  },
};
type Dictionary = typeof en;
const es: Dictionary = {
  nav: {
    menu: "Menús",
    locations: "Ubicaciones",
    story: "Nuestra historia",
    gallery: "Galería",
    careers: "Empleo",
    contact: "Contacto",
    find: "Encuentra tu Aztec",
    home: "Inicio",
    privacy: "Privacidad",
    open: "Abrir navegación",
    close: "Cerrar navegación",
    label: "Navegación principal",
    language: "Idioma",
    skip: "Saltar al contenido",
  },
  common: {
    menus: "Ver menús",
    menu: "Ver menú",
    locations: "Ver ubicaciones",
    directions: "Cómo llegar",
    call: "Llamar a la sucursal",
    hours: "Llama para consultar los horarios",
    operational: "Te esperamos en Tyler",
    coming: "Próximamente",
    details: "Conoce la sucursal",
    follow: "Sigue nuestras novedades",
    vary: "El menú y la disponibilidad pueden variar según la ubicación.",
    email: "Escríbenos",
    source: "Ver publicación original",
    copied: "Dirección copiada",
    copy: "Copiar dirección",
    copyFailed: "Selecciona y copia la dirección de arriba.",
    back: "Volver a ubicaciones",
    selected: "Sucursal seleccionada",
    change: "Elige tu sucursal",
    phone: "Teléfono",
    address: "Dirección",
    opening: "Novedades de apertura",
    close: "Cerrar",
    next: "Siguiente foto",
    previous: "Foto anterior",
    photo: "Abrir foto",
    loading: "Cargando",
    retry: "Reintentar",
    error: "Algo salió mal. Vuelve a intentarlo.",
    all: "Todas las fotos",
    food: "Comida",
    drinks: "Bebidas",
    atmosphere: "Ambiente",
    gallery: "Explora la galería",
    languageChanged: "Cambiar a inglés",
    copyright: "Todos los derechos reservados.",
    social: "Encuéntranos en redes",
    contact: "Hablemos",
    noResults: "No hay fotos en esta categoría.",
  },
  home: {
    eyebrow: "COCINA MEXICANA • TYLER, TEXAS",
    title: "Sabor mexicano. Momentos para compartir.",
    intro: "Comida llena de sabor, bebidas y una bienvenida cálida en Tyler.",
    locationTitle: "Tu próximo encuentro empieza aquí.",
    locationIntro:
      "Dos sucursales en Broadway. Una cálida bienvenida. Elige tu Aztec.",
    flavorTitle: "Al centro de la mesa, para compartir.",
    flavorIntro:
      "De los tacos a la parrilla, encuentra un buen motivo para reunirte.",
    grill: "De nuestra parrilla",
    tacos: "Mucho color. Mucho sabor.",
    share: "Buena comida, mejor compañía.",
    experienceTitle: "Acércate a la mesa. Quédate un rato.",
    experienceIntro:
      "Un almuerzo familiar. Un encuentro entre amigos. Un motivo para celebrar. Haz espacio para los momentos que nos unen.",
    storyTitle: "Raíces mexicanas. Espíritu urbano.",
    storyLink: "Conoce Aztec",
    drinksTitle: "Un toque fresco para tus encuentros.",
    drinksIntro:
      "Cocteles llenos de color, buena conversación y un poco más de tiempo en la mesa.",
    comingTitle: "Aztec llega a 5th Street.",
    comingIntro:
      "Otro lugar para compartir la experiencia Aztec en Tyler. Síguenos para conocer las novedades de apertura.",
    communityTitle: "Así se vive Aztec.",
    communityIntro:
      "Comida, bebidas y los momentos que compartimos. Date una vuelta.",
  },
  menu: {
    title: "Encuentra tu sabor.",
    intro:
      "Primero, elige tu Aztec. Cada sucursal tiene su propio menú y disponibilidad.",
    choose:
      "Elige una sucursal para consultar la información de su menú vigente.",
    missing: "Consulta con esta sucursal el menú vigente.",
    missingBody:
      "Llámanos para conocer las opciones de comida y bebidas, disponibilidad y precios actuales. Te ayudamos a planear tu visita.",
    callPrefix: "Llamar al",
    locationLink: "Datos de la sucursal",
    menuTitle: "Tu menú en",
    pdf: "Descargar menú PDF",
    confirmed: "Menú confirmado",
    version: "Versión",
  },
  locations: {
    title: "Encuentra tu Aztec.",
    intro: "Sabor mexicano y una cálida bienvenida, aquí en Tyler.",
    futureIntro: "Un nuevo punto de encuentro está en camino.",
    visitTitle: "Hoy se comparte en Aztec.",
    visitIntro: "Ven con apetito y con tus personas favoritas. Te esperamos.",
    planning: "Planea tu visita",
    hoursTitle: "Horarios",
    menuIntro: "Consulta las opciones de comida y bebidas de esta sucursal.",
    futureBody:
      "Aztec Urban MX llegará a 1125 E. 5th Street. Sigue nuestra cuenta de marca para conocer las novedades de apertura.",
    futureLink: "Sigue a @aztecurbanmx",
    other: "Visítanos en Broadway",
    otherBody:
      "Mientras esperas la llegada a 5th Street, encuentra tu Aztec en una de nuestras dos sucursales de Broadway.",
  },
  story: {
    title: "Con tradición. Con energía de hoy.",
    intro: "Sabor mexicano. Espíritu contemporáneo. Un lugar para reunirnos.",
    body: "Aztec Urban MX une la tradición mexicana y una energía moderna en Tyler, Texas. Nuestro nombre refleja esa conexión: Aztec habla de la herencia cultural y las tradiciones que inspiran nuestra identidad, mientras Urban aporta una mirada fresca y creativa a la forma de reunirnos. En la mesa, eso se traduce en comida llena de sabor, bebidas y un ambiente acogedor. Ya sea para encontrarte con amigos, compartir una comida familiar o celebrar algo especial, queremos que te sientas en casa. Es una experiencia compartida, con raíces en la cultura mexicana y conectada con la ciudad que llamamos hogar.",
    togetherTitle: "Hay lugar para tus encuentros.",
    togetherBody:
      "Desde un almuerzo tranquilo hasta una noche de conversación, lo mejor de la mesa es con quién la compartes.",
    value1: "El sabor que nos reúne",
    value1body:
      "Las tradiciones mexicanas inspiran nuestra comida y nuestra experiencia.",
    value2: "Una bienvenida como en casa",
    value2body: "Un lugar acogedor para familias, amigos y celebraciones.",
    value3: "Un espíritu conectado con Tyler",
    value3body:
      "Energía fresca y una mesa compartida con nuestra comunidad del este de Texas.",
  },
  gallery: {
    title: "Date una vuelta.",
    intro:
      "Una mirada a la comida, las bebidas y el ambiente de Aztec Urban MX.",
    label: "Filtrar fotografías",
    count: "fotos",
    position: "Foto",
    of: "de",
    sourceNote: "Desde nuestro Instagram",
    captionNote:
      "La disponibilidad de comida y bebidas varía según la sucursal.",
  },
  contact: {
    title: "Vamos a reunirnos.",
    intro:
      "¿Planeas una visita o tienes una pregunta? Nos encantará saber de ti.",
    emailTitle: "Salúdanos",
    emailBody:
      "Para preguntas generales, escríbenos. Para consultar el menú y los horarios vigentes, llama directamente a tu sucursal de Broadway.",
    phoneTitle: "Habla con tu Aztec",
    socialTitle: "Sigamos en contacto",
    socialIntro: "Sigue la comida, el ambiente y lo que viene.",
    nextTitle: "5th Street llega próximamente.",
    nextBody:
      "Sigue nuestra cuenta de marca para conocer las novedades de apertura.",
  },
  privacy: {
    title: "Tu privacidad.",
    intro: "Cómo maneja la información este sitio web.",
    review: "Última actualización: 29 de octubre de 2026.",
    localTitle: "Tu sucursal preferida",
    localBody:
      "Si eliges una sucursal de Broadway, este sitio recuerda su identificador en el almacenamiento local de tu navegador. Solo se usa para mantener tu selección de menú. Puedes cambiarla en Menús o eliminarla borrando los datos de este sitio en el navegador. No guardamos tu ubicación precisa ni solicitamos geolocalización.",
    analyticsTitle: "Cookies y analítica",
    analyticsBody:
      "Este sitio no carga publicidad, servicios de analítica, feeds sociales, píxeles de seguimiento ni mapas integrados, y no crea cookies no esenciales propias. Sí carga un script de inKind, un servicio de crédito y tarjetas de regalo para restaurantes, que puede mostrar una ventana emergente promocional. Al cargarse el script, inKind recibe datos de conexión como tu dirección IP, información del navegador y la página que estás viendo, y puede usar cookies o almacenamiento similar del navegador para la ventana emergente. Si usas la ventana emergente, inKind trata esa información según su propia política de privacidad. No hay suscripciones de marketing habilitadas. Los eventos de interacción permanecen en la página y no se envían a un proveedor de analítica.",
    externalTitle: "Enlaces a otros servicios",
    externalBody:
      "Google Maps, Instagram, Facebook, tu aplicación de correo y tu aplicación de teléfono solo se abren al seguir sus enlaces. Esos servicios tratan información según sus propias políticas de privacidad. Las fotos y fuentes locales se sirven desde este sitio.",
    contactTitle: "Al contactarnos",
    contactBody:
      "Cuando está disponible, el formulario envía tu nombre, correo, mensaje, sucursal de Broadway opcional, idioma y consentimiento de contacto mediante Microsoft 365 a la bandeja de contacto. Estos datos se usan para responder, sin suscribirte a marketing. El sitio no guarda los mensajes en una base de datos ni en el almacenamiento del navegador. Para limitar envíos repetidos el servidor procesa temporalmente en memoria un hash de la dirección de conexión con un valor aleatorio; no se guarda en una base de datos. El almacenamiento y la conservación del correo dependen del proveedor y del responsable de la bandeja y se deben confirmar antes del lanzamiento público. Si el formulario no está disponible, puedes escribirnos o llamarnos directamente. Para preguntas sobre privacidad, contacta a info@aztecmx.com. Evita enviar información sensible.",
    careersTitle: "Solicitudes de empleo",
    careersBody:
      "Cuando está disponible, el formulario de empleo envía tu nombre, correo, teléfono, área y sucursal de interés, mensaje opcional, el CV que adjuntas, idioma y consentimiento de solicitud mediante Microsoft 365 a la bandeja de contacto, solo para revisar tu solicitud. El sitio no guarda solicitudes ni archivos de CV en una base de datos, almacenamiento de archivos ni en el navegador; el archivo permanece en la memoria del servidor solo mientras se envía el correo. La verificación de seguridad la genera y comprueba el propio servidor del sitio, sin cookies ni servicios de terceros. Se aplica el mismo límite en memoria para envíos repetidos. No incluyas información sensible como tu número de Seguro Social, datos bancarios o de salud. El tiempo de conservación de las solicitudes depende del responsable de la bandeja y se debe confirmar antes del lanzamiento público. Para consultar o retirar tu solicitud, escribe a info@aztecmx.com.",
    hostingTitle: "Entrega del sitio web",
    hostingBody:
      "Este sitio se aloja en Vercel. La infraestructura de alojamiento procesa datos de conexión, como dirección IP y hora de solicitud, para servir las páginas y proteger los formularios de contacto y empleo frente a solicitudes repetidas. El responsable del sitio debe confirmar los plazos de conservación del alojamiento y el correo antes del lanzamiento público definitivo.",
  },
  meta: {
    home: "Aztec Urban MX | Comida mexicana y cocteles en Tyler, TX",
    description:
      "La tradición mexicana se une a la energía moderna en Aztec Urban MX, Tyler, Texas. Conoce nuestras sucursales de Broadway, comida, bebidas y ambiente.",
    menu: "Menús",
    locations: "Ubicaciones en Tyler",
    story: "Nuestra historia",
    gallery: "Comida, bebidas y ambiente",
    careers: "Trabaja con nosotros",
    contact: "Contacto",
    privacy: "Privacidad",
    future: "5th Street | Próximamente",
  },
  footer: {
    description:
      "Tradición mexicana. Energía urbana moderna. Una cálida bienvenida en Tyler, Texas.",
    explore: "Te esperamos",
    social: "Sigue las novedades",
  },
};
export function dictionary(locale: Locale): Dictionary {
  return locale === "es" ? es : en;
}
