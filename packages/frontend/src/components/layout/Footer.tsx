import { useBlogStore } from '@/lib/store';
import { Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  const { settings } = useBlogStore();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              {settings.blogTitle}
            </h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {settings.blogDescription}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {settings.socialLinks.twitter && (
              <a
                href={settings.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Twitter className="h-5 w-5" />
              </a>
            )}
            {settings.socialLinks.github && (
              <a
                href={settings.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Github className="h-5 w-5" />
              </a>
            )}
            {settings.socialLinks.linkedin && (
              <a
                href={settings.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {settings.authorName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
