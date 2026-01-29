import React from 'react';
import { Check, X, HelpCircle } from 'lucide-react';

export const CapabilitiesTable: React.FC = () => {
    const capabilities = [
        {
            category: 'User Management',
            items: [
                { feature: 'View All Users', admin: true, mentor: false, note: 'Mentors can only see assigned students' },
                { feature: 'Create/Edit Users', admin: true, mentor: false },
                { feature: 'Delete Users', admin: true, mentor: false },
                { feature: 'Assign Roles', admin: true, mentor: false },
            ]
        },
        {
            category: 'Batch Management',
            items: [
                { feature: 'View Batches', admin: true, mentor: true, note: 'Mentors see their own batches' },
                { feature: 'Create Batches', admin: true, mentor: true },
                { feature: 'Edit Batch Details', admin: true, mentor: true },
                { feature: 'Delete Batches', admin: true, mentor: false },
                { feature: 'Assign Students to Batch', admin: true, mentor: true },
            ]
        },
        {
            category: 'Roadmaps & Content',
            items: [
                { feature: 'View Roadmaps', admin: true, mentor: true },
                { feature: 'Create Roadmaps', admin: true, mentor: true },
                { feature: 'Edit/Delete Roadmaps', admin: true, mentor: true },
                { feature: 'Manage Weeks/Tasks', admin: true, mentor: true },
            ]
        },
        {
            category: 'Notices',
            items: [
                { feature: 'View Notices', admin: true, mentor: true },
                { feature: 'Create Notices', admin: true, mentor: true },
                { feature: 'Edit/Delete Own Notices', admin: true, mentor: true },
                { feature: 'Publish Notices', admin: true, mentor: true },
            ]
        },
        {
            category: 'Student Progress',
            items: [
                { feature: 'View Student Progress', admin: true, mentor: true },
                { feature: 'Grade/Review Tasks', admin: true, mentor: true },
                { feature: 'Give Feedback', admin: true, mentor: true },
            ]
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Role Capabilities</h2>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 w-1/3">Capability</th>
                                <th className="p-4 text-sm font-semibold text-blue-600 dark:text-blue-400 text-center w-1/4">Admin</th>
                                <th className="p-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400 text-center w-1/4">Mentor</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 w-1/6">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {capabilities.map((section, idx) => (
                                <React.Fragment key={idx}>
                                    <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                                        <td colSpan={4} className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-100/50 dark:bg-gray-700/50">
                                            {section.category}
                                        </td>
                                    </tr>
                                    {section.items.map((item, itemIdx) => (
                                        <tr key={itemIdx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="p-4 text-sm font-medium text-gray-800 dark:text-gray-200">
                                                {item.feature}
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex justify-center">
                                                    {item.admin ?
                                                        <Check className="w-5 h-5 text-green-500" /> :
                                                        <X className="w-5 h-5 text-red-400" />
                                                    }
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex justify-center">
                                                    {item.mentor ?
                                                        <Check className="w-5 h-5 text-green-500" /> :
                                                        <X className="w-5 h-5 text-red-400" />
                                                    }
                                                </div>
                                            </td>
                                            <td className="p-4 text-xs text-gray-500 dark:text-gray-400">
                                                {item.note && (
                                                    <div className="flex items-center gap-1 group relative">
                                                        <HelpCircle className="w-4 h-4 text-gray-400" />
                                                        <span className="hidden group-hover:block absolute right-full mr-2 w-48 p-2 bg-black text-white rounded text-xs z-10">
                                                            {item.note}
                                                        </span>
                                                        <span className="lg:hidden">{item.note}</span>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
