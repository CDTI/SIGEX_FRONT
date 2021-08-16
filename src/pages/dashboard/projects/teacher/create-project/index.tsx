import React, { useEffect, useState } from "react";
import { Link, RouteProps } from "react-router-dom";
import { Button, Modal, Result, Space, Steps } from "antd";

import { BasicInfoForm, IBasicInfo } from "./components/BasicInfoForm";
import { PartnershipForm } from "./components/PartnershipForm";
import { CommunityForm } from "./components/CommunityForm";
import { PlanningForm } from "./components/PlanningForm";
import { ResourcesForm } from "./components/ResourcesForm";
import { defaultValue } from "./helpers/defaultValue";

import { Category, isCategory } from "../../../../../interfaces/category";
import { Notice, Schedule, isNotice } from "../../../../../interfaces/notice";
import { Material, Planning, Project, Community, Resource, Partnership } from "../../../../../interfaces/project";
import { User, isUser } from "../../../../../interfaces/user";
import { getActiveNoticesForUser } from "../../../../../services/notice_service";
import { createProject, updateProject } from "../../../../../services/project_service";
import Structure from "../../../../../components/layout/structure";
import { useAuth } from "../../../../../context/auth";

interface Props
{
  location?: RouteProps["location"];
}

const { Step } = Steps;

