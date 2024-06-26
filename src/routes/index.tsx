import React, { useContext } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { AuthContext } from "../context/auth";
import { ProtectedRoute } from "../components/ProtectedRoute";

import { NotFound } from "../pages/404";
import { ChangePasswordPage } from "../pages/change-password";
import { AppLayout } from "../pages/dashboard";
import { CreateCategory } from "../pages/dashboard/category";
import { CreateDiscipline } from "../pages/dashboard/disciplines";
import { CoursesPage } from "../pages/dashboard/courses";
import { HomeDashboard } from "../pages/dashboard/home";
import { Notices } from "../pages/dashboard/notice";
import { CreateNoticePage } from "../pages/dashboard/notice/create";
import { Programs } from "../pages/dashboard/programs";
import { CreateProposalPage } from "../pages/dashboard/projects/create/project";
import { CreateReportPage } from "../pages/dashboard/projects/create/report";
import { AllProjects } from "../pages/dashboard/projects/list/admin";
import { TeacherProjectsPage } from "../pages/dashboard/projects/list/teacher";
import { UsersPage } from "../pages/dashboard/users";
import { CreateUserPage } from "../pages/dashboard/users/create";
import { LoginPage } from "../pages/login";
import { ProjectsFilterProvider } from "../context/projects";
import { CreateProgram } from "../pages/dashboard/programs/create";
import { YearReportPage } from "../pages/dashboard/year-report";
import { CreateCampi } from "../pages/dashboard/campi";
import { PartnersReportPage } from "../pages/dashboard/partners-report";

export const Routes: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext.isUserLoggedIn)
    return (
      <Switch>
        <Route path="/login">
          <LoginPage />
        </Route>

        <Route path="/alterar-senha">
          <ChangePasswordPage />
        </Route>

        <Route>
          <Redirect to="/login" />
        </Route>
      </Switch>
    );

  return (
    <AppLayout>
      <Switch>
        <Route path="/" exact>
          <Redirect to="/home" />
        </Route>

        <Route path="/perfil">
          <CreateUserPage />
        </Route>

        <Route path="/home">
          <HomeDashboard />
        </Route>

        <Route path="/programas" exact>
          <Programs />
        </Route>

        <ProtectedRoute allow="Administrador" path="/programas/criar">
          <CreateProgram />
        </ProtectedRoute>

        <ProtectedRoute allow="Administrador" path="/cursos">
          <CoursesPage />
        </ProtectedRoute>

        <ProtectedRoute allow="Administrador" path="/campus">
          <CreateCampi />
        </ProtectedRoute>

        <ProtectedRoute allow="Administrador" path="/categorias">
          <CreateCategory />
        </ProtectedRoute>

        <ProtectedRoute allow="Administrador" path="/disciplines">
          <CreateDiscipline />
        </ProtectedRoute>

        <ProtectedRoute allow="Administrador" path="/relatorio-anual">
          <YearReportPage />
        </ProtectedRoute>

        <ProtectedRoute
          allow={["Administrador", "Comitê de extensão"]}
          path="/relatorio-de-parceiros"
        >
          <PartnersReportPage />
        </ProtectedRoute>

        <ProtectedRoute allow="Administrador" path="/editais" exact>
          <Notices />
        </ProtectedRoute>

        <ProtectedRoute
          allow="Administrador"
          path={["/editais/criar", "/editais/editar/:id"]}
        >
          <CreateNoticePage />
        </ProtectedRoute>

        <ProtectedRoute allow="Administrador" path="/usuarios" exact>
          <UsersPage />
        </ProtectedRoute>

        <ProtectedRoute
          allow="Administrador"
          path={["/usuarios/criar", "/usuarios/editar/:id"]}
        >
          <CreateUserPage />
        </ProtectedRoute>

        <ProtectedRoute
          allow={["Administrador", "Comitê de extensão"]}
          path="/propostas"
          exact
        >
          <ProjectsFilterProvider>
            <AllProjects />
          </ProjectsFilterProvider>
        </ProtectedRoute>

        <ProtectedRoute
          allow={["Professor", "Presidente do NDE", "Coordenador de escola"]}
          path={["/propostas/criar", "/propostas/editar/:id"]}
        >
          <CreateProposalPage />
        </ProtectedRoute>

        <ProtectedRoute
          allow={["Professor", "Presidente do NDE", "Coordenador de escola"]}
          path={[
            "/propostas/relatorio/criar",
            "/propostas/relatorio/editar/:id",
          ]}
        >
          <CreateReportPage />
        </ProtectedRoute>

        <ProtectedRoute
          allow={["Professor", "Presidente do NDE", "Coordenador de escola"]}
          path="/minhas-propostas"
        >
          <TeacherProjectsPage />
        </ProtectedRoute>

        <Route>
          <NotFound />
        </Route>
      </Switch>
    </AppLayout>
  );
};
