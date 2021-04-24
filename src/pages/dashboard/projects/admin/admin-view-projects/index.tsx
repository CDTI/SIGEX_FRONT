import React, { useEffect, useState, useMemo } from "react";
import { Divider, Steps, Button, Space, Collapse, Typography, Result, Modal, Form, Input, Timeline } from "antd";
import Structure from "../../../../../components/layout/structure";
import { ContainerFlex } from "../../../../../global/styles";
import { IMaterials, IProject, ITransport } from "../../../../../interfaces/project";
import { compareDate, currentProject } from "../../../../../util";
import MyTable from "../../../../../components/layout/table";
import { listCategoriesDashboard } from "../../../../../services/category_service";
import { ICategory } from "../../../../../interfaces/category";
import { listPrograms } from "../../../../../services/program_service";
import { IPrograms } from "../../../../../interfaces/programs";
import { ReturnResponse, updateProject } from "../../../../../services/project_service";
import { IFeedback } from "../../../../../interfaces/feedback";
import { createFeedbackProject, listFeedbackProject } from "../../../../../services/feedback_service";
import { UserInterface } from "../../../../../interfaces/user";
import { getUserName } from "../../../../../services/user_service";

const { Step } = Steps;
const { Panel } = Collapse;
const { TextArea } = Input;

interface Props {
  project: IProject;
}

