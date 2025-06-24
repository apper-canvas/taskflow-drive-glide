import tasksData from '../mockData/tasks.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let tasks = [...tasksData]

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
  }
}