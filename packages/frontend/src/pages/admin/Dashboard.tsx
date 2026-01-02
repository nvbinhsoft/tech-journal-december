import { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useBlogStore } from '@/lib/store';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Plus, Edit, Trash2, Eye, EyeOff, FileText, Tags, Settings, Activity } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export default function Dashboard() {
  const { articles, tags, isAdmin, deleteArticle, updateArticle, fetchArticles, fetchTags } = useBlogStore();

  // Fetch data on mount
  useEffect(() => {
    if (isAdmin) {
      fetchArticles();
      fetchTags();
    }
  }, [isAdmin, fetchArticles, fetchTags]);

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const handleDelete = async (id: string, title: string) => {
    try {
      await deleteArticle(id);
      toast.success(`"${title}" has been deleted`);
    } catch {
      toast.error('Failed to delete article');
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      await updateArticle(id, { published: !currentStatus });
      toast.success(currentStatus ? 'Article unpublished' : 'Article published');
    } catch {
      toast.error('Failed to update article');
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="container mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">Manage your blog content</p>
          </div>
          <Button asChild>
            <Link to="/admin/editor">
              <Plus className="h-4 w-4" />
              New Article
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{articles.length}</p>
                <p className="text-sm text-muted-foreground">Articles</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                <Tags className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{tags.length}</p>
                <p className="text-sm text-muted-foreground">Tags</p>
              </div>
            </div>
          </div>
          <Link
            to="/admin/tags"
            className="rounded-lg border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-card"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                <Settings className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">Manage Tags</p>
                <p className="text-sm text-muted-foreground">Add or edit tags</p>
              </div>
            </div>
          </Link>
          <Link
            to="/admin/audit"
            className="rounded-lg border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-card"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Activity className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">Audit Logs</p>
                <p className="text-sm text-muted-foreground">View visitor history</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Articles List */}
        <div className="rounded-lg border border-border bg-card shadow-soft">
          <div className="border-b border-border p-4">
            <h2 className="font-serif text-lg font-semibold text-foreground">All Articles</h2>
          </div>

          {articles.length > 0 ? (
            <div className="divide-y divide-border">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground">{article.title}</h3>
                      {!article.published && (
                        <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {format(new Date(article.updatedAt), 'MMM d, yyyy')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => togglePublished(article.id, article.published)}
                      title={article.published ? 'Unpublish' : 'Publish'}
                    >
                      {article.published ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/admin/editor/${article.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Article</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{article.title}"? This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(article.id, article.title)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No articles yet</p>
              <Button asChild className="mt-4">
                <Link to="/admin/editor">
                  <Plus className="h-4 w-4" />
                  Create your first article
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
