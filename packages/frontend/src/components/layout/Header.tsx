import { Link, useLocation } from 'react-router-dom';
import { useBlogStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { PenLine, LogOut, Settings } from 'lucide-react';

export function Header() {
  const { settings, isAdmin, logout } = useBlogStore();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <Link
          to="/"
          className="group flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <span className="font-serif text-xl font-semibold text-foreground">
            {settings.blogTitle}
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          {isAdmin ? (
            <>
              <Button variant="nav" size="sm" asChild>
                <Link to="/admin">
                  <PenLine className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="nav" size="sm" asChild>
                <Link to="/admin/settings">
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Admin</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
