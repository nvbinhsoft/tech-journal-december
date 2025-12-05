import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useBlogStore, Tag } from '@/lib/store';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Edit, Trash2, X, Check } from 'lucide-react';
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

const PRESET_COLORS = [
  '#E11D48', // Rose
  '#EA580C', // Orange
  '#CA8A04', // Yellow
  '#16A34A', // Green
  '#0891B2', // Cyan
  '#2563EB', // Blue
  '#7C3AED', // Violet
  '#C026D3', // Fuchsia
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function TagsManager() {
  const navigate = useNavigate();
  const { tags, isAdmin, addTag, updateTag, deleteTag, fetchTags } = useBlogStore();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTag, setNewTag] = useState({ name: '', color: PRESET_COLORS[0] });
  const [editTag, setEditTag] = useState({ name: '', color: '' });

  // Fetch tags on mount
  useEffect(() => {
    if (isAdmin) {
      fetchTags();
    }
  }, [isAdmin, fetchTags]);

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const handleAddTag = async () => {
    if (!newTag.name.trim()) {
      toast.error('Tag name is required');
      return;
    }

    try {
      await addTag({
        name: newTag.name,
        slug: generateSlug(newTag.name),
        color: newTag.color,
      });

      toast.success('Tag created');
      setNewTag({ name: '', color: PRESET_COLORS[0] });
      setIsAdding(false);
    } catch {
      toast.error('Failed to create tag');
    }
  };

  const handleUpdateTag = async (id: string) => {
    if (!editTag.name.trim()) {
      toast.error('Tag name is required');
      return;
    }

    try {
      await updateTag(id, {
        name: editTag.name,
        slug: generateSlug(editTag.name),
        color: editTag.color,
      });

      toast.success('Tag updated');
      setEditingId(null);
    } catch {
      toast.error('Failed to update tag');
    }
  };

  const handleDeleteTag = async (tag: Tag) => {
    try {
      await deleteTag(tag.id);
      toast.success(`"${tag.name}" deleted`);
    } catch {
      toast.error('Failed to delete tag');
    }
  };

  const startEditing = (tag: Tag) => {
    setEditingId(tag.id);
    setEditTag({ name: tag.name, color: tag.color });
  };

  return (
    <Layout showFooter={false}>
      <div className="container mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/admin')}>
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="rounded-lg border border-border bg-card shadow-soft">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h1 className="font-serif text-xl font-semibold text-foreground">Manage Tags</h1>
            {!isAdding && (
              <Button size="sm" onClick={() => setIsAdding(true)}>
                <Plus className="h-4 w-4" />
                Add Tag
              </Button>
            )}
          </div>

          <div className="divide-y divide-border">
            {/* Add new tag form */}
            {isAdding && (
              <div className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                  <div className="flex-1 space-y-2">
                    <Label>Name</Label>
                    <Input
                      placeholder="Tag name"
                      value={newTag.name}
                      onChange={(e) => setNewTag((prev) => ({ ...prev, name: e.target.value }))}
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="flex gap-1">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewTag((prev) => ({ ...prev, color }))}
                          className={`h-8 w-8 rounded-full transition-transform hover:scale-110 ${newTag.color === color ? 'ring-2 ring-foreground ring-offset-2' : ''
                            }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => setIsAdding(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                    <Button size="icon" onClick={handleAddTag}>
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Tag list */}
            {tags.map((tag) => (
              <div key={tag.id} className="p-4">
                {editingId === tag.id ? (
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex-1 space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={editTag.name}
                        onChange={(e) =>
                          setEditTag((prev) => ({ ...prev, name: e.target.value }))
                        }
                        autoFocus
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Color</Label>
                      <div className="flex gap-1">
                        {PRESET_COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setEditTag((prev) => ({ ...prev, color }))}
                            className={`h-8 w-8 rounded-full transition-transform hover:scale-110 ${editTag.color === color
                              ? 'ring-2 ring-foreground ring-offset-2'
                              : ''
                              }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                      <Button size="icon" onClick={() => handleUpdateTag(tag.id)}>
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span className="font-medium text-foreground">{tag.name}</span>
                      <span className="text-sm text-muted-foreground">/{tag.slug}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" onClick={() => startEditing(tag)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Tag</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{tag.name}"? Articles using this tag
                              will no longer have it.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteTag(tag)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {tags.length === 0 && !isAdding && (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">No tags yet</p>
                <Button className="mt-4" onClick={() => setIsAdding(true)}>
                  <Plus className="h-4 w-4" />
                  Create your first tag
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
