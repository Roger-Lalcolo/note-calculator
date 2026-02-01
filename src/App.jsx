import { useMemo, useState } from "react";

/** Convertit un input (string) en nombre, en acceptant virgule ou point. */
function toNumber(value) {
  if (value === null || value === undefined) return NaN;
  const cleaned = String(value).replace(",", ".").trim();
  return cleaned === "" ? NaN : Number(cleaned);
}

/** Calcule les sommes utiles : Σ(note_i * coef_i) et Σ(coef_i) à partir des lignes valides. */
function computeSums(notes) {
  let sumNotes = 0;
  let sumCoefs = 0;

  for (const row of notes) {
    const note = toNumber(row.note);
    const coef = toNumber(row.coef);

    // On ignore les lignes incomplètes ou avec coefficient non positif
    if (!Number.isNaN(note) && !Number.isNaN(coef) && coef > 0) {
      sumNotes += note * coef;
      sumCoefs += coef;
    }
  }

  return { sumNotes, sumCoefs };
}

/** Calcule la moyenne pondérée (moyenne avec coefficients) à partir des sommes. */
function computeWeightedAverage(sumNotes, sumCoefs) {
  if (sumCoefs <= 0) return null;
  return sumNotes / sumCoefs;
}

/**
 * Calcule la note requise x pour atteindre une moyenne cible M
 * en ajoutant une note future de coefficient c.
 * Formule : x = ( M*(Σc + c) - Σ(note*coef) ) / c
 */
function computeRequiredGrade({ sumNotes, sumCoefs, target, coefFuture }) {
  const M = toNumber(target);
  const c = toNumber(coefFuture);

  if (sumCoefs <= 0 || Number.isNaN(M) || Number.isNaN(c) || c <= 0) return null;

  const required = (M * (sumCoefs + c) - sumNotes) / c;
  return required;
}

