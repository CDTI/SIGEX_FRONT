import React, { useEffect, useState } from "react";
import Structure from "../../../../../components/layout/structure";
import { Button, Result, Space, Steps } from "antd";

// Steps
import BasicInfo from "./step_1";
import Partner from "./step_2";
import SpecificCommunity from "./step_3";
import Planning from "./step_4";
import Resource from "./step_5";
// import Attachment from './step_6'
import {
  IDiscipline,
  IMaterials,
  IPartnership,
  IPlanning,
  IProject,
  ISpecificCommunity,
  ITeacher,
} from "../../../../../interfaces/project";
import { newProject } from "../../../../../mocks/mockDefaultValue";
import { Link, RouteProps } from "react-router-dom";
import { useAuth } from "../../../../../context/auth";
import { createProject, updateProject } from "../../../../../services/project_service";
import Modal from "antd/lib/modal/Modal";
import { getActiveNoticesForUser } from "../../../../../services/notice_service";
import { INotice, ISchedule } from "../../../../../interfaces/notice";

const { Step } = Steps;

export interface IBasicInfo {
  name: string;
  description: string;
  firstSemester: ISchedule[];
  secondSemester: ISchedule[];
  totalCH: number;
  programId: string;
  category: string;
  notice: string;
  typeProject: "common" | "extraCurricular" | "curricularComponent";
  disciplines: IDiscipline[];
  teachers: ITeacher[];
  maxClasses: number;
}

interface Props {
  // Quando for editar um projeto o projeto a ser editado vem no location do RoutePros
  location?: RouteProps["location"];
}

