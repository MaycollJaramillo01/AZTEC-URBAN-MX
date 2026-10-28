# Mantenimiento de contenido

## Sucursales y teléfonos

Editar `src/data/locations.ts`. Conservar los IDs `broadway-7918`, `broadway-2127` y `fifth-street`. Dirección, mapas, pie y contacto usan ese mismo origen de datos. Registrar `verifiedAt` únicamente al reconfirmar con el responsable.

`status: open` significa operativa según el brief, nunca abierta en este instante. No hay cálculos de “Open now”. La zona horaria es America/Chicago.

5th Street tiene un tipo separado con teléfono nulo. No basta cambiar un estado para abrirla: se requiere instrucción explícita del cliente, reconfirmar datos y actualizar los tipos, el selector, las relaciones, el contenido, el SEO y las pruebas en una misma revisión. No heredar información de Broadway.

## Añadir una carta aprobada

1. Solicitar la carta vigente de una sede concreta y confirmar precios, nombres, descripciones, fecha y versión. Revisar cualquier OCR contra el documento original.
2. Añadir un objeto `Menu` en `src/data/menus.ts` con `locationId` obligatorio, `locale`, `version`, `confirmedAt`, `pdfUrl` nullable y `categories` completas. `price` se escribe como texto exacto aprobado, no se calcula ni se inventa.
3. Crear registros EN y ES separados, cada uno asignado a la misma sede cuando corresponda. No copiar el contenido de otra sucursal sin confirmación explícita.
4. Si hay PDF, guardarlo en `public/menus/` y usar una ruta local real. El PDF complementa la carta HTML accesible. No añadir PDF vacío.
5. Añadir su `id` a `menuReferences` de la sede correspondiente. Solo puede haber una carta vigente por sede e idioma; archivar versiones previas fuera de este arreglo.
6. Correr `npm run validate`, abrir ambos idiomas y probar las dos sucursales. Deben cambiar contenido, llamada y dirección juntos.

El componente ya representa categorías, nombres, descripciones, precios y PDF opcional cuando existen datos aprobados. Con el arreglo vacío se muestra el contacto real de cada sede.

## Añadir horarios

Actualmente `hours` es `null` y su texto honesto ofrece llamar. Antes de introducir horarios se debe ampliar el tipo con días, rangos y excepciones de festivos confirmados. Sustituir el texto de llamada en las páginas individuales y comprobar EN/ES. Incorporar `openingHoursSpecification` solo después de esta confirmación. Si en el futuro se calcula el estado actual, usar America/Chicago y contemplar excepciones; no usar la zona del visitante.

## Actualizar fotos

1. Revisar el archivo real, su resolución, derechos, categoría y procedencia. La cuenta no confirma sede ni nombre de plato.
2. Conservar el original. Añadir la selección y alternativas EN/ES a `scripts/prepare-assets.mjs`; ejecutar `npm run assets`.
3. El script genera WebP y JPEG con tamaños de hasta el ancho original. No elimina marcas, etiquetas o textos del original.
4. Conservar en `images.json` todos los campos de procedencia y `locationId: null` hasta verificar la sede. Un `imageIds` de sucursal exige la misma sede en el registro de imagen.
5. `approvedForPublication` y `publicationApproval` solo se cambian con aprobación real. Registrar la evidencia y fecha en la documentación. El script establece pendientes por defecto; si se regenera después de aprobar, volver a revisar y conservar las aprobaciones verificadas.
6. Actualizar el Open Graph con una imagen aprobada antes de habilitar indexación. Revisar recortes en 360/390 y 1440 px; el lightbox muestra el archivo completo, incluida la etiqueta original del pulpo.

El inventario completo original está en `../inventario.json` y `../inventario.csv`; el de usos efectivos está en `src/data/images.json`.

## Texto e integraciones

Editar `src/lib/i18n.ts` para texto, `brand.ts` para correo/redes y `globals.css` para tokens. El esquema tipado exige las mismas claves por idioma. Máximo dos familias tipográficas; licencias en `docs/licenses/`.

Los flags no son una implementación de proveedor: no habilitarlos sin integrar y probar un servicio real. El formulario de contacto ya incorpora validación en servidor, límites, protección de secretos y éxito solo tras aceptación SMTP; para conectarlo al proveedor existente sigue `SMTP.md`. Cualquier analítica requiere configuración explícita y revisión del responsable. No agregar panel de administración ni base de datos para editar estos archivos estáticos.
