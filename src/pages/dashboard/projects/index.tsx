import React from 'react'
import { useAuth } from '../../../context/auth'

import ListProjectsTeacher from './teacher/list-projects-teacher'
import ListProjectsAdmin from './admin/list-project-admin'


const Projects: React.FC = () => {
  const { user } = useAuth()
  return (
    <>
      {user?.role === 'teacher' && (
        <ListProjectsTeacher />
      )}
      {user?.role === 'admin' && (
        <ListProjectsAdmin />
      )}
    </>
  )
}

export default Projects