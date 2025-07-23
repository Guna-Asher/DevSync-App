import React from 'react';

function TaskCard({ task, onDragStart }) {
  const labelColors = {
    frontend: 'bg-green-100 text-green-800',
    backend: 'bg-blue-100 text-blue-800',
    database: 'bg-yellow-100 text-yellow-800',
    design: 'bg-purple-100 text-purple-800'
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className={`task-card bg-white rounded-lg shadow p-4 mb-4 cursor-move border-l-4 ${
        task.status === 'todo' ? 'border-yellow-500' :
        task.status === 'inprogress' ? 'border-blue-500' :
        task.status === 'done' ? 'border-green-500' : ''
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{task.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{task.description}</p>
        </div>
        <div className="flex space-x-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${labelColors[task.label]}`}>
            {task.label.charAt(0).toUpperCase() + task.label.slice(1)}
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center">
          {/* Placeholder for assignee image */}
          <div className="h-6 w-6 rounded-full bg-gray-300"></div>
          <span className="ml-2 text-sm text-gray-600">{task.assignee_name || 'Unassigned'}</span>
        </div>
        <div className="text-xs text-gray-500">Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</div>
      </div>
    </div>
  );
}

export default TaskCard;
