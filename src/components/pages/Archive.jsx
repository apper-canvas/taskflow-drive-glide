import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import TaskList from '@/components/organisms/TaskList'
import SearchBar from '@/components/molecules/SearchBar'
import { taskService } from '@/services/api/taskService'

const Archive = () => {
  const [archivedTasks, setArchivedTasks] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadArchivedTasks()
  }, [])

  const loadArchivedTasks = async () => {
    setLoading(true)
    try {
      const data = await taskService.getAll()
      const archived = data.filter(task => task.archived)
      setArchivedTasks(archived)
    } catch (error) {
      console.error('Failed to load archived tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUnarchive = async (taskId) => {
    try {
      await taskService.unarchive(taskId)
      setArchivedTasks(prev => prev.filter(task => task.Id !== taskId))
      toast.success('Task restored to active list')
    } catch (error) {
      toast.error('Failed to restore task')
    }
  }

  const handleTaskDelete = (taskId) => {
    setArchivedTasks(prev => prev.filter(task => task.Id !== taskId))
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-surface-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold text-surface-900">
              Archive
            </h1>
            <p className="text-surface-600 mt-1">
              {archivedTasks.length} archived tasks
            </p>
          </div>
        </div>

        <SearchBar
          onSearch={handleSearch}
          placeholder="Search archived tasks..."
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <TaskList
          filters={{}}
          searchQuery={searchQuery}
          onTaskUpdate={handleUnarchive}
          onTaskDelete={handleTaskDelete}
          showArchived={true}
        />
      </div>
    </motion.div>
  )
}

export default Archive