import React, { createContext, ReactNode, useEffect, useState } from "react";
import { useHttpClient } from "../hooks/useHttpClient";
import { Project } from "../interfaces/project";
import { getAllProjectsPaginatedEndpoint } from "../services/endpoints/projects";

interface IProjectsFilter {
  page: number;
  limit: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  query: IQuery;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  filteredProjects: Project[];
  setFilteredProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  getPaginatedProjects: (query: any) => Promise<void>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  projectNameFilter: string;
  setProjectNameFilter: React.Dispatch<React.SetStateAction<string>>;
  categoryFilter: string;
  setCategoryFilter: React.Dispatch<React.SetStateAction<string>>;
  noticeFilter: string;
  setNoticeFilter: React.Dispatch<React.SetStateAction<string>>;
  programFilter: string;
  setProgramFilter: React.Dispatch<React.SetStateAction<string>>;
  authorNameFilter: string;
  setAuthorNameFilter: React.Dispatch<React.SetStateAction<string>>;
  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  cleanFilters: () => void;
}

interface IProps {
  children: ReactNode;
}

export interface IQuery {
  name?: string;
  author?: string;
  program?: string;
  category?: string;
  notice?: string;
  page?: string;
  limit?: string;
  status?: string;
}

export const ProjectsFilterContext = createContext<IProjectsFilter>(
  {} as IProjectsFilter
);

export const ProjectsFilterProvider = ({ children }: IProps) => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [projectNameFilter, setProjectNameFilter] = useState<string>("");
  const [authorNameFilter, setAuthorNameFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [noticeFilter, setNoticeFilter] = useState<string>("");
  const [programFilter, setProgramFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  let query = {
    page: String(page),
    limit: String(limit),
    name: projectNameFilter,
    author: authorNameFilter,
    program: programFilter,
    category: categoryFilter,
    notice: noticeFilter,
    status: statusFilter,
  };

  const tableProjectsRequester = useHttpClient();

  const getPaginatedProjects = async (query: IQuery) => {
    setLoading(true);
    try {
      const mapedQuery = new Map();
      for (const i in query) {
        if (query[i as keyof IQuery] !== "") {
          mapedQuery.set(i, query[i as keyof IQuery]);
        }
      }
      const projects = await tableProjectsRequester.send({
        ...getAllProjectsPaginatedEndpoint(),
        queryParams: new Map(mapedQuery),
        cancellable: true,
      });
      setTotalPages(projects.totalPages);
      setProjects(projects.docs ?? []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const cleanFilters = () => {
    setCategoryFilter("");
    setProjectNameFilter("");
    setNoticeFilter("");
    setProgramFilter("");
    setAuthorNameFilter("");
    setStatusFilter("");
    setPage(1);
  };

  useEffect(() => {
    getPaginatedProjects(query);
  }, [
    page,
    limit,
    categoryFilter,
    projectNameFilter,
    noticeFilter,
    programFilter,
    authorNameFilter,
    statusFilter,
  ]);

  return (
    <ProjectsFilterContext.Provider
      value={{
        page,
        limit,
        totalPages,
        query,
        projects,
        filteredProjects,
        getPaginatedProjects,
        loading,
        programFilter,
        projectNameFilter,
        authorNameFilter,
        categoryFilter,
        noticeFilter,
        statusFilter,
        setPage,
        setLimit,
        setTotalPages,
        setLoading,
        setProjects,
        setCategoryFilter,
        setNoticeFilter,
        setProgramFilter,
        setFilteredProjects,
        setProjectNameFilter,
        setAuthorNameFilter,
        setStatusFilter,
        cleanFilters,
      }}
    >
      {children}
    </ProjectsFilterContext.Provider>
  );
};