const AdminViewProject: React.FC<Props> = ({ project }) => {
  const [edited, setEdited] = useState<ReturnResponse | null>(null);
  const [feedback, setFeedback] = useState<IFeedback | null>(null);
  const [category, setCategory] = useState<ICategory | null>(null);
  const [program, setProgram] = useState<IPrograms | null>(null);
  const [user, setUser] = useState<UserInterface | null>(null);
  const [status, setStatus] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [total, setTotal] = useState("");
  const [typeProject, setTypeProject] = useState("");

  const formatReal = (value: any) => {
    console.log(value);
    var tmp = value + "";
    tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
    if (tmp.length > 6) tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$),([-])/g, ".$1,$2");
    return tmp;
  };

  const defineTypeProject = () => {
    if(project.typeProject === "common" && project.categoryId === "5fb8402399032945bc5c1fe2"){
      setTypeProject("Extracurricular");
    }else if (project.typeProject === "common") {
      setTypeProject("Institucional");
    } else if (project.typeProject === "extraCurricular") {
      setTypeProject("Extracurricular");
    } else if (project.typeProject === "curricularComponent") {
      setTypeProject("Componente Curricular"); 
    }
  }

  useEffect(() => {
    listCategoriesDashboard().then((data) => {
      console.log(data);
      const categorySelected = data.find((cat) => cat._id === project.categoryId);
      if (categorySelected !== undefined) setCategory(categorySelected);
      listPrograms().then((programsData) => {
        const programSelected = programsData.programs.find((e) => e._id === project.programId);
        if (programSelected !== undefined) setProgram(programSelected);
        listFeedbackProject(project._id).then((data) => {
          console.log(data);
          setFeedback(data.feedback);
          const resource = project.resources;
          let value = 0;

          if (resource.transport !== null && resource.transport !== undefined)
            value += resource.transport.quantity * parseInt(formatReal(resource.transport.unitaryValue.toString()));

          resource.materials?.map(
            (e: IMaterials) => (value += e.quantity * parseInt(formatReal(e.unitaryValue.toString())))
          );
          setTotal(formatReal(value));
          getUserName(project.author).then((data) =>{
            setUser(data.user);
          });
          defineTypeProject();
        });
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalSpending = () => {
    const resource = project.resources;
    let value = 0;

    if (resource.transport !== null && resource.transport !== undefined)
      value += resource.transport.quantity * parseInt(formatReal(resource.transport.unitaryValue.toString()));

    resource.materials?.map((e: IMaterials) => (value += e.quantity * parseInt(formatReal(e.unitaryValue.toString()))));
    setTotal(formatReal(value));
  };

  const changeStatus = async (status: "approved" | "reproved" | "adjust") => {
    project.status = status;

    const update = await updateProject(project);
    console.log(update);
    setStatus(true);
    setEdited({ message: update.message, result: update.result, project: update.project });
  };

  const openModal = () => {
    setVisible(true);
  };

  const modalFeedback = useMemo(() => {
    const submitFeedback = async (values: { text: string }) => {
      console.log(values);
      setVisible(false);
      const registerFeed = await createFeedbackProject(project._id, values);
      console.log(registerFeed);
    };

    const closeModal = () => {
      setVisible(false);
    };

    return (
      <Modal title="Enviar feedback" visible={visible} onCancel={closeModal} footer={[]}>
        <Form form={form} style={{ maxWidth: "500px", width: "100%" }} layout="vertical" onFinish={submitFeedback}>
          <Form.Item label="Feedback" name="text" rules={[{ required: true, message: "Campo Obrigatório " }]}>
            <TextArea />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={closeModal} type="primary" style={{ backgroundColor: "#a31621", color: "#fff" }}>
                Cancelar
              </Button>
              <Button htmlType="submit" type="primary" style={{ backgroundColor: "#439A86", color: "#fff" }}>
                Enviar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    );
  }, [form, project._id, visible]);

  const columnsMaterials = [
    {
      title: "Nome",
      dataIndex: "item",
      key: "item",
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Quantidade",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Valor Unitário",
      dataIndex: "unitaryValue",
      key: "unitaryValue",
      render: (text: string, transport: ITransport) => <Typography>{formatReal(transport.unitaryValue)}</Typography>,
    },
    {
      title: "Total",
      key: "total",
      render: (text: string, material: IMaterials) => (
        <Typography>{material.quantity * parseInt(formatReal(material.unitaryValue))}</Typography>
      ),
    },
  ];

  const columnsTransport = [
    {
      title: "Tipo",
      dataIndex: "typeTransport",
      key: "typeTransport",
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Quantidade",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Valor Unitário",
      dataIndex: "unitaryValue",
      key: "unitaryValue",
      render: (text: string, transport: ITransport) => <Typography>{formatReal(transport.unitaryValue)}</Typography>,
    },
    {
      title: "Total",
      key: "total",
      render: (text: string, transport: ITransport) => {
        if (transport !== undefined && transport !== null) {
          return (
            <Typography>{transport.quantity * parseInt(formatReal(transport.unitaryValue.toString()))}</Typography>
          );
        }
      },
    },
  ];

  return (
    <>
      {!status && (
        <Structure title="Dados do projeto">
          <ContainerFlex>
            <div>
              <Steps direction="horizontal" current={currentProject(project)}>
                {project.status === "reproved" && <Step title="Reprovado" description="Projeto foi reprovado" />}
                {(project.status === "pending" || project.status === "approved") && (
                  <Step title="Em análise" description="Projeto em ánalise." />
                )}
                {project.status === "adjust" && <Step title="Correção" description="Projeto aguardando correção" />}
                {project.status !== "reproved" && (
                  <>
                    <Step title="Aprovado" description="Projeto aprovado." />
                    <Step title="Em andamento" description="Projeto em andamento." />
                    <Step title="Finalizado" description="Projeto finalizado." />
                  </>
                )}
              </Steps>
              <Collapse accordion style={{ marginTop: "30px" }}>
                <Panel header="Informações básicas" key="1">
                  <Typography>
                    <b>Usuário:</b> {user?.name}
                  </Typography>
                  <Typography>
                    <b>Nome:</b> {project.name}
                  </Typography>
                  <Typography>
                    <b>Descrição:</b> {project.description}
                  </Typography>
                  <Typography>
                    <b>Categoria:</b> {category?.name}
                  </Typography>
                  <Typography>
                    <b>Programa:</b> {program?.name}
                  </Typography>
                  <Typography key={project.typeProject}>
                    <b>Tipo:</b> {typeProject}
                  </Typography>
                  {project.categoryId !== "5fb8402399032945bc5c1fe2" && (
                    <>
                      <Typography>
                        <b>Disponibilidades de horários primeiro semestre:</b>
                      </Typography>
                      <ul style={{ marginLeft: "18px" }}>
                        {project.firstSemester.map((e) => (
                          <li>
                            {e.name} - {e.day} - {e.turn}
                          </li>
                        ))}
                      </ul>
                      <Typography>
                        <b>Disponibilidades de horários segundo semestre:</b>
                      </Typography>
                      <ul style={{ marginLeft: "18px" }}>
                        {project.secondSemester.map((e) => (
                          <li>
                            {e.name} - {e.day} - {e.turn}
                          </li>
                        ))}
                      </ul>
                      <Typography>
                        <b>CH disponível:</b> {project.totalCH}
                      </Typography>
                      <Typography>
                        <b>Máximo de turmas:</b> {project.maxClasses}
                      </Typography>
                    </>
                  )}
                  {project.categoryId === "5fb8402399032945bc5c1fe2" && project.typeProject === "curricularComponent" && (
                    <>
                      <Typography>
                        {" "}
                        <b> Professores </b>{" "}
                      </Typography>
                      {project.teachers.map((t) => (
                        <li>
                          {t.name} - {t.registration} - {t.cpf} - {t.phone} - {t.email}
                        </li>
                      ))}
                      <Typography>
                        {" "}
                        <b> Disciplinas </b>{" "}
                      </Typography>
                      {project.disciplines.map((d) => (
                        <li>{d.name}</li>
                      ))}
                    </>
                  )}
                  {project.categoryId === "5fb8402399032945bc5c1fe2" && project.typeProject === "extraCurricular" && (
                    <>
                      <Typography>
                        {" "}
                        <b> Professores </b>{" "}
                      </Typography>
                      {project.teachers.map((t) => (
                        <li>
                          {t.name} - {t.registration} - {t.cpf} - {t.phone} - {`${t.totalCH} CH`} - {t.email}
                        </li>
                      ))}
                    </>
                  )}
                </Panel>
                <Panel header="Parcerias" key="2">
                  <Collapse accordion>
                    {project.partnership?.map((partner, index) => (
                      <Panel header={"Parceria " + (index + 1)} key={index}>
                        <Typography>Sobre: {partner.text}</Typography>
                        {partner.contacts.map((contact, contactInd) => (
                          <div key={contactInd}>
                            <Typography>{contact.name}</Typography>
                            <Typography>{contact.phone}</Typography>
                          </div>
                        ))}
                      </Panel>
                    ))}
                  </Collapse>
                  <Typography></Typography>
                </Panel>
                <Panel header="Comunidade" key="3">
                  <Typography>Sobre: {project.specificCommunity.text}</Typography>
                  <Typography>Localização: {project.specificCommunity.location}</Typography>
                  <Typography>Pessoas envolvidas: {project.specificCommunity.peopleInvolved}</Typography>
                </Panel>
                <Panel header="Planejamento" key="4">
                  <Collapse>
                    {project.planning?.map((planning, planningIdx) => (
                      <Panel header={"Etapas " + (planningIdx + 1)} key={planningIdx}>
                        <Typography>Sobre: {planning.text}</Typography>
                        <Typography>Modo de desenvolvimento: {planning.developmentMode}</Typography>
                        <Typography>Lugar de desenvolvimento: {planning.developmentSite}</Typography>
                        <Typography>Inicio: {planning.startDate}</Typography>
                        <Typography>Final: {planning.finalDate}</Typography>
                      </Panel>
                    ))}
                  </Collapse>
                </Panel>
                <Panel header="Recursos" key="5">
                  <h2>Materiais</h2>
                  {project.resources.materials !== undefined && (
                    <MyTable columns={columnsMaterials} pagination={false} data={project.resources.materials} />
                  )}
                  <Divider />
                  <h2>Transportes</h2>
                  {project.resources.transport !== null && project.resources.transport !== undefined && (
                    <MyTable
                      columns={columnsTransport}
                      pagination={false}
                      data={[project.resources.transport]}
                    ></MyTable>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography style={{ marginLeft: "10px", fontWeight: "bold", fontSize: "16pt", color: "#b80c09" }}>
                      Valor total do projeto
                    </Typography>
                    <Typography style={{ marginRight: "50px", fontWeight: "bold", fontSize: "16pt", color: "#b80c09" }}>
                      {total}
                    </Typography>
                  </div>
                </Panel>
              </Collapse>
              <Space style={{ marginTop: "25px" }}>
                {project.status === "pending" && (
                  <>
                    <Button
                      style={{ backgroundColor: "#a31621", color: "#fff" }}
                      onClick={() => changeStatus("reproved")}
                    >
                      Reprovar
                    </Button>
                    <Button style={{ backgroundColor: "#dbbb04", color: "#fff" }} onClick={openModal}>
                      Solicitar ajuste
                    </Button>
                    <Button
                      style={{ backgroundColor: "#439A86", color: "#fff" }}
                      onClick={() => changeStatus("approved")}
                    >
                      Aprovar
                    </Button>
                  </>
                )}
              </Space>
              <Timeline style={{ marginTop: "25px" }}>
                {feedback?.registers.sort(compareDate).map((e) => {
                  return (
                    <Timeline.Item>
                      {e.text} - {e.date} - {e.typeFeedback}
                    </Timeline.Item>
                  );
                })}
              </Timeline>
            </div>
          </ContainerFlex>
        </Structure>
      )}
      {status && (
        <ContainerFlex>
          <Result
            status={edited?.result}
            title={edited?.message}
            subTitle={"Projeto editado: " + edited?.project.name}
          />
        </ContainerFlex>
      )}
      {modalFeedback}
    </>
  );
};

export default AdminViewProject;
