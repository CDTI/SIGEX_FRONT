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
  queryString: string;
  setQueryString: React.Dispatch<React.SetStateAction<string>>;
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
  disciplineFilter: string;
  setDisciplineFilter: React.Dispatch<React.SetStateAction<string>>;
  noticeFilter: string;
  setNoticeFilter: React.Dispatch<React.SetStateAction<string>>;
  programFilter: string;
  setProgramFilter: React.Dispatch<React.SetStateAction<string>>;
  authorNameFilter: string;
  setAuthorNameFilter: React.Dispatch<React.SetStateAction<string>>;
  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  reportFilter: string;
  setReportFilter: React.Dispatch<React.SetStateAction<string>>;
  reportOdsFilter: string[];
  setReportOdsFilter: React.Dispatch<React.SetStateAction<string[]>>;
  reportStatusFilter: string;
  setReportStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  cleanFilters: () => void;
  shouldReload: number;
  setShouldReload: React.Dispatch<React.SetStateAction<number>>;
}

interface IProps {
  children: ReactNode;
}

export interface IQuery {
  name?: string;
  author?: string;
  program?: string;
  category?: string;
  discipline?: string;
  notice?: string;
  page?: string;
  limit?: string;
  status?: string;
  report?: string;
  reportOds?: string[];
  reportStatus?: string;
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
  const [disciplineFilter, setDisciplineFilter] = useState<string>("");
  const [noticeFilter, setNoticeFilter] = useState<string>("");
  const [programFilter, setProgramFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [reportFilter, setReportFilter] = useState<string>("");
  const [reportOdsFilter, setReportOdsFilter] = useState<string[]>([]);
  const [reportStatusFilter, setReportStatusFilter] = useState<string>("");
  const [shouldReload, setShouldReload] = useState(1);
  let query = {
    page: String(page),
    limit: String(limit),
    name: projectNameFilter,
    author: authorNameFilter,
    program: programFilter,
    category: categoryFilter,
    discipline: disciplineFilter,
    notice: noticeFilter,
    status: statusFilter,
    report: reportFilter,
    reportOds: reportOdsFilter,
    reportStatus: reportStatusFilter,
  };

  const [queryString, setQueryString] = useState<string>("?");

  const tableProjectsRequester = useHttpClient();

  const getPaginatedProjects = async (query: IQuery) => {
    setLoading(true);
    try {
      let string = "";
      for (const item in query) {
        if (
          item !== "page" &&
          item !== "limit" &&
          query[item as keyof IQuery] !== ""
        ) {
          string += `${item}=${query[item as keyof IQuery] ?? ""}&`;
        }
      }
      setQueryString(string.slice(0, -1));
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
    setDisciplineFilter("");
    setProjectNameFilter("");
    setNoticeFilter("");
    setProgramFilter("");
    setAuthorNameFilter("");
    setStatusFilter("");
    setReportFilter("");
    setReportOdsFilter([]);
    setReportStatusFilter("");
    setPage(1);
  };

  useEffect(() => {
    getPaginatedProjects(query);
  }, [page, limit, shouldReload]);

  return (
    <ProjectsFilterContext.Provider
      value={{
        page,
        limit,
        totalPages,
        query,
        queryString,
        setQueryString,
        projects,
        filteredProjects,
        getPaginatedProjects,
        loading,
        programFilter,
        projectNameFilter,
        authorNameFilter,
        categoryFilter,
        disciplineFilter,
        noticeFilter,
        statusFilter,
        reportFilter,
        reportOdsFilter,
        reportStatusFilter,
        setPage,
        setLimit,
        setTotalPages,
        setLoading,
        setProjects,
        setCategoryFilter,
        setDisciplineFilter,
        setNoticeFilter,
        setProgramFilter,
        setFilteredProjects,
        setProjectNameFilter,
        setAuthorNameFilter,
        setStatusFilter,
        setReportFilter,
        setReportOdsFilter,
        setReportStatusFilter,
        cleanFilters,
        shouldReload,
        setShouldReload,
      }}
    >
      {children}
    </ProjectsFilterContext.Provider>
  );
};
