
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { DailyLog } from "@/lib/types"
import { TrendingUp } from "lucide-react"
import { useEffect, useState } from 'react';

interface ProgressChartClientProps {
  dailyLogs: Record<string, DailyLog>;
}

const getWeek = (date: Date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
};

export function ProgressChartClient({ dailyLogs }: ProgressChartClientProps) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  if (!isClient) {
     return (
       <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center"><TrendingUp className="mr-2 h-6 w-6"/>Workout Progress</CardTitle>
          <CardDescription className="text-muted-foreground">Loading chart data...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Your progress chart will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = Object.values(dailyLogs)
    .filter(log => log.workoutCompleted)
    .reduce((acc, log) => {
      const date = new Date(log.date);
      const week = `W${getWeek(date)} ${date.getFullYear()}`;
      
      if (!acc[week]) {
        acc[week] = { week, workouts: 0 };
      }
      acc[week].workouts++;
      return acc;
    }, {} as Record<string, { week: string; workouts: number }>);

  const sortedChartData = Object.values(chartData).sort((a,b) => {
    const [aWeekPart, aYearPart] = a.week.substring(1).split(" ");
    const [bWeekPart, bYearPart] = b.week.substring(1).split(" ");
    if (aYearPart !== bYearPart) return parseInt(aYearPart) - parseInt(bYearPart);
    return parseInt(aWeekPart) - parseInt(bWeekPart);
  }).slice(-12);

  const chartConfig = {
    workouts: {
      label: "Workouts Completed",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig

  if (sortedChartData.length === 0) {
    return (
       <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center"><TrendingUp className="mr-2 h-6 w-6"/>Workout Progress</CardTitle>
          <CardDescription className="text-muted-foreground">No workouts completed yet. Start training to see your progress!</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Your progress chart will appear here.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary flex items-center"><TrendingUp className="mr-2 h-6 w-6"/>Weekly Workout Progress</CardTitle>
        <CardDescription className="text-muted-foreground">Track your completed workouts over the past weeks.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedChartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="week" 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8}
              />
              <YAxis allowDecimals={false} tickMargin={8} tickLine={false} axisLine={false} />
              <RechartsTooltip
                cursor={{ fill: "hsl(var(--accent) / 0.2)" }}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="workouts" fill="var(--color-workouts)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
