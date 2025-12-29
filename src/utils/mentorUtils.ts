export const getTaskTypeColor = (type: string, isDarkMode: boolean) => {
    const colors = {
        'Watch': isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700',
        'Read': isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700',
        'Project': isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700',
        'Attend': isDarkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-50 text-purple-700',
        'MCQ': isDarkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-50 text-yellow-700',
        'Written': isDarkMode ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-50 text-orange-700'
    };
    return colors[type as keyof typeof colors] || colors.Watch;
};

export const getTagColor = (tag: string) => {
    const colors = {
        Reminder: 'bg-blue-100 text-blue-800 border-blue-200',
        Homework: 'bg-purple-100 text-purple-800 border-purple-200',
        Assignment: 'bg-green-100 text-green-800 border-green-200',
        Exam: 'bg-red-100 text-red-800 border-red-200',
        Cancellation: 'bg-gray-100 text-gray-800 border-gray-200',
        Resources: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        Welcome: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        Meeting: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[tag as keyof typeof colors] || colors.Reminder;
};
