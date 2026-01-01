import { useParams, Link, Navigate } from 'react-router-dom';
import { useBlogStore } from '@/lib/store';
import { Layout } from '@/components/layout/Layout';
import { ArticleContent } from '@/components/blog/ArticleContent';
import { format } from 'date-fns';
import { Calendar, ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const { articles, tags, settings } = useBlogStore();

  const article = articles.find((a) => a.slug === slug && a.published);

  if (!article) {
    return <Navigate to="/" replace />;
  }

  const articleTags = tags.filter((tag) => article.tags.includes(tag.id));

  return (
    <Layout>
      <article className="py-8 md:py-12">
        <div className="container mx-auto max-w-3xl px-4">
          {/* Back button */}
          <Button variant="ghost" size="sm" asChild className="mb-8">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Back to articles
            </Link>
          </Button>

          {/* Header */}
          <header className="animate-fade-in">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {articleTags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: `${tag.color}20`,
                    color: tag.color,
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {settings.authorName}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(new Date(article.createdAt), 'MMMM d, yyyy')}
              </div>
            </div>
          </header>

          {/* Cover Image */}
          {article.coverImage && (
            <div className="animate-slide-up mt-8 overflow-hidden rounded-lg">
              <img
                src={article.coverImage}
                alt={article.title}
                className="aspect-video w-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="animate-slide-up mt-10" style={{ animationDelay: '100ms' }}>
            <ArticleContent content={article.content} />
          </div>

          {/* Author Bio */}
          <footer className="mt-16 border-t border-border pt-8">
            <div className="flex items-start gap-4">
              {settings.authorAvatar ? (
                <img
                  src={settings.authorAvatar}
                  alt={settings.authorName}
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-7 w-7 text-primary" />
                </div>
              )}
              <div>
                <p className="font-serif font-semibold text-foreground">
                  {settings.authorName}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {settings.authorBio}
                </p>
              </div>
            </div>
          </footer>
        </div>
      </article>
    </Layout>
  );
}
