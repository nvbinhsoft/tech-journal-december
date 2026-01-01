import { useState, useMemo, useEffect } from 'react';
import { useBlogStore } from '@/lib/store';
import { Layout } from '@/components/layout/Layout';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { SearchAndFilter } from '@/components/blog/SearchAndFilter';
import { AuthorCard } from '@/components/blog/AuthorCard';

const Index = () => {
  const { articles, settings, fetchArticles, fetchTags, fetchSettings, isLoading } = useBlogStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Fetch data on mount
  useEffect(() => {
    fetchArticles();
    fetchTags();
    fetchSettings();
  }, [fetchArticles, fetchTags, fetchSettings]);

  const publishedArticles = articles.filter((a) => a.published);

  const filteredArticles = useMemo(() => {
    return publishedArticles.filter((article) => {
      // Search filter
      const matchesSearch = !searchQuery ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase());

      // Tag filter
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.every((tagId) => article.tags.includes(tagId));

      return matchesSearch && matchesTags;
    });
  }, [publishedArticles, searchQuery, selectedTags]);

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-card to-background">
        <div className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
          <div className="animate-fade-in text-center">
            <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              {settings.blogTitle}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-muted-foreground md:text-xl">
              {settings.blogDescription}
            </p>
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="h-px w-12 bg-primary/30" />
              <span className="text-sm text-muted-foreground">by {settings.authorName}</span>
              <div className="h-px w-12 bg-primary/30" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Articles Column */}
            <div className="lg:col-span-2">
              {/* Search and Filter */}
              <div className="mb-8">
                <SearchAndFilter
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedTags={selectedTags}
                  onTagToggle={handleTagToggle}
                  onClearFilters={handleClearFilters}
                />
              </div>

              <h2 className="mb-8 font-serif text-2xl font-semibold text-foreground">
                {searchQuery || selectedTags.length > 0
                  ? `Found ${filteredArticles.length} article${filteredArticles.length !== 1 ? 's' : ''}`
                  : 'Latest Articles'}
              </h2>

              {filteredArticles.length > 0 ? (
                <div className="grid gap-8">
                  {filteredArticles.map((article, index) => (
                    <ArticleCard key={article.id} article={article} index={index} />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-border bg-card p-12 text-center">
                  <p className="text-muted-foreground">
                    {searchQuery || selectedTags.length > 0
                      ? 'No articles match your search criteria.'
                      : 'No articles published yet.'}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar - Author Card */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <h3 className="mb-4 font-serif text-lg font-semibold text-foreground">
                About the Author
              </h3>
              <AuthorCard />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
