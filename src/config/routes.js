import Tasks from '@/components/pages/Tasks'
import Archive from '@/components/pages/Archive'

export const routes = {
  tasks: {
    id: 'tasks',
    label: 'All Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: Tasks
  },
  archive: {
    id: 'archive',
    label: 'Archive',
    path: '/archive',
    icon: 'Archive',
    component: Archive
  }
}

export const routeArray = Object.values(routes)