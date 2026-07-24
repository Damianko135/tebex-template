import { StoreSidebarModule } from "./sidebar-module-card";
import type { SidebarModule } from "./types";

/** The homepage's grid of remaining /sidebar modules - everything besides
 * the "featured_package" module, which renders separately as
 * `FeaturedPackage`. */
export function ModuleGrid({ modules }: { modules: SidebarModule[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
        {modules.map((module) => (
          <StoreSidebarModule key={module.id} module={module} />
        ))}
      </div>
    </section>
  );
}
