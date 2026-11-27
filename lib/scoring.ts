/**
 * Cálculo de afinidad basado exclusivamente en posiciones con evidencia verificable.
 * La ausencia de información nunca se interpreta como desacuerdo.
 */
export type Stance = "support" | "oppose" | "mixed" | "unknown";
export type Evidence = {
  sourceTitle: string;
  url: string;
  page?: string;
  quote?: string;
  checkedAt: string;
};
export type PartyPosition = {
  questionId: string;
  optionId: string;
  stance: Stance;
  evidence?: Evidence;
};
export type PartyProfile = { id: string; name: string; positions: PartyPosition[] };

const VALUE: Record<Exclude<Stance, "unknown">, number> = {
  support: 1,
  mixed: 0.5,
  oppose: 0
};

// Respuestas de abstención: no representan una preferencia política puntuable.
const NON_SCORING_OPTIONS: Record<string, string[]> = {
  economia: ["F"],
  empleo: ["G"]
};

function hasVerifiableEvidence(position: PartyPosition): boolean {
  const evidence = position.evidence;
  return Boolean(
    position.stance !== "unknown" &&
    evidence?.sourceTitle?.trim() &&
    evidence?.url?.trim() &&
    evidence?.checkedAt?.trim() &&
    evidence?.quote?.trim()
  );
}

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
    const questionWeight = weights[questionId] ?? 0;
    const scorableOptions = selectedOptions.filter(
      optionId => !(NON_SCORING_OPTIONS[questionId] || []).includes(optionId)
    );
    if (!scorableOptions.length || questionWeight <= 0) continue;

    const optionWeight = questionWeight / scorableOptions.length;
    weightedPossible += questionWeight;

    for (const optionId of scorableOptions) {
      const position = party.positions.find(
        item => item.questionId === questionId && item.optionId === optionId
      );
      if (!position || !hasVerifiableEvidence(position)) continue;

      weightedScore += VALUE[position.stance as Exclude<Stance, "unknown">] * optionWeight;
      weightedKnown += optionWeight;
      evidenceCount += 1;
    }
  }

  return {
    compatibility: weightedKnown > 0
      ? Math.round((weightedScore / weightedKnown) * 100)
      : null,
    coverage: weightedPossible > 0
      ? Math.round((weightedKnown / weightedPossible) * 100)
      : 0,
    evidenceCount,
    comparableWeight: Math.round(weightedKnown * 100) / 100
  };
}
