import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useBlogStore, Tag } from '@/lib/store';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTags: string[];
  onTagToggle: (tagId: string) => void;
  onClearFilters: () => void;
}

export function SearchAndFilter({
  searchQuery,
  onSearchChange,
  selectedTags,
  onTagToggle,
  onClearFilters,
}: SearchAndFilterProps) {
  const { tags } = useBlogStore();
  const hasFilters = searchQuery || selectedTags.length > 0;

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Tags Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Filter by:</span>
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => onTagToggle(tag.id)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
              selectedTags.includes(tag.id)
                ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
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
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground"
          >
            <X className="mr-1 h-3 w-3" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
