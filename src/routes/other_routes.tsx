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
import Projects from '../pages/dashboard/projects'
import AdminViewProject from '../pages/dashboard/projects/admin/admin-view-projects'

// Componentes Category
import CreateCategory from '../pages/dashboard/category'

// Componentes Usuário
import Users from '../pages/dashboard/users'

// Outros Componentes
import Home from '../pages/home'
import NotFound from '../pages/404'

const OtherRoutes: React.FC = () => {
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
                            Rotas de projetos
                        */}
                        <Route path='/dashboard/projects' component={Projects}/>
                        <Route path='/dashboard/project/create' component={CreateProject} />
                        <Route path='/dashboard/project/admin-view' component={AdminViewProject} />
                        {/* 
                            Rotas de categorias
                        */}
                        <Route path='/dashboard/categories' component={CreateCategory}/>
                        {/* 
                            Rotas de programas
                        */}
                        <Route path='/dashboard/programs' component={Programs}/>
                        <Route path='/dashboard/program/create' component={CreateProgram}/>
                        <Route path='/dashboard/users' component={Users}/>
                        
                    </Dashboard>
                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        </>
    )
}

export default OtherRoutes