import Image from 'next/image';
import type { AnimeCharacter } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

interface CharacterCardProps {
  character: AnimeCharacter;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function CharacterCard({ character, isSelected, onSelect }: CharacterCardProps) {
  return (
    <Card className={`group w-full shadow-lg hover:shadow-primary/30 transition-shadow duration-300 ${isSelected ? 'ring-2 ring-primary border-primary' : 'border-border'}`}>
      <CardHeader className="p-0 relative aspect-[3/4] overflow-hidden rounded-t-lg">
        <Image
          src={character.imageUrl}
          alt={character.name}
          width={300}
          height={450}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          data-ai-hint={character.dataAiHint}
        />
         {isSelected && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground p-2 rounded-full shadow-md">
            <Zap className="h-5 w-5" />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="font-headline text-xl text-primary group-hover:text-accent transition-colors">
          {character.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1 h-10 overflow-hidden">
          {character.description}
        </p>
        <p className="text-xs text-foreground mt-2">Power Level: <span className="font-bold text-accent">{character.powerLevel}</span></p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => onSelect(character.id)} 
          variant={isSelected ? "default" : "outline"}
          className="w-full"
          aria-pressed={isSelected}
        >
          {isSelected ? 'Selected' : 'Choose Character'}
        </Button>
      </CardFooter>
    </Card>
  );
}
