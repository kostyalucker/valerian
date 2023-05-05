import Link from "next/link";

export function Breadcrumbs({ crumbs }) {
  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        {crumbs.map((crumb) => {
          return (
            <li class="inline-flex items-center" key={crumb.label}>
              <Link
                href={crumb.href}
                class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                {crumb.label}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
