import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { TeamStats } from '../types';

interface StatsChartProps {
  data: TeamStats;
}

export function StatsChart({ data }: StatsChartProps) {
  const chartData = [
    { name: 'Wins', value: data.wins, color: '#22c55e' },
    { name: 'Draws', value: data.draws, color: '#eab308' },
    { name: 'Losses', value: data.losses, color: '#ef4444' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-64">
      <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill={(entry) => entry.color} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}