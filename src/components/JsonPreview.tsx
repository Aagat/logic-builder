import { Button } from './ui/button';
import { Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { JsonLogic } from '../lib/types';

interface JsonPreviewProps {
  logic: JsonLogic;
}

export function JsonPreview({ logic }: JsonPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(logic, null, 2))
      .then(() => {
        setCopied(true);
        toast("Copied!", {
          description: "JSON logic copied to clipboard",
        });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard", {
          description: "Failed to copy to clipboard",
        });
      });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">JSON Logic</h3>
        <Button size="sm" onClick={handleCopy}>
          <Copy className="h-4 w-4 mr-2" />
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      <div className="bg-muted p-4 rounded-md font-mono text-sm overflow-auto max-h-60">
        {JSON.stringify(logic, null, 2)}
      </div>
    </div>
  );
}
