import React, { useEffect, useState } from "react";
import Structure from "../../../../components/layout/structure";
import { ContainerFlex } from "../../../../global/styles";
import { IProject } from "../../../../interfaces/project";
import { deleteProject, listProjectForTeacher } from "../../../../services/project_service";
import { Tag, Space, Button, Spin, notification, Select } from "antd";

import MyTable from "../../../../components/layout/table";
import { Link } from "react-router-dom";
import { IPrograms } from "../../../../interfaces/programs";
import { listPrograms } from "../../../../services/program_service";
import { INotice } from "../../../../interfaces/notice";

const { Option } = Select;

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<IProject[]>([]);
  const [programs, setPrograms] = useState<IPrograms[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialState, setInitialState] = useState(0);

  useEffect(() => {
    setLoading(true);
    listProjectForTeacher().then((data) => {
      setProjects(data);
      setFilteredProjects(data);
      listPrograms().then((list) => {
        setPrograms(list.programs);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      });
    });
  }, [initialState]);

  const handleChange = (event: string) => {
    if (event !== "null") {
      const filter = projects.filter((e) => e.programId === event);
      setFilteredProjects(filter);
    } else {
      setFilteredProjects(projects);
    }
  };

  const columns = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Data de início",
      dataIndex: "dateStart",
      key: "dateStart",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status: string) => {
        let typeStatus = { color: "", text: "" };

        if (status === "pending" || status === "approved") {
          typeStatus.color = "#f9a03f";
          typeStatus.text = "Pendente";
        } else if (status === "adjust") {
          typeStatus.color = "#e1bc29";
          typeStatus.text = "Correção";
        } else if (status === "reproved") {
          typeStatus.color = "#f71735";
          typeStatus.text = "Reprovado";
        } else if (status === "selected") {
          typeStatus.color = "#40f99b";
          typeStatus.text = "Selecionado";
        } else if (status === "finish") {
          typeStatus.color = "#000000";
          typeStatus.text = "Finalizado";
        }
        return (
          <Tag color={typeStatus.color} key={typeStatus.text}>
            {typeStatus.text}
          </Tag>
        );
      },
    },
    {
      title: "Ação",
      key: "action",
      render: (text: string, record: IProject) => (
        <Space size="middle">
          {(record.notice as INotice).isActive && (record.status === "pending" || record.status === "adjust") && (
            <>
              <Button>
                <Link to={{ pathname: "/dashboard/project/create", state: record }}>Editar</Link>
              </Button>
              {(record.status === "adjust" || record.status === "pending") && (
                <Button
                  onClick={async () => {
                    const deleted = await deleteProject(record._id);

                    notification[deleted.result]({ message: deleted.message });
                    setInitialState(initialState + 1);
                  }}
                >
                  Deletar
                </Button>
              )}
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Structure title="Meus Projetos">
      <Select defaultValue="null" style={{ width: 200, margin: "8px 0" }} onChange={handleChange}>
        <Option value="null">Sem filtro</Option>
        {programs.map((e) => {
          if (e._id !== undefined) {
            return (
              <Option key={e._id} value={e._id}>
                {e.name}
              </Option>
            );
          }
        })}
      </Select>
      <ContainerFlex>{loading ? <Spin /> : <MyTable data={filteredProjects} columns={columns} />}</ContainerFlex>
    </Structure>
  );
};

export default Projects;
