# Laboratorio de significados — prototipo v2

**Estado:** rediseño en rama `redesign/2026-laboratorio`; no publicado en `main`.

El hero muestra directamente una demostración geométrica de proyectores ortogonales no conmutativos, sin fotografía. Compatible con español/inglés y tema claro/oscuro; sin bibliotecas externas, analítica ni formularios.

El scroll y los controles «anterior/siguiente» actualizan un estado en ℝ³: ψ₀=(0.6,0.48,0.64), u=(0.8,0,0.6), Q=uuᵀ, P=diag(1,1,0). En las dos secuencias sí-sí, las probabilidades conjuntas son ‖PQψ₀‖²=0.47775744 y ‖QPψ₀‖²=0.2304. La interpolación y la disolución son recursos narrativos, no procesos físicos ni resultados humanos.

La portada contiene las ocho secciones previstas: demostración, identidad, investigación, publicaciones, código, docencia, divulgación, trayectoria y contacto. Los accesos a contenido detallado apuntan temporalmente a la web pública actual; se migrarán en una versión final aprobada.

QA: Chromium 1440 y 390 px, ES/EN, claro/oscuro, sin errores de JS ni desbordamiento; comprobados orden inverso y etiquetas matemáticas.

Para prueba offline, descomprime el ZIP y abre `prototype-v2/index.html` o `prototype-v2/en/index.html`. Si la política del navegador impide abrir `file://`, sirve la carpeta local con `python -m http.server` desde la raíz de este paquete.