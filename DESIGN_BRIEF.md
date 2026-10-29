# Arquitectura editorial — Laboratorio de significados

**Versión:** 2.0 · 29 octubre 2026  
**Destino:** rama `redesign/2026-laboratorio` del repositorio `alejandrommingo/alejandrommingo.github.io`  
**Estado:** documento de diseño; no sustituye la web publicada.

## Propósito y principio rector

Construir una web académica de Alejandro Martínez-Mingo (UNED) que invite a entrar por una idea científica y facilite después tres objetivos: (1) encontrar su investigación y publicaciones; (2) localizar formación, herramientas y materiales; (3) identificar una fuente académica para colaboración o entrevistas. Evitar la estética de CV corporativo y los argumentos de autoridad no documentados.

**Regla editorial:** la geometría es un ejemplo formal de proyecciones sobre subespacios, no evidencia empírica de QST ni prueba de procesos cerebrales cuánticos. **Regla de verificación:** BPR sigue siendo línea en desarrollo; AGRUPA es participación en equipo de trabajo; Puerta de Hierro es colaboración metodológica y no adscripción clínica permanente.

## Arquitectura del sitio (bilingüe)

```text
/                         Inicio / Home (ES)
/en/                      Home (EN)
/investigacion/           Research (ES)
/en/research/             Research (EN)
/publicaciones/           Publications (ES)
/en/publications/         Publications (EN)
/herramientas/            Code and methods (ES; nueva)
/en/tools/                Code and methods (EN; nueva)
/docencia/                Teaching (ES)
/en/teaching/             Teaching (EN)
/divulgacion/             Talks & outreach (ES)
/en/talks/                Talks & outreach (EN)
/perfil/                  Academic profile & experience (ES; nueva)
/en/about/                Academic profile & experience (EN; nueva)
```

Mantener los enlaces existentes que ya han sido compartidos. Las páginas nuevas pueden introducirse sin modificar las URL existentes, con `canonical` y `hreflang` coherentes. `main` sigue intacta hasta completar pruebas. Una rama no ofrece automáticamente una URL pública de GitHub Pages.

**Menú desktop sugerido:** Investigación · Publicaciones · Código y métodos · Docencia · Divulgación · Perfil, con acceso a contacto, ES/EN y tema claro/oscuro. En móvil, menú accesible desplegable. La primera pantalla ofrece siempre un acceso directo y visible a las publicaciones y al contacto, incluso sin activar animaciones.

## Arquitectura de la portada

### 01 · Entrada: una pregunta y una demostración (hero)
**Objetivo:** captar interés y explicar inmediatamente la relación entre la pregunta y el trabajo científico.

**ES, copia de referencia:**
> **Alejandro Martínez-Mingo**  
> Psicología cognitiva · Lenguaje · Modelos computacionales  
> **¿Y si el significado no fuera un punto?**  
> Estudio cómo representamos conceptos, cómo cambian con el contexto y qué pueden explicar sobre la cognición humana los modelos del lenguaje.  
> **Explorar la geometría** · **Ver publicaciones**

**EN:**
> **Alejandro Martínez-Mingo**  
> Cognitive psychology · Language · Computational models  
> **What if meaning were not a point?**  
> I study how concepts are represented, how they change across contexts, and what language models can tell us about human cognition.  
> **Explore the geometry** · **Selected publications**

**Visualización:** mostrar desde el primer viewport el SVG interactivo del prototipo (sin retrato). Relato progresivo: estado inicial → proyector de rango uno → proyector de rango dos → desmontaje visual, con opción de invertir el orden. Conservar indicaciones matemáticas (`ψ₀`, `Q`, `P`, `S`, `L`, `dim`). El resultado del modelo no «demuestra» un proceso cognitivo; incluir una aclaración breve, visible y secundaria: *«Ejemplo geométrico ilustrativo; no son resultados experimentales».*

