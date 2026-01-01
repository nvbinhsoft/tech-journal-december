import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useBlogStore } from '@/lib/store';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import '@/components/editor/editor-styles.css';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function ArticleEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { articles, tags, isAdmin, addArticle, updateArticle } = useBlogStore();

  const existingArticle = id ? articles.find((a) => a.id === id) : null;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    tags: [] as string[],
    published: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingArticle) {
      // Ensure tags are mapped to IDs if they are objects
      const tagIds = existingArticle.tags.map((t: any) =>
        typeof t === 'object' && t !== null && 'id' in t ? t.id : t
      );

      setFormData({
        title: existingArticle.title,
        slug: existingArticle.slug,
        excerpt: existingArticle.excerpt,
        content: existingArticle.content,
        coverImage: existingArticle.coverImage || '',
        tags: tagIds,
        published: existingArticle.published,
      });
    }
  }, [existingArticle]);

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const toggleTag = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter((t) => t !== tagId)
        : [...prev.tags, tagId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Content is required');
      return;
    }

    setIsSubmitting(true);

    try {
      if (existingArticle) {
        await updateArticle(existingArticle.id, formData);
        toast.success('Article updated successfully');
      } else {
        await addArticle(formData);
        toast.success('Article created successfully');
      }
      navigate('/admin');
    } catch {
      toast.error('Failed to save article');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/admin')}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, published: checked }))
                }
              />
              <Label htmlFor="published" className="text-sm">
                {formData.published ? 'Published' : 'Draft'}
              </Label>
            </div>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter article title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="font-serif text-lg"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              placeholder="article-url-slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                }))
              }
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <div className="flex gap-2">
              <Input
                id="coverImage"
                placeholder="https://example.com/image.jpg"
                value={formData.coverImage}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, coverImage: e.target.value }))
                }
              />
              {formData.coverImage && (
                <Button type="button" variant="outline" size="icon" asChild>
                  <a href={formData.coverImage} target="_blank" rel="noopener noreferrer">
                    <Eye className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
            {formData.coverImage && (
              <img
                src={formData.coverImage}
                alt="Cover preview"
                className="mt-2 aspect-video max-h-48 rounded-lg object-cover"
              />
            )}
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              placeholder="Brief description of the article..."
              value={formData.excerpt}
              onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
              rows={2}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${formData.tags.includes(tag.id)
                    ? 'ring-2 ring-primary ring-offset-2'
                    : 'opacity-60 hover:opacity-100'
                    }`}
                  style={{
                    backgroundColor: `${tag.color}20`,
                    color: tag.color,
                  }}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label>Content</Label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
              placeholder="Start writing your article..."
            />
          </div>
        </form>
      </div>
    </Layout>
  );
}
