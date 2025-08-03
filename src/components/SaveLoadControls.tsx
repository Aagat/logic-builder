import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';
import { toast } from 'sonner';
import { loadSavedLogics, loadLogic, deleteLogic, saveLogic } from '../lib/utils';
import type { JsonLogic } from '../lib/types';

interface SaveLoadControlsProps {
  logic: JsonLogic;
  onLoad: (logic: JsonLogic) => void;
}

export function SaveLoadControls({ logic, onLoad }: SaveLoadControlsProps) {
  const [saveOpen, setSaveOpen] = useState(false);
  const [loadOpen, setLoadOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [selectedLoadId, setSelectedLoadId] = useState<string | null>(null);
  const [savedLogics, setSavedLogics] = useState(loadSavedLogics());

  const handleSave = () => {
    if (!saveName.trim()) {
      toast.error("Please enter a name for your logic");
      return;
    }
    
    saveLogic(saveName, logic);
    setSavedLogics(loadSavedLogics());
    setSaveName('');
    setSaveOpen(false);
    toast.success("Logic saved successfully!");
  };

  const handleLoad = () => {
    if (!selectedLoadId) {
      toast.error("Please select a logic to load");
      return;
    }
    
    const saved = loadLogic(selectedLoadId);
    if (saved) {
      onLoad(saved.logic);
      setLoadOpen(false);
      toast.success("Logic loaded successfully!");
    }
  };

  const handleDelete = (id: string) => {
    deleteLogic(id);
    setSavedLogics(loadSavedLogics());
    toast.success("Logic deleted successfully!");
  };

  return (
    <div className="flex gap-2">
      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">Save</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Logic</DialogTitle>
            <DialogDescription>
              Give your logic a name to save it for later use.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="My Logic"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={loadOpen} onOpenChange={setLoadOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">Load</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Load Logic</DialogTitle>
            <DialogDescription>
              Select a saved logic to load.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="saved-logic">Saved Logic</Label>
              <Select onValueChange={(value) => setSelectedLoadId(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a saved logic" />
                </SelectTrigger>
                <SelectContent>
                  {savedLogics.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">No saved logics found</div>
                  ) : (
                    savedLogics.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between p-2">
                        <SelectItem value={item.id} className="flex-1">
                          {item.name} 
                          <span className="ml-2 text-xs text-muted-foreground">
                            {new Date(parseInt(item.id)).toLocaleString()}
                          </span>
                        </SelectItem>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                          className="ml-2 h-8"
                        >
                          Delete
                        </Button>
                      </div>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLoadOpen(false)}>Cancel</Button>
            <Button onClick={handleLoad}>Load</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => {
          onLoad({ and: [] });
          toast.success("Logic cleared!");
        }}
      >
        Clear
      </Button>
    </div>
  );
}
