# Formulario y SMTP existente

El formulario de contacto está construido en inglés y español. Se conecta a tu proveedor SMTP desde una ruta Node.js de Next.js con Nodemailer. No usa un servicio de formularios ni un proveedor de correo nuevo.

## Configuración

Se preparó `.env.local` con campos vacíos. No se incluye en el ZIP ni en Git. Completar los siguientes valores únicamente en ese archivo local, o en las variables de servidor del proyecto Vercel:

```dotenv
CONTACT_FORM_ENABLED=true
SMTP_HOST=smtp.tu-proveedor.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
SMTP_TO=info@aztecmx.com
```

No usar prefijos `NEXT_PUBLIC_`. No poner credenciales en archivos de contenido, componentes, capturas, chat ni documentación. `SMTP_FROM` y `SMTP_TO` deben contener una dirección simple, sin nombre de presentación. El remitente debe estar autorizado por el proveedor. Por defecto, el destino es el correo entregado en el brief, `info@aztecmx.com`.

Next.js interpreta referencias con `$` en los archivos de entorno. Un dólar literal en `.env.local` se guarda como `\$`; el comando de verificación utiliza el mismo cargador de entorno de Next.js. En el panel de variables de Vercel se introduce el valor literal del secreto.

- Puerto 587: `SMTP_SECURE=false`, con STARTTLS obligatorio.
- Puerto 465: `SMTP_SECURE=true`, con TLS desde la conexión.
- El puerto 25 se rechaza. La validación de certificado permanece activa.

Después de cambiar las variables, reiniciar el servidor local. En Vercel deben aplicarse al entorno correcto y se requiere un nuevo despliegue cuando corresponda; el despliegue se realiza únicamente tras solicitud explícita.

## Verificar sin enviar correos

```powershell
npm run smtp:verify
```

El comando comprueba conexión, TLS y autenticación. No envía ningún correo ni imprime valores secretos. Una conexión válida no confirma por sí sola los permisos del remitente ni la entrega final en una bandeja. Antes del lanzamiento debe probarse un mensaje con el responsable y su autorización.

Sin configuración completa y `CONTACT_FORM_ENABLED=true`, `GET /api/contact` devuelve únicamente `available: false`. El visitante ve una alternativa real por correo y los campos de envío quedan deshabilitados. No se expone qué secreto falta. `POST` devuelve 503, sin intentar conectar a un proveedor.

## Envío y pruebas

`POST /api/contact` valida nombre, correo, mensaje, sede, idioma, consentimiento y un campo antispam. El destinatario y remitente se toman exclusivamente del servidor; el correo del visitante solo se usa en Reply-To. El contenido se envía como texto, sin adjuntos ni acceso a archivos o URLs desde Nodemailer.

El servidor espera a que `sendMail` termine y a que el proveedor acepte el destinatario antes de responder con éxito. Rechazos y fallos devuelven un error traducido en la interfaz, sin borrar el mensaje. No se registran datos del mensaje ni credenciales. No hay autorrespuesta, alta de marketing ni almacenamiento en base de datos.

Las pruebas automatizadas generan el MIME en memoria y sustituyen la entrega por una función local controlada. Cubren la espera de aceptación, fallos de proveedor, configuración incompleta, validación, origen, tamaño y límite de intentos. No enviaron correos reales.

## Formulario de empleo

`/en/careers` y `/es/careers` usan el mismo SMTP y la misma bandeja (`SMTP_TO`). `CAREERS_CC` (opcional, dirección simple) añade una copia visible (Cc) de cada solicitud; si es inválida, ambos formularios quedan deshabilitados como con el resto de la configuración. `POST /api/careers` recibe `multipart/form-data` con un CV de hasta 4 MiB y 64 KiB de campos, por debajo del límite de 4,5 MB de Vercel Functions. Acepta PDF, DOC, DOCX, JPG y PNG; el tipo se determina por los primeros bytes del archivo, no por su nombre, y el adjunto se renombra como `CV-Nombre.ext`. El CV solo permanece en memoria durante el envío; no se guarda en disco, base de datos ni navegador.

El captcha es nativo: `GET /api/careers` entrega una suma sencilla y un token firmado con HMAC-SHA256 que caduca a los 30 minutos; la respuesta nunca viaja en claro. Cada desafío resuelto se acepta una sola vez por proceso. No usa servicios de terceros, cookies ni scripts externos. Se suman el campo antispam, la comprobación de origen y el mismo límite de cinco intentos en quince minutos.

`CAPTCHA_SECRET` (32 caracteres aleatorios o más) está configurado como variable sensible en Production de Vercel; en local es opcional. Sin él, cada proceso genera su propia clave: funciona en local, pero en Vercel otra instancia podría rechazar el desafío y pedir una nueva respuesta. La regla WAF `Careers form limit` aplica a `POST /api/careers` el mismo límite que al contacto: cinco solicitudes por IP en 600 segundos.

## Límite de intentos

La API admite cinco intentos por identificador de conexión en una ventana de quince minutos por proceso y limita el cuerpo a 16 KiB. Conserva únicamente un hash con sal aleatoria en la memoria del proceso; las entradas vencidas se eliminan al atender solicitudes posteriores o al terminar el proceso.

Además del límite por proceso, se configuró y publicó la regla Contact form limit de Vercel WAF: cinco solicitudes POST a /api/contact por IP en diez minutos. Los contadores WAF se aplican por región, según Vercel; el límite de aplicación por proceso sigue vigente. No hay base de datos adicional.

## Estado de esta entrega

Se configuró Microsoft 365 mediante smtp.office365.com:587 con STARTTLS. La verificación real de conexión, TLS y autenticación pasó el 28 de octubre de 2026. La cuenta autenticada se usa como remitente y el destinatario es info@aztecmx.com. Los valores privados están en .env.local y en los secretos de producción de Vercel; no se incluyen en GitHub ni en el ZIP. El envío está habilitado en la vista previa. No se enviaron mensajes reales de prueba ni se afirma entrega en la bandeja final. Se actualizó privacidad EN/ES; aún se deben confirmar responsable de bandeja y conservación de correo antes de publicar.

Referencias: [SMTP de Nodemailer](https://nodemailer.com/smtp), [correo desde Vercel Functions](https://vercel.com/kb/guide/sending-emails-from-an-application-on-vercel). Con SMTP, Vercel requiere completar la conexión y el envío antes de devolver la respuesta; la implementación utiliza `await` y límites de tiempo explícitos.
