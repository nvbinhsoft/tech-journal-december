import { Link } from 'react-router-dom';
import { useBlogStore, Article } from '@/lib/store';
import { format } from 'date-fns';
import { Calendar, ArrowRight } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  index?: number;
}

export function ArticleCard({ article, index = 0 }: ArticleCardProps) {
  const { tags } = useBlogStore();
  const articleTags = tags.filter((tag) => article.tags.includes(tag.id));

  return (
    <article
      className="group animate-slide-up rounded-lg border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:shadow-card"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {article.coverImage && (
        <Link to={`/article/${article.slug}`} className="block overflow-hidden rounded-md">
          <img
            src={article.coverImage}
            alt={article.title}
            className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {articleTags.map((tag) => (
          <span
            key={tag.id}
            className="rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: `${tag.color}20`,
              color: tag.color,
            }}
          >
            {tag.name}
          </span>
        ))}
      </div>

      <Link to={`/article/${article.slug}`}>
        <h2 className="mt-3 font-serif text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
          {article.title}
        </h2>
      </Link>

      <p
        className="mt-2 line-clamp-2 font-sans text-muted-foreground lining-nums"
        style={{
          fontVariantNumeric: 'lining-nums tabular-nums',
          fontFeatureSettings: '"lnum" 1, "onum" 0, "pnum" 0, "tnum" 1',
        }}
      >
        {article.excerpt}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          {format(new Date(article.createdAt), 'MMM d, yyyy')}
        </div>

        <Link
          to={`/article/${article.slug}`}
          className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          Read more
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
