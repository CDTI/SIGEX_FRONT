import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

// Componentes Dashboard
import DashboardHome from '../pages/dashboard/home'
import Dashboard from '../pages/dashboard'

// Componentes Programas
import Programs from '../pages/dashboard/programs'
import CreateProgram from '../pages/dashboard/programs/create'

// Componentes Project
import CreateProject from '../pages/dashboard/projects/teacher/create-project'
import ProjectsTeacher from '../pages/dashboard/projects/teacher'
import ProjectsAdmin from '../pages/dashboard/projects/admin'
import AdminViewProject from '../pages/dashboard/projects/admin/admin-view-projects'
import SelectProjects from '../pages/dashboard/projects/admin/select-projects'

// Componentes Category
import CreateCategory from '../pages/dashboard/category'

// Componentes Usuário
import Users from '../pages/dashboard/users'

// Outros Componentes
import Home from '../pages/home'
import NotFound from '../pages/404'
import { useAuth } from '../context/auth'

import RegistrationPeriods from '../pages/dashboard/registrationPeriod'

const OtherRoutes: React.FC = () => {
    const { user } = useAuth()

    return (
        <>
            <BrowserRouter>
                <Switch>
                    <Route path='/' exact={true} component={Home} />
                    <Dashboard>
                        {/* 
                            Rota base
                        */}
                        <Route path='/dashboard' exact={true} component={DashboardHome} />
                        {/* 
                            @description
                            Rotas acessadas apenas por professore e ou predidentes do NDE
                        */}
                        {(user?.role.includes('teacher') || user?.role.includes('ndePresident')) && (
                            <>
                                <Route path='/dashboard/project/create' component={CreateProject} />
                                <Route path='/dashboard/myProjects' component={ProjectsTeacher} />
                            </>
                        )}
                        {/* 
                            @description
                            Rotas acessadas apenas por administradores
                            
                        */}
                        {user?.role.includes('admin') && (
                            <>
                                <Route path='/dashboard/periods' component={RegistrationPeriods} />
                                <Route path='/dashboard/project/admin-view' component={AdminViewProject} />
                                <Route path='/dashboard/selectProjects' component={SelectProjects} />
                                <Route path='/dashboard/program/create' component={CreateProgram} />
                                <Route path='/dashboard/categories' component={CreateCategory} />
                                <Route path='/dashboard/projects' component={ProjectsAdmin}/>
                                <Route path='/dashboard/users' component={Users} />
                            </>
                        )}

                        {/* 
                            Rotas de programas
                        */}
                        <Route path='/dashboard/programs' component={Programs} />
                    </Dashboard>
                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        </>
    )
}

export default OtherRoutes