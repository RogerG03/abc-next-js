import { PageShell } from "@/shared/ui/page-shell";
import { tv } from "tailwind-variants";

const homeCard = tv({
  base: "grid min-h-44 gap-3 rounded-2xl border bg-white p-6 shadow-[0_12px_32px_rgb(30_50_90_/_0.05)]",
  variants: {
    tone: {
      accent: "border-blue-300",
      neutral: "border-slate-200",
    },
  },
  defaultVariants: {
    tone: "neutral",
  },
});

export function HomeScreen() {
  return (
    <PageShell>
      <section className="grid gap-6" aria-labelledby="page-title">
        <p className="text-sm font-bold tracking-[0.08em] text-blue-600 uppercase">
          ABC · Next.js template
        </p>
        <h1
          id="page-title"
          className="max-w-[16ch] text-[clamp(2.5rem,7vw,5rem)] leading-[0.98] font-bold tracking-[-0.06em]"
        >
          Una base modular lista para crecer.
        </h1>
        <p className="max-w-[60ch] text-lg leading-7 text-slate-600">
          Las rutas viven en{" "}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-[0.875em]">app</code>,
          las capacidades de producto en{" "}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-[0.875em]">
            modules
          </code>{" "}
          y las piezas transversales en{" "}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-[0.875em]">
            shared
          </code>
          .
        </p>
        <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-4">
          <article className={homeCard({ tone: "accent" })}>
            <h2 className="text-lg font-semibold">Empieza simple</h2>
            <p className="leading-6 text-slate-600">
              Crea sólo los módulos y capas que tu funcionalidad realmente necesita.
            </p>
          </article>
          <article className={homeCard()}>
            <h2 className="text-lg font-semibold">Escala con límites</h2>
            <p className="leading-6 text-slate-600">
              La skill local mantiene separadas la UI, el dominio y la infraestructura.
            </p>
          </article>
          <article className={homeCard()}>
            <h2 className="text-lg font-semibold">Comparte sin acoplar</h2>
            <p className="leading-6 text-slate-600">
              Cuando haya varios repositorios, usa paquetes o contratos versionados.
            </p>
          </article>
        </div>
      </section>
    </PageShell>
  );
}
