import { FileText } from 'lucide-react';
import Card from '@/components/ui/Card';

interface DocumentsListProps {
  documents: string[];
}

export default function DocumentsList({ documents }: DocumentsListProps) {
  return (
    <Card className="p-5">
      <h2 className="font-sans text-base font-semibold text-text-primary mb-4">Documents requis</h2>
      <ul className="space-y-2.5">
        {documents.map((doc, i) => (
          <li key={i} className="flex items-center gap-2.5 text-sm text-text-secondary">
            <FileText size={14} className="text-text-muted shrink-0" />
            {doc}
          </li>
        ))}
      </ul>
    </Card>
  );
}
