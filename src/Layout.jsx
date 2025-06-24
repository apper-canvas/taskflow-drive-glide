import { NavLink, Outlet, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "@/index.css";
import { categoryService } from "@/services/api/categoryService";
import { taskService } from "@/services/api/taskService";
import { routeArray } from "@/config/routes";
import ApperIcon from "@/components/ApperIcon";
import Tasks from "@/components/pages/Tasks";
const Layout = () => {
  const location = useLocation()
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [recurringTasks, setRecurringTasks] = useState([])
  const [showRecurringPanel, setShowRecurringPanel] = useState(false)
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
    loadRecurringTasks()
  }, [])

  const loadRecurringTasks = async () => {
    try {
      const { taskService } = await import('@/services/api/taskService')
      const data = await taskService.getRecurringTasks()
      setRecurringTasks(data.filter(task => !task.paused))
    } catch (error) {
      console.error('Failed to load recurring tasks:', error)
    }
  }
const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId)
    setMobileMenuOpen(false)
    // Emit category change event for tasks page
    if (typeof CustomEvent !== 'undefined') {
      window.dispatchEvent(new CustomEvent('categoryChange', { detail: categoryId }))
    } else {
      // Fallback for environments where CustomEvent is not available
      const event = document.createEvent('CustomEvent')
      event.initCustomEvent('categoryChange', false, false, categoryId)
      window.dispatchEvent(event)
    }
  }
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 flex items-center justify-between px-4 lg:px-6 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
          >
            <ApperIcon name="Menu" size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" size={16} className="text-white" />
            </div>
            <h1 className="text-xl font-heading font-bold text-surface-900">TaskFlow</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-surface-600">
            <ApperIcon name="Calendar" size={16} />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className={`
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static fixed inset-y-0 left-0 z-50
          w-64 bg-surface-50 border-r border-surface-200 transition-transform duration-300 ease-in-out
          flex flex-col overflow-hidden
        `}>
          {/* Mobile overlay */}
          {mobileMenuOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
          
          <div className="relative z-50 bg-surface-50 h-full flex flex-col overflow-y-auto">
            {/* Navigation */}
            <nav className="p-4 space-y-2">
              {routeArray.map(route => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-surface-700 hover:bg-surface-100 hover:text-surface-900'
                    }
                  `}
                >
                  <ApperIcon name={route.icon} size={18} />
                  <span className="font-medium">{route.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Categories */}
            <div className="px-4 py-2">
              <h3 className="text-sm font-semibold text-surface-500 uppercase tracking-wide mb-3">
                Categories
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => handleCategorySelect('all')}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-left
                    ${selectedCategory === 'all'
                      ? 'bg-secondary text-white'
                      : 'text-surface-700 hover:bg-surface-100'
                    }
                  `}
                >
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-secondary"></div>
                  <span className="font-medium">All Tasks</span>
                </button>
                {categories.map(category => (
                  <button
                    key={category.Id}
                    onClick={() => handleCategorySelect(category.Id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-left
                      ${selectedCategory === category.Id
                        ? 'bg-secondary text-white'
                        : 'text-surface-700 hover:bg-surface-100'
                      }
                    `}
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="font-medium">{category.name}</span>
                  </button>
))}
              </div>
            </div>

            {/* Recurring Tasks Configuration */}
            <div className="px-4 py-2 border-t border-surface-200 mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-surface-500 uppercase tracking-wide">
                  Recurring Tasks
                </h3>
                <button
                  onClick={() => setShowRecurringPanel(!showRecurringPanel)}
                  className="p-1 rounded hover:bg-surface-100 transition-colors"
                >
                  <ApperIcon 
                    name={showRecurringPanel ? "ChevronUp" : "ChevronDown"} 
                    size={14} 
                    className="text-surface-500"
                  />
                </button>
              </div>
              
              {showRecurringPanel && (
                <div className="space-y-2">
                  {recurringTasks.length === 0 ? (
                    <p className="text-xs text-surface-500 px-3 py-2">
                      No recurring tasks configured
                    </p>
                  ) : (
                    recurringTasks.map(task => (
                      <div
                        key={task.Id}
                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-100 text-sm"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <ApperIcon name="Repeat" size={12} className="text-primary flex-shrink-0" />
                          <span className="truncate text-surface-700">{task.title}</span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="text-xs text-surface-500 capitalize">
                            {task.recurringType}
                          </span>
                          <button
                            onClick={async () => {
                              try {
                                const { taskService } = await import('@/services/api/taskService')
                                await taskService.updateRecurringTask(task.Id, { paused: true })
                                loadRecurringTasks()
                              } catch (error) {
                                console.error('Failed to pause recurring task:', error)
                              }
                            }}
                            className="p-1 rounded hover:bg-surface-200 transition-colors"
                            title="Pause recurring task"
                          >
                            <ApperIcon name="Pause" size={10} className="text-surface-500" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout