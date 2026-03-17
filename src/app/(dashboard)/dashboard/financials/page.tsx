// [path]: app/(dashboard)/dashboard/financials/page.tsx

'use client';

import { useMemo } from 'react';
import { getProjects } from '@/lib/data-service';
import { calculateProjectCosts, calculateProjectProfitability } from '@/lib/utils';
import Link from 'next/link';
import StatCard from '@/components/dashboard/StatCard';
import { DollarSign, TrendingDown, TrendingUp, Percent } from 'lucide-react';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount);
};

export default function FinancialsPage() {
    const projects = getProjects();

    const financialSummary = useMemo(() => {
        let totalQuoted = 0;
        let totalCost = 0;
        let totalNetProfit = 0;
        let totalMargin = 0;
        
        projects.forEach(project => {
            const { totalCost: projectCost } = calculateProjectCosts(project);
            const { netProfit, margin } = calculateProjectProfitability(project);
            
            totalQuoted += project.financials.totalQuoted;
            totalCost += projectCost;
            totalNetProfit += netProfit;
            totalMargin += margin;
        });

        const averageMargin = projects.length > 0 ? totalMargin / projects.length : 0;

        return { totalQuoted, totalCost, totalNetProfit, averageMargin };
    }, [projects]);

    const getMarginColor = (margin: number) => {
        if (margin > 25) return 'text-green-400';
        if (margin > 0) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Finance Control Room</h1>
                <p className="text-gray-400">The treasury. Complete control over every rand coming in and going out.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    icon={DollarSign}
                    title="Total Quoted Value"
                    value={formatCurrency(financialSummary.totalQuoted)}
                    colorClass="bg-blue-600"
                />
                <StatCard 
                    icon={TrendingDown}
                    title="Total Combined Costs"
                    value={formatCurrency(financialSummary.totalCost)}
                    colorClass="bg-yellow-600"
                />
                <StatCard 
                    icon={TrendingUp}
                    title="Total Net Profit"
                    value={formatCurrency(financialSummary.totalNetProfit)}
                    colorClass="bg-green-600"
                />
                <StatCard 
                    icon={Percent}
                    title="Average Profit Margin"
                    value={`${financialSummary.averageMargin.toFixed(1)}%`}
                    colorClass="bg-red-600"
                />
            </div>

            <div className="bg-gray-800 border border-white/10 rounded-lg shadow-soft overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">Project Profitability Breakdown</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Project</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Quoted</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Total Cost</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Net Profit</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Margin</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {projects.map(project => {
                                const { totalCost } = calculateProjectCosts(project);
                                const { netProfit, margin } = calculateProjectProfitability(project);

                                return (
                                    <tr key={project.id} className="hover:bg-gray-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link href={`/dashboard/projects/${project.id}`} className="text-sm font-medium text-red-500 hover:underline">
                                                {project.car.year} {project.car.make} {project.car.model}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {formatCurrency(project.financials.totalQuoted)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {formatCurrency(totalCost)}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${getMarginColor(margin)}`}>
                                            {formatCurrency(netProfit)}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${getMarginColor(margin)}`}>
                                            {margin.toFixed(1)}%
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}