import React, { useEffect, useState, useMemo } from "react";
import
{
  Steps,
  Button,
  Space,
  Collapse,
  Typography,
  Result,
  Modal,
  Form,
  Input,
  Timeline,
  Row,
  Col
} from "antd";

import { Category } from "../../../../../interfaces/category";
import { Feedback } from "../../../../../interfaces/feedback";
import { Program } from "../../../../../interfaces/program";
import { Material, Project, Transport } from "../../../../../interfaces/project";
import { Role, User } from "../../../../../interfaces/user";
import { createFeedbackProject, listFeedbackProject } from "../../../../../services/feedback_service";
import { ReturnResponse, updateProject } from "../../../../../services/project_service";

import MyTable from "../../../../../components/layout/table";
import { Restricted } from "../../../../../components/Restricted";
import { useAuth } from "../../../../../context/auth";
import { compareDate } from "../../../../../util";

interface Props
{
  project: Project;
  showResult: boolean;
  onRate(): void;
}

function currentProject(project: Project)
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

const { Step } = Steps;
const { Panel } = Collapse;
const { TextArea } = Input;

export const AdminViewProject: React.FC<Props> = (props) =>
{
  const [edited, setEdited] = useState<ReturnResponse | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [category, setCategory] = useState<Category>(props.project.category as Category);
  const [program, setProgram] = useState<Program | null>(null);
  const [userName, setUserName] = useState("");
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [total, setTotal] = useState("");
  const [typeProject, setTypeProject] = useState("");
  const { user } = useAuth();

  const formatReal = (value: any) =>
  {
    let tmp = `${value} `.replace(/([0-9]{2})$/g, ",$1");
    if (tmp.length > 6)
      tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$),([-])/g, ".$1,$2");

    return tmp;
  };

  const defineTypeProject = () =>
  {
    if (props.project.typeProject === "common")
    {
      setTypeProject(props.project.category === "5fb8402399032945bc5c1fe2"
        ? "Extracurricular"
        : "Institucional");
    }
    else if (props.project.typeProject === "extraCurricular")
    {
      setTypeProject("Extracurricular");
    }
    else if (props.project.typeProject === "curricularComponent")
    {
      setTypeProject("Componente Curricular");
    }
  };

  useEffect(() =>
  {
    (async () =>
    {
      setProgram(props.project.program as Program);

      const feedbacksResponse = await listFeedbackProject(props.project._id!);
      setFeedback(feedbacksResponse.feedback);

      const resources = props.project.resources;

      let value = 0;
      if (resources.transport !== null && resources.transport !== undefined)
        value += resources.transport.quantity * parseInt(formatReal(resources.transport.unitaryValue.toString()));

      resources.materials?.forEach((m: Material) =>
        value += m.quantity * parseInt(formatReal(m.unitaryValue.toString())));

      setTotal(formatReal(value));
      setUserName((props.project.author as User)?.name);
      defineTypeProject();
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.project]);

  const changeStatus = async (status: "reproved" | "notSelected" | "selected") =>
  {
    props.project.status = status;

    const update = await updateProject(props.project);
    setEdited({ message: update.message, result: update.result, project: update.project });
    props.onRate();
  };

  const openModal = () => setVisible(true);

  const modalFeedback = useMemo(() =>
  {
    const submitFeedback = async (values: { text: string }) =>
    {
      setVisible(false);
      let response = await createFeedbackProject(props.project._id!, values);
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
              { required: true, message: "Campo obrigatório" },
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
  }, [form, props.project._id, visible, changeStatus]);

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
      render: (text: string, transport: Transport) => <Typography>{formatReal(transport.unitaryValue)}</Typography>,
    },
    {
      title: "Total",
      key: "total",
      render: (text: string, material: Material) => (
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
      render: (text: string, transport: Transport) => <Typography>{formatReal(transport.unitaryValue)}</Typography>,
    },
    {
      title: "Total",
      key: "total",
      render: (text: string, transport: Transport) => {
        if (transport !== undefined && transport !== null) {
          return (
            <Typography>{transport.quantity * parseInt(formatReal(transport.unitaryValue.toString()))}</Typography>
          );
        }
      },
    },
  ];

  const userRoles = user!.roles.map((r: string | Role) => (r as Role).description);

  return (
    <>
      {!props.showResult && (
        <Row justify="center" gutter={[0,32]}>
          <Col span={21}>
            <Steps direction="horizontal" current={currentProject(props.project)}>
              {props.project.status === "reproved"
                ? <Step title="Reprovado" />
                : <Step title="Em análise" />}

              <Step title="Aprovado" />
              <Step title="Em andamento" />
              <Step title="Finalizado" />
            </Steps>
          </Col>

          <Col span={21}>
            <Collapse accordion>
              <Panel header="Informações básicas" key="1">
                <Typography><b>Usuário:</b> {userName}</Typography>
                <Typography><b>Nome:</b> {props.project.name}</Typography>
                <Typography><b>Descrição:</b> {props.project.description}</Typography>
                <Typography><b>Categoria:</b> {category.name}</Typography>
                <Typography><b>Programa:</b> {program?.name}</Typography>
                <Typography><b>Tipo:</b> {typeProject}</Typography>

                {props.project.category !== "5fb8402399032945bc5c1fe2" && (
                  <>
                    <Typography><b>Disponibilidades de horários primeiro semestre:</b></Typography>
                    <ul style={{ marginLeft: "18px" }}>
                      {props.project.firstSemester.map((e) =>
                        <li>{e.period} - {`${e.day}ª feira`} - {e.location}</li>
                      )}
                    </ul>

                    <Typography><b>Disponibilidades de horários segundo semestre:</b></Typography>
                    <ul style={{ marginLeft: "18px" }}>
                      {props.project.secondSemester.map((e) =>
                        <li>{e.period} - {`${e.day}ª feira`} - {e.location}</li>
                      )}
                    </ul>

                    <Typography><b>CH disponível:</b> {props.project.totalCH}</Typography>
                    <Typography><b>Máximo de turmas:</b> {props.project.maxClasses}</Typography>
                  </>
                )}

                {props.project.category === "5fb8402399032945bc5c1fe2" && props.project.typeProject === "curricularComponent" && (
                  <>
                    <Typography>{" "}<b> Professores </b>{" "}</Typography>
                    {props.project.teachers.map((t) =>
                      <li>{t.name} - {t.registration} - {t.cpf} - {t.phone} - {t.email}</li>
                    )}

                    <Typography>{" "}<b> Disciplinas </b>{" "}</Typography>
                    {props.project.disciplines.map((d) =>
                      <li>{d.name}</li>
                    )}
                  </>
                )}

                {props.project.category === "5fb8402399032945bc5c1fe2" && props.project.typeProject === "extraCurricular" && (
                  <>
                    <Typography>{" "}<b> Professores </b>{" "}</Typography>
                    {props.project.teachers.map((t) =>
                      <li>{t.name} - {t.registration} - {t.cpf} - {t.phone} - {`${t.totalCH} CH`} - {t.email}</li>
                    )}
                  </>
                )}
              </Panel>

              <Panel header="Parcerias" key="2">
                <Collapse accordion>
                  {props.project.partnership?.map((partner, index) => (
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
              </Panel>

              <Panel header="Comunidade" key="3">
                <Typography>Sobre: {props.project.specificCommunity.text}</Typography>
                <Typography>Localização: {props.project.specificCommunity.location}</Typography>
                <Typography>Pessoas envolvidas: {props.project.specificCommunity.peopleInvolved}</Typography>
              </Panel>

              <Panel header="Planejamento" key="4">
                <Collapse>
                  {props.project.planning?.map((planning, planningIdx) => (
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
                <Row gutter={[0, 24]}>
                  <Col span={24}>
                    <Typography.Title level={3}>Materiais</Typography.Title>
                    {props.project.resources.materials !== undefined && (
                      <MyTable
                        columns={columnsMaterials}
                        pagination={false}
                        data={props.project.resources.materials}
                      />
                    )}
                  </Col>

                  <Col span={24}>
                    <Typography.Title level={3}>Transportes</Typography.Title>
                    {props.project.resources.transport !== null && props.project.resources.transport !== undefined && (
                      <MyTable
                        columns={columnsTransport}
                        pagination={false}
                        data={[props.project.resources.transport]}
                      />
                    )}
                  </Col>

                  <Col span={24}>
                    <Row justify="space-between">
                      <Typography.Text strong style={{ fontSize: "16pt", color: "#b80c09" }}>
                        Valor total do projeto
                      </Typography.Text>

                      <Typography.Text strong style={{ fontSize: "16pt", color: "#b80c09" }}>
                        {total}
                      </Typography.Text>
                    </Row>
                  </Col>
                </Row>
              </Panel>
            </Collapse>
          </Col>

          {props.project.status !== "finished" && (
            <Restricted allowedRoles={["Administrador"]}>
              <Col span={21}>
                <Space>
                  <Button
                    style={{ backgroundColor: "#acc5cf", color: "#fff" }}
                    onClick={openModal}
                  >
                    Não aprovado
                  </Button>

                  <Button
                    style={{ backgroundColor: "#b3afc8", color: "#fff" }}
                    onClick={() => changeStatus("notSelected")}
                  >
                    Aprovado e não selecionado
                  </Button>

                  <Button
                    style={{ backgroundColor: "#8dc898", color: "#fff" }}
                    onClick={() => changeStatus("selected")}
                  >
                    Selecionado
                  </Button>
                </Space>
              </Col>
            </Restricted>
          )}

          <Col span={21}>
            <Timeline>
              {feedback?.registers.sort(compareDate).map((e) =>
                <Timeline.Item>{e.text} - {e.date} - {e.typeFeedback}</Timeline.Item>
              )}
            </Timeline>
          </Col>
        </Row>
      )}

      {props.showResult && (
        <Row justify="center">
          <Col span={16}>
            {edited !== null && (
              <Result
                status={edited.result}
                title={edited.message}
                subTitle={"Projeto editado: " + edited.project.name}
              />
            )}
          </Col>
        </Row>
      )}

      {modalFeedback}
    </>
  );
};
