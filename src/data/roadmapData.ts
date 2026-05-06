import { RoadmapNodeData } from '../components/Roadmap/RoadmapNode';
import { Roadmap, RoadmapWeek, RoadmapTask } from '../services/database';

export interface RoadmapConnection {
  from: string;
  to: string;
}

// Function to generate roadmap data from real database data
export const generateRoadmapData = (
  roadmap: Roadmap, 
  weeks: RoadmapWeek[], 
  tasks: RoadmapTask[], 
  studentProgress?: any[],
  batchId?: string
): { nodes: RoadmapNodeData[] } => {
  const nodes = weeks.map((week, index) => {
    // Determine status based on actual student progress, not hardcoded
    let status: 'completed' | 'active' | 'locked' = 'locked';
    
    if (studentProgress && studentProgress.length > 0) {
      // Check if this week has any completed tasks
      const weekTasks = tasks.filter(task => task.week_id === week.id);
      const completedTasks = weekTasks.filter(task => 
        studentProgress.some(progress => progress.task_id === task.id && progress.status === 'completed')
      );
      
      if (completedTasks.length === weekTasks.length && weekTasks.length > 0) {
        status = 'completed'; // Mark as completed when all tasks are done
      } else if (completedTasks.length > 0) {
        status = 'active'; // Active if there's some progress but not all tasks done
      } else if (index === 0) {
        // First week is active if no progress yet
        status = 'active';
      } else {
        // Check if previous week is completed to unlock this week
        const previousWeek = weeks[index - 1];
        if (previousWeek) {
          const previousWeekTasks = tasks.filter(task => task.week_id === previousWeek.id);
          const previousWeekCompletedTasks = previousWeekTasks.filter(task => 
            studentProgress.some(progress => progress.task_id === task.id && progress.status === 'completed')
          );
          
          // Unlock if previous week is 100% completed
          if (previousWeekCompletedTasks.length === previousWeekTasks.length && previousWeekTasks.length > 0) {
            status = 'active';
          }
        }
      }
    } else {
      // No progress data, only first week is active
      if (index === 0) status = 'active';
    }
    
    // Get tasks for this week
    const weekTasks = tasks.filter(task => task.week_id === week.id);
    
    return {
      id: week.id,
      title: week.title,
      description: week.description || 'No description available',
      status,
      tasks: weekTasks.map(task => {
        const isCompleted = studentProgress ? 
          studentProgress.some(progress => progress.task_id === task.id && progress.status === 'completed') : 
          false;
        
        return {
          id: task.id,
          title: task.task_name,
          type: task.task_type as any, // Use actual task_type from database
          url: task.relevant_links?.[0] || '#',
          completed: isCompleted
        };
      }),
      relatedSkills: [week.domain],
      estimatedTime: '1 week',
      // Add completion statistics placeholder - will be populated by the component
      completionStats: batchId ? {
        totalStudents: 0, // Will be fetched dynamically
        completedStudents: 0,
        completionPercentage: 0
      } : undefined
    };
  });

  return { nodes };
};