**Comportamiento:** desplazamiento opcional; botones para avanzar/retroceder e invertir orden; `prefers-reduced-motion`; alternativa estática sin JS; progreso visible y navegación disponible. Evitar obligar a cuatro pantallas de scroll antes de acceder a contenidos.

### 02 · Identidad y accesos inmediatos
**Objetivo:** responder «¿quién es, dónde trabaja, dónde encuentro sus trabajos?». Una banda breve en lugar de un párrafo de CV.

**ES:** «Profesor ayudante doctor · Facultad de Psicología, UNED. Investigación en representación conceptual, modelos del lenguaje y metodología de las ciencias del comportamiento». Enlaces: **Publicaciones**, **Investigación**, **Código**, **Contacto**. Enlace contextual al perfil científico de la UNED.

**EN:** «Assistant Professor · Faculty of Psychology, UNED. Research on conceptual representation, language models and behavioral-science methodology». Mismos enlaces.

**Visual:** franja editorial sin cajas repetidas. No añadir métricas inventadas, recuentos de citas no verificados ni nombres de proyectos solicitados como si estuvieran concedidos.

### 03 · Investigación: cuatro ámbitos distintos
**Objetivo:** mostrar especialización principal y versatilidad metodológica sin fingir que todas las áreas tienen el mismo peso.

1. **Representación conceptual y cognición** / **Conceptual representation and cognition.** Modelos geométricos y probabilísticos de los conceptos; subespacios semánticos; comparación con representaciones vectoriales y modelos clásicos. Vincular al artículo de *Cognitive Systems Research* (2023), *Science Progress* (2024) y a `/investigacion/`.
2. **Modelos del lenguaje y medición psicológica** / **Language models and psychological measurement.** Evaluación de indicadores extraídos de LLM: *surprisal*, validez de constructo, diferencias individuales y generalización. Vincular a *Behavior Research Methods* (2026), *Psych* (2022) y `/publicaciones/`.
3. **Estereotipos sociales y arte (AGRUPA)** / **Social stereotypes and art (AGRUPA).** Trabajo en equipo de proyecto financiado en UAM, con descriptores de obras de arte y análisis computacional de constructos sociales. Vincular a GitHub `alejandrommingo/AGRUPA` y al apartado correspondiente de investigación; identificar **miembro del equipo de trabajo**, nunca IP.
4. **Metodología en investigación clínica** / **Methods in clinical research.** Colaboración estadística con el equipo de Cardiología y Hemodinámica del Hospital Universitario Puerta de Hierro Majadahonda. Vincular a bibliografía biomédica contrastable desde el Portal Científico UNED; no atribuir resultados clínicos propios sin evidencia.

**Diseño:** cuatro capítulos numerados con distintos recursos gráficos, no cuatro tarjetas idénticas. Dar más extensión visual a las dos líneas principales. Usar referencias académicas como acompañamiento, no adornos pseudoempíricos.

### 04 · Publicaciones seleccionadas
**Objetivo:** acreditar la investigación con el mínimo esfuerzo de búsqueda.

**Título ES:** «Trabajos que explican por dónde va mi investigación». Alternativa más neutra: «Publicaciones seleccionadas».  
**EN:** «Selected publications».

**Cuatro trabajos de portada (orden editorial, no bibliométrico):**
- *Quantum projections on conceptual subspaces* (2023, *Cognitive Systems Research*; DOI `10.1016/j.cogsys.2023.101154`).
- *Surprisal from Large Language Models as an individual difference...* (2026, *Behavior Research Methods*; DOI `10.3758/s13428-026-03117-7`).
- *A failed cross-validation study on the relationship between LIWC linguistic indicators and personality...* (2022, *Psych*; DOI `10.3390/psych4040059`).
- *Quantum projections on conceptual subspaces: A deeper dive into methodological challenges and opportunities* (2024, *Science Progress*; DOI `10.1177/00368504241238773`).

Cada entrada: título completo, coautorías (en página secundaria, si portada compacta), revista, año, enlace DOI. El botón **«Todas las publicaciones»** abre `/publicaciones/`; allí se conservan las nueve referencias existentes, el capítulo de Elsevier y la **tesis doctoral como sección separada** (Dialnet `https://dialnet.unirioja.es/servlet/tesis?codigo=329016`, repositorio UAM), más el listado institucional UNED. No afirmar que son todas las publicaciones del autor.

### 05 · Código y métodos
**Objetivo:** ofrecer recursos útiles para investigadores y estudiantes, y reforzar la trazabilidad de la investigación.

**ES:** «Las herramientas que utilizo y desarrollo».  
**EN:** «Code, methods and research tools».

Mencionar inicialmente **QLang** (Python, subespacios y contexto), **QLSA** (R, LSA/subespacios), **AGRUPA** (R, análisis de descriptores) y **SampleSizeApp** (R, metodología estadística). LDAapp Cualitativas puede situarse en la página completa. Cada repositorio lleva estado documentado (prototipo, dependencias, limitaciones de acceso, si corresponde); no declarar software estable ni validación que no consten.

**Arquitectura:** tarjeta editorial pequeña por herramienta o listado de laboratorio, con relación a la línea científica y enlace externo al código. Nueva página `/herramientas/` a partir de los repos existentes, sin duplicar su documentación completa.

### 06 · Docencia y formación investigadora
**Objetivo:** que estudiantes del grado/máster y posibles doctorandos identifiquen qué enseña y en qué trabaja.

**ES:** «Docencia y formación»; tres asignaturas en 2026–2027:
- Introducción al Análisis de Datos (Grado en Psicología, UNED).
- Métodos Informáticos (Máster Interuniversitario en Metodología de las Ciencias del Comportamiento y de la Salud, UNED–UCM–UAM).
- Programación Avanzada en R (seminario optativo del mismo máster).

**EN:** «Teaching and research training», con las mismas guías oficiales enlazadas, sin inventar traducciones oficiales de los títulos. Añadir enlace a `/docencia/`, con proyectos de innovación Jamovi y BIIAD, actividades TFG/TFM y guías docentes.

### 07 · Charlas y divulgación
**Objetivo:** documentar experiencia pública y facilitar su descubrimiento a periodistas y organizadores.

**ES:** «Charlas y divulgación»; **EN:** «Talks and outreach».

Portada con dos o tres entradas representativas: charla de **Canal UNED** sobre sesgos cognitivos (2024), comunicaciones APS/AEMCCO (2026) y enlace a la entrevista de *El Referente* (2017) sobre Wibber. La página completa `/divulgacion/` conserva la entrevista de Santalucía, la presencia en actúaUPM y congresos, con fuentes originales y distinción explícita entre divulgación, congresos y entrevistas empresariales. No presentar notas de emprendeduría como medios científicos.

### 08 · Contacto, perfiles y trayectoria
**Objetivo:** cerrar con identidad verificable, correo directo y acceso a antecedentes completos.

**ES:** «Para colaboraciones científicas, propuestas de charlas o consultas de formación investigadora, puedes escribirme a la dirección institucional».  
**EN:** «For research collaborations, invited talks or enquiries about research training, please contact me at my institutional address».

Mostrar `a.martinez.m@psi.uned.es` como texto seleccionable, sin formulario de envío. Enlaces: UNED docente, Portal Científico UNED, ORCID **`0000-0002-5617-1453`**, GitHub, ResearchGate, LinkedIn, Bluesky. Retrato **opcional, pequeño y sin protagonismo**, en `/perfil/` o junto al contacto.

Nueva página `/perfil/` para que no desaparezcan de la web: UNED, IMIENS (secretaría académica), coedición de *Acción Psicológica*, innovación docente, docencia previa IE/UAM, Wibber (cofundador y director general), contribución al proyecto VioGén y colaboración con Puerta de Hierro. Las credenciales institucionales tendrán fuente; no tratar la beca/propuesta AEI 2026 como financiación concedida.

