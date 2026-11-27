/**
 * Modelo de datos para la compatibilidad.
 * Una posición solo puede puntuarse cuando tiene evidencia documental.
 * Valores: "support" | "oppose" | "mixed" | "unknown".
 */
export type Stance = "support" | "oppose" | "mixed" | "unknown";
export type Evidence = { sourceTitle: string; url: string; page?: string; quote?: string; checkedAt: string };
export type PartyPosition = { questionId: string; optionId: string; stance: Stance; evidence?: Evidence };
export type PartyProfile = { id: string; name: string; positions: PartyPosition[] };

const VALUE: Record<Stance, number> = { support: 1, mixed: 0.5, oppose: 0, unknown: 0 };

export function calculateCompatibility(
  answers: Record<string, string[]>,
  weights: Record<string, number>,
  party: PartyProfile
) {
  let weightedScore = 0;
  let weightedKnown = 0;
  let weightedPossible = 0;
  let evidenceCount = 0;

  for (const [questionId, selectedOptions] of Object.entries(answers)) {
    const weight = weights[questionId] ?? 0;
    if (!selectedOptions.length) continue;
    const positions = selectedOptions.map(optionId =>
      party.positions.find(p => p.questionId === questionId && p.optionId === optionId)
    );
    const known = positions.filter(p => p && p.stance !== "unknown");
    if (!known.length) continue;

    const average = known.reduce((sum, p) => sum + VALUE[p!.stance], 0) / known.length;
    weightedScore += average * weight;
    weightedKnown += weight;
    weightedPossible += weight;
    evidenceCount += known.filter(p => p?.evidence).length;
  }

  return {
    compatibility: weightedKnown ? Math.round((weightedScore / weightedKnown) * 100) : null,
    coverage: totalCoverage(weightedKnown, answers, weights),
    evidenceCount,
    comparableWeight: weightedKnown
  };
}

function totalCoverage(knownWeight: number, answers: Record<string, string[]>, weights: Record<string, number>) {
  const answeredWeight = Object.entries(answers).reduce((sum, [id, selected]) =>
    sum + (selected.length ? (weights[id] ?? 0) : 0), 0);
  return answeredWeight ? Math.round(knownWeight / answeredWeight * 100) : 0;
}
