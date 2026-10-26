import Link from "next/link";

const USED = new Set(["web-system", "ui-elements"]);

export function UsePills({ item, projects }) {
  const ids = Array.isArray(item?.uses) ? item.uses : [];
  if (!ids.length || !projects?.length) return null;

  const used = ids
    .map((id) => projects.find((project) => project.id === id))
    .filter((project) => project && USED.has(project.category_slug));

  if (!used.length) return null;

  return (
    <div className="dna-use-pills">
      {used.map((project) => (
        <Link key={project.id} href={`/projects/${project.id}`} className="dna-chip">
          {project.title}
        </Link>
      ))}
    </div>
  );
}

export default UsePills;
