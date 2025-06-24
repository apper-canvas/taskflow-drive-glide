import { useState } from 'react'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import ApperIcon from '@/components/ApperIcon'

const TaskHeader = ({ 
  onCreateTask, 
  onSearch, 
  onFilterChange,
  completedCount = 0,
  totalCount = 0 
}) => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const filters = [
    { id: 'all', label: 'All Tasks', icon: 'List' },
    { id: 'pending', label: 'Pending', icon: 'Clock' },
    { id: 'completed', label: 'Completed', icon: 'CheckCircle' }
  ]

  const priorityFilters = [
    { id: 'all', label: 'All Priority' },
    { id: 'high', label: 'High Priority' },
    { id: 'medium', label: 'Medium Priority' },
    { id: 'low', label: 'Low Priority' }
  ]

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId)
    
    const filterConfig = {}
    
    if (filterId === 'pending') {
      filterConfig.completed = false
    } else if (filterId === 'completed') {
      filterConfig.completed = true
    }
    
    onFilterChange(filterConfig)
  }

  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div className="bg-white border-b border-surface-200 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-surface-900">
            My Tasks
          </h1>
          <p className="text-surface-600 mt-1">
            {completedCount} of {totalCount} tasks completed
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="md"
            icon="Filter"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-surface-100' : ''}
          >
            Filters
          </Button>
          <Button
            variant="primary"
            size="md"
            icon="Plus"
            onClick={onCreateTask}
          >
            Add Task
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-surface-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(completionPercentage)}%</span>
          </div>
          <div className="w-full bg-surface-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-4">
        <SearchBar
          onSearch={onSearch}
          placeholder="Search tasks..."
        />
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="space-y-4 p-4 bg-surface-50 rounded-lg">
          {/* Status Filters */}
          <div>
            <h3 className="text-sm font-medium text-surface-700 mb-2">Status</h3>
            <div className="flex flex-wrap gap-2">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => handleFilterChange(filter.id)}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${activeFilter === filter.id
                      ? 'bg-primary text-white'
                      : 'bg-white text-surface-700 hover:bg-surface-100 border border-surface-200'
                    }
                  `}
                >
                  <ApperIcon name={filter.icon} size={14} />
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskHeader