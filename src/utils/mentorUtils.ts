export const getTaskTypeColor = (type: string) => {
    const neutral = 'bg-muted text-muted-foreground';
    const colors: Record<string, string> = {
        'Watch': neutral,
        'Read': neutral,
        'Project': neutral,
        'Attend': neutral,
        'MCQ': neutral,
        'Written': neutral,
    };
    return colors[type] ?? neutral;
};

export const getTagColor = (tag: string) => {
    const neutral = 'bg-muted text-muted-foreground border-border';
    const colors: Record<string, string> = {
        Reminder: neutral,
        Homework: neutral,
        Assignment: neutral,
        Exam: neutral,
        Cancellation: neutral,
        Resources: neutral,
        Welcome: neutral,
        Meeting: neutral,
    };
    return colors[tag] ?? neutral;
};
