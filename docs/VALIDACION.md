# Validación realizada

28 de octubre de 2026. Sitio local, sin despliegue. Node 22.20.0, Next.js 16.4.3, Chrome 156 para el diagnóstico Lighthouse.

## Código y rutas

- `npm run lint`: pasó sin errores ni advertencias de lint.
- `npm run typecheck`: pasó con TypeScript estricto.
- `npm test`: seis pruebas pasaron. Cubren teléfonos y códigos postales por sede, destinos de mapas, exclusión de 5th Street, rechazo de relaciones inválidas, aislamiento de cartas por sede e idioma, navegación de idioma con consulta, paridad de traducciones, metadatos únicos, SEO de preview y archivos/hashes de fotos.
- `npm run build`: pasó. Generó las 20 páginas EN/ES, además de entrada, 404, robots y sitemap.
- `node scripts/check-routes.mjs http://127.0.0.1:3001`: pasó para 20 respuestas 200, un H1 por página, idioma HTML correcto, títulos únicos, correo correcto, ausencia de enlaces vacíos, redirección de `/` a `/en`, 404 para rutas inexistentes, robots y ocho fallbacks de imagen.

## Revisión de navegador

Inicio, menú y ubicaciones se comprobaron en ambos idiomas a 360, 390, 768, 1024 y 1440 px: 30 vistas, sin desbordamiento horizontal ni imágenes cargadas rotas, con un H1 por vista. Los resultados de geometría están en `reports/responsive.json`; las capturas de 390 y 1440 están en `reports/`.

Se inspeccionaron visualmente portada, menú y ubicaciones en móvil y desktop. Se revisó que el hero móvil muestre el plato completo y los CTAs sean visibles antes de la fotografía. Las fotografías son locales y mantienen proporción; la limitación de resolución original continúa vigente.

Comprobaciones de interacción:

- Seleccionar 7918 muestra `tel:+19036302661`; seleccionar 2127 cambia a `tel:+19032669005` y a su dirección/mapa.
- EN/ES conserva la página y `?location=broadway-2127`; la preferencia permanece al volver a Menús.
- El selector contiene solo las dos sucursales Broadway. No se muestra carta ni precio ficticio.
- El menú móvil abre con foco en cerrar, contiene Tab y Shift+Tab, cierra con Escape y devuelve el foco al disparador.
- El filtro Bebidas muestra tres imágenes. La ampliación navega con flechas, conserva el enlace de origen correcto, contiene el foco, cierra con Escape y devuelve el foco a la foto original.
- Las páginas de 5th Street y sus paneles conservan Próximamente/Coming soon. No hay teléfono, horario, pedido, reserva ni carta atribuida a esa sede.
- Se revisaron los valores de enlaces `tel:`, `mailto:`, redes y destinos completos de mapas. No se realizaron llamadas, envíos de correo ni acciones en redes.

## Consola

La portada compilada se revisó sin errores ni advertencias de aplicación. Lighthouse, con perfil limpio sin extensiones, confirmó ausencia de errores de consola tras incorporar el favicon.

El navegador interactivo del equipo sí produjo errores ajenos al código servido: en desarrollo, diferencias de hidratación por atributos `bis_*` inyectados; al navegar, `M_ID` desde `chrome-extension://eppiocemhmnlbhjplcgkofciiegomcon/`. Se conservó la extensión y no se ocultaron ni suprimieron advertencias con código de la web. No se atribuyen esos mensajes a una validación limpia de todo el entorno del usuario.

## Lighthouse y límites de rendimiento

Auditoría móvil simulada de `/en`, viewport 412 × 823, escala 1,75, CPU 4×, RTT 150 ms y 1.638,4 Kbps. Reportes completos en `reports/lighthouse-mobile*.json`.

| Corrida                                                       | Rendimiento | Accesibilidad | Buenas prácticas | SEO |   LCP |   CLS |    TBT |
| ------------------------------------------------------------- | ----------: | ------------: | ---------------: | --: | ----: | ----: | -----: |
| Inicial                                                       |          95 |           100 |               96 |  66 | 2,9 s | 0,035 |  50 ms |
| Con favicon, nombres accesibles y fuentes locales precargadas |          90 |           100 |              100 |  66 | 3,3 s |     0 | 190 ms |
| Repetición posterior                                          |          80 |           100 |              100 |  66 | 3,4 s |     0 | 480 ms |

La precarga eliminó el desplazamiento observado de fuentes. El LCP medido no cumple aún la meta orientativa de 2,5 s. El rendimiento varió entre corridas en el mismo equipo; no se garantiza una puntuación ni se selecciona solamente la mejor corrida. Requiere seguir optimizando y medir en el hosting/red de destino. TBT es un diagnóstico de laboratorio, no una medición de INP real.

SEO está deliberadamente limitado por `noindex, nofollow` y `robots.txt` de la vista previa. No se habilitó indexación para mejorar la puntuación. Accesibilidad 100 es un diagnóstico automatizado, no una certificación integral de WCAG 2.2 AA.

Las últimas correcciones de tamaño táctil (wordmark y controles de lightbox a 44 px) también pasaron el build y la matriz responsive; no alteran la carga de recursos auditada. No se han medido usuarios reales, disponibilidad de proveedores externos ni servicios comerciales no confirmados.

## Qué queda para el lanzamiento

La implementación de vista previa está disponible. Los bloqueos editoriales y operativos reales se detallan en `PENDIENTES.md`: cartas, horarios, logo, originales de alta resolución, derechos de fotografías, estado de 5th Street, dominio y privacidad del hosting. No se realizó publicación.

## Actualización: entradas y formulario SMTP

Se añadieron entradas nativas de 250 ms con secuencias de hasta 120 ms y desplazamiento vertical de 14 px. Se ejecutan al cargar/cambiar de página y cuando las secciones entran en pantalla. No hay dependencia de animación nueva, secuestro de scroll ni contenido oculto si falta JavaScript. La preferencia `prefers-reduced-motion` cancela las animaciones activas y conserva el contenido visible. Se observó en navegador la transición de entrada y el contenido completo tras terminar.

El formulario de Contacto EN/ES está activo en la vista previa. La comprobación real `npm run smtp:verify` verificó conexión, STARTTLS y autenticación de Microsoft 365 en puerto 587. No se enviaron mensajes de prueba al destinatario ni a terceros. Esa verificación no afirma entrega final en una bandeja.

`npm run validate` pasó con lint, tipado, **12 pruebas** y build. Las seis pruebas adicionales cubren configuración incompleta, campos, consentimiento, antispam, cabeceras, origen, tamaño, espera de aceptación, fallo del proveedor y rate limiting. El MIME se generó en memoria; las entregas de tests usan una función controlada y no conectan con buzones.

En navegador se comprobó que el formulario está habilitado, que enviar vacío produce errores EN/ES y lleva el foco al nombre, sin enviar correos. Se revisó el diseño de Contacto en EN/ES a 360, 390, 768, 1024 y 1440 px: diez vistas, sin scroll horizontal y con envío habilitado. Los resultados están en reports/contact-responsive.json. La búsqueda del secreto configurado en los archivos del cliente, fuentes y documentación encontró cero coincidencias. Los datos privados solo están en `.env.local`, excluido del ZIP; el cliente recibe únicamente una bandera de disponibilidad. La configuración y el límite por proceso se explican en `SMTP.md`.

No se repitió Lighthouse por estos cambios; sus números anteriores son una línea base, no métricas garantizadas de la versión con animaciones y formulario.
