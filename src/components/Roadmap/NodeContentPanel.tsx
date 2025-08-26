import React, { useState } from 'react';
import { X, Clock, ExternalLink, CheckCircle, Circle, Play, BookOpen, Code, FileText, Award } from 'lucide-react';
import { RoadmapNodeData } from './RoadmapNode';

interface NodeContentPanelProps {
  node: RoadmapNodeData;
  onClose: () => void;
  isDarkMode?: boolean;
}

export const NodeContentPanel: React.FC<NodeContentPanelProps> = ({ node, onClose, isDarkMode = false }) => {
  const [completedTasks, setCompletedTasks] = useState(node.tasks.map(t => t.completed));

  const toggleTaskCompletion = (taskIndex: number) => {
    setCompletedTasks(prev => {
      const newCompleted = [...prev];
      newCompleted[taskIndex] = !newCompleted[taskIndex];
      return newCompleted;
    });
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="w-4 h-4 text-blue-500" />;
      case 'exercise':
        return <Code className="w-4 h-4 text-green-500" />;
      case 'reading':
        return <BookOpen className="w-4 h-4 text-purple-500" />;
      case 'project':
        return <FileText className="w-4 h-4 text-orange-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-500" />;
    }
  };

  const completionRate = completedTasks.filter(Boolean).length / completedTasks.length;
  const isCompleted = completionRate === 1;

  return (
    <div className={`w-1/3 border-l h-full flex flex-col transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-6 border-b transition-colors duration-200 ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center gap-3">
          {node.status === 'completed' ? (
            <CheckCircle className={`w-6 h-6 fill-current ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
          ) : node.status === 'active' ? (
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              isDarkMode ? 'border-blue-400' : 'border-blue-500'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'}`} />
            </div>
          ) : (
            <div className={`w-6 h-6 rounded-full border-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`} />
          )}
          <h2 className={`text-xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{node.title}</h2>
        </div>
        <button
          onClick={onClose}
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode 
              ? 'hover:bg-gray-700 text-gray-400' 
              : 'hover:bg-gray-100 text-gray-500'
          }`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Description */}
        <div className="mb-6">
          <p className={`leading-relaxed transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{node.description}</p>
        </div>

        {/* Meta Information */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`flex items-center gap-2 text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <Clock className="w-4 h-4" />
            <span>{node.estimatedTime}</span>
          </div>
          <div className={`flex items-center gap-2 text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <Award className="w-4 h-4" />
            <span>{node.tasks.length} tasks</span>
          </div>
        </div>

        {/* Progress */}
        {node.status === 'active' && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className={`font-semibold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Progress</h3>
              <span className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {Math.round(completionRate * 100)}% Complete
              </span>
            </div>
            <div className={`w-full rounded-full h-2 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'}`}
                style={{ width: `${completionRate * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Tasks & Resources */}
        <div className="mb-6">
          <h3 className={`font-semibold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Tasks & Resources</h3>
          <div className="space-y-3">
            {node.tasks.map((task, index) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'border-gray-600 hover:border-gray-500 bg-gray-700/50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <button
                  onClick={() => toggleTaskCompletion(index)}
                  className="flex-shrink-0"
                  disabled={node.status === 'locked'}
                >
                  {completedTasks[index] ? (
                    <CheckCircle className={`w-5 h-5 fill-current ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
                  ) : (
                    <Circle className={`w-5 h-5 transition-colors ${
                      isDarkMode 
                        ? 'text-gray-500 hover:text-gray-400' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`} />
                  )}
                </button>
                
                <div className="flex items-center gap-2 flex-1">
                  {getTaskIcon(task.type)}
                  <span className={`text-sm ${
                    completedTasks[index] 
                      ? `line-through ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}` 
                      : `${isDarkMode ? 'text-white' : 'text-gray-900'}`
                  }`}>
                    {task.title}
                  </span>
                </div>

                {task.url && (
                  <a
                    href={task.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-shrink-0 p-1 rounded transition-colors ${
                      isDarkMode 
                        ? 'hover:bg-gray-600 text-gray-400' 
                        : 'hover:bg-gray-100 text-gray-500'
                    }`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Related Skills */}
        {node.relatedSkills.length > 0 && (
          <div className="mb-6">
            <h3 className={`font-semibold mb-3 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Related Skills</h3>
            <div className="flex flex-wrap gap-2">
              {node.relatedSkills.map((skill, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-blue-900/30 text-blue-300 border-blue-700' 
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {node.status === 'active' && (
        <div className={`p-6 border-t transition-colors duration-200 ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={() => {/* Handle completion */}}
            className={`w-full py-3 px-4 rounded-xl font-medium transition-colors ${
              isCompleted
                ? `${isDarkMode ? 'bg-green-500 hover:bg-green-600' : 'bg-green-500 hover:bg-green-600'} text-white`
                : `${isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'} cursor-not-allowed`
            }`}
            disabled={!isCompleted}
          >
            {isCompleted ? 'Mark as Complete' : `Complete ${completedTasks.filter(Boolean).length}/${completedTasks.length} tasks first`}
          </button>
        </div>
      )}
    </div>
  );
};