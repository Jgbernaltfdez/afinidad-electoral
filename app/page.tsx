 "use client";

import { useEffect, useMemo, useState } from "react";
import questions from "../data/questions.json";
import provinces from "../data/circunscripciones.json";
import candidaturas from "../data/candidaturas.json";
import positionData from "../data/posiciones.json";
import { calculateCompatibility, type PartyProfile } from "../lib/scoring";

type Option = { id: string; text: string };
type Question = { id: string; title: string; weight: number; prompt: string; options: [string,string][] };
type Party = { id: string; name: string; source: string };
type Answers = Record<string, string[]>;

const qs = questions as Question[];
const provinceList = provinces as string[];
const partyData = candidaturas as Record<string, Party[]>;
const profiles = positionData as PartyProfile[];
const weights = Object.fromEntries(qs.map(q => [q.id, q.weight]));
const totalWeight = qs.reduce((sum, q) => sum + q.weight, 0);

export default function Home() {
  const [province, setProvince] = useState("Madrid");
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("afinidad-electoral-progress-v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.province) setProvince(parsed.province);
        if (parsed.answers) setAnswers(parsed.answers);
      } catch { /* progreso inválido: se ignora */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("afinidad-electoral-progress-v1", JSON.stringify({ province, answers }));
  }, [province, answers]);

  const current = qs[step];
  const answered = qs.filter(q => (answers[q.id] || []).length > 0).length;
  const selected = answers[current?.id] || [];
  const parties = partyData[province] || [];
  const results = parties.map(party => {
    const profile = profiles.find(item => item.id === party.id);
    return { party, score: profile ? calculateCompatibility(answers, weights, profile) : null };
  }).sort((a, b) => (b.score?.compatibility ?? -1) - (a.score?.compatibility ?? -1));

  function toggle(option: string) {
    setAnswers(prev => {
      const old = prev[current.id] || [];
      const next = old.includes(option) ? old.filter(x => x !== option) : [...old, option];
      return { ...prev, [current.id]: next };
    });
  }

  function reset() {
    if (!confirm("¿Quieres borrar todas tus respuestas y empezar de nuevo?")) return;
    setAnswers({});
    setStep(0);
    setShowResults(false);
    setStarted(false);
    localStorage.removeItem("afinidad-electoral-progress-v1");
  }

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#"><span className="brand-mark">AE</span><span>Afinidad <b>Electoral</b></span></a>
        <span className="edition">CONGRESO · 29N 2026</span>
      </header>

      {!started ? (
        <section className="hero">
          <div className="eyebrow"><span className="dot" /> COMPARADOR DE PROGRAMAS ELECTORALES</div>
          <h1>Tu voto.<br/><em>Tus prioridades.</em></h1>
          <p className="lead">Responde a 15 preguntas sobre políticas públicas y descubre qué programas electorales se acercan más a tus preferencias.</p>
          <div className="setup-card">
            <label htmlFor="province">Selecciona tu circunscripción</label>
            <select id="province" value={province} onChange={e => setProvince(e.target.value)}>
              {provinceList.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <div className="setup-meta"><span>15 preguntas</span><span>5–8 minutos</span><span>Respuestas privadas</span></div>
            <button className="primary full" onClick={() => { setStarted(true); setShowResults(false); }}>Comenzar cuestionario <span>→</span></button>
          </div>
          <div className="trust-note"><span>◎</span> No te pediremos datos personales. Tus respuestas se guardan únicamente en este dispositivo.</div>
        </section>
      ) : showResults ? (
        <section className="results">
          <div className="eyebrow">RESULTADO DEL CUESTIONARIO</div>
          <h1>Tu mapa de<br/><em>preferencias.</em></h1>
          <p className="lead">Circunscripción: <b>{province}</b>. Has respondido {answered} de {qs.length} preguntas.</p>
          {parties.length ? (
            <div className="notice">
              <b>Comparación documental de candidaturas</b>
              <p>Solo se calcula afinidad cuando existe una posición respaldada por una fuente identificable, una cita y una fecha de comprobación. La falta de información no cuenta como desacuerdo.</p>
              <div className="party-results">
                {results.map(({ party, score }) => (
                  <div className="party-result" key={party.id}>
                    <div className="party-result-name">{party.name}</div>
                    {score && score.compatibility !== null ? (
                      <div className="party-result-score">
                        <b>{score.compatibility}%</b>
                        <span>Cobertura documental: {score.coverage}% · {score.evidenceCount} evidencias</span>
                      </div>
                    ) : (
                      <div className="party-result-pending">
                        <b>Sin datos suficientes</b>
                        <span>No hay posiciones verificadas para tus respuestas.</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="smallprint">La cobertura indica qué proporción del peso de tus opciones seleccionadas puede compararse con evidencia documental. Un porcentaje de afinidad con cobertura baja debe interpretarse con cautela.</p>
            </div>
          ) : (
            <div className="notice"><b>Datos de candidaturas pendientes para {province}.</b><p>El cuestionario está disponible, pero todavía no se ha incorporado el listado oficial de candidaturas de esta circunscripción.</p></div>
          )}
          <div className="result-actions">
            <button className="primary" onClick={() => {setShowResults(false);setStep(0);}}>Revisar respuestas</button>
            <button className="secondary" onClick={reset}>Empezar de nuevo</button>
          </div>
          <p className="smallprint">Los resultados futuros incluirán porcentaje de afinidad, cobertura documental y evidencias por propuesta. La falta de información no se interpretará como desacuerdo.</p>
        </section>
      ) : (
        <section className="quiz">
          <div className="quiz-head">
            <div><div className="eyebrow">CIRCUNSCRIPCIÓN · {province.toUpperCase()}</div><div className="progress-label">Pregunta <b>{step + 1}</b> de {qs.length}<span>{Math.round((answered / qs.length) * 100)}% respondido</span></div></div>
            <button className="text-button" onClick={reset}>Salir</button>
          </div>
          <div className="progress"><div style={{width:`${((step+1)/qs.length)*100}%`}} /></div>
          <div className="question-kicker">BLOQUE {step+1} <span>·</span> PESO {current.weight}%</div>
          <h2>{current.title}</h2>
          <p className="question-prompt">{current.prompt}</p>
          <p className="hint">Puedes seleccionar todas las opciones con las que estés de acuerdo.</p>
          <div className="options">
            {current.options.map(([id,text]) => {
              const active = selected.includes(id);
              return <button key={id} className={`option ${active ? "selected" : ""}`} onClick={() => toggle(id)} aria-pressed={active}>
                <span className="option-letter">{id}</span><span className="option-text">{text}</span><span className="check">{active ? "✓" : ""}</span>
              </button>;
            })}
          </div>
          <div className="quiz-footer">
            <button className="secondary" onClick={() => step === 0 ? setStarted(false) : setStep(s => s-1)}>{step === 0 ? "Volver" : "← Anterior"}</button>
            <span className="answered-count">{answered}/{qs.length} respondidas</span>
            <button className="primary" disabled={selected.length === 0} onClick={() => step < qs.length-1 ? setStep(s => s+1) : setShowResults(true)}>{step === qs.length-1 ? "Ver resumen" : "Siguiente →"}</button>
          </div>
        </section>
      )}

      <footer className="footer"><span>AFINIDAD ELECTORAL</span><span>Herramienta informativa e independiente · No recomienda el voto</span></footer>
    </main>
  );
}
