import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { HomeDashboard } from "../pages/dashboard/home";
import { Dashboard } from "../pages/dashboard";
import { Programs } from "../pages/dashboard/programs";
import { CreateProgram } from "../pages/dashboard/programs/create";
import { CreateProposalPage } from "../pages/dashboard/projects/create/project";
import { TeacherProjectsPage } from "../pages/dashboard/projects/list/teacher";
import { AllProjects } from "../pages/dashboard/projects/list/admin";
import { AdminViewProject } from "../pages/dashboard/projects/list/admin/components/ProjectDetails";
import { CreateCategory } from "../pages/dashboard/category";
import { UsersPage } from "../pages/dashboard/users";
import { CreateUserPage } from "../pages/dashboard/users/create";
import { HomePage } from "../pages/home";
import { NotFound } from "../pages/404";
import { Notices } from "../pages/dashboard/notice";
import { CreateNoticePage } from "../pages/dashboard/notice/create";
import { CreateReportPage } from "../pages/dashboard/projects/create/report";
import { CoursesPage } from "../pages/dashboard/courses";

import { Restricted } from "../components/Restricted";

export const OtherRoutes: React.FC = () =>
{
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact={true} component={HomePage} />
        <Dashboard>
          {/* Rota base */
            <Route path="/dashboard" exact={true} component={HomeDashboard} />
          }

          {/* Rotas acessadas pelo comitê de extensão */
            <Restricted allowedRoles={["Administrador", "Comitê de extensão"]}>
              <Route exact={true} path="/dashboard/projects" component={AllProjects}/>
            </Restricted>
          }

          {/* Rotas acessadas apenas por professore e ou presidentes do NDE */
            <Restricted allowedRoles={["Professor", "Presidente do NDE"]}>
              <Route path="/dashboard/my-projects" component={TeacherProjectsPage} />

              <Route path="/dashboard/projects/create" component={CreateProposalPage} />
              <Route path="/dashboard/projects/edit/:id" component={CreateProposalPage} />

              <Route path="/dashboard/projects/report/create" component={CreateReportPage} />
              <Route path="/dashboard/projects/report/edit/:id" component={CreateReportPage} />
            </Restricted>
          }

          {/* Rotas de programas */
            <Route exact={true} path="/dashboard/programs" component={Programs} />
          }

          {/* Rotas acessadas apenas por administradores */
            <Restricted allowedRoles={["Administrador"]}>
              <Route exact={true} path="/dashboard/notices" component={Notices} />
              <Route path="/dashboard/notices/create" component={CreateNoticePage} />
              <Route path="/dashboard/notices/edit/:id" component={CreateNoticePage} />

              <Route exact={true} path="/dashboard/programs/create" component={CreateProgram} />

              <Route path="/dashboard/categories" component={CreateCategory} />

              <Route exact={true} path="/dashboard/users" component={UsersPage} />
              <Route path="/dashboard/users/create" component={CreateUserPage} />
              <Route path="/dashboard/users/edit/:id" component={CreateUserPage} />

              <Route path="/dashboard/courses" component={CoursesPage}/>
            </Restricted>
          }
        </Dashboard>

        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};