// Keep the original hardcoded data as fallback (commented out since we're using database)
/*
export const roadmapData = {
  nodes: [
    {
      id: 'python-basics',
      title: 'Python Fundamentals',
      description: 'Learn the core concepts of Python programming including variables, data types, control structures, and basic syntax. This foundation will prepare you for more advanced topics.',
      status: 'completed' as const,
      tasks: [
        {
          id: 'python-install',
          title: 'Install Python and set up development environment',
          type: 'exercise' as const,
          url: 'https://python.org/downloads',
          completed: true
        },
        {
          id: 'variables-types',
          title: 'Learn about variables and data types',
          type: 'video' as const,
          url: '#',
          completed: true
        },
        {
          id: 'control-structures',
          title: 'Master if statements and loops',
          type: 'exercise' as const,
          url: '#',
          completed: true
        },
        {
          id: 'basic-functions',
          title: 'Create your first functions',
          type: 'project' as const,
          url: '#',
          completed: true
        }
      ],
      relatedSkills: ['Programming Logic', 'Problem Solving', 'Syntax'],
      estimatedTime: '2-3 weeks'
    },
    {
      id: 'data-structures',
      title: 'Data Structures',
      description: 'Master Python\'s built-in data structures: lists, dictionaries, tuples, and sets. Learn when and how to use each effectively in real-world scenarios.',
      status: 'active' as const,
      tasks: [
        {
          id: 'lists-tuples',
          title: 'Working with Lists and Tuples',
          type: 'video' as const,
          url: '#',
          completed: true
        },
        {
          id: 'dictionaries',
          title: 'Dictionary operations and methods',
          type: 'exercise' as const,
          url: '#',
          completed: true
        },
        {
          id: 'sets',
          title: 'Understanding Sets and their use cases',
          type: 'reading' as const,
          url: '#',
          completed: false
        },
        {
          id: 'data-structure-project',
          title: 'Build a contact management system',
          type: 'project' as const,
          url: '#',
          completed: false
        }
      ],
      relatedSkills: ['Data Management', 'Collections', 'Algorithms'],
      estimatedTime: '2-3 weeks'
    },
    {
      id: 'functions-modules',
      title: 'Functions & Modules',
      description: 'Deep dive into creating reusable code with functions, understanding scope, and organizing code using modules and packages for better maintainability.',
      status: 'locked' as const,
      tasks: [
        {
          id: 'function-parameters',
          title: 'Function parameters and return values',
          type: 'video' as const,
          url: '#',
          completed: false
        },
        {
          id: 'scope-lifetime',
          title: 'Variable scope and lifetime',
          type: 'reading' as const,
          url: '#',
          completed: false
        },
        {
          id: 'modules-packages',
          title: 'Creating and importing modules',
          type: 'exercise' as const,
          url: '#',
          completed: false
        },
        {
          id: 'module-project',
          title: 'Build a calculator module',
          type: 'project' as const,
          url: '#',
          completed: false
        }
      ],
      relatedSkills: ['Code Organization', 'Modularity', 'Reusability'],
      estimatedTime: '3-4 weeks'
    },
    {
      id: 'oop',
      title: 'Object-Oriented Programming',
      description: 'Learn the principles of OOP in Python: classes, objects, inheritance, polymorphism, and encapsulation. Build robust, scalable applications.',
      status: 'locked' as const,
      tasks: [
        {
          id: 'classes-objects',
          title: 'Creating classes and objects',
          type: 'video' as const,
          url: '#',
          completed: false
        },
        {
          id: 'inheritance',
          title: 'Inheritance and method overriding',
          type: 'exercise' as const,
          url: '#',
          completed: false
        },
        {
          id: 'encapsulation',
          title: 'Encapsulation and data hiding',
          type: 'reading' as const,
          url: '#',
          completed: false
        },
        {
          id: 'oop-project',
          title: 'Design a library management system',
          type: 'project' as const,
          url: '#',
          completed: false
        }
      ],
      relatedSkills: ['Design Patterns', 'Code Structure', 'Abstraction'],
      estimatedTime: '3-4 weeks'
    },
    {
      id: 'error-handling',
      title: 'Error Handling & Debugging',
      description: 'Master exception handling, debugging techniques, and writing robust code that handles edge cases gracefully. Learn to write production-ready code.',
      status: 'locked' as const,
      tasks: [
        {
          id: 'try-except',
          title: 'Try-except blocks and exception types',
          type: 'video' as const,
          url: '#',
          completed: false
        },
        {
          id: 'custom-exceptions',
          title: 'Creating custom exceptions',
          type: 'exercise' as const,
          url: '#',
          completed: false
        },
        {
          id: 'debugging',
          title: 'Debugging techniques and tools',
          type: 'reading' as const,
          url: '#',
          completed: false
        },
        {
          id: 'robust-code',
          title: 'Write error-resistant file processor',
          type: 'project' as const,
          url: '#',
          completed: false
        }
      ],
      relatedSkills: ['Debugging', 'Testing', 'Code Quality'],
      estimatedTime: '2 weeks'
    },
    {
      id: 'file-handling',
      title: 'File I/O & Data Processing',
      description: 'Learn to work with files, process different data formats (CSV, JSON, XML), and handle large datasets efficiently for data analysis.',
      status: 'locked' as const,
      tasks: [
        {
          id: 'file-operations',
          title: 'Reading and writing files',
          type: 'video' as const,
          url: '#',
          completed: false
        },
        {
          id: 'csv-json',
          title: 'Working with CSV and JSON data',
          type: 'exercise' as const,
          url: '#',
          completed: false
        },
        {
          id: 'data-processing',
          title: 'Data cleaning and transformation',
          type: 'reading' as const,
          url: '#',
          completed: false
        },
        {
          id: 'data-project',
          title: 'Build a data analysis tool',
          type: 'project' as const,
          url: '#',
          completed: false
        }
      ],
      relatedSkills: ['Data Processing', 'File Systems', 'Data Formats'],
      estimatedTime: '2-3 weeks'
    },
    {
      id: 'libraries',
      title: 'Popular Libraries & Frameworks',
      description: 'Explore essential Python libraries: NumPy for numerical computing, Pandas for data analysis, and Requests for web APIs. Build real-world applications.',
      status: 'locked' as const,
      tasks: [
        {
          id: 'numpy-basics',
          title: 'NumPy arrays and operations',
          type: 'video' as const,
          url: '#',
          completed: false
        },
        {
          id: 'pandas-dataframes',
          title: 'Pandas DataFrames and analysis',
          type: 'exercise' as const,
          url: '#',
          completed: false
        },
        {
          id: 'requests-apis',
          title: 'Making HTTP requests and APIs',
          type: 'reading' as const,
          url: '#',
          completed: false
        },
        {
          id: 'library-project',
          title: 'Create a weather data analyzer',
          type: 'project' as const,
          url: '#',
          completed: false
        }
      ],
      relatedSkills: ['Data Science', 'APIs', 'Scientific Computing'],
      estimatedTime: '4-5 weeks'
    },
    {
      id: 'web-development',
      title: 'Web Development with Python',
      description: 'Introduction to web development with Python using Flask framework. Build web applications, REST APIs, and integrate with databases.',
      status: 'locked' as const,
      tasks: [
        {
          id: 'flask-basics',
          title: 'Flask fundamentals and routing',
          type: 'video' as const,
          url: '#',
          completed: false
        },
        {
          id: 'templates',
          title: 'HTML templates and forms',
          type: 'exercise' as const,
          url: '#',
          completed: false
        },
        {
          id: 'databases',
          title: 'Database integration with SQLAlchemy',
          type: 'reading' as const,
          url: '#',
          completed: false
        },
        {
          id: 'web-project',
          title: 'Build a task management web app',
          type: 'project' as const,
          url: '#',
          completed: false
        }
      ],
      relatedSkills: ['Web Development', 'APIs', 'Databases'],
      estimatedTime: '4-6 weeks'
    }
  ] as RoadmapNodeData[],
  
  connections: [
    { from: 'python-basics', to: 'data-structures' },
    { from: 'data-structures', to: 'functions-modules' },
    { from: 'functions-modules', to: 'oop' },
    { from: 'oop', to: 'error-handling' },
    { from: 'error-handling', to: 'file-handling' },
    { from: 'file-handling', to: 'libraries' },
    { from: 'libraries', to: 'web-development' }
  ] as RoadmapConnection[]
};
*/