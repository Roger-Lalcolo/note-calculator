import { Routes, Route, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import App from "./App.jsx";

const DOMAIN = "https://note-calculator-six.vercel.app";

function SeoPage({ title, description, canonicalPath, children }) {
  const canonical = `${DOMAIN}${canonicalPath}`;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/40 px-4 py-2 text-sm hover:bg-slate-900/60"
          >
            ← Accéder au calculateur
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
          {children}
        </div>

        <p className="mt-6 text-xs text-slate-500">
          Outil gratuit, sans compte, sans suivi.
        </p>
      </div>
    </div>
  );
}

export default function RouterApp() {
  return (
    <Routes>
      {/* Page principale : ton app actuelle (on ne la touche pas) */}
      <Route path="/" element={<App />} />
      
      <Route
        path="/moyenne-sur-20"
        element={
          <SeoPage
            title="Calcul de moyenne sur 20 (avec coefficients)"
            description="Calculez une moyenne sur 20 avec coefficients (moyenne pondérée) et accédez au calculateur en un clic."
            canonicalPath="/moyenne-sur-20"
          >
            <h1 className="text-2xl font-semibold">Calcul de moyenne sur 20</h1>
            <p className="mt-3 text-slate-300 leading-relaxed">
              Cette page explique le calcul d’une moyenne sur 20 avec coefficients (moyenne pondérée).
              La formule est : Σ(note × coef) / Σ(coef).
            </p>
            <p className="mt-3 text-slate-300 leading-relaxed">
              Exemple : (14×2 + 10×1 + 16×3) / (2+1+3) = 86 / 6 = 14,33.
            </p>
          </SeoPage>
        }
      />

      <Route
        path="/moyenne-sur-6"
        element={
          <SeoPage
            title="Calcul de moyenne sur 6 (avec coefficients)"
            description="Calculez une moyenne sur 6 avec coefficients (moyenne pondérée) et accédez au calculateur rapidement."
            canonicalPath="/moyenne-sur-6"
          >
            <h1 className="text-2xl font-semibold">Calcul de moyenne sur 6</h1>
            <p className="mt-3 text-slate-300 leading-relaxed">
              Le calcul d’une moyenne sur 6 est identique : seule l’échelle change.
              Vous utilisez toujours la moyenne pondérée : Σ(note × coef) / Σ(coef).
            </p>
            <p className="mt-3 text-slate-300 leading-relaxed">
              Dans le calculateur, définissez la note maximale à 6 pour que la simulation reste cohérente.
            </p>
          </SeoPage>
        }
      />

      <Route
        path="/guide-moyenne-coefficients"
        element={
          <SeoPage
            title="Guide : calcul de moyenne avec coefficients"
            description="Guide rapide pour calculer une moyenne pondérée avec coefficients, avec formule et exemple."
            canonicalPath="/guide-moyenne-coefficients"
          >
            <h1 className="text-2xl font-semibold">Guide : moyenne avec coefficients</h1>
            <p className="mt-3 text-slate-300 leading-relaxed">
              Une moyenne avec coefficients (pondérée) donne plus d’importance aux notes avec un coefficient plus élevé.
            </p>
            <ul className="mt-4 list-disc pl-5 text-slate-300 space-y-2">
              <li>Multiplier chaque note par son coefficient.</li>
              <li>Faire la somme de ces produits.</li>
              <li>Diviser par la somme des coefficients.</li>
            </ul>
            <p className="mt-4 text-slate-300 leading-relaxed">
              Formule : <span className="text-white">Σ(note × coef) / Σ(coef)</span>.
            </p>
          </SeoPage>
        }
      />

      {/* fallback */}
      <Route path="*" element={<App />} />
    </Routes>
  );
}
