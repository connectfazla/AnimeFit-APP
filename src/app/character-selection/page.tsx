import { AppLayout } from '@/components/layout/AppLayout';
import { CharacterSelectionGrid } from '@/components/features/animefit/CharacterSelectionGrid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CharacterSelectionPage() {
  return (
    <AppLayout pageTitle="Choose Your Hero">
      <div className="container mx-auto py-8">
        <Card className="mb-8 bg-card/70 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-center text-primary">Select Your Training Partner</CardTitle>
            <CardDescription className="text-center text-lg text-foreground/80">
              Choose an anime hero to guide your fitness journey. Their power will be your inspiration!
            </CardDescription>
          </CardHeader>
        </Card>
        <CharacterSelectionGrid />
      </div>
    </AppLayout>
  );
}
