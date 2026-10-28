# GitHub y Vercel

El usuario solicitó subir el proyecto a `MaycollJaramillo01/AZTEC-URBAN-MX` y desplegarlo en Vercel. La raíz del repositorio es la aplicación Next.js; no se necesita una subcarpeta de proyecto.

URL de producción: https://aztec-urban-mx.vercel.app. La raíz redirige a `/en`; español está en `/es`. El repositorio GitHub está conectado al proyecto Vercel.

## Configuración

- Proyecto Vercel: `aztec-urban-mx`, dentro de `maycolljaramillo01s-projects`.
- Framework Next.js, Node.js 22.x, instalación `npm ci`, build `npm run build`.
- Configuración declarativa en `vercel.json`; no establecer `public` como Output Directory porque Next.js genera también funciones.
- `.vercel/`, `.env.local`, dependencias, build y reportes locales se excluyen de Git.
- `.vercelignore` impide cargar secretos, originales de trabajo, reportes y documentación en el paquete de despliegue. Las imágenes de la web están en `public/images/aztec` y sí se despliegan.

## Variables de servidor

Configurar en Production: `CONTACT_FORM_ENABLED`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `SMTP_TO`, `SITE_INDEXABLE`. Los valores están almacenados como secretos en Vercel. Nunca pasarlos como argumentos CLI ni incluirlos en commits.

El formulario usa Microsoft 365 con STARTTLS. Los campos están habilitados solo cuando existe configuración completa; éxito significa aceptación SMTP, no una garantía de entrega en bandeja. No se enviaron mensajes de prueba reales durante las comprobaciones.

La regla WAF `Contact form limit` está publicada: cinco POST a `/api/contact` por IP en una ventana de 600 segundos. Vercel cuenta por región; además existe un límite de aplicación por proceso. No compartir los secretos SMTP con builds de forks ni añadirlos al código cliente.

## Indexación

`SITE_INDEXABLE=false` mantiene noindex y el sitemap vacío mientras se confirma el contenido. No se asigna un dominio comercial sin confirmación. Para el lanzamiento definitivo, configurar `SITE_URL` con el origen verificado, revisar `PENDIENTES.md` y ejecutar un nuevo build.

## Publicar cambios

```powershell
npm ci
npm run validate
git push origin main
```

Si se necesita un despliegue manual desde un checkout ya vinculado:

```powershell
vercel --prod --yes --scope maycolljaramillo01s-projects
```

Verificar el estado Ready, ambas versiones de idioma, ubicaciones, `/api/contact` y la ausencia de secretos en el repositorio. No efectuar un envío real a una bandeja sin la instrucción correspondiente.
