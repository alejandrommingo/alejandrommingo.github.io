# Web académica — Alejandro Martínez-Mingo

Web estática bilingüe publicada con GitHub Pages. No requiere servidor de aplicación, base de datos, analíticas, cookies, formularios ni recursos de terceros en tiempo de ejecución. Todo el contenido visible está en HTML y CSS; incorpora un pequeño script local para cerrar el menú móvil tras navegar, con Escape o al pulsar fuera. El menú sigue funcionando sin JavaScript gracias a `<details>`.

## Páginas
- `/` y `/en/`: perfil académico.
- `/investigacion/` y `/en/research/`: líneas de investigación y repositorios públicos.
- `/publicaciones/` y `/en/publications/`: referencias científicas seleccionadas con DOI.
- `/docencia/` y `/en/teaching/`: docencia y guías UNED.
- `/divulgacion/` y `/en/talks/`: conferencias y entrevistas, enlazadas a fuentes originales.

## Archivos
- `assets/site.css`: sistema visual compartido, diseño adaptable y navegación móvil.
- `perfil.jpeg`: fotografía local aportada por el titular.
- `favicon.svg`: icono local.
- `robots.txt`, `sitemap.xml`, `llms.txt`: rastreo e índice de contenidos. `llms.txt` es orientativo, no un estándar SEO garantizado.

## Publicación y mantenimiento
Publicar desde la rama `main` y la carpeta raíz del repositorio `alejandrommingo.github.io`. El contenido curricular debe verificarse contra el perfil docente y científico de la UNED, DOI originales, páginas institucionales y CVN. Actualizar la fecha `lastmod` del sitemap cuando se cambie contenido material. No incluir publicaciones aceptadas solo provisionalmente como si ya estuvieran publicadas.

## Visibilidad externa
Conectar la página con ORCID, UNED, ResearchGate, LinkedIn, Bluesky y perfiles de eventos científicos. La propiedad de Google Search Console y el envío del sitemap requieren intervención del titular.