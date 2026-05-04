// [path]: app/(dashboard)/dashboard/settings/templates/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { getTemplates, saveTemplates } from '@/lib/data-service';
import { Category } from '@/lib/types';
import Button from '@/components/ui/Button';
import { Plus, Trash2, Edit } from 'lucide-react';

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<Category[][]>([]);

    useEffect(() => {
        setTemplates(getTemplates());
    }, []);

    const handleDelete = (templateIndex: number) => {
        if (confirm('Are you sure you want to delete this template?')) {
            const newTemplates = templates.filter((_, index) => index !== templateIndex);
            setTemplates(newTemplates);
            saveTemplates(newTemplates);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Project Templates</h1>
                    <p className="text-gray-400">Manage the starting templates for new projects.</p>
                </div>
                <Button href="/dashboard/settings/templates/new" variant="primary">
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    New Template
                </Button>
            </div>
            
            <div className="space-y-4">
                {templates.map((template, index) => {
                    const templateName = template[0]?.name.split(' - ')[0] || `Template ${index + 1}`;
                    const categoryCount = template.length;
                    const taskCount = template.reduce((acc, cat) => acc + cat.subTasks.length, 0);

                    return (
                        <div key={index} className="bg-gray-800 border border-white/10 p-4 rounded-lg flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-white">{templateName}</h3>
                                <p className="text-sm text-gray-400">{categoryCount} Categories, {taskCount} Tasks</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button href={`/dashboard/settings/templates/${index}`} size="sm" variant="secondary">
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button onClick={() => handleDelete(index)} size="sm" variant="outline">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}