export default function App() {
  const [notes, setNotes] = useState([
    { note: "", coef: "" },
    { note: "", coef: "" },
  ]);

  // Simulation (optionnelle)
  const [target, setTarget] = useState("");
  const [coefFuture, setCoefFuture] = useState("");

  // Paramètre global (utile si /6, /20, etc.)
  const [maxNote, setMaxNote] = useState("20");

  /** Met à jour une cellule (note/coef) d’une ligne. */
  const handleChange = (index, field, value) => {
    setNotes((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  /** Ajoute une nouvelle ligne note/coef. */
  const addLine = () => setNotes((prev) => [...prev, { note: "", coef: "" }]);

  /** Supprime une ligne note/coef. */
  const removeLine = (index) => setNotes((prev) => prev.filter((_, i) => i !== index));

  /** Réinitialise tous les champs. */
  const resetAll = () => {
    setNotes([
      { note: "", coef: "" },
      { note: "", coef: "" },
    ]);
    setTarget("");
    setCoefFuture("");
    setMaxNote("20");
  };

  const sums = useMemo(() => computeSums(notes), [notes]);

  const average = useMemo(() => {
    const avg = computeWeightedAverage(sums.sumNotes, sums.sumCoefs);
    return avg === null ? null : avg;
  }, [sums.sumNotes, sums.sumCoefs]);

  const max = useMemo(() => {
    const m = toNumber(maxNote);
    return Number.isNaN(m) || m <= 0 ? 20 : m;
  }, [maxNote]);

  const required = useMemo(() => {
    return computeRequiredGrade({
      sumNotes: sums.sumNotes,
      sumCoefs: sums.sumCoefs,
      target,
      coefFuture,
    });
  }, [sums.sumNotes, sums.sumCoefs, target, coefFuture]);

  const simulation = useMemo(() => {
    if (required === null || !Number.isFinite(required)) return null;

    let message = "Objectif atteignable";
    let color = "text-green-400";

    if (required > max) {
      message = `Objectif impossible (note requise > ${max})`;
      color = "text-red-400";
    } else if (required <= 0) {
      message = "Objectif déjà atteint (même 0 suffit)";
      color = "text-green-400";
    } else if (required > 0.85 * max) {
      message = "Objectif difficile (proche de la note maximale)";
      color = "text-yellow-400";
    }

    return {
      requiredRounded: required.toFixed(2),
      message,
      color,
    };
  }, [required, max]);

  const hasAnyValidLine = sums.sumCoefs > 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Calculateur de moyenne avec coefficients
          </h1>
          <p className="text-gray-300 mt-2">
            Saisissez vos notes et coefficients pour obtenir votre moyenne.
            La section “Simulation” permet ensuite d’estimer la note requise pour une moyenne cible.
          </p>
        </header>

        <div className="bg-gray-800/60 rounded-xl p-4 sm:p-6 shadow">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold">Notes</h2>
            <button
              onClick={resetAll}
              className="text-sm text-gray-300 hover:text-white"
              type="button"
            >
              Réinitialiser
            </button>
          </div>

          <div className="space-y-2">
            {notes.map((row, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Note"
                  value={row.note}
                  onChange={(e) => handleChange(i, "note", e.target.value)}
                  className="w-1/2 p-2 rounded bg-gray-900/70 border border-gray-700 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Coefficient"
                  value={row.coef}
                  onChange={(e) => handleChange(i, "coef", e.target.value)}
                  className="w-1/3 p-2 rounded bg-gray-900/70 border border-gray-700 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => removeLine(i)}
                  className="w-1/6 p-2 rounded bg-gray-900/70 border border-gray-700 hover:border-red-500 hover:text-red-300"
                  type="button"
                  title="Supprimer la ligne"
                >
                  Suppr.
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addLine}
            className="mt-3 text-sm text-blue-400 hover:text-blue-300"
            type="button"
          >
            Ajouter une note
          </button>

          <div className="mt-6 grid sm:grid-cols-3 gap-2">
            <div className="sm:col-span-1">
              <label className="text-sm text-gray-300">Note maximale</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="20"
                value={maxNote}
                onChange={(e) => setMaxNote(e.target.value)}
                className="w-full mt-1 p-2 rounded bg-gray-900/70 border border-gray-700 focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                Exemple : 20 (standard), 6 (notation sur 6), etc.
              </p>
            </div>

            <div className="sm:col-span-2 flex items-end">
              <div className="w-full text-center bg-gray-900/40 rounded-lg p-3 border border-gray-700">
                <div className="text-sm text-gray-300">Moyenne actuelle</div>
                <div className="text-2xl font-bold mt-1">
                  {average === null ? "—" : average.toFixed(2)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {hasAnyValidLine ? `Somme des coefficients : ${sums.sumCoefs.toFixed(2)}` : "Ajoutez au moins une ligne valide (note + coefficient)."}
                </div>
              </div>
            </div>
          </div>

          <hr className="my-6 border-gray-700" />

          <h2 className="text-lg font-semibold mb-2">Simulation (optionnelle)</h2>
          <p className="text-gray-300 text-sm mb-4">
            Estime la note nécessaire sur une prochaine évaluation pour atteindre une moyenne cible.
          </p>

          <div className="grid sm:grid-cols-2 gap-2">
            <div>
              <label className="text-sm text-gray-300">Moyenne cible</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="Ex : 12.5"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full mt-1 p-2 rounded bg-gray-900/70 border border-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Coefficient de la note à venir</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="Ex : 2"
                value={coefFuture}
                onChange={(e) => setCoefFuture(e.target.value)}
                className="w-full mt-1 p-2 rounded bg-gray-900/70 border border-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-4">
            {simulation ? (
              <div className="text-center bg-gray-900/40 rounded-lg p-3 border border-gray-700">
                <div className="text-sm text-gray-300">Note minimale estimée</div>
                <div className="text-2xl font-bold mt-1">{simulation.requiredRounded}</div>
                <div className={`text-sm font-semibold mt-2 ${simulation.color}`}>
                  {simulation.message}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Formule : x = ( M(Σc + c) − Σ(note·coef) ) / c
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-400 text-sm">
                Renseignez une moyenne cible et un coefficient (avec au moins une note valide) pour afficher une estimation.
              </p>
            )}
          </div>
        </div>

        <footer className="text-center text-xs text-gray-500 mt-6">
          Calculateur local : aucune création de compte requise.
        </footer>
        <section className="mt-8 bg-gray-800/40 border border-gray-700 rounded-xl p-4 sm:p-6">
  <h2 className="text-lg font-semibold">Questions fréquentes</h2>

  <div className="mt-3 space-y-2 text-sm text-gray-300">
    <details className="bg-gray-900/30 border border-gray-700 rounded-lg p-3">
      <summary className="cursor-pointer text-white font-medium">
        Comment est calculée la moyenne avec coefficients ?
      </summary>
      <p className="mt-2 leading-relaxed">
        La moyenne pondérée se calcule en additionnant chaque note multipliée par son coefficient,
        puis en divisant par la somme des coefficients : Σ(note × coef) / Σ(coef).
      </p>
    </details>

    <details className="bg-gray-900/30 border border-gray-700 rounded-lg p-3">
      <summary className="cursor-pointer text-white font-medium">
        Est-ce que l’outil fonctionne pour une notation sur 20, sur 6, ou autre ?
      </summary>
      <p className="mt-2 leading-relaxed">
        Oui. Vous pouvez définir la note maximale (20, 6, etc.). Le calcul de moyenne reste identique,
        seule l’échelle change. La simulation compare aussi la note requise à la note maximale.
      </p>
    </details>

    <details className="bg-gray-900/30 border border-gray-700 rounded-lg p-3">
      <summary className="cursor-pointer text-white font-medium">
        À quoi sert la section “Simulation” ?
      </summary>
      <p className="mt-2 leading-relaxed">
        Elle estime la note minimale à obtenir sur une prochaine évaluation (avec son coefficient)
        pour atteindre une moyenne cible. Si la note requise dépasse la note maximale, l’objectif est
        considéré comme impossible dans le cadre de l’échelle choisie.
      </p>
    </details>

    <details className="bg-gray-900/30 border border-gray-700 rounded-lg p-3">
      <summary className="cursor-pointer text-white font-medium">
        Puis-je saisir des décimales avec une virgule ?
      </summary>
      <p className="mt-2 leading-relaxed">
        Oui. Les entrées acceptent la virgule ou le point pour les décimales.
      </p>
    </details>
  </div>
</section>
      </div>
    </div>
  );
}
