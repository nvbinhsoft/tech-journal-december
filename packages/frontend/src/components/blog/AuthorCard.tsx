import { Link } from 'react-router-dom';
import { useBlogStore } from '@/lib/store';
import { Github, Twitter, Linkedin, ArrowRight } from 'lucide-react';

export function AuthorCard() {
    const { settings } = useBlogStore();

    return (
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-soft">
            {/* Decorative elements */}
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-accent/5 blur-2xl" />

            <div className="relative">
                {/* Header */}
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative">
                        {settings.authorAvatar ? (
                            <img
                                src={settings.authorAvatar}
                                alt={settings.authorName}
                                className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
                            />
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-2xl font-bold text-primary-foreground ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                                {settings.authorName?.charAt(0) || 'A'}
                            </div>
                        )}
                        {/* Online indicator */}
                        <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-card bg-green-500" />
                    </div>

                    {/* Name & Title */}
                    <div className="flex-1">
                        <h3 className="font-serif text-lg font-semibold text-foreground">
                            {settings.authorName || 'Anonymous'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Author
                        </p>
                    </div>
                </div>

                {/* Bio */}
                {settings.authorBio && (
                    <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {settings.authorBio}
                    </p>
                )}

                {/* Social Links */}
                <div className="mt-5 flex items-center gap-3">
                    {settings.socialLinks?.github && (
                        <a
                            href={settings.socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-all hover:scale-110 hover:bg-primary hover:text-primary-foreground"
                            title="GitHub"
                        >
                            <Github className="h-4 w-4" />
                        </a>
                    )}
                    {settings.socialLinks?.twitter && (
                        <a
                            href={settings.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-all hover:scale-110 hover:bg-[#1DA1F2] hover:text-white"
                            title="Twitter"
                        >
                            <Twitter className="h-4 w-4" />
                        </a>
                    )}
                    {settings.socialLinks?.linkedin && (
                        <a
                            href={settings.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-all hover:scale-110 hover:bg-[#0A66C2] hover:text-white"
                            title="LinkedIn"
                        >
                            <Linkedin className="h-4 w-4" />
                        </a>
                    )}
                </div>

                {/* About Link */}
                <Link
                    to="/about"
                    className="mt-5 flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                    Learn more about me
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
        </div>
    );
}
