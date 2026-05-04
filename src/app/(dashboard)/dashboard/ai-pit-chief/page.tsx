// [path]: app/(dashboard)/dashboard/ai-pit-chief/page.tsx

'use client';

import Input from '@/components/ui/Input';
import { Search } from 'lucide-react';
import AiSuggestions from '@/components/dashboard/AiSuggestions';
import PredictiveAnalyticsChart from '@/components/dashboard/PredictiveAnalyticsChart';

export default function AiPitChiefPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">AI Pit Chief</h1>
        <p className="text-gray-400">The dedicated interface for interacting with the system&apos;s intelligence layer.</p>
      </div>

      {/* Query Console */}
      <div className="mb-8">
        <div className="relative">
          <Input 
            type="text"
            placeholder="Ask a question about your workshop... (e.g., 'Which projects are most profitable?' or 'Forecast cash flow for next month')"
            className="pl-12 text-lg h-16"
            disabled // Non-functional for this demo
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
        </div>
      </div>

      {/* Suggestions and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <AiSuggestions />
        </div>
        <div>
          <PredictiveAnalyticsChart />
        </div>
      </div>
    </div>
  );
}