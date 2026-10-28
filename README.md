# Aztec Urban MX

Sitio bilingüe de Aztec Urban MX, preparado para Next.js en Vercel. Repositorio: https://github.com/MaycollJaramillo01/AZTEC-URBAN-MX. Configuración y operación del despliegue en `docs/DEPLOY.md`.

## Empezar

Requiere Node.js 20.9 o superior. Probado con Node 22.20.0. Las dependencias y sus versiones exactas están en `package.json` y `package-lock.json`.

```powershell
cd C:\Users\Mayco\Downloads\AZTEC-imagenes-y-prompt\aztec-urban-mx
npm ci
npm run dev
```

Abrir http://127.0.0.1:3000. `/` redirige a `/en`; español en `/es`.

Para revisar una compilación optimizada:

```powershell
npm run build
npm start
```

No ejecutar `dev` y `start` en el mismo puerto. La vista previa se limita a la interfaz de loopback del equipo.

## Rutas

Las diez páginas existen bajo `/en` y `/es`: inicio, `menu`, `locations`, `locations/broadway-7918`, `locations/broadway-2127`, `locations/fifth-street`, `story`, `gallery`, `contact` y `privacy`. Los slugs se mantienen iguales entre idiomas; se traducen contenido, navegación, controles, alternativas de imagen y metadatos. El documento HTML se sirve con el idioma correcto. El selector EN/ES conserva la ruta y la consulta de sucursal.

## Tecnología y estructura

- Next.js 16.4.3, App Router, React 19.3.1 y TypeScript estricto. Versiones estables comprobadas en npm y documentación oficial al construir.
- Páginas prerenderizadas con componentes de servidor. Interacciones de cliente limitadas al selector, navegación móvil, galería, copia de dirección y eventos locales.
- CSS propio con tokens, sin biblioteca de componentes adicional ni base de datos.
- Barlow Condensed 600 y DM Sans 400/600, obtenidas de Fontsource y servidas desde archivos locales con precarga de `next/font/local`. Licencias OFL en `docs/licenses/`.
- Paleta, estructura editorial y fondos alternados siguen el brief. Entradas nativas de 250 ms, desplazamiento de 14 px y secuencias de hasta 120 ms; soporte dinámico de `prefers-reduced-motion`, limpieza al cambiar de ruta y contenido visible sin JavaScript.
- Wordmark tipográfico provisional. No se ha redibujado el símbolo circular del avatar.

```text
src/data/brand.ts             Marca, correo, redes y funciones deshabilitadas
src/data/locations.ts         Direcciones y teléfonos por ID estable
src/data/menus.ts             Cartas aprobadas, inicialmente vacío
src/data/images.json          Inventario de los 8 archivos utilizados y derivados
src/lib/i18n.ts               Traducciones y rutas
src/lib/seo.ts                Metadatos y datos estructurados condicionados
src/lib/validate-content.ts   Validación de relaciones y estados
src/components/              Presentación e interacciones
src/app/                     Rutas, estilos, robots y sitemap
scripts/prepare-assets.mjs    Derivados sin alterar originales
scripts/check-routes.mjs      Validación HTTP de las 20 páginas
tests/content.test.ts         Pruebas de integridad y aislamiento
docs/                        Mantenimiento, pendientes, validación y licencias
```

## Comprobar

```powershell
npm run lint
npm run typecheck
npm test
npm run build
# Con un servidor local encendido:
npm run test:routes
# Se admite otro origen local:
node scripts/check-routes.mjs http://127.0.0.1:3001
```

`npm run validate` encadena lint, tipado, pruebas y build. Las pruebas de cartas usan una fixture temporal solo en memoria, que nunca llega al sitio ni a sus archivos de contenido.

## Contenido e imágenes