const CreateProject: React.FC<Props> = ({ location }) => {
  // Verifica se existe um projeto no location.state
  const editProject = location?.state as IProject | undefined;
  const [current, setCurrent] = useState(0);
  const [project, setProject] = useState<IProject>(newProject);
  const [finish, setFinish] = useState(false);
  const [visible, setVisible] = useState(false);
  const [primary, setPrimary] = useState(true);
  const [title, setTitle] = useState("Criar projeto");
  const [edited, setEdited] = useState(false);
  const [commom, setCommom] = useState(false);
  const [specific, setSpecific] = useState(false);
  const { user } = useAuth();

  useEffect(() =>
  {
    // Verifica se os periodos estão ativos
    getActiveNoticesForUser(user?._id).then((notices) => {
      for (let notice of notices) {
        if (notice.type === "common") {
          setCommom(notice.isActive);
        } else if (notice.type === "specific") {
          setSpecific(notice.isActive);
        }
      }

      if (user !== null) {
        if (primary && editProject === undefined) {
          const loadProject = localStorage.getItem("registerProject");
          if (loadProject !== null) {
            setVisible(true);
          } else {
            setPrimary(false);
          }
        } else if (editProject !== undefined) {
          setTitle("Editar projeto");

          const savedState = location?.state as IProject;
          if (savedState !== undefined)
            savedState.notice = (savedState.notice as INotice)._id as string;

          setProject(savedState);
          setEdited(true);
          setPrimary(false);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primary]);

  useEffect(() => {
    if (!primary && title === "Criar projeto") {
      setPrimary(false);
      if (!edited) localStorage.setItem("registerProject", JSON.stringify(project));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  const changeLoadProject = (option: string) => {
    const loadProject = localStorage.getItem("registerProject");
    setPrimary(false);
    if (loadProject !== null && option === "yes") {
      const loaded = JSON.parse(loadProject) as IProject;
      setProject(loaded);
      setVisible(false);
    } else if (option === "no") {
      localStorage.removeItem("registerProject");
      setVisible(false);
    }
  };

  // Recebe as informções da 1° Etapa do cadastro e mando para o estado "project"
  const changeBasicInfo = (values: IBasicInfo, firstSemester: ISchedule[], secondSemester: ISchedule[]) => {
    const date = new Date();
    if (user !== null) {
      setProject({
        ...project,
        maxClasses: values.maxClasses,
        teachers: values.teachers,
        disciplines: values.disciplines,
        name: values.name,
        description: values.description,
        firstSemester: firstSemester,
        secondSemester: secondSemester,
        programId: values.programId,
        dateStart: date,
        dateFinal: date,
        status: "pending",
        category: values.category,
        author: user._id,
        totalCH: values.totalCH,
        typeProject: values.typeProject,
        notice: values.notice,
      });
    } else {
      setProject({
        ...project,
        maxClasses: values.maxClasses,
        teachers: values.teachers,
        disciplines: values.disciplines,
        name: values.name,
        description: values.description,
        firstSemester: firstSemester,
        secondSemester: secondSemester,
        programId: values.programId,
        dateStart: date,
        dateFinal: date,
        status: "pending",
        category: values.category,
        totalCH: values.totalCH,
        typeProject: values.typeProject,
        notice: values.notice,
      });
    }
    setCurrent(current + 1);
  };

  const changeSpecificCommunity = (specificCommunity: ISpecificCommunity) => {
    setProject({ ...project, specificCommunity: specificCommunity });
    setCurrent(current + 1);
  };

  const changePlanning = (plannings: IPlanning[]) => {
    setProject({ ...project, planning: project.planning.concat(plannings) });
    setCurrent(current + 1);
  };

  const changeResource = async (transport: any, materials: IMaterials[]) => {
    if (transport !== undefined) {
      project.resources.transport = transport;
    }

    if (materials !== undefined) {
      project.resources.materials = materials;
    }
    setProject({ ...project, resources: project.resources });
    // setCurrent(current + 1)
    console.log(project._id);
    // console.log(project)

    if (!edited) {
      await createProject(project);
    } else {
      await updateProject(project);
    }
    project.resources.materials = undefined;
    project.resources.transport = null;
    project.planning = [];
    localStorage.removeItem("registerProject");
    setFinish(true);
  };

  const removeLocal = (index: number, name: "firstSemester" | "secondSemester") => {
    const remove = project[name].splice(index, 1);
    console.log(remove);
    if (name === "firstSemester") setProject({ ...project, firstSemester: project.firstSemester });

    if (name === "secondSemester") setProject({ ...project, secondSemester: project.secondSemester });
  };

  // Função para remover o transporte do projeto
  const removeTransport = () => {
    project.resources.transport = null;
    setProject({ ...project, resources: project.resources });
  };

  // Função para remover 1 etapa do planejamento
  const removeStep = (index: number) => {
    project.planning.splice(index, 1);

    setProject({ ...project, planning: project.planning });
  };

  // Função para remover 1 material dos recursos
  const removeMaterials = (index: number) => {
    project.resources.materials?.splice(index, 1);
    setProject({ ...project, resources: project.resources });
  };

  /**
   *
   * @param event
   * @param index
   * @description Funcções relacionadas a parceria
   */

  // Adicionar um array de parceiros se ele for diferente de undefined
  const changePartner = (partner: IPartnership[] | undefined) => {
    if (partner !== undefined) {
      partner.map((e) => {
        if (e.contacts === undefined) e.contacts = [];
      });
      const partners = project.partnership?.concat(partner);
      setProject({ ...project, partnership: partners });
    }
    next();
  };

  // Editar um parceiro
  const changeEditPartner = (event: any, index: number) => {
    if (project.partnership !== undefined) project.partnership[index].text = event.target.value;
    setProject({ ...project, partnership: project.partnership });
  };

  // Remover um parceiro
  const removePartner = (index: number) => {
    if (project.partnership !== undefined) project.partnership.splice(index, 1);
    setProject({ ...project, partnership: project.partnership });
  };

  // Remover um contato dos parceiros
  const removeContact = (indexPartner: number, indexContact: number) => {
    const partner = project.partnership?.find((p, index) => index === indexPartner);
    project.partnership?.splice(indexPartner, 1);
    if (partner !== undefined) {
      partner.contacts.splice(indexContact, 1);

      project.partnership?.push(partner);

      setProject({ ...project, partnership: project.partnership });
    }
  };

  // Adicionar um contato ao parceiro
  const addContact = (index: number) => {
    if (project.partnership !== undefined) project.partnership[index].contacts.push({ name: "", phone: "" });
    setProject({ ...project, partnership: project.partnership });
  };

  /**
   * @description Funções relaciondas as etapas
   */

  // Edita um campo da etapa[index] do planejamento
  // O Campo a ser editado é enviado como parametro "name" para a função
  // O valor a ser adicionado é enviado como parametro "value" para a função
  const changeStep = (
    index: number,
    name: "developmentSite" | "developmentMode" | "startDate" | "finalDate" | "text",
    value: string
  ) => {
    project.planning[index][name] = value;
  };

  // Chama a etapa anterior
  const previous = () => {
    setCurrent(current - 1);
  };

  // Chama a próxima etapa
  const next = () => {
    setCurrent(current + 1);
  };

  // Aqui estão os componentes de todas as etapas
  const steps = [
    {
      title: "Informações Básicas",
      content: (
        <BasicInfo
          specific={specific}
          commom={commom}
          changeBasicInfo={changeBasicInfo}
          project={project}
          removeLocal={removeLocal}
        />
      ),
    },
    {
      title: "Parcerias",
      content: (
        <Partner
          changePartner={changePartner}
          previous={previous}
          changeEditPartner={changeEditPartner}
          removeContact={removeContact}
          removePartner={removePartner}
          project={project}
          addContact={addContact}
        />
      ),
    },
    {
      title: "Comunidade",
      content: (
        <SpecificCommunity previous={previous} changeCommunitySpecific={changeSpecificCommunity} project={project} />
      ),
    },
    {
      title: "Planejamento",
      content: (
        <Planning
          changeStep={changeStep}
          previous={previous}
          removeStep={removeStep}
          next={next}
          changePlanning={changePlanning}
          project={project}
        />
      ),
    },
    {
      title: "Recursos",
      content: (
        <Resource
          removeMaterials={removeMaterials}
          edited={edited}
          previous={previous}
          changeResources={changeResource}
          removeTransport={removeTransport}
          project={project}
        />
      ),
    },
    // {
    //   title: 'Anexos',
    //   content: <Attachment changeAttachement={changeAttachment} previous={previous} project={project} />
    // }
  ];

  return (
    <>
      {(commom || specific) && (
        <>
          <Modal visible={visible} title="Existe um cadastro em andamento, deseja carregar?" footer={[]}>
            <Space>
              <Button type="primary" style={{ backgroundColor: "#a31621" }} onClick={() => changeLoadProject("no")}>
                Não
              </Button>
              <Button type="primary" style={{ backgroundColor: "#439A86" }} onClick={() => changeLoadProject("yes")}>
                Sim
              </Button>
            </Space>
          </Modal>
          {!finish && !primary && (
            <Structure title={title}>
              <Steps current={current}>
                {steps.map((item) => (
                  <Step key={item.title} title={item.title} />
                ))}
              </Steps>
              <div className="steps-content">{steps[current].content}</div>
            </Structure>
          )}
          {finish && (
            <Result
              status="success"
              title="Seu projeto foi registrado com sucesso"
              subTitle="Você pode acompanhar os seus projetos no menu 'Meus Projetos'."
              extra={[
                <Button type="primary" key="console">
                  <Link to="/dashboard">Voltar</Link>
                </Button>,
              ]}
            />
          )}
        </>
      )}
      {!commom && !specific && (
        <Result
          status="403"
          title="403"
          subTitle="Desculpe, parece que o periodo de cadastro não esta ativo!"
          extra={
            <Button type="primary">
              <Link to="/dashboard" key="/dashboard">
                Voltar
              </Link>
            </Button>
          }
        />
      )}
    </>
  );
};

export default CreateProject;
