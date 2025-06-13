import { AppLayout } from '@/components/layout/AppLayout';
import { WorkoutLogList } from '@/components/features/animefit/WorkoutLogList';

export default function WorkoutTrackerPage() {
  return (
    <AppLayout pageTitle="Daily Workout Tracker">
      <div className="container mx-auto py-8">
        <WorkoutLogList />
      </div>
    </AppLayout>
  );
}
