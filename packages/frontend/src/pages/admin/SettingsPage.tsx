import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useBlogStore } from '@/lib/store';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, Save, Globe, User, Link as LinkIcon } from 'lucide-react';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { settings, isAdmin, updateSettings, fetchSettings } = useBlogStore();

  const [formData, setFormData] = useState({
    blogTitle: settings.blogTitle,
    blogDescription: settings.blogDescription,
    authorName: settings.authorName,
    authorBio: settings.authorBio || '',
    twitter: settings.socialLinks?.twitter || '',
    github: settings.socialLinks?.github || '',
    linkedin: settings.socialLinks?.linkedin || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch settings on mount
  useEffect(() => {
    if (isAdmin) {
      fetchSettings();
    }
  }, [isAdmin, fetchSettings]);

  // Update form when settings load
  useEffect(() => {
    setFormData({
      blogTitle: settings.blogTitle,
      blogDescription: settings.blogDescription,
      authorName: settings.authorName,
      authorBio: settings.authorBio || '',
      twitter: settings.socialLinks?.twitter || '',
      github: settings.socialLinks?.github || '',
      linkedin: settings.socialLinks?.linkedin || '',
    });
  }, [settings]);

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateSettings({
        blogTitle: formData.blogTitle,
        blogDescription: formData.blogDescription,
        authorName: formData.authorName,
        authorBio: formData.authorBio,
        socialLinks: {
          twitter: formData.twitter || undefined,
          github: formData.github || undefined,
          linkedin: formData.linkedin || undefined,
        },
      });

      toast.success('Settings saved');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="container mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/admin')}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Blog Settings */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-semibold text-foreground">Blog Settings</h2>
                <p className="text-sm text-muted-foreground">General blog information</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="blogTitle">Blog Title</Label>
                <Input
                  id="blogTitle"
                  value={formData.blogTitle}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, blogTitle: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="blogDescription">Blog Description</Label>
                <Textarea
                  id="blogDescription"
                  value={formData.blogDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, blogDescription: e.target.value }))
                  }
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Author Settings */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                <User className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-semibold text-foreground">Author Profile</h2>
                <p className="text-sm text-muted-foreground">Your public author information</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="authorName">Author Name</Label>
                <Input
                  id="authorName"
                  value={formData.authorName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, authorName: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorBio">Author Bio</Label>
                <Textarea
                  id="authorBio"
                  value={formData.authorBio}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, authorBio: e.target.value }))
                  }
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                <LinkIcon className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-semibold text-foreground">Social Links</h2>
                <p className="text-sm text-muted-foreground">Connect your social profiles</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter URL</Label>
                <Input
                  id="twitter"
                  type="url"
                  placeholder="https://twitter.com/username"
                  value={formData.twitter}
                  onChange={(e) => setFormData((prev) => ({ ...prev, twitter: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="github">GitHub URL</Label>
                <Input
                  id="github"
                  type="url"
                  placeholder="https://github.com/username"
                  value={formData.github}
                  onChange={(e) => setFormData((prev) => ({ ...prev, github: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedin}
                  onChange={(e) => setFormData((prev) => ({ ...prev, linkedin: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
