import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TaskCard from '@/components/molecules/TaskCard'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import EmptyState from '@/components/molecules/EmptyState'
import ErrorState from '@/components/molecules/ErrorState'
import { taskService } from '@/services/api/taskService'

const TaskList = ({ 
  filters = {}, 
  searchQuery = '', 
  onTaskUpdate, 
  onTaskDelete, 
  onTaskEdit,
  onCreateTask,
  showArchived = false 
}) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await taskService.getAll()
      setTasks(data)
    } catch (err) {
      setError(err.message || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ))
    onTaskUpdate?.(updatedTask)
  }

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(task => task.Id !== taskId))
    onTaskDelete?.(taskId)
  }

  const filterTasks = (tasks) => {
    return tasks.filter(task => {
      // Archive filter
      if (showArchived && !task.archived) return false
      if (!showArchived && task.archived) return false
      
      // Category filter
      if (filters.categoryId && filters.categoryId !== 'all' && task.categoryId !== parseInt(filters.categoryId)) {
        return false
      }
      
      // Priority filter
      if (filters.priority && task.priority !== filters.priority) {
        return false
      }
      
      // Completion filter
      if (filters.completed !== undefined && task.completed !== filters.completed) {
        return false
      }
      
      // Search filter
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      
      return true
    })
  }

  const filteredTasks = filterTasks(tasks)

  if (loading) {
    return <SkeletonLoader count={5} />
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={loadTasks}
      />
    )
  }

  if (filteredTasks.length === 0) {
    if (searchQuery) {
      return (
        <EmptyState
          icon="Search"
          title="No tasks found"
          description={`No tasks match your search for "${searchQuery}"`}
        />
      )
    }
    
    if (showArchived) {
      return (
        <EmptyState
          icon="Archive"
          title="No archived tasks"
          description="Completed tasks will appear here when you archive them"
        />
      )
    }
    
    return (
      <EmptyState
        title="No tasks yet"
        description="Get started by creating your first task and take control of your productivity"
        actionLabel="Create Task"
        onAction={onCreateTask}
      />
    )
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {filteredTasks.map(task => (
          <motion.div
            key={task.Id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="group"
          >
            <TaskCard
              task={task}
              onUpdate={handleTaskUpdate}
              onDelete={handleTaskDelete}
              onEdit={onTaskEdit}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default TaskList