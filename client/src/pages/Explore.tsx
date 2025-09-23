import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function Explore() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation('/')}><ArrowLeft /></Button>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Compass className="w-6 h-6" /> Explore</h1>
        </div>
        <Card>
          <CardContent className="pt-6"><p className="text-muted-foreground">Explore community creations. This feature is coming soon!</p></CardContent>
        </Card>
      </div>
    </div>
  );
}