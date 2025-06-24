import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { categoryService } from "@/services/api/categoryService";
import { taskService } from "@/services/api/taskService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const TaskModal = ({ isOpen, onClose, task, onTaskSaved, onRecurringTaskSaved }) => {
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    priority: 'medium',
    dueDate: '',
    isRecurring: false,
    recurringType: 'daily',
    recurringInterval: 1,
    recurringEndDate: ''
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAll()
        setCategories(data)
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    }
    loadCategories()
  }, [])

  useEffect(() => {
if (task) {
      setFormData({
        title: task.title || '',
        categoryId: task.categoryId || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate || '',
        isRecurring: false,
        recurringType: 'daily',
        recurringInterval: 1,
        recurringEndDate: ''
      })
    } else {
      setFormData({
        title: '',
        categoryId: '',
        priority: 'medium',
        dueDate: '',
        isRecurring: false,
        recurringType: 'daily',
        recurringInterval: 1,
        recurringEndDate: ''
      })
    }
    setErrors({})
  }, [task, isOpen])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required'
    }
    
    if (formData.isRecurring) {
      if (!formData.dueDate) {
        newErrors.dueDate = 'Due date is required for recurring tasks'
      }
      if (formData.recurringInterval < 1) {
        newErrors.recurringInterval = 'Interval must be at least 1'
      }
      if (formData.recurringEndDate && formData.dueDate && new Date(formData.recurringEndDate) <= new Date(formData.dueDate)) {
        newErrors.recurringEndDate = 'End date must be after the start date'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      let result
      
      if (task) {
        // Update existing task (no recurring support for existing tasks)
        result = await taskService.update(task.Id, formData)
        toast.success('Task updated successfully')
        onTaskSaved(result)
      } else {
        if (formData.isRecurring) {
          // Create recurring task
          result = await taskService.createRecurringTask(formData)
          toast.success('Recurring task created successfully')
          onRecurringTaskSaved?.(result)
        } else {
          // Create regular task
          result = await taskService.create(formData)
          toast.success('Task created successfully')
          onTaskSaved(result)
        }
      }
      
      onClose()
    } catch (error) {
      toast.error(task ? 'Failed to update task' : 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-heading font-semibold text-surface-900">
                  {task ? 'Edit Task' : 'Create New Task'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="X"
                  onClick={onClose}
                  className="p-1.5"
                />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Task Title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  error={errors.title}
                  placeholder="Enter task title..."
                  autoFocus
                />

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => handleChange('categoryId', e.target.value)}
                    className={`
                      block w-full rounded-lg border px-3 py-2.5 text-surface-900
                      ${errors.categoryId 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-surface-300 focus:border-primary focus:ring-primary/20'
                      }
                      focus:outline-none focus:ring-2 transition-colors duration-200
                    `}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.Id} value={category.Id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="text-sm text-red-600 mt-1">{errors.categoryId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    className="block w-full rounded-lg border border-surface-300 px-3 py-2.5 text-surface-900 focus:border-primary focus:ring-primary/20 focus:outline-none focus:ring-2 transition-colors duration-200"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <Input
                  type="date"
                  label="Due Date (Optional)"
                  value={formData.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  icon="Calendar"
                  iconPosition="left"
/>

                {/* Recurring Task Options */}
                {!task && (
                  <div className="border-t border-surface-200 pt-4">
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="checkbox"
                        id="isRecurring"
                        checked={formData.isRecurring}
                        onChange={(e) => handleChange('isRecurring', e.target.checked)}
                        className="rounded border-surface-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="isRecurring" className="text-sm font-medium text-surface-700">
                        Make this a recurring task
                      </label>
                    </div>

                    {formData.isRecurring && (
                      <div className="space-y-4 pl-6 border-l-2 border-surface-100">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">
                              Repeat
                            </label>
                            <select
                              value={formData.recurringType}
                              onChange={(e) => handleChange('recurringType', e.target.value)}
                              className="block w-full rounded-lg border border-surface-300 px-3 py-2 text-surface-900 focus:border-primary focus:ring-primary/20 focus:outline-none focus:ring-2 transition-colors duration-200"
                            >
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                              <option value="yearly">Yearly</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">
                              Every
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="365"
                              value={formData.recurringInterval}
                              onChange={(e) => handleChange('recurringInterval', parseInt(e.target.value) || 1)}
                              className={`
                                block w-full rounded-lg border px-3 py-2 text-surface-900
                                ${errors.recurringInterval 
                                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                                  : 'border-surface-300 focus:border-primary focus:ring-primary/20'
                                }
                                focus:outline-none focus:ring-2 transition-colors duration-200
                              `}
                            />
                            {errors.recurringInterval && (
                              <p className="text-sm text-red-600 mt-1">{errors.recurringInterval}</p>
                            )}
                          </div>
                        </div>

                        <Input
                          type="date"
                          label="End Date (Optional)"
                          value={formData.recurringEndDate}
                          onChange={(e) => handleChange('recurringEndDate', e.target.value)}
                          error={errors.recurringEndDate}
                          icon="Calendar"
                          iconPosition="left"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    icon={task ? "Save" : formData.isRecurring ? "Repeat" : "Plus"}
                  >
                    {task ? 'Update Task' : formData.isRecurring ? 'Create Recurring Task' : 'Create Task'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default TaskModal