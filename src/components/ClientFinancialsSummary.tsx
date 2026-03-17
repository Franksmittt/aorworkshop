// [path]: components/ClientFinancialsSummary.tsx

'use client';

import { Project, Invoice } from '@/lib/types';
import { DollarSign, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button'; // Using alias path for robustness

interface ClientFinancialsSummaryProps {
  project: Project;
}

const ClientFinancialsSummary = ({ project }: ClientFinancialsSummaryProps) => {
  const { financials } = project;
  const balanceDue = financials.totalQuoted - financials.totalPaid;

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'Pending':
        return <Clock className="h-5 w-5 text-yellow-400" />;
      case 'Overdue':
        return <AlertTriangle className="h-5 w-5 text-red-400" />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount);
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-white/10 shadow-large rounded-lg p-6 md:p-8 mb-12">
      <h2 className="text-3xl font-bold text-white mb-6">Financial Summary</h2>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800/60 p-4 rounded-md">
          <p className="text-sm text-gray-400">Total Project Cost</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(financials.totalQuoted)}</p>
        </div>
        <div className="bg-gray-800/60 p-4 rounded-md">
          <p className="text-sm text-gray-400">Total Paid</p>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(financials.totalPaid)}</p>
        </div>
        <div className="bg-gray-800/60 p-4 rounded-md">
          <p className="text-sm text-gray-400">Balance Due</p>
          <p className="text-2xl font-bold text-yellow-400">{formatCurrency(balanceDue)}</p>
        </div>
      </div>

      {/* Invoices List */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Invoice History</h3>
        <div className="space-y-3">
          {financials.invoices.map(invoice => (
            <div key={invoice.id} className="bg-gray-800/60 p-3 rounded-md flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center mb-2 sm:mb-0">
                {getStatusIcon(invoice.status)}
                <div className="ml-3">
                  <p className="font-medium text-gray-200">{invoice.description}</p>
                  <p className="text-xs text-gray-500">Due: {invoice.dueDate}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-white sm:mx-4">{formatCurrency(invoice.amount)}</p>
                 {(invoice.status === 'Pending' || invoice.status === 'Overdue') && (
                    <Button size="sm" variant="primary" onClick={() => alert('Secure payment portal would be linked here.')}>
                        <DollarSign className="w-4 h-4 mr-2"/> Pay Now
                    </Button>
                 )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientFinancialsSummary;