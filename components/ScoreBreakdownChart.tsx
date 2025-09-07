'use client';

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ScoreBreakdown {
  price: number;
  features: number;
  location: number;
  safety: number;
  schools: number;
  commute: number;
}

interface ScoreBreakdownChartProps {
  breakdown: ScoreBreakdown;
  type?: 'pie' | 'bar';
  className?: string;
}

export default function ScoreBreakdownChart({
  breakdown,
  type = 'pie',
  className = '',
}: ScoreBreakdownChartProps) {
  const data = [
    { name: 'Price', value: breakdown.price, color: '#ef4444' },
    { name: 'Features', value: breakdown.features, color: '#f59e0b' },
    { name: 'Location', value: breakdown.location, color: '#3b82f6' },
    { name: 'Safety', value: breakdown.safety, color: '#10b981' },
    { name: 'Schools', value: breakdown.schools, color: '#8b5cf6' },
    { name: 'Commute', value: breakdown.commute, color: '#ec4899' },
  ];

  const barData = data.map(item => ({
    name: item.name,
    score: item.value,
    color: item.color,
  }));

  if (type === 'bar') {
    return (
      <div className={`w-full h-64 ${className}`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip 
              formatter={(value) => [`${value}/100`, 'Score']}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className={`w-full h-64 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value}/100`, 'Score']}
            labelStyle={{ color: '#374151' }}
            contentStyle={{ 
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
