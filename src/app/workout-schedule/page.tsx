import { AppLayout } from '@/components/layout/AppLayout';
import { DayOfWeekSelector } from '@/components/features/animefit/DayOfWeekSelector';

export default function WorkoutSchedulePage() {
  return (
    <AppLayout pageTitle="Workout Schedule">
      <div className="container mx-auto py-8">
        <DayOfWeekSelector />
      </div>
    </AppLayout>
  );
}
