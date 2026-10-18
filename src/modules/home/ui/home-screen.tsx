import { PageShell } from "@/shared/ui/page-shell";

export function HomeScreen() {
  return (
    <PageShell>
      <section className="hero" aria-labelledby="page-title">
        <p className="eyebrow">ABC · Next.js template</p>
        <h1 id="page-title">Una base modular lista para crecer.</h1>
        <p className="description">
          Las rutas viven en <code>app</code>, las capacidades de producto en <code>modules</code> y
          las piezas transversales en <code>shared</code>.
        </p>
        <div className="cards">
          <article>
            <h2>Empieza simple</h2>
            <p>Crea sólo los módulos y capas que tu funcionalidad realmente necesita.</p>
          </article>
          <article>
            <h2>Escala con límites</h2>
            <p>La skill local mantiene separadas la UI, el dominio y la infraestructura.</p>
          </article>
          <article>
            <h2>Comparte sin acoplar</h2>
            <p>Cuando haya varios repositorios, usa paquetes o contratos versionados.</p>
          </article>
        </div>
      </section>
    </PageShell>
  );
}
