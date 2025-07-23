import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import axios from 'axios';

function TaskBoard({ tasks, user, socket }) {
  const [filter, setFilter] = useState({
    search: '',
    label: 'all',
    assignee: 'all'
  });

  const [filteredTasks, setFilteredTasks] = useState(tasks);

  useEffect(() => {
    filterTasks();
  }, [tasks, filter]);

  const filterTasks = () => {
    let filtered = tasks;

    if (filter.search) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(filter.search.toLowerCase())
      );
    }
    if (filter.label !== 'all') {
      filtered = filtered.filter(task => task.label === filter.label);
    }
    if (filter.assignee !== 'all') {
      filtered = filtered.filter(task => task.assignee_name === filter.assignee);
    }
    setFilteredTasks(filtered);
  };

  const onDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const onDrop = async (e, newStatus) => {
    const taskId = e.dataTransfer.getData('taskId');
    const token = localStorage.getItem('access_token');
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      socket.emit('task_update', { task_id: parseInt(taskId) });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const statusColumns = [
    { key: 'todo', label: 'To Do' },
    { key: 'inprogress', label: 'In Progress' },
    { key: 'done', label: 'Done' }
  ];

  return (
    <div>
      <div className="filters">
        <input
          type="text"
          placeholder="Search tasks..."
          value={filter.search}
          onChange={e => setFilter({ ...filter, search: e.target.value })}
        />
        <select
          value={filter.label}
          onChange={e => setFilter({ ...filter, label: e.target.value })}
        >
          <option value="all">All Labels</option>
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
          <option value="database">Database</option>
          <option value="design">Design</option>
        </select>
        <select
          value={filter.assignee}
          onChange={e => setFilter({ ...filter, assignee: e.target.value })}
        >
          <option value="all">All Assignees</option>
          {/* Assignees can be dynamically loaded */}
          <option value="John Doe">John Doe</option>
          <option value="Jane Smith">Jane Smith</option>
          <option value="Mike Johnson">Mike Johnson</option>
        </select>
      </div>
      <div className="task-board" style={{ display: 'flex', gap: '1rem' }}>
        {statusColumns.map(col => (
          <div
            key={col.key}
            onDrop={e => onDrop(e, col.key)}
            onDragOver={onDragOver}
            style={{ flex: 1, backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '8px', minHeight: '300px' }}
          >
            <h3>{col.label}</h3>
            {filteredTasks.filter(task => task.status === col.key).map(task => (
              <TaskCard key={task.id} task={task} onDragStart={onDragStart} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskBoard;