export const CreateProject: React.FC<Props> = (props) =>
{
  const editProject = props.location?.state as Project | undefined;
  const [current, setCurrent] = useState(0);
  const [project, setProject] = useState<Project>(defaultValue);
  const [finish, setFinish] = useState(false);
  const [visible, setVisible] = useState(false);
  const [primary, setPrimary] = useState(true);
  const [title, setTitle] = useState("Criar projeto");
  const [edited, setEdited] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice>();
  const [anyActiveNotice, setAnyActiveNotice] = useState(false);
  const { user } = useAuth();

  useEffect(() =>
  {
    (async () =>
    {
      const notices = await getActiveNoticesForUser(user!._id);
      if (editProject !== undefined)
      {
        setTitle("Editar projeto");

        if (isUser(editProject.author))
          editProject.author = (editProject.author as User)._id!;

        if (isCategory(editProject.category))
          editProject.category = (editProject.category as Category)._id!;

        if (isNotice(editProject.notice))
        {
          if (!notices.some((n: Notice) => n._id === (editProject.notice as Notice)._id!))
            notices.push(editProject.notice);

          setSelectedNotice(editProject.notice);
          editProject.notice = (editProject.notice as Notice)._id!;
        }

        setProject(editProject);
        setEdited(true);
        setPrimary(false);
      }
      else if (primary)
      {
        const loadProject = localStorage.getItem("registerProject");
        if (loadProject !== null)
          setVisible(true);
        else
          setPrimary(false);
      }

      setAnyActiveNotice(selectedNotice !== undefined || notices.length !== 0);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primary]);

  useEffect(() =>
  {
    if (!primary && title === "Criar projeto" && !edited)
      localStorage.setItem("registerProject", JSON.stringify(project));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  const changeLoadProject = (option: "yes" | "no") =>
  {
    setPrimary(false);

    const loadProject = localStorage.getItem("registerProject");
    if (loadProject !== null && option === "yes")
    {
      const loaded = JSON.parse(loadProject) as Project;
      setProject(loaded);
    }
    else
    {
      localStorage.removeItem("registerProject");
    }

    setVisible(false);
  };

  const previous = () => setCurrent(current - 1);

  const next = () => setCurrent(current + 1);

  const changeBasicInfo = (values: IBasicInfo, firstSemester: Schedule[], secondSemester: Schedule[]) =>
  {
    const date = new Date();
    setProject((prevState) => (
    {
      ...prevState,
      maxClasses: values.maxClasses,
      teachers: values.teachers,
      disciplines: values.disciplines,
      name: values.name,
      description: values.description,
      firstSemester: firstSemester,
      secondSemester: secondSemester,
      program: values.program,
      dateStart: date,
      dateFinal: date,
      status: "pending",
      category: values.category,
      author: user!._id!,
      totalCH: values.totalCH,
      typeProject: values.typeProject,
      notice: values.notice,
    }));

    next();
  };

  const changeSpecificCommunity = (specificCommunity: Community) =>
  {
    setProject((prevState) => (
    {
      ...prevState,
      specificCommunity:
      {
        location: specificCommunity.location,
        peopleInvolved: specificCommunity.peopleInvolved,
        text: specificCommunity.text
      }
    }));

    next();
  };

  const changePlanning = (plannings: Planning[]) =>
  {
    setProject((prevState) => (
    {
      ...prevState,
      planning: plannings
    }));

    next();
  };

  const changeResource = async (transport: any, materials: Material[]) =>
  {
    setProject((prevState) =>
    {
      const resources: Resource = { materials };
      if (transport !== undefined)
        resources.transport = transport;

      return { ...prevState, resources };
    });

    await (!edited
      ? createProject(project)
      : updateProject(project));

    localStorage.removeItem("registerProject");

    setFinish(true);
  };

  const removeLocal = (index: number, name: "firstSemester" | "secondSemester") =>
  {
    setProject((prevState) => name === "firstSemester"
      ? (
      {
        ...prevState,
        firstSemester: prevState.firstSemester.splice(index, 1)
      })
      : (
      {
        ...prevState,
        secondSemester: prevState.secondSemester.splice(index, 1)
      }));
  };

  // Função para remover o transporte do projeto
  const removeTransport = () =>
  {
    setProject((prevState) =>
    {
      const resources = prevState.resources;
      delete resources.transport;

      return { ...prevState, resources };
    });
  };

  // Função para remover 1 etapa do planejamento
  const removeStep = (index: number) =>
  {
    setProject((prevState) => (
    {
      ...prevState,
      planning: prevState.planning.splice(index, 1)
    }));
  };

  // Função para remover 1 material dos recursos
  const removeMaterials = (index: number) =>
  {
    setProject((prevState) => (
    {
      ...prevState,
      resources:
      {
        ...prevState.resources,
        materials: prevState.resources.materials.splice(index, 1)
      }
    }));
  };

  // Adicionar um array de parceiros se ele for diferente de undefined
  const changePartner = (partners: Partnership[]) =>
  {
    setProject((prevState) =>
    {
      const partnersWithContacts = partners.filter((p: Partnership) =>
        p.contacts !== undefined);

      const partnersWithoutContacts = partners
        .filter((p: Partnership) => p.contacts === undefined)
        .map((p: Partnership) => ({ ...p, contacts: [] }));

      return (
      {
        ...prevState,
        partnership:
        [
          ...prevState.partnership,
          ...partnersWithContacts,
          ...partnersWithoutContacts
        ]
      });
    });

    next();
  };

  // Editar um parceiro
  const changeEditPartner = (ev: any, index: number) =>
  {
    setProject((prevState) =>
    {
      const partner =
      {
        ...prevState.partnership[index],
        text: ev.target.value
      };

      return (
      {
        ...prevState,
        partnership: prevState.partnership.splice(index, 1).concat([partner])
      });
    });
  };

  // Remover um parceiro
  const removePartner = (index: number) =>
  {
    setProject((prevState) => (
    {
      ...prevState,
      partnership: prevState.partnership.splice(index, 1)
    }));
  };

  // Remover um contato dos parceiros
  const removeContact = (partnerIndex: number, contactIndex: number) =>
  {
    setProject((prevState) =>
    {
      const partner =
      {
        ...prevState.partnership[partnerIndex],
        contacts: prevState.partnership[partnerIndex].contacts.splice(contactIndex, 1)
      };

      return (
      {
        ...prevState,
        partnership: prevState.partnership.splice(partnerIndex, 1).concat([partner])
      });
    });
  };

  // Adicionar um contato ao parceiro
  const addContact = (index: number) =>
  {
    setProject((prevState) =>
    {
      const partner =
      {
        ...prevState.partnership[index],
        contacts: prevState.partnership[index].contacts.concat([{ name: "", phone: "" }])
      }

      return (
      {
        ...prevState,
        partnership: prevState.partnership.splice(index, 1).concat(partner)
      });
    });
  };

  // Edita um campo da etapa[index] do planejamento
  // O Campo a ser editado é enviado como parametro "name" para a função
  // O valor a ser adicionado é enviado como parametro "value" para a função
  type PlanningField = "developmentSite" | "developmentMode" | "startDate" | "finalDate" | "text";
  const changeStep = (index: number, field: PlanningField, value: string) =>
  {
    setProject((prevState) =>
    {
      const plan =
      {
        ...prevState.planning[index],
        [field]: value
      };

      return (
      {
        ...prevState,
        planning: prevState.planning.splice(index, 1).concat([plan])
      });
    });
  };

  const steps =
  [
    {
      title: "Informações Básicas",
      content: (
        <BasicInfoForm
          changeBasicInfo={changeBasicInfo}
          project={project}
          preSelectedNotice={selectedNotice}
          removeLocal={removeLocal}
        />
      )
    },
    {
      title: "Parcerias",
      content: (
        <PartnershipForm
          changePartner={changePartner}
          previous={previous}
          changeEditPartner={changeEditPartner}
          removeContact={removeContact}
          removePartner={removePartner}
          project={project}
          addContact={addContact}
        />
      )
    },
    {
      title: "Comunidade",
      content: (
        <CommunityForm
          previous={previous}
          changeCommunitySpecific={changeSpecificCommunity}
          project={project}
        />
      )
    },
    {
      title: "Planejamento",
      content: (
        <PlanningForm
          changeStep={changeStep}
          previous={previous}
          removeStep={removeStep}
          changePlanning={changePlanning}
          project={project}
        />
      )
    },
    {
      title: "Recursos",
      content: (
        <ResourcesForm
          removeMaterials={removeMaterials}
          edited={edited}
          previous={previous}
          changeResources={changeResource}
          removeTransport={removeTransport}
          project={project}
        />
      )
    }
    // {
    //   title: "Anexos",
    //   content: (
    //     <AttachementsForm
    //       changeAttachement={changeAttachment}
    //       previous={previous}
    //       project={project}
    //     />
    //   )
    // }
  ];

  return (
    <>
      {anyActiveNotice && (
        <>
          <Modal
            visible={visible}
            title="Existe um cadastro em andamento, deseja carregar?"
            footer={[]}
          >
            <Space>
              <Button
                type="primary"
                style={{ backgroundColor: "#a31621" }}
                onClick={() => changeLoadProject("no")}
              >
                Não
              </Button>

              <Button
                type="primary"
                style={{ backgroundColor: "#439A86" }}
                onClick={() => changeLoadProject("yes")}
              >
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
              extra={
                <Button type="primary" key="console">
                  <Link to="/dashboard">Voltar</Link>
                </Button>
              }
            />
          )}
        </>
      )}

      {!anyActiveNotice && (
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

// TODO: Remover tela 403
// TODO: Adicionar status de carregando
