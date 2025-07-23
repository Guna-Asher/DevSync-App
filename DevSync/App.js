import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import TaskBoard from './components/TaskBoard';
import Login from './components/Login';

const socket = io('http://localhost:5000');

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (user) {
      fetchTasks();
      socket.on('task_updated', (data) => {
        fetchTasks();
      });
    }
    return () => {
      socket.off('task_updated');
    };
  }, [user]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:5000/api/tasks/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="App">
      <TaskBoard tasks={tasks} user={user} socket={socket} />
    </div>
  );
}

export default App;
