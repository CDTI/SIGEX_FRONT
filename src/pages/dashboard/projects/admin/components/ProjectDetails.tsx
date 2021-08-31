import React, { useEffect, useState, useMemo } from "react";
import ReactDOM from "react-dom";
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

import { dateFormatterOptions } from "../helpers/constants";

import { Category } from "../../../../../interfaces/category";
import { Feedback } from "../../../../../interfaces/feedback";
import { Program } from "../../../../../interfaces/program";
import { Material, Project, Transport } from "../../../../../interfaces/project";
import { User } from "../../../../../interfaces/user";
import { createFeedbackProject, listFeedbackProject } from "../../../../../services/feedback_service";
import { ReturnResponse, updateProject } from "../../../../../services/project_service";

import MyTable from "../../../../../components/layout/table";
import { Restricted } from "../../../../../components/Restricted";
import { compareDate } from "../../../../../util";

const { Step } = Steps;
const { Panel } = Collapse;
const { TextArea } = Input;

const projectStatus =
{
  pending: 0,
  reproved: 0,
  notSelected: 1,
  selected: 2,
  finished: 3
} as const;

const projectTypes =
{
  common: "Comum",
  curricularComponent: "Componente curricular",
  extraCurricular: "Extra curricular"
} as const;

interface Props
{
  project: Project;
  showResult: boolean;
  onRate(): void;
}

function formatTimelineMessage(date: Date, type: "system" | "user"): string
{
  const formattedDate = new Intl
    .DateTimeFormat("pt-BR", dateFormatterOptions)
    .format(date)
    .split(" ");

  const parsedType = type === "system"
    ? "sistema"
    : "usuário"

  return `${formattedDate[0]} às ${formattedDate[1]} por ${parsedType}`;
}

export const AdminViewProject: React.FC<Props> = (props) =>
{
  const [edited, setEdited] = useState<ReturnResponse>();
  const [feedback, setFeedback] = useState<Feedback>();
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [total, setTotal] = useState("");

  useEffect(() =>
  {
    (async () =>
    {
      const feedbacksResponse = await listFeedbackProject(props.project._id!);
      setFeedback(feedbacksResponse.feedback);

      const resources = props.project.resources;
      if (resources)
      {
        let value = 0;
        if (resources.transport)
          value += resources.transport.quantity * resources.transport.unitaryValue;

        resources.materials.forEach((m: Material) =>
          value += m.quantity * m.unitaryValue);

        setTotal(`R$ ${value.toFixed(2).replace(/\./, ",")}`);
      }
    })();

    return () => console.log("Unmounting...\n%o", props.project);
  }, [props.project]);

  const changeStatus = async (status: "reproved" | "notSelected" | "selected") =>
  {
    const project = { ...props.project, status };

    try
    {
      await updateProject(project._id!, project);
      setEdited({ message: "Projeto atualizado com sucesso", result: "success", project });
    }
    catch (error)
    {
      let message = "";
      if (error.response)
        message = error.response.data;
      else if (error.request)
        message = "Não houve resposta do servidor!";

      setEdited({ message, result: "error", project: props.project });
    }

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
        <Form
          form={form}
          layout="vertical"
          style={{ maxWidth: "500px", width: "100%" }}
          onFinish={submitFeedback}
        >
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
      render: (text: string, record: Material) => (
        <Typography>{`R$ ${record.unitaryValue.toFixed(2).replace(/\./, ",")}`}</Typography>
      )
    },
    {
      title: "Total",
      key: "total",
      render: (text: string, record: Material) => (
        <Typography>{`R$ ${(record.quantity * record.unitaryValue).toFixed(2).replace(/\./, ",")}`}</Typography>
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
      render: (text: string, record: Transport) => (
        <Typography>{`R$ ${record.unitaryValue.toFixed(2).replace(/\./, ",")}`}</Typography>
      )
    },
    {
      title: "Total",
      key: "total",
      render: (text: string, record: Transport) =>
      {
        if (record != null)
          return (
            <Typography>{`R$ ${(record.quantity * record.unitaryValue).toFixed(2).replace(/\./, ",")}`}</Typography>
          );
      },
    },
  ];

  if (props.showResult)
    return (
      <Row justify="center">
        <Col span={16}>
          {edited != null && (
            <Result
              status={edited.result}
              title={edited.message}
              subTitle={"Projeto editado: " + edited.project.name}
            />
          )}
        </Col>
      </Row>
    );

  return (
    <>
      {ReactDOM.createPortal(modalFeedback, document.getElementById("dialog-overlay")!)}

      <Row justify="center" gutter={[0, 32]}>
        <Col span={21}>
          <Steps direction="horizontal" current={projectStatus[props.project.status]}>
            {props.project.status === "reproved"
              ? <Step title="Reprovado" />
              : <Step title="Em análise" />
            }

            <Step title="Aprovado" />
            <Step title="Em andamento" />
            <Step title="Finalizado" />
          </Steps>
        </Col>

        <Col span={21}>
          <Collapse accordion>
            <Panel header="Informações básicas" key="1">
              <Typography><b>Usuário:</b> {(props.project.author as User).name}</Typography>
              <Typography><b>Descrição:</b> {props.project.description}</Typography>
              <Typography><b>Categoria:</b> {(props.project.category as Category).name}</Typography>
              <Typography><b>Programa:</b> {(props.project.program as Program).name}</Typography>
              <Typography><b>Tipo:</b> {projectTypes[props.project.typeProject]}</Typography>

              {(props.project.category as Category).name !== "Extensão específica do curso" && (
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

              {(props.project.category as Category).name === "Extensão específica do curso"
                && props.project.typeProject === "curricularComponent" && (
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

              {(props.project.category as Category).name === "Extensão específica do curso"
                && props.project.typeProject === "extraCurricular" && (
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
                {props.project.partnership.map((partner, index) => (
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
                  {props.project.resources && (
                    <MyTable
                      columns={columnsMaterials}
                      pagination={false}
                      data={props.project.resources.materials}
                    />
                  )}
                </Col>

                <Col span={24}>
                  <Typography.Title level={3}>Transportes</Typography.Title>
                  {props.project.resources && props.project.resources.transport && (
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
          <Timeline mode="left">
            {feedback?.registers.sort(compareDate).map((e) =>
              <Timeline.Item label={formatTimelineMessage(new Date(e.date), e.typeFeedback)}>
                {e.text}
              </Timeline.Item>
            )}
          </Timeline>
        </Col>
      </Row>
    </>
  );
};
