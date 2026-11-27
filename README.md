# Afinidad Electoral

Aplicación web Next.js para comparar preferencias ciudadanas con los programas de las candidaturas al Congreso.

## Estado de la documentación (27 de noviembre de 2026)

- 14 candidaturas de Madrid identificadas.
- 77 posiciones codificadas en 13 candidaturas.
- Cada posición puntuable incluye fuente, enlace, cita breve y fecha de comprobación.
- PCTE permanece sin posiciones puntuadas: el documento localizado se denomina «Programa de lucha» y las fuentes consultadas advierten que no es un programa electoral específico del 29N.
- La ausencia de una propuesta explícita se deja sin codificar; no se interpreta como apoyo ni como rechazo.

El registro de documentos, el tipo de fuente y las limitaciones de cobertura se describen en [data/fuentes.md](data/fuentes.md). Los datos estructurados están en [data/posiciones.json](data/posiciones.json).

## Criterio de codificación

1. Solo se puntúan posiciones vinculadas a una propuesta identificable.
2. Cada entrada exige título de fuente, URL, cita, fecha de comprobación y, cuando se dispone, página o apartado.
3. «support» significa que la propuesta respalda la opción concreta del cuestionario; «oppose» que la contradice explícitamente; «mixed» que la posición es mixta; «unknown» no puntúa.
4. No se infieren posturas por etiquetas ideológicas, declaraciones genéricas o silencio del programa.
5. Algunas fichas secundarias reproducen extractos de los PDF oficiales y se identifican como tales en el título de la fuente. Esas entradas requieren una segunda comprobación contra el PDF primario antes de considerarse definitivas.

## Cálculo y transparencia

- El peso de cada pregunta se reparte entre las opciones elegidas por el usuario.
- Las opciones sin evidencia no se consideran desacuerdo, pero reducen la cobertura documental.
- El porcentaje de afinidad se calcula solo sobre las opciones elegidas con evidencia.
- La interfaz permite desplegar las citas y abrir la fuente de cada posición que coincide con las respuestas del usuario.
- No se debe interpretar un porcentaje con cobertura baja como un ranking concluyente.

## Requisitos

- Node.js 20.9 o superior
- npm

## Arranque local

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Estructura

- `app/`: interfaz Next.js
- `data/questions.json`: preguntas, opciones y pesos
- `data/circunscripciones.json`: lista de circunscripciones
- `data/candidaturas.json`: candidaturas por circunscripción
- `data/posiciones.json`: posiciones y evidencias por candidatura
- `data/fuentes.md`: inventario de fuentes y límites documentales
- `lib/scoring.ts`: cálculo de afinidad y cobertura documental

## Pendiente

- Segunda revisión de cada cita contra el PDF oficial.
- Completar más materias y propuestas por candidatura.
- Localizar un programa electoral específico de PCTE para el 29N o mantenerlo sin puntuación.
- Importar y documentar candidaturas de las otras 51 circunscripciones.
