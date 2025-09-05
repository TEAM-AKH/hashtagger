
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[calc(100vh-12rem)]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
            <Settings className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Manage your account settings here. This page is under construction.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
