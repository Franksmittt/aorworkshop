// [path]: components/dashboard/FinancialsPanel.tsx

'use client';

import { Project, Invoice } from '@/lib/types';
import { DollarSign, CheckCircle, Clock, AlertTriangle, Plus } from 'lucide-react';
import Button from '../ui/Button';

interface FinancialsPanelProps {
  project: Project;
  onMarkAsPaid: (invoiceId: string) => void;
  onAddInvoiceClick: () => void; // New prop to open the modal
}

const FinancialsPanel = ({ project, onMarkAsPaid, onAddInvoiceClick }: FinancialsPanelProps) => {
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
    <div className="bg-gray-800 border border-white/10 p-6 rounded-lg shadow-soft">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Financial Overview</h3>
        <Button onClick={onAddInvoiceClick} variant="secondary" size="sm">
            <Plus className="h-4 w-4 mr-2"/>
            Add Invoice
        </Button>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900/50 p-4 rounded-md">
          <p className="text-sm text-gray-400">Total Quoted</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(financials.totalQuoted)}</p>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-md">
          <p className="text-sm text-gray-400">Total Paid</p>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(financials.totalPaid)}</p>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-md">
          <p className="text-sm text-gray-400">Balance Due</p>
          <p className="text-2xl font-bold text-yellow-400">{formatCurrency(balanceDue)}</p>
        </div>
      </div>

      {/* Invoices List */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Invoices</h4>
        <div className="space-y-3">
          {financials.invoices.length > 0 ? financials.invoices.map(invoice => (
            <div key={invoice.id} className="bg-gray-900/50 p-3 rounded-md flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center mb-2 sm:mb-0">
                {getStatusIcon(invoice.status)}
                <div className="ml-3">
                  <p className="font-medium text-gray-200">{invoice.description}</p>
                  <p className="text-xs text-gray-500">Due: {invoice.dueDate}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-white sm:mx-4">{formatCurrency(invoice.amount)}</p>
                 {invoice.status !== 'Paid' && (
                    <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => onMarkAsPaid(invoice.id)}
                    >
                        <DollarSign className="w-4 h-4 mr-2" /> Mark as Paid
                    </Button>
                 )}
              </div>
            </div>
          )) : (
            <div className="text-center py-4 text-sm text-gray-500">No invoices have been added.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialsPanel;