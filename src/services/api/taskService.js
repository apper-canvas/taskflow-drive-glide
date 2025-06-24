import tasksData from '../mockData/tasks.json'
import { addDays, addWeeks, addMonths, addYears, isBefore, parseISO } from 'date-fns'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let tasks = [...tasksData]
let recurringTasks = []
export const taskService = {
  async getAll() {
    await delay(300)
    return [...tasks]
  },

  async getById(id) {
    await delay(200)
    const task = tasks.find(t => t.Id === parseInt(id, 10))
    if (!task) throw new Error('Task not found')
    return { ...task }
  },

  async create(taskData) {
    await delay(400)
    const maxId = Math.max(...tasks.map(t => t.Id), 0)
    const newTask = {
      ...taskData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      completed: false,
      archived: false
    }
    tasks.push(newTask)
    return { ...newTask }
  },

  async update(id, updates) {
    await delay(300)
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10))
    if (index === -1) throw new Error('Task not found')
    
    const updatedTask = { 
      ...tasks[index], 
      ...updates,
      Id: tasks[index].Id // Prevent ID modification
    }
    tasks[index] = updatedTask
    return { ...updatedTask }
  },

  async delete(id) {
    await delay(250)
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10))
    if (index === -1) throw new Error('Task not found')
    
    tasks.splice(index, 1)
    return true
  },

  async toggleComplete(id) {
    await delay(200)
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10))
    if (index === -1) throw new Error('Task not found')
    
    tasks[index].completed = !tasks[index].completed
    return { ...tasks[index] }
  },

  async archive(id) {
    await delay(200)
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10))
    if (index === -1) throw new Error('Task not found')
    
    tasks[index].archived = true
    return { ...tasks[index] }
  },

  async unarchive(id) {
    await delay(200)
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10))
    if (index === -1) throw new Error('Task not found')
    
    tasks[index].archived = false
    return { ...tasks[index] }
  },

async bulkDelete(ids) {
    await delay(400)
    const idsToDelete = ids.map(id => parseInt(id, 10))
    tasks = tasks.filter(t => !idsToDelete.includes(t.Id))
    return true
  },

  // Recurring task methods
  async createRecurringTask(recurringData) {
    await delay(400)
    const maxId = Math.max(...recurringTasks.map(t => t.Id), 0)
    const newRecurringTask = {
      ...recurringData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      paused: false,
      nextDueDate: recurringData.dueDate || new Date().toISOString().split('T')[0]
    }
    
    recurringTasks.push(newRecurringTask)
    
    // Create the first instance of the recurring task
    const firstTask = await this.create({
      title: newRecurringTask.title,
      categoryId: newRecurringTask.categoryId,
      priority: newRecurringTask.priority,
      dueDate: newRecurringTask.nextDueDate,
      recurringTaskId: newRecurringTask.Id,
      isRecurringInstance: true
    })
    
    // Update next due date
    newRecurringTask.nextDueDate = this.calculateNextDueDate(
      newRecurringTask.nextDueDate,
      newRecurringTask.recurringType,
      newRecurringTask.recurringInterval
    )
    
    return { recurringTask: { ...newRecurringTask }, firstTask: { ...firstTask } }
  },

  async getRecurringTasks() {
    await delay(200)
    return [...recurringTasks]
  },

  async updateRecurringTask(id, updates) {
    await delay(300)
    const index = recurringTasks.findIndex(t => t.Id === parseInt(id, 10))
    if (index === -1) throw new Error('Recurring task not found')
    
    const updatedTask = { 
      ...recurringTasks[index], 
      ...updates,
      Id: recurringTasks[index].Id
    }
    recurringTasks[index] = updatedTask
    return { ...updatedTask }
  },

  async deleteRecurringTask(id) {
    await delay(250)
    const index = recurringTasks.findIndex(t => t.Id === parseInt(id, 10))
    if (index === -1) throw new Error('Recurring task not found')
    
    // Also delete all instances of this recurring task
    const recurringTaskId = recurringTasks[index].Id
    tasks = tasks.filter(t => t.recurringTaskId !== recurringTaskId)
    
    recurringTasks.splice(index, 1)
    return true
  },

  async generateNextRecurringTask(recurringTaskId) {
    await delay(300)
    const recurringTask = recurringTasks.find(t => t.Id === parseInt(recurringTaskId, 10))
    if (!recurringTask || recurringTask.paused) return null
    
    // Check if we should generate the next task
    const now = new Date()
    const nextDue = new Date(recurringTask.nextDueDate)
    
    if (isBefore(nextDue, now) || nextDue.toDateString() === now.toDateString()) {
      // Create next instance
      const nextTask = await this.create({
        title: recurringTask.title,
        categoryId: recurringTask.categoryId,
        priority: recurringTask.priority,
        dueDate: recurringTask.nextDueDate,
        recurringTaskId: recurringTask.Id,
        isRecurringInstance: true
      })
      
      // Calculate and update next due date
      const newNextDueDate = this.calculateNextDueDate(
        recurringTask.nextDueDate,
        recurringTask.recurringType,
        recurringTask.recurringInterval
      )
      
      // Check if we've reached the end date
      if (recurringTask.recurringEndDate && new Date(newNextDueDate) > new Date(recurringTask.recurringEndDate)) {
        await this.updateRecurringTask(recurringTask.Id, { paused: true })
      } else {
        await this.updateRecurringTask(recurringTask.Id, { nextDueDate: newNextDueDate })
      }
      
      return { ...nextTask }
    }
    
    return null
  },

  calculateNextDueDate(currentDate, recurringType, interval = 1) {
    const date = new Date(currentDate)
    
    switch (recurringType) {
      case 'daily':
        return addDays(date, interval).toISOString().split('T')[0]
      case 'weekly':
        return addWeeks(date, interval).toISOString().split('T')[0]
      case 'monthly':
        return addMonths(date, interval).toISOString().split('T')[0]
      case 'yearly':
        return addYears(date, interval).toISOString().split('T')[0]
      default:
        return addDays(date, 1).toISOString().split('T')[0]
    }
  },

  // Override toggleComplete to handle recurring tasks
  async toggleComplete(id) {
    await delay(200)
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10))
    if (index === -1) throw new Error('Task not found')
    
    tasks[index].completed = !tasks[index].completed
    
    // If this is a recurring task instance and it's being completed, generate next instance
    if (tasks[index].completed && tasks[index].recurringTaskId) {
      await this.generateNextRecurringTask(tasks[index].recurringTaskId)
    }
    
    return { ...tasks[index] }
  }
}