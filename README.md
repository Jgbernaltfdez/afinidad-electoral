# Afinidad Electoral

Primera versión de una aplicación web Next.js para comparar preferencias ciudadanas con programas electorales al Congreso.

## Requisitos
- Node.js 20.9 o superior
- npm

## Arranque local
```bash
npm install
npm run dev
```
Abre http://localhost:3000

## Qué incluye esta primera entrega
- Selector de las 52 circunscripciones.
- Cuestionario de 15 preguntas multirrespuesta.
- Pesos por materia que suman el 100 %.
- Navegación pregunta a pregunta y barra de progreso.
- Persistencia local del progreso en el navegador.
- Candidaturas de Madrid cargadas como semilla desde BOE-A-2026-23103.
- Estructura inicial del motor de compatibilidad y del modelo de evidencias.

## Qué falta antes de publicar resultados
1. Importar las candidaturas proclamadas del BOE para las 52 circunscripciones.
2. Recopilar los programas electorales de cada candidatura.
3. Codificar las posiciones por pregunta y opción, adjuntando fuente, página, cita breve y fecha de revisión.
4. Someter las codificaciones a revisión para evitar atribuciones no sustentadas.
5. Conectar el motor `lib/scoring.ts` a los perfiles verificados.

**Importante:** el proyecto no inventa porcentajes. En esta fase identifica candidaturas de Madrid, pero indica expresamente que sus posiciones programáticas aún no están cargadas. Las otras circunscripciones tienen el selector preparado, pero requieren importar sus listas oficiales.

## Estructura
- `app/`: interfaz Next.js
- `data/questions.json`: preguntas, opciones y pesos
- `data/circunscripciones.json`: lista de circunscripciones
- `data/candidaturas.json`: candidaturas por circunscripción
- `lib/scoring.ts`: cálculo de afinidad y cobertura documental

## Fuentes iniciales
- BOE-A-2026-20742: Real Decreto de convocatoria.
- BOE-A-2026-23103: candidaturas proclamadas.
