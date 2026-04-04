import { Brain, BookOpen, Laugh } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Playlist } from "@/hooks/usePlaylists";

const CATEGORY_ICONS: Record<string, any> = {
  philosophy: Brain,
  literature: BookOpen,
  comedy: Laugh,
};

interface SaveToPlaylistDialogProps {
  open: boolean;
  onClose: () => void;
  playlists: Playlist[];
  onSelect: (playlistId: string) => void;
}

export function SaveToPlaylistDialog({ open, onClose, playlists, onSelect }: SaveToPlaylistDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">Save to Queue</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 pt-2">
          {playlists.map((p) => {
            const Icon = CATEGORY_ICONS[p.category] || BookOpen;
            const count = (p.items || []).filter((i) => !i.listened).length;
            return (
              <Button
                key={p.id}
                variant="outline"
                className="w-full justify-start gap-3 h-12 border-border hover:bg-secondary"
                onClick={() => {
                  onSelect(p.id);
                  onClose();
                }}
              >
                <Icon className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">{p.name}</span>
                {count > 0 && (
                  <span className="ml-auto text-xs text-muted-foreground">{count} queued</span>
                )}
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
