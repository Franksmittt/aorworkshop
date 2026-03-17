'use client';

import { useState } from 'react';
import { Project, TimelineUpdate } from '@/lib/types';
import Button from '../ui/Button';

interface AddTimelineFormProps {
  project: Project;
  onAddUpdate: (newUpdate: Omit<TimelineUpdate, 'id' | 'date'>) => void;
}

const AddTimelineForm = ({ project, onAddUpdate }: AddTimelineFormProps) => {
  const [updateText, setUpdateText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(project.categories[0]?.name || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateText.trim() || !selectedCategory) return;

    onAddUpdate({
      update: updateText,
      category: selectedCategory,
    });
    setUpdateText('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="updateText" className="block text-sm font-medium text-gray-300">
          New Update
        </label>
        <textarea
          id="updateText"
          rows={4}
          value={updateText}
          onChange={(e) => setUpdateText(e.target.value)}
          className="mt-1 block w-full rounded-md bg-gray-900 border-gray-600 text-white placeholder-gray-400 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
          placeholder="e.g., Engine block returned from machine shop."
          required
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-300">
          Category
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="mt-1 block w-full rounded-md bg-gray-900 border-gray-600 py-2 pl-3 pr-10 text-base text-white focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
        >
          {project.categories.map(cat => (
            <option key={cat.id} className="bg-gray-800 text-white">{cat.name}</option>
          ))}
        </select>
      </div>
      <Button type="submit" variant="primary" className="w-full">
        Add Update to Timeline
      </Button>
    </form>
  );
};

export default AddTimelineForm;