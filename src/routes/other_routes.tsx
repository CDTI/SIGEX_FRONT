import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { HomeDashboard } from "../pages/dashboard/home";
import { Dashboard } from "../pages/dashboard";
import { Programs } from "../pages/dashboard/programs";
import { CreateProgram } from "../pages/dashboard/programs/create";
import { CreateProject } from "../pages/dashboard/projects/teacher/create-project";
import { TeacherProjects } from "../pages/dashboard/projects/teacher";
import { AllProjects } from "../pages/dashboard/projects/admin";
import { AdminViewProject } from "../pages/dashboard/projects/admin/components/ProjectDetails";
import { CreateCategory } from "../pages/dashboard/category";
import { Users } from "../pages/dashboard/users";
import { HomePage } from "../pages/home";
import { NotFound } from "../pages/404";
import { Notices } from "../pages/dashboard/notice";
import { CreateNoticeController } from "../pages/dashboard/notice/create";
import { ReportForm } from "../pages/dashboard/projects/teacher/report";

import { useAuth } from "../context/auth";
import { Restricted } from "../components/Restricted";
import { Courses } from "../pages/dashboard/courses";

export const OtherRoutes: React.FC = () =>
{
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact={true} component={HomePage} />
        <Dashboard>
          {/* Rota base */
            <Route path="/dashboard" exact={true} component={HomeDashboard} />
          }

          {
            <>
            </>
          }

          {/* Rotas acessadas apenas por professore e ou predidentes do NDE */
            <Restricted allowedRoles={["Professor", "Presidente do NDE"]}>
              <Route path="/dashboard/project/create" component={CreateProject} />
              <Route path="/dashboard/project/report/create" component={ReportForm} />
              <Route path="/dashboard/project/report/edit/:id" component={ReportForm} />
              <Route path="/dashboard/myProjects" component={TeacherProjects} />
            </Restricted>
          }

          {/* Rotas acessadas apenas por administradores */
            <Restricted allowedRoles={["Administrador"]}>
              <Route exact={true} path="/dashboard/notices" component={Notices} />
              <Route
                  exact={true}
                  path={"/dashboard/notices/create"}
                  component={CreateNoticeController} />

              <Route
                  exact={true}
                  path={"/dashboard/notices/edit/:id"}
                  component={CreateNoticeController} />

              <Route path="/dashboard/project/admin-view" component={AdminViewProject} />
              <Route path="/dashboard/program/create" component={CreateProgram} />
              <Route path="/dashboard/categories" component={CreateCategory} />
              <Route path="/dashboard/users" component={Users} />
              <Route path="/dashboard/courses" component={Courses}/>
            </Restricted>
          }

          {/* Rotas acessadas pelo comitê de extensão */
            <Restricted allowedRoles={["Administrador", "Comitê de extensão"]}>
              <Route path="/dashboard/projects" component={AllProjects}/>
            </Restricted>
          }

          {/* Rotas de programas */
            <Route path="/dashboard/programs" component={Programs} />
          }
        </Dashboard>

        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};