## Política de lenguaje y SEO

- Títulos descriptivos y específicos; evitar repetir palabras clave artificialmente. Primera página: `Alejandro Martínez-Mingo | Psicología cognitiva, lenguaje e IA | UNED`. Inglés: `Alejandro Martínez-Mingo | Cognitive Psychology, Language & AI | UNED`.
- Meta descripción basada en actividad verificable: «Investigación en representación conceptual, modelos del lenguaje y metodología psicológica. Publicaciones, código, docencia y charlas de Alejandro Martínez-Mingo (UNED).»
- Datos `Person` coherentes con perfiles institucionales y ORCID correcto. `ScholarlyArticle` solo para publicaciones reales; `CreativeWork` o equivalente pertinente para tesis si corresponde.
- Cada página con `canonical`, `hreflang`, `og:image` (tarjeta actual de geometría completa), `lang` correcto, `sitemap.xml` y texto alternativo accesible.
- Evitar que las palabras «cuántico» o «IA» sugieran resultados empíricos no alcanzados. Los enlaces externos deben seguir siendo fuentes, no decoración.
- Preservar rutas compartidas: las existentes pueden mantenerse; la decisión de URL nuevas no exige romper enlaces públicos de ayer.

## Reglas de interacción y accesibilidad

- La interacción se presenta como una **demostración formal**, no como un estudio psicológico ni medición cerebral. El modelo `Q→P` y su inverso muestran actualizaciones selectivas para resultados «sí, sí»; las probabilidades publicadas proceden de los proyectores, no de sujetos reales.
- Evitar que el contenido quede bloqueado hasta terminar la secuencia. Dejar enlace «Saltar al contenido» y una opción de controles manuales junto al scroll.
- `prefers-reduced-motion`, navegación por teclado, estados de foco, contraste WCAG, idioma de cada página y alternativa sin JavaScript.
- La geometría no debe ocupar indefinidamente la pantalla en móvil; fase interactiva más breve y opción visible de ir directamente a investigación/publicaciones.
- No se requiere servidor ni servicios externos para funcionamiento, salvo GitHub Pages como alojamiento estático y enlaces que los visitantes decidan abrir.

## Estrategia de ejecución

**Sprint siguiente — prototipo v2:**
1. Extraer el módulo geométrico y colocarlo en la **primera pantalla**, con texto editorial más breve y **sin foto**.
2. Sustituir el capítulo demostrativo largo por pasos de scroll más compactos, con indicador de progreso y controles manuales.
3. Implementar la banda de identidad, cuatro áreas de investigación y los accesos de publicaciones, código, docencia y divulgación.
4. Incorporar contacto y perfiles con ORCID correcto; reservar historial detallado para `/perfil/`.
5. Preparar tema claro y oscuro, español e inglés, sin redirigir desde `main` ni cambiar las páginas públicas.
6. Comprobar matemáticas, jerarquía de encabezados, teclado, móvil, enlace interno, ausencia de FOUC, SEO de previsualización y rendimiento.

**Validación de contenido:** revisión contra CVN/CVA, enlaces institucionales y repositorios actualmente disponibles. **Validación UX:** probar que una persona encuentra una publicación y el contacto en menos de dos interacciones de navegación, sin necesidad de atravesar la demostración.

## Decisiones explícitas

- **Sí:** una primera pantalla científica e interactiva, con texto editorial y geometría.
- **No:** retrato enorme, claims de financiación no concedida, efecto de «cerebro cuántico» ni gráficos con apariencia de resultados reales inventados.
- **Sí:** vínculos entre pregunta científica, publicación, herramienta y colaboración real.
- **No:** convertir la página en un CV exhaustivo o un catálogo de tarjetas indistinguibles.