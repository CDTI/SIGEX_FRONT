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

import RegistrationPeriods from '../pages/dashboard/notice'
import CreateNoticeController from '../pages/dashboard/notice/create'
import { IRole } from '../interfaces/role'

const OtherRoutes: React.FC = () => {
    const { user } = useAuth()

    const isIRole = (v: string | IRole): v is IRole =>
    {
      if ((v as IRole)._id)
        return true;

      return false;
    };

    let userRoles = user?.roles?.map((r: any) => (isIRole(r)) ? r.description : r) ?? [];

    return (
        <>
            <BrowserRouter>
                <Switch>
                    <Route path='/' exact={true} component={Home} />
                    <Dashboard>
                        {/* Rota base */
                            <Route path='/dashboard' exact={true} component={DashboardHome} />
                        }

                        {/* Rotas acessadas apenas por professore e ou predidentes do NDE */
                            (userRoles.includes('Professor') || userRoles.includes('Presidente do NDE')) && (
                                <>
                                    <Route path='/dashboard/project/create' component={CreateProject} />
                                    <Route path='/dashboard/myProjects' component={ProjectsTeacher} />
                                </>
                        )}

                        {/* Rotas acessadas apenas por administradores */
                            userRoles.includes('Administrador') && (
                                <>
                                    <Route exact={true} path='/dashboard/notices' component={RegistrationPeriods} />
                                    <Route
                                        exact={true}
                                        path={'/dashboard/notices/create'}
                                        component={CreateNoticeController} />

                                    <Route
                                        exact={true}
                                        path={'/dashboard/notices/edit/:id'}
                                        component={CreateNoticeController} />

                                    <Route path='/dashboard/project/admin-view' component={AdminViewProject} />
                                    <Route path='/dashboard/selectProjects' component={SelectProjects} />
                                    <Route path='/dashboard/program/create' component={CreateProgram} />
                                    <Route path='/dashboard/categories' component={CreateCategory} />
                                    <Route path='/dashboard/users' component={Users} />
                                </>
                        )}

                        {/* Rotas acessadas pelo comitê de extensão */
                            (userRoles.includes("Administrador") || userRoles.includes("Comitê de extensão")) && (
                              <>
                                  <Route path='/dashboard/projects' component={ProjectsAdmin}/>
                              </>
                        )}

                        {/* Rotas de programas */
                            <Route path='/dashboard/programs' component={Programs} />
                        }
                    </Dashboard>

                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        </>
    )
}

export default OtherRoutes