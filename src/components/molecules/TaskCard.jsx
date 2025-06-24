import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format, isPast, isToday } from "date-fns";
import { toast } from "react-toastify";
import { categoryService } from "@/services/api/categoryService";
import { taskService } from "@/services/api/taskService";
import ApperIcon from "@/components/ApperIcon";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const TaskCard = ({ task, onUpdate, onDelete, onEdit }) => {
  const [isCompleting, setIsCompleting] = useState(false)
  const [category, setCategory] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isRecurringTask, setIsRecurringTask] = useState(false)
  useEffect(() => {
    const loadCategory = async () => {
      try {
        const categoryData = await categoryService.getById(task.categoryId)
        setCategory(categoryData)
      } catch (error) {
        console.error('Failed to load category:', error)
      }
    }
if (task.categoryId) {
      loadCategory()
    }
    
    // Check if this is a recurring task instance
    setIsRecurringTask(!!task.recurringTaskId)
  }, [task.categoryId, task.recurringTaskId])
  const handleToggleComplete = async () => {
    if (isCompleting) return
    
    setIsCompleting(true)
    try {
      const updatedTask = await taskService.toggleComplete(task.Id)
      
      if (updatedTask.completed) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 600)
        toast.success('Task completed! 🎉')
      }
      
      onUpdate(updatedTask)
    } catch (error) {
      toast.error('Failed to update task')
    } finally {
      setIsCompleting(false)
    }
  }

  const handleDelete = async () => {
    try {
      await taskService.delete(task.Id)
      onDelete(task.Id)
      toast.success('Task deleted')
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  const getDueDateStatus = () => {
    if (!task.dueDate) return null
    
    const dueDate = new Date(task.dueDate)
    if (isPast(dueDate) && !isToday(dueDate) && !task.completed) {
      return 'overdue'
    }
    if (isToday(dueDate) && !task.completed) {
      return 'today'
    }
    return 'upcoming'
  }

  const dueDateStatus = getDueDateStatus()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      layout
      className={`
        relative bg-white rounded-lg border border-surface-200 p-4 hover:shadow-md transition-all duration-200
        ${task.completed ? 'opacity-75' : ''}
      `}
    >
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: [0, 1.5, 0], rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute top-2 right-2 w-6 h-6 pointer-events-none"
          >
            <div className="w-full h-full bg-gradient-to-r from-accent via-secondary to-primary rounded-full"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="flex-shrink-0 mt-0.5">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={isCompleting}
          />
        </div>

{/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <h3 className={`
              font-medium text-surface-900 break-words flex-1
              ${task.completed ? 'line-through text-surface-500' : ''}
            `}>
              {task.title}
            </h3>
            {isRecurringTask && (
              <div className="flex-shrink-0">
                <ApperIcon 
                  name="Repeat" 
                  size={14} 
                  className="text-primary"
                  title="Recurring task"
                />
              </div>
            )}
          </div>
          
          {/* Priority Badge */}
          {task.priority && (
            <div className="flex-shrink-0 mt-1">
              <Badge 
                variant={task.priority} 
                size="xs"
                className={dueDateStatus === 'overdue' ? 'animate-pulse-slow' : ''}
              >
                {task.priority}
              </Badge>
            </div>
          )}

          {/* Category and Due Date */}
          <div className="flex items-center gap-3 mt-2">
            {category && (
              <div className="flex items-center gap-1.5 text-xs text-surface-600">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span>{category.name}</span>
              </div>
            )}
            
            {task.dueDate && (
              <div className={`
                flex items-center gap-1.5 text-xs
                ${dueDateStatus === 'overdue' ? 'text-red-600' : ''}
                ${dueDateStatus === 'today' ? 'text-amber-600' : ''}
                ${dueDateStatus === 'upcoming' ? 'text-surface-600' : ''}
              `}>
                <ApperIcon name="Calendar" size={12} />
                <span>
                  {format(new Date(task.dueDate), 'MMM d')}
                  {dueDateStatus === 'overdue' && ' (Overdue)'}
                  {dueDateStatus === 'today' && ' (Today)'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            icon="Edit"
            onClick={() => onEdit(task)}
            className="p-1.5"
          />
          <Button
            variant="ghost"
            size="sm"
            icon="Trash2"
            onClick={handleDelete}
            className="p-1.5 text-red-500 hover:text-red-600"
          />
        </div>
      </div>
    </motion.div>
  )
}

export default TaskCard