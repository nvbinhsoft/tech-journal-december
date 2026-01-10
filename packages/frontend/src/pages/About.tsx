import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBlogStore } from '@/lib/store';
import { Layout } from '@/components/layout/Layout';
import { Github, Twitter, Linkedin, Mail, MapPin, Calendar, ArrowLeft, Code2, BookOpen, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function About() {
    const { settings, fetchSettings, isLoading } = useBlogStore();

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return (
        <Layout>
            {/* Hero Section with Gradient */}
            <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-card via-background to-background">
                {/* Decorative blobs */}
                <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

                <div className="container relative mx-auto max-w-4xl px-4 py-16 md:py-24">
                    {/* Back Link */}
                    <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" />
                        Back to articles
                    </Link>

                    <div className="mt-8 flex flex-col items-center gap-8 md:flex-row md:items-start">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            {settings.authorAvatar ? (
                                <img
                                    src={settings.authorAvatar}
                                    alt={settings.authorName}
                                    className="h-40 w-40 rounded-2xl object-cover shadow-xl ring-4 ring-primary/20 ring-offset-4 ring-offset-background md:h-48 md:w-48"
                                />
                            ) : (
                                <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-accent text-6xl font-bold text-primary-foreground shadow-xl ring-4 ring-primary/20 ring-offset-4 ring-offset-background md:h-48 md:w-48">
                                    {settings.authorName?.charAt(0) || 'A'}
                                </div>
                            )}
                            {/* Status badge */}
                            <div className="absolute -bottom-2 -right-2 flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 shadow-lg ring-1 ring-border">
                                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                                <span className="text-xs font-medium text-foreground">Available</span>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                                {settings.authorName || 'Anonymous Author'}
                            </h1>

                            <p className="mt-3 text-lg text-muted-foreground">
                                Creator
                            </p>

                            {/* Social Links */}
                            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                                {settings.socialLinks?.github && (
                                    <a
                                        href={settings.socialLinks.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-all hover:scale-105 hover:bg-foreground hover:text-background"
                                    >
                                        <Github className="h-4 w-4" />
                                        GitHub
                                    </a>
                                )}
                                {settings.socialLinks?.twitter && (
                                    <a
                                        href={settings.socialLinks.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-all hover:scale-105 hover:bg-[#1DA1F2] hover:text-white"
                                    >
                                        <Twitter className="h-4 w-4" />
                                        Twitter
                                    </a>
                                )}
                                {settings.socialLinks?.linkedin && (
                                    <a
                                        href={settings.socialLinks.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-all hover:scale-105 hover:bg-[#0A66C2] hover:text-white"
                                    >
                                        <Linkedin className="h-4 w-4" />
                                        LinkedIn
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16">
                <div className="container mx-auto max-w-4xl px-4">
                    <div className="grid gap-12 md:grid-cols-3">
                        {/* Bio Column */}
                        <div className="md:col-span-2">
                            <h2 className="mb-6 font-serif text-2xl font-semibold text-foreground">
                                About Me
                            </h2>

                            <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
                                {settings.authorBio ? (
                                    <p className="leading-relaxed text-muted-foreground">
                                        {settings.authorBio}
                                    </p>
                                ) : (
                                    <p className="leading-relaxed text-muted-foreground">
                                        Welcome to my corner of the internet!
                                    </p>
                                )}

                                <p className="mt-4 leading-relaxed text-muted-foreground">
                                    This blog is where I document my journey as a developer, or something else from my life.
                                </p>

                            </div>

                            {/* What I Write About */}
                            <div className="mt-12">
                                <h2 className="mb-6 font-serif text-2xl font-semibold text-foreground">
                                    What I Write About
                                </h2>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg">
                                        <Code2 className="mb-3 h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                                        <h3 className="font-semibold text-foreground">Development</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Full-stack tips, best practices, and tutorials
                                        </p>
                                    </div>
                                    <div className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg">
                                        <BookOpen className="mb-3 h-8 w-8 text-accent transition-transform group-hover:scale-110" />
                                        <h3 className="font-semibold text-foreground">Learning</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            My journey learning new technologies
                                        </p>
                                    </div>
                                    <div className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg">
                                        <Coffee className="mb-3 h-8 w-8 text-orange-500 transition-transform group-hover:scale-110" />
                                        <h3 className="font-semibold text-foreground">Life</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Thoughts on productivity and growth
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Facts */}
                            <div className="rounded-xl border border-border bg-card p-6">
                                <h3 className="font-serif text-lg font-semibold text-foreground">
                                    Quick Facts
                                </h3>
                                <ul className="mt-4 space-y-3">
                                    <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        <span>Based in Vietnam</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4 text-primary" />
                                        <span>Started blogging 2025</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <Coffee className="h-4 w-4 text-primary" />
                                        <span>Powered by caffeine</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Contact CTA */}
                            <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 p-6">
                                <h3 className="font-serif text-lg font-semibold text-foreground">
                                    Get in Touch
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Have a question or want to collaborate? I'd love to hear from you!
                                </p>
                                <Button asChild className="mt-4 w-full">
                                    <a href="mailto:nvbinhsoft@gmail.com">
                                        <Mail className="h-4 w-4" />
                                        Send me an email
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
