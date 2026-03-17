// [path]: components/dashboard/PredictiveAnalyticsChart.tsx

'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PredictiveAnalyticsChart = () => {
    // NOTE: This is hardcoded placeholder data for demonstration.
    const data = [
        { name: 'Last Week', completed: 2 },
        { name: 'This Week', completed: 1 },
        { name: 'Next Week', completed: 3 },
        { name: 'In 2 Weeks', completed: 2 },
        { name: 'In 3 Weeks', completed: 4 },
    ];

    return (
        <div className="bg-gray-800 border border-white/10 p-6 rounded-lg shadow-soft h-full">
            <h3 className="text-xl font-bold text-white mb-4">Project Completion Forecast</h3>
            <div className="h-72">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis dataKey="name" stroke="#A0AEC0" fontSize={12} />
                        <YAxis stroke="#A0AEC0" fontSize={12} allowDecimals={false}/>
                        <Tooltip 
                            cursor={{fill: 'rgba(255, 255, 255, 0.1)'}}
                            contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }}
                        />
                        <Bar dataKey="completed" name="Projects Completed" fill="#DC2626" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PredictiveAnalyticsChart;