Los archivos originales siguen intactos en la carpeta superior `imagenes/`. `src/data/images.json` registra cuenta, enlace de origen, archivo y SHA-256 original, categoría revisada, dimensiones, variantes, alt EN/ES, punto focal y aprobación pendiente. Ninguna foto tiene sede atribuida ni nombre de receta verificado. Dos imágenes son miniaturas de reels, sin reproducir video. Se excluyeron avatares de 150 px, flyers y promociones.

Se incluyen WebP y JPEG responsive a 320 px y al ancho original, sin ampliar los originales. `npm run assets` los regenera a partir del paquete superior. `originals/` conserva además copias binarias de los ocho originales utilizados y una copia del inventario; permite regenerar los derivados y ejecutar las pruebas al trasladar el proyecto. El archivo completo de 26 imágenes sigue intacto en la carpeta superior.

La foto de hero procede de un original de 640 × 427 px. Se usa en una columna de hasta 640 px; no se promete calidad original de alta resolución. Solicitar el original para pantallas de alta densidad. Toda aprobación de publicación está pendiente, documentada fuera de la interfaz del visitante.

## Comportamiento y privacidad

El menú comienza con una elección explícita entre 7918 y 2127. Guarda solo el ID en `localStorage` (`aztec:location`); funciona sin almacenamiento disponible. Los enlaces directos admiten `?location=broadway-7918` y `?location=broadway-2127`. Sin carta aprobada, se ofrece la llamada correcta. 5th Street nunca participa en el selector.

Teléfono y mapas se construyen exclusivamente desde los datos de cada sede. No se muestran horarios inventados, precios, pedidos, reservas, reseñas ni promociones. Los visitantes pueden copiar una dirección. Galería y menú móvil contienen el foco, cierran con Escape y devuelven el foco al control que los abrió.

Eventos `aztec:interaction`: `select_location`, `view_menu`, `click_phone`, `click_directions`, `click_email`, `click_social`, con `language` y `location_id` (nullable para la marca). Son CustomEvents en memoria; no hay envío, registro persistente ni proveedor de analítica. En caso de integrar uno, revisar privacidad antes de conectarlo.

Pedidos, reservas y newsletter siguen deshabilitados. El formulario de contacto EN/ES está implementado con una API Node.js y Nodemailer para SMTP existente. Su envío queda desactivado hasta completar y habilitar la configuración del servidor; no se simula ninguna confirmación de envío. Consulta `docs/SMTP.md`. Las redes y mapas son enlaces externos; no hay feeds ni mapas embebidos. No hay cookies no esenciales ni banner ficticio.

## SEO y lanzamiento

La vista previa es `noindex, nofollow`, `robots.txt` bloquea el rastreo y el sitemap está vacío. No hay canonical con un dominio supuesto. El Open Graph incluye título y descripción; se omite la imagen hasta aprobar derechos de publicación.

Antes de lanzar, revisar `docs/PENDIENTES.md`, aprobar contenido y privacidad, y configurar `.env.local` usando `.env.example`. Solo con `SITE_URL` HTTPS verificado y `SITE_INDEXABLE=true` se emiten canonical, hreflang, sitemap y marcado Organization/Restaurant. El marcado Restaurant se limita a las dos sucursales operativas y omite horarios, precio, valoraciones, coordenadas y carta sin confirmar. Cambios de estas variables requieren un nuevo build.

La configuración de Vercel está en `vercel.json`. El proyecto se vincula al repositorio GitHub; los secretos se configuran en Vercel y no se guardan en Git. Los reportes y capturas de QA son artefactos locales y no se versionan.

Consultar [mantenimiento](docs/MANTENIMIENTO.md), [pendientes reales](docs/PENDIENTES.md) y [validación](docs/VALIDACION.md).

Referencias técnicas primarias: [instalación de Next.js](https://nextjs.org/docs/app/getting-started/installation), [App Router y layouts](https://nextjs.org/docs/app/api-reference/file-conventions/layout). También se revisaron las guías incluidas con la versión instalada en `node_modules/next/dist/docs/`.
