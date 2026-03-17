// [path]: components/dashboard/PerformanceBarChart.tsx

'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PerformanceData {
  name: string;
  taskHours: number;
  shiftHours: number;
}

interface PerformanceBarChartProps {
  data: PerformanceData[];
}

const PerformanceBarChart = ({ data }: PerformanceBarChartProps) => {
  return (
    <div className="h-80 bg-gray-800 p-4 rounded-lg border border-white/10">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="name" stroke="#A0AEC0" />
                <YAxis stroke="#A0AEC0" />
                <Tooltip 
                    cursor={{fill: 'rgba(255, 255, 255, 0.1)'}}
                    contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }}
                />
                <Legend />
                <Bar dataKey="shiftHours" name="Shift Hours" fill="#4A5568" />
                <Bar dataKey="taskHours" name="Task Hours" fill="#DC2626" />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default PerformanceBarChart;