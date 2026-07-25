export const getTaskTypeColor = (type: string) => {
    const neutral = 'bg-muted text-muted-foreground';
    const handsOn = 'bg-primary/15 text-primary';
    const colors: Record<string, string> = {
        'Watch': neutral,
        'Read': neutral,
        'Project': handsOn,
        'Hands-on': handsOn,
        'Attend': neutral,
        'MCQ': neutral,
        'Written': neutral,
    };
    return colors[type] ?? neutral;
};

/** DB stores project; show Hands-on in mentor UI */
export function formatTaskTypeLabel(type: string): string {
    if (type === 'Project' || type === 'project') return 'Hands-on';
    return type;
}

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
