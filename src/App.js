import React, { useState, useRef } from 'react';
import './App.css';

const TaskItem = ({ task, onToggle, onDelete, onEdit }) => {
  const { id, text, completed } = task;
  return (
    <div className="task-cont">
      <div
        className="task-text"
        style={{ textDecoration: completed ? 'line-through' : 'none' }}
        onClick={() => onToggle(id)}
      >
        {text}
      </div>
      <div className="task-buttons">
        <button className="glow-on-hover1" onClick={() => onDelete(id)}>Delete</button>
      </div>
      <div className="task-buttons1">
        <button className={`glow-on-hover ${completed ? 'completed' : ''}`} onClick={() => onEdit(id)}>Redact</button>
      </div>
    </div>
  );
};

const TaskList = ({ tasks, onToggle, onDelete, onEdit, filterStatus }) => {
  const filteredTasks = filterStatus === "all" ? tasks : tasks.filter(task => (filterStatus === "completed" ? task.completed : !task.completed));
  return (
    <div>
      {filteredTasks.map((task) => (
        <div key={task.id} className="task-container">
          <TaskItem task={task} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
        </div>
      ))}
    </div>
  );
};

const TaskForm = ({ onSubmit, taskToEdit }) => {
  const [text, setText] = useState(taskToEdit ? taskToEdit.text : '');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === '') return;
    onSubmit({ text });
    setText('');
  };
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <input type="text" placeholder="Введите задачу" value={text} onChange={(e) => setText(e.target.value)} style={{ width: '90%', padding: '10px', borderRadius: '10px' }} />
      <button className="glow-on-hover2" type="submit" style={{ padding: '18px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', }}> {taskToEdit ? 'Редактировать' : 'Добавить'} </button>
    </form>
  );
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const taskListRef = useRef(null);
  const addTask = (newTask) => setTasks([...tasks, { ...newTask, id: tasks.length + 1, completed: false }]);
  const toggleTask = (taskId) => setTasks(prevTasks => prevTasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task));
  const deleteTask = (taskId) => setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  const editTask = (taskId) => setTaskToEdit(tasks.find(task => task.id === taskId));
  const updateTask = (editedTask) => {
    setTasks(prevTasks => prevTasks.map(task => task.id === taskToEdit.id ? { ...task, ...editedTask } : task));
    setTaskToEdit(null);
  };
  const scrollToTop = () => { if (taskListRef.current) taskListRef.current.scrollTop = 0; };
  const scrollToBottom = () => { if (taskListRef.current) taskListRef.current.scrollTop = taskListRef.current.scrollHeight; };
  return (
    <div>
      <h1>task list</h1>
      <div className="qq">
        <button className="qwerty" onClick={scrollToTop}>Scroll to Top</button>
        <button className="qwerty" onClick={scrollToBottom}>Scroll to Bottom</button>
        <button className="qwerty" onClick={() => setFilterStatus("all")}>ALL</button>
        <button className="qwerty1" onClick={() => setFilterStatus("completed")}>completed</button>
        <button className="qwerty1" onClick={() => setFilterStatus("uncompleted")}>unfinished</button>
      </div>
      <TaskForm onSubmit={taskToEdit ? updateTask : addTask} taskToEdit={taskToEdit} />
      <div ref={taskListRef} style={{ overflowY: 'auto', maxHeight: '400px' }}>
        <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} onEdit={editTask} filterStatus={filterStatus} />
      </div>
    </div>
  );
}