
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit } from 'lucide-react';

export default function MemoryBankPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[calc(100vh-12rem)]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
            <BrainCircuit className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Memory Bank</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page is under construction. Check back later for updates!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
