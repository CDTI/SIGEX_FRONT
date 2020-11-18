import React from 'react'
import { useAuth } from '../../../context/auth'

import ListProjectsTeacher from './teacher/list-projects-teacher'
import ListProjectsAdmin from './admin/list-project-admin'


const Projects: React.FC = () => {
  const { user } = useAuth()
  return (
    <>
      {user?.role.includes('teacher') && (
        <ListProjectsTeacher />
      )}
      {user?.role.includes('admin') && (
        <ListProjectsAdmin />
      )}
    </>
  )
}

export default Projects