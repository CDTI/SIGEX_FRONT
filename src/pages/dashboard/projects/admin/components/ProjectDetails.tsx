import React, { useEffect, useState, useMemo } from "react";
import { Divider, Steps, Button, Space, Collapse, Typography, Result, Modal, Form, Input, Timeline, Row, Col } from "antd";
import Structure from "../../../../../components/layout/structure";
import { ContainerFlex } from "../../../../../global/styles";
import { IMaterials, IProject, ITransport } from "../../../../../interfaces/project";
import { compareDate } from "../../../../../util";
import MyTable from "../../../../../components/layout/table";
import { ICategory } from "../../../../../interfaces/category";
import { listPrograms } from "../../../../../services/program_service";
import { IPrograms } from "../../../../../interfaces/programs";
import { ReturnResponse, updateProject } from "../../../../../services/project_service";
import { IFeedback } from "../../../../../interfaces/feedback";
import { createFeedbackProject, listFeedbackProject } from "../../../../../services/feedback_service";
import IUser from "../../../../../interfaces/user";

const { Step } = Steps;
const { Panel } = Collapse;
const { TextArea } = Input;

interface Props
{
  project: IProject;
}

const currentProject = (project: IProject) =>
{
  switch (project.status)
  {
    case "pending":
    case "reproved":
      return 0;

    case "notSelected":
      return 1;

    case "selected":
      return 2;

    case "finished":
      return 3;

    default:
      return -1;
  }
}

const AdminViewProject: React.FC<Props> = ({ project }) =>
{
  const [edited, setEdited] = useState<ReturnResponse | null>(null);
  const [feedback, setFeedback] = useState<IFeedback | null>(null);
  const [category, setCategory] = useState<ICategory>(project.category as ICategory);
  const [program, setProgram] = useState<IPrograms | null>(null);
  const [userName, setUserName] = useState("");
  const [status, setStatus] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [total, setTotal] = useState("");
  const [typeProject, setTypeProject] = useState("");

  const formatReal = (value: any) =>
  {
    let tmp = `${value} `.replace(/([0-9]{2})$/g, ",$1");
    if (tmp.length > 6)
      tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$),([-])/g, ".$1,$2");

    return tmp;
  };

  const defineTypeProject = () =>
  {
    if (project.typeProject === "common")
    {
      setTypeProject(project.category === "5fb8402399032945bc5c1fe2"
        ? "Extracurricular"
        : "Institucional");
    }
    else if (project.typeProject === "extraCurricular")
    {
      setTypeProject("Extracurricular");
    }
    else if (project.typeProject === "curricularComponent")
    {
      setTypeProject("Componente Curricular");
    }
  };

  useEffect(() =>
  {
    listPrograms().then((programsData) =>
    {
      const programSelected = programsData.programs.find((e) => e._id === project.programId);
      if (programSelected !== undefined)
        setProgram(programSelected);

      listFeedbackProject(project._id).then((data) =>
      {
        setFeedback(data.feedback);
        const resource = project.resources;
        let value = 0;

        if (resource.transport !== null && resource.transport !== undefined)
          value += resource.transport.quantity * parseInt(formatReal(resource.transport.unitaryValue.toString()));

        resource.materials?.map((e: IMaterials) =>
          (value += e.quantity * parseInt(formatReal(e.unitaryValue.toString()))));

        setTotal(formatReal(value));
        setUserName((project.author as IUser)?.name);
        defineTypeProject();
      });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeStatus = async (status: "reproved" | "notSelected" | "selected") =>
  {
    project.status = status;

    const update = await updateProject(project);
    setStatus(true);
    setEdited({ message: update.message, result: update.result, project: update.project });
  };

  const openModal = () => setVisible(true);

  const modalFeedback = useMemo(() =>
  {
    const submitFeedback = async (values: { text: string }) =>
    {
      setVisible(false);
      let response = await createFeedbackProject(project._id, values);
      if (response.status !== "error")
        changeStatus("reproved");
    };

    const closeModal = () => setVisible(false);

    return (
      <Modal title="Justificativa" visible={visible} onCancel={closeModal} footer={[]}>
        <Form form={form} style={{ maxWidth: "500px", width: "100%" }} layout="vertical" onFinish={submitFeedback}>
          <Form.Item
            name="text"
            rules={
            [
              { required: true, message: "Campo Obrigatório" },
              { max: 3000, message: "Número máximo de caracteres extrapolado" }
            ]}
          >
            <TextArea />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={closeModal} type="default">
                Cancelar
              </Button>

              <Button htmlType="submit" type="primary">
                Enviar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>);
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
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Row justify="center">
              <Col span={16}>
                <Steps direction="horizontal" current={currentProject(project)}>
                  {project.status === "reproved"
                    ? <Step title="Reprovado" />
                    : <Step title="Em análise" />}

                  <Step title="Aprovado" />
                  <Step title="Em andamento" />
                  <Step title="Finalizado" />
                </Steps>
              </Col>
            </Row>

            <Row justify="center">
              <Col span={16}>
                <Collapse accordion>
                  <Panel header="Informações básicas" key="1">
                    <Typography><b>Usuário:</b> {userName}</Typography>
                    <Typography><b>Nome:</b> {project.name}</Typography>
                    <Typography><b>Descrição:</b> {project.description}</Typography>
                    <Typography><b>Categoria:</b> {category.name}</Typography>
                    <Typography><b>Programa:</b> {program?.name}</Typography>
                    <Typography><b>Tipo:</b> {typeProject}</Typography>

                    {project.category !== "5fb8402399032945bc5c1fe2" && (
                      <>
                        <Typography><b>Disponibilidades de horários primeiro semestre:</b></Typography>
                        <ul style={{ marginLeft: "18px" }}>
                          {project.firstSemester.map((e) =>
                            <li>{e.period} - {`${e.day}ª feira`} - {e.location}</li>)}
                        </ul>

                        <Typography><b>Disponibilidades de horários segundo semestre:</b></Typography>
                        <ul style={{ marginLeft: "18px" }}>
                          {project.secondSemester.map((e) =>
                            <li>{e.period} - {`${e.day}ª feira`} - {e.location}</li>)}
                        </ul>

                        <Typography><b>CH disponível:</b> {project.totalCH}</Typography>
                        <Typography><b>Máximo de turmas:</b> {project.maxClasses}</Typography>
                      </>
                    )}

                    {project.category === "5fb8402399032945bc5c1fe2" && project.typeProject === "curricularComponent" && (
                      <>
                        <Typography>{" "}<b> Professores </b>{" "}</Typography>
                        {project.teachers.map((t) =>
                          <li>{t.name} - {t.registration} - {t.cpf} - {t.phone} - {t.email}</li>)}

                        <Typography>{" "}<b> Disciplinas </b>{" "}</Typography>
                        {project.disciplines.map((d) =>
                          <li>{d.name}</li>)}
                      </>
                    )}

                    {project.category === "5fb8402399032945bc5c1fe2" && project.typeProject === "extraCurricular" && (
                      <>
                        <Typography>{" "}<b> Professores </b>{" "}</Typography>
                        {project.teachers.map((t) =>
                          <li>{t.name} - {t.registration} - {t.cpf} - {t.phone} - {`${t.totalCH} CH`} - {t.email}</li>)}
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
                          </div>)
                        )}
                      </Panel>)
                    )}
                  </Collapse>
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
                      </Panel>)
                    )}
                  </Collapse>
                </Panel>

                <Panel header="Recursos" key="5">
                  <h2>Materiais</h2>
                  {project.resources.materials !== undefined && (
                    <MyTable columns={columnsMaterials} pagination={false} data={project.resources.materials} />)}

                  <Divider />

                  <h2>Transportes</h2>
                  {project.resources.transport !== null && project.resources.transport !== undefined && (
                    <MyTable
                      columns={columnsTransport}
                      pagination={false}
                      data={[project.resources.transport]}
                    ></MyTable>)}

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
              </Col>
            </Row>

            <Row justify="center">
              <Col span={16}>
                {project.status !== "selected" && project.status !== "finished" && (
                  <>
                    <Button
                      style={{ backgroundColor: "#acc5cf", color: "#fff" }}
                      onClick={openModal}
                      >
                      Não aprovado
                    </Button>

                    <Button style={{ backgroundColor: "#b3afc8", color: "#fff" }} onClick={() => changeStatus("notSelected")}>
                      Aprovado e não selecionado
                    </Button>

                    <Button
                      style={{ backgroundColor: "#8dc898", color: "#fff" }}
                      onClick={() => changeStatus("selected")}
                      >
                      Selecionado
                    </Button>
                  </>
                )}
              </Col>
            </Row>

            <Row justify="center">
              <Col span={16}>
                <Timeline style={{ marginTop: "25px" }}>
                  {feedback?.registers.sort(compareDate).map((e) =>
                    <Timeline.Item>{e.text} - {e.date} - {e.typeFeedback}</Timeline.Item>)}
                </Timeline>
              </Col>
            </Row>
          </Space>
        </Structure>
      )}

      {status && (
        <Row justify="center">
          <Col span={16}>
            {edited !== null &&
              <Result status={edited.result} title={edited.message} subTitle={"Projeto editado: " + edited.project.name} />}
          </Col>
        </Row>
      )}

      {modalFeedback}
    </>
  );
};

export default AdminViewProject;
