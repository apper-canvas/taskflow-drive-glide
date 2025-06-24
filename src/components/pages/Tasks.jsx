import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { taskService } from "@/services/api/taskService";
import TaskModal from "@/components/molecules/TaskModal";
import TaskHeader from "@/components/organisms/TaskHeader";
import TaskList from "@/components/organisms/TaskList";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [stats, setStats] = useState({ completed: 0, total: 0 });
  const [recurringTasks, setRecurringTasks] = useState([]);
useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    // Listen for category changes from sidebar
const handleCategoryChange = (event) => {
      setSelectedCategory(event.detail);
      setFilters(prev => ({
        ...prev,
        categoryId: event.detail === 'all' ? null : event.detail
      }));
    };

window.addEventListener('categoryChange', handleCategoryChange);
    return () => window.removeEventListener('categoryChange', handleCategoryChange);
  }, []);

  const loadTasks = async () => {
    try {
const data = await taskService.getAll();
      const activeTasks = data.filter(task => !task.archived);
      setTasks(activeTasks);
      
// Calculate stats
      const completed = activeTasks.filter(task => task.completed).length;
      setStats({ completed, total: activeTasks.length });
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  }

const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskModal(true);
  };

const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };
const handleTaskSaved = (savedTask) => {
    if (editingTask) {
      // Update existing task
      setTasks(prev => prev.map(task => 
        task.Id === savedTask.Id ? savedTask : task
      ));
    } else {
      // Add new task
      setTasks(prev => [...prev, savedTask]);
    }
    
    // Recalculate stats
const updatedTasks = editingTask 
      ? tasks.map(task => task.Id === savedTask.Id ? savedTask : task)
      : [...tasks, savedTask];
    
    const completed = updatedTasks.filter(task => task.completed).length;
    setStats({ completed, total: updatedTasks.length });
  };

const handleRecurringTaskSaved = (result) => {
    if (result.firstTask) {
      setTasks(prev => [...prev, result.firstTask]);
      const completed = [...tasks, result.firstTask].filter(task => task.completed).length;
      setStats({ completed, total: tasks.length + 1 });
    }
  };

const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ));
    
    // Recalculate stats
    const updatedTasks = tasks.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    );
    const completed = updatedTasks.filter(task => task.completed).length;
    setStats({ completed, total: updatedTasks.length });
  };

const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(task => task.Id !== taskId));
    
    // Recalculate stats
    const updatedTasks = tasks.filter(task => task.Id !== taskId);
    const completed = updatedTasks.filter(task => task.completed).length;
    setStats({ completed, total: updatedTasks.length });
  };

const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

const effectiveFilters = {
    ...filters,
    categoryId: selectedCategory === 'all' ? null : selectedCategory
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col overflow-hidden"
    >
      <TaskHeader
        onCreateTask={handleCreateTask}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        completedCount={stats.completed}
        totalCount={stats.total}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <TaskList
          filters={effectiveFilters}
          searchQuery={searchQuery}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
          onTaskEdit={handleEditTask}
          onCreateTask={handleCreateTask}
        />
      </div>

<TaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        task={editingTask}
        onTaskSaved={handleTaskSaved}
        onRecurringTaskSaved={handleRecurringTaskSaved}
      />
    </motion.div>
  );
};

export default Tasks;