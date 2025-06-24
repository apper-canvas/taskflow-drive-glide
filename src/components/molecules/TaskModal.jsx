import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import { taskService } from '@/services/api/taskService'
import { categoryService } from '@/services/api/categoryService'

const TaskModal = ({ isOpen, onClose, task, onTaskSaved }) => {
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    priority: 'medium',
    dueDate: ''
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
        dueDate: task.dueDate || ''
      })
    } else {
      setFormData({
        title: '',
        categoryId: '',
        priority: 'medium',
        dueDate: ''
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
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      let savedTask
      
      if (task) {
        // Update existing task
        savedTask = await taskService.update(task.Id, formData)
        toast.success('Task updated successfully')
      } else {
        // Create new task
        savedTask = await taskService.create(formData)
        toast.success('Task created successfully')
      }
      
      onTaskSaved(savedTask)
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
                    icon={task ? "Save" : "Plus"}
                  >
                    {task ? 'Update Task' : 'Create Task'}
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