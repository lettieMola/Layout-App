import { Link } from "wouter";


interface HeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function Header({ title, children }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-4">
        <Link to="/">
          <a className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-50">
            &larr; Back
          </a>
        </Link>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        {children}
        <ThemeToggle />
      </div>
    </header>
  );
}