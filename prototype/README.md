# Laboratorio de significados — prototipo de rediseño 2026

**Estado:** prototipo editorial y funcional. NO publicado en la web principal. Rama de GitHub: `redesign/2026-laboratorio`.

## Cómo verlo

Abrir `prototype/index.html` para español o `prototype/en/index.html` para inglés. Son archivos HTML/CSS/JS estáticos, sin paquetes npm ni CDN; `perfil.jpeg` está incluido en la raíz del ZIP.

Hacer scroll desde el hero hasta el laboratorio para observar (1) estado inicial, (2) selección y actualización condicional con proyector de rango 1, (3) proyección sobre plano de rango 2 y (4) descomposición visual. Pulsar «Invertir orden» para comparar las probabilidades conjuntas. Cambiar tema con el botón de la cabecera.

## Cálculo formal

- Espacio euclídeo real de dimensión 3; \(\psi_0=(0.6,0.48,0.64)\) normalizado.
- \(u=(0.8,0,0.6)\), \(Q=uu^T\): proyector ortogonal sobre la recta L.
- \(P=\mathrm{diag}(1,1,0)\): proyector ortogonal sobre plano S.
- L no está incluida en S.
- \(p(Q_\mathrm{sí},P_\mathrm{sí})=\|PQ\psi_0\|^2=0.47775744\).
- \(p(P_\mathrm{sí},Q_\mathrm{sí})=\|QP\psi_0\|^2=0.2304\).
- Estados tras dos «sí»: \( (1,0,0)\) o \(u\), respectivamente.
- Las interpolaciones visuales entre estados **no son** evoluciones físicas ni resultados humanos medidos. La disolución de la figura es una metáfora gráfica.

## Diseño

A (laboratorio geométrico, tipografía editorial) como base; B (tipografía hero de mayor impacto), C (líneas científicas conectadas con fuentes y aplicaciones). Sin bibliotecas, analítica, formularios ni recursos remotos en runtime; enlaces externos solamente al hacer clic.

## Límites

Es una portada prototipo con un capítulo de investigación y colaboración. No sustituye todavía las 10 páginas de la web actual. El contenido científico y las secciones completas se migrarán tras validar el efecto y su usabilidad, accesibilidad y funcionamiento.