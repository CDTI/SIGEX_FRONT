import React, { useEffect, useState } from "react";
import {
  Steps,
  Button,
  Space,
  Collapse,
  Typography,
  Modal,
  Timeline,
  Row,
  Col,
  List,
} from "antd";

import { formatDate } from "../../../../../../utils/dateFormatter";
import { Restricted } from "../../../../../../components/Restricted";
import { LabeledText } from "../../../../../../components/LabeledText";
import { LabeledContent } from "../../../../../../components/LabeledContent";
import { Category } from "../../../../../../interfaces/category";
import { Campus, Course } from "../../../../../../interfaces/course";
import { Feedback, Register } from "../../../../../../interfaces/feedback";
import { Schedule } from "../../../../../../interfaces/notice";
import { Program } from "../../../../../../interfaces/program";
import { Notice } from "../../../../../../interfaces/notice";
import {
  Contact,
  Material,
  Project,
  Teacher,
  Transport,
} from "../../../../../../interfaces/project";
import { User } from "../../../../../../interfaces/user";
import { Discipline } from "../../../../../../interfaces/discipline";
import { DownloadOutlined } from "@ant-design/icons";
import { baseUrl } from "../../../../../../services/httpClient";

interface Props {
  isVisible: boolean;
  log?: Feedback;
  project?: Project;
  onClose(): void;
  onReview(verdict: "reproved" | "notSelected" | "selected"): void;
}

const { Panel } = Collapse;
const { Text, Title, Paragraph } = Typography;

const projectStatus = {
  pending: 0,
  reproved: 0,
  notSelected: 1,
  selected: 2,
  finished: 3,
} as const;

const projectTypes = {
  common: "Comum",
  curricularComponent: "Componente curricular",
  extraCurricular: "Extra curricular",
} as const;

function compareRegistersDate(a: Register, b: Register): number {
  return a.date > b.date ? -1 : a.date < b.date ? 1 : 0;
}

function formatCurrency(value: number): string {
  return `R$ ${value.toFixed(2).replace(/\./, ",")}`;
}

function formatPrice(quantity: number, pricePerUnit: number): string {
  const value = formatCurrency(pricePerUnit);
  const total = formatCurrency(quantity * pricePerUnit);
  return `${quantity} x ${value} = ${total}`;
}

function formatTimelineMessage(type: "system" | "user", date: Date): string {
  const formattedDate = formatDate(date);
  const parsedType = type === "system" ? "sistema" : "usuário";

  return `${formattedDate} por ${parsedType}`;
}

export const ProjectDetailsModal: React.FC<Props> = (props) => {
  const [totalCost, setTotalCost] = useState("");

  useEffect(() => {
    if (props.project != null) {
      const materialsTotalValue = props.project.resources.materials
        .map((m: Material) => m.quantity * m.unitaryValue)
        .reduce((previous: number, current: number) => previous + current, 0);

      const transportTotalValue = props.project.resources.transport
        .map((t: Transport) => t.quantity * t.unitaryValue)
        .reduce((previous: number, current: number) => previous + current, 0);

      setTotalCost(formatCurrency(materialsTotalValue + transportTotalValue));
    }
  }, [props.project]);
  return (
    <Modal
      centered={true}
      closable={true}
      footer={
        <Row justify="space-between">
          <Col>
            <Restricted allow="Administrador">
              {props.project != null && props.project.status !== "finished" && (
                <Col span={21}>
                  <Space>
                    <Button
                      type="primary"
                      style={{ backgroundColor: "#acc5cf" }}
                      onClick={() => props.onReview("reproved")}
                    >
                      Não aprovado
                    </Button>

                    <Button
                      type="primary"
                      style={{ backgroundColor: "#b3afc8" }}
                      onClick={() => props.onReview("notSelected")}
                    >
                      Aprovado e não selecionado
                    </Button>

                    <Button
                      type="primary"
                      style={{ backgroundColor: "#8dc898" }}
                      onClick={() => props.onReview("selected")}
                    >
                      Selecionado
                    </Button>
                  </Space>
                </Col>
              )}
            </Restricted>
          </Col>

          <Col>
            <Row justify="end">
              <Button type="primary" onClick={() => props.onClose()}>
                Fechar
              </Button>
            </Row>
          </Col>
        </Row>
      }
      title={
        <Title level={5} ellipsis>
          {props.project?.name}
        </Title>
      }
      visible={props.isVisible}
      onCancel={props.onClose}
      width="85%"
    >
      <Row gutter={[0, 32]} justify="center">
        <Col span={21}>
          <Steps current={projectStatus[props.project?.status ?? "pending"]}>
            <Steps.Step title="Em análise" />

            {props.project != null && props.project.status === "reproved" ? (
              <Steps.Step title="Reprovado" status="error" />
            ) : (
              <Steps.Step title="Aprovado" />
            )}

            <Steps.Step title="Em andamento" />
            <Steps.Step title="Finalizado" />
          </Steps>
        </Col>

        <Col span={21}>
          <Collapse accordion>
            <Panel header="Informações básicas" key="main">
              <Row gutter={[0, 8]}>
                <Col span={24}>
                  <LabeledContent label="Autor">
                    <Paragraph>
                      {(props.project?.author as User)?.name}
                    </Paragraph>
                  </LabeledContent>
                </Col>

                <Col span={24}>
                  <LabeledContent label="Programa">
                    <Paragraph>
                      {(props.project?.program as Program)?.name}
                    </Paragraph>
                  </LabeledContent>
                </Col>

                <Col span={24}>
                  <LabeledContent label="Categoria">
                    <Paragraph>
                      {(props.project?.category as Category)?.name}
                    </Paragraph>
                  </LabeledContent>
                </Col>

                {props.project?.campus && (
                  <Col span={24}>
                    <LabeledContent label="Cidade de execução do projeto">
                      <Paragraph>
                        {(props.project?.campus as Campus)?.name}
                      </Paragraph>
                    </LabeledContent>
                  </Col>
                )}

                {props.project?.discipline && (
                  <Col span={24}>
                    <LabeledContent label="Disciplina">
                      <Paragraph>
                        {(props.project?.discipline as Discipline)?.name}
                      </Paragraph>
                    </LabeledContent>
                  </Col>
                )}

                <Col span={24}>
                  <LabeledContent label="Descrição geral do projeto (contexto, problemática, objetivo)">
                    <Paragraph>{props.project?.description}</Paragraph>
                  </LabeledContent>
                </Col>

                {props.project?.researchTypeDescription && (
                  <Col span={24}>
                    <LabeledContent label="Tipo de pesquisa será desenvolvida no projeto e como será realizada">
                      <Paragraph>
                        {props.project?.researchTypeDescription}
                      </Paragraph>
                    </LabeledContent>
                  </Col>
                )}

                {props.project?.studentsLearningDescription && (
                  <Col span={24}>
                    <LabeledContent label="Atores com quem o estudante irá estabelecer relação dialógica e o tipo de aprendizado que pode adquirir com essa relação">
                      <Paragraph>
                        {props.project?.studentsLearningDescription}
                      </Paragraph>
                    </LabeledContent>
                  </Col>
                )}

                {props.project?.transformingActionsDescription && (
                  <Col span={24}>
                    <LabeledContent label="Ações transformadoras que podem surgir deste projeto">
                      <Paragraph>
                        {props.project?.transformingActionsDescription}
                      </Paragraph>
                    </LabeledContent>
                  </Col>
                )}

                {props.project?.disciplineLearningObjectivesDescription && (
                  <Col span={24}>
                    <LabeledContent label="Aderência deste projeto com os objetivos de aprendizagem da componente curricular">
                      <Paragraph>
                        {props.project?.disciplineLearningObjectivesDescription}
                      </Paragraph>
                    </LabeledContent>
                  </Col>
                )}

                {props.project?.ods && props.project.ods.length > 0 && (
                  <Col span={24}>
                    <LabeledContent label="ODS Selecionados">
                      <Paragraph>
                        {props.project?.ods.map((eachOds, index) => {
                          const isLastElement =
                            props.project?.ods?.length === index + 1
                              ? true
                              : false;
                          if (isLastElement) {
                            return eachOds + ".";
                          } else {
                            return eachOds + ", ";
                          }
                        })}
                      </Paragraph>
                    </LabeledContent>
                  </Col>
                )}

                {props.project != null &&
                  (props.project.notice as Notice).projectExecutionPeriod &&
                  (props.project.notice as Notice).projectExecutionYear && (
                    <>
                      <Col span={24}>
                        <LabeledContent label="Período de execução do projeto">
                          <Paragraph>
                            {
                              (props.project?.notice as Notice)
                                ?.projectExecutionPeriod
                            }
                          </Paragraph>
                        </LabeledContent>
                      </Col>
                      <Col span={24}>
                        <LabeledContent label="Ano de execução do projeto">
                          <Paragraph>
                            {new Date(
                              (
                                props.project?.notice as Notice
                              )?.projectExecutionYear
                            ).getFullYear()}
                          </Paragraph>
                        </LabeledContent>
                      </Col>
                    </>
                  )}

                {props.project != null &&
                  (props.project.category as Category).name ===
                    "Curricular institucional" && (
                    <>
                      <Col span={24}>
                        <Row gutter={[0, 32]} style={{ marginBottom: "0" }}>
                          <Col span={24}>
                            <LabeledContent label="Disponibilidade">
                              <List
                                dataSource={props.project.secondSemester}
                                renderItem={(s: Schedule) => (
                                  <List.Item>
                                    <List.Item.Meta
                                      title={s.location}
                                      description={`${s.period} - ${s.day}ª feira`}
                                    />
                                  </List.Item>
                                )}
                                size="small"
                              />
                            </LabeledContent>
                          </Col>
                        </Row>
                      </Col>

                      <Col span={24}>
                        {!props.project.totalCHManha &&
                        !props.project.totalCHTarde &&
                        !props.project.totalCHNoite ? (
                          <LabeledContent label={`Carga horária disponível`}>
                            <Paragraph>{props.project.totalCH} horas</Paragraph>
                          </LabeledContent>
                        ) : (
                          <LabeledContent
                            label={`Carga horária disponível(Total: ${props.project.totalCH} horas)`}
                          >
                            <Paragraph
                              style={{ marginBottom: 2, marginTop: 5 }}
                            >
                              Manha: {props.project.totalCHManha} horas
                            </Paragraph>
                            <Paragraph style={{ marginBottom: 2 }}>
                              Tarde: {props.project.totalCHTarde} horas
                            </Paragraph>
                            <Paragraph>
                              Noite: {props.project.totalCHNoite} horas
                            </Paragraph>
                          </LabeledContent>
                        )}
                      </Col>

                      <Col span={24} style={{ paddingBottom: "0" }}>
                        <LabeledContent label="Máximo de turmas">
                          <Paragraph>{props.project.maxClasses}</Paragraph>
                        </LabeledContent>
                      </Col>

                      {(props.project.notice as Notice)
                        .projectExecutionPeriod &&
                        (props.project.notice as Notice)
                          .projectExecutionYear && (
                          <>
                            <Col span={24}>
                              <LabeledContent label="Período de execução do projeto">
                                <Paragraph>
                                  {
                                    (props.project?.notice as Notice)
                                      ?.projectExecutionPeriod
                                  }
                                </Paragraph>
                              </LabeledContent>
                            </Col>
                            <Col span={24}>
                              <LabeledContent label="Ano de execução do projeto">
                                <Paragraph>
                                  {new Date(
                                    (
                                      props.project?.notice as Notice
                                    )?.projectExecutionYear
                                  ).getFullYear()}
                                </Paragraph>
                              </LabeledContent>
                            </Col>
                          </>
                        )}
                    </>
                  )}

                {props.project != null &&
                  (props.project.category as Category).name ===
                    "Curricular específica de curso" && (
                    <>
                      {props.project.course &&
                        (props.project.course.length > 0 ? (
                          <Col span={24} style={{ paddingBottom: "0" }}>
                            <LabeledContent label="Cursos">
                              {props.project.course?.map((course: Course) => (
                                <Paragraph>
                                  {course.name} - {course.campus.name}
                                </Paragraph>
                              ))}
                            </LabeledContent>
                          </Col>
                        ) : (
                          <></>
                        ))}

                      <Col span={24}>
                        <Row gutter={[0, 32]} style={{ marginBottom: "0" }}>
                          <Col span={24}>
                            <LabeledContent label="Professores">
                              <List
                                dataSource={props.project.teachers}
                                renderItem={(t: User) => (
                                  <List.Item>
                                    <List.Item.Meta
                                      description={
                                        <Row justify="space-between">
                                          <LabeledText
                                            label="Nome"
                                            text={t.name}
                                          />
                                          <LabeledText
                                            label="E-Mail"
                                            text={t.email}
                                          />
                                        </Row>
                                      }
                                      title={
                                        <Row justify="space-between">
                                          <Text>{t.name}</Text>
                                          <Text>{t.cpf}</Text>
                                        </Row>
                                      }
                                    />
                                  </List.Item>
                                )}
                                size="small"
                              />
                            </LabeledContent>
                          </Col>
                        </Row>
                      </Col>
                    </>
                  )}

                {props.project != null &&
                  (props.project.category as Category).name ===
                    "Extracurricular" && (
                    <>
                      {props.project.course &&
                        (props.project.course.length > 0 ? (
                          <Col span={24} style={{ paddingBottom: "0" }}>
                            <LabeledContent label="Cursos">
                              {props.project.course?.map((course: Course) => (
                                <Paragraph>
                                  {course.name} - {course.campus.name}
                                </Paragraph>
                              ))}
                            </LabeledContent>
                          </Col>
                        ) : (
                          <></>
                        ))}

                      <Col span={24}>
                        <Row gutter={[0, 32]} style={{ marginBottom: "0" }}>
                          <Col span={24}>
                            <LabeledContent label="Professores">
                              <List
                                dataSource={props.project.teachers}
                                renderItem={(t: User) => (
                                  <List.Item>
                                    <List.Item.Meta
                                      description={
                                        <Row justify="space-between">
                                          <LabeledText
                                            label="Nome"
                                            text={t.name}
                                          />
                                          <LabeledText
                                            label="E-Mail"
                                            text={t.email}
                                          />
                                        </Row>
                                      }
                                      title={
                                        <Row justify="space-between">
                                          <Text>{t.name}</Text>
                                          <Text>{t.cpf}</Text>
                                        </Row>
                                      }
                                    />
                                  </List.Item>
                                )}
                                size="small"
                              />
                            </LabeledContent>
                          </Col>
                        </Row>
                      </Col>
                    </>
                  )}
              </Row>
            </Panel>

            <Panel header="Parcerias" key="associates">
              <Collapse accordion>
                {props.project?.partnership.map((partner, index) => (
                  <Panel header={`Parceria ${index + 1}`} key={index}>
                    <Row gutter={[0, 8]}>
                      <Col span={24}>
                        <LabeledContent label="Sobre">
                          <Paragraph>{partner.text}</Paragraph>
                        </LabeledContent>
                      </Col>

                      <Col span={24}>
                        <Row gutter={[0, 32]} style={{ marginBottom: "0" }}>
                          <Col span={24} style={{ paddingBottom: "0" }}>
                            <LabeledContent label="Contatos">
                              <List
                                dataSource={partner.contacts}
                                renderItem={(c: Contact) => (
                                  <List.Item>
                                    <List.Item.Meta
                                      description={
                                        <LabeledText
                                          label="Telefone"
                                          text={c.phone ?? "Nenhum cadastrado!"}
                                        />
                                      }
                                      title={c.name}
                                    />
                                  </List.Item>
                                )}
                                size="small"
                              />
                            </LabeledContent>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Panel>
                )) ?? []}
              </Collapse>
            </Panel>

            <Panel header="Comunidade" key="community">
              <Row gutter={[0, 8]}>
                <Col span={24}>
                  <LabeledContent label="Sobre">
                    <Paragraph>
                      {props.project?.specificCommunity.text}
                    </Paragraph>
                  </LabeledContent>
                </Col>

                <Col span={24}>
                  <LabeledContent label="Localização">
                    <Paragraph>
                      {props.project?.specificCommunity.location}
                    </Paragraph>
                  </LabeledContent>
                </Col>

                <Col span={24}>
                  <LabeledContent label="Pessoas envolvidas">
                    <Paragraph>
                      {props.project?.specificCommunity.peopleInvolved}
                    </Paragraph>
                  </LabeledContent>
                </Col>
              </Row>
            </Panel>

            <Panel header="Planejamento" key="arrangements">
              <Collapse accordion>
                {props.project?.planning.map((planning, index) => (
                  <Panel header={`Etapas ${index + 1}`} key={`step ${index}`}>
                    <Row gutter={[0, 8]}>
                      <Col span={24}>
                        <LabeledContent label="Sobre">
                          <Paragraph>{planning.text}</Paragraph>
                        </LabeledContent>
                      </Col>

                      <Col span={24}>
                        <LabeledContent label="Modo de desenvolvimento">
                          <Paragraph>{planning.developmentMode}</Paragraph>
                        </LabeledContent>
                      </Col>

                      <Col span={24}>
                        <LabeledContent label="Lugar de desenvolvimento">
                          <Paragraph>{planning.developmentSite}</Paragraph>
                        </LabeledContent>
                      </Col>

                      <Col span={24}>
                        <LabeledContent label="Inicio">
                          <Paragraph>{planning.startDate}</Paragraph>
                        </LabeledContent>
                      </Col>

                      <Col span={24}>
                        <LabeledContent label="Final">
                          <Paragraph>{planning.finalDate}</Paragraph>
                        </LabeledContent>
                      </Col>
                    </Row>
                  </Panel>
                )) ?? []}
              </Collapse>
            </Panel>

            <Panel header="Recursos" key="resources">
              <Row gutter={[0, 32]}>
                <Col span={24}>
                  <LabeledContent label="Materiais">
                    <List
                      dataSource={props.project?.resources.materials ?? []}
                      renderItem={(m: Material) => (
                        <List.Item>
                          <List.Item.Meta
                            description={m.description}
                            title={
                              <Row justify="space-between">
                                <Text>{m.item}</Text>
                                <Text>
                                  {formatPrice(m.quantity, m.unitaryValue)}
                                </Text>
                              </Row>
                            }
                          />
                        </List.Item>
                      )}
                      size="small"
                    />
                  </LabeledContent>
                </Col>

                <Col span={24}>
                  <LabeledContent label="Transporte">
                    <List
                      dataSource={props.project?.resources.transport ?? []}
                      renderItem={(t: Transport) => (
                        <List.Item>
                          <List.Item.Meta
                            description={t.description}
                            title={
                              <Row justify="space-between">
                                <Text>{t.typeTransport}</Text>
                                <Text>
                                  {formatPrice(t.quantity, t.unitaryValue)}
                                </Text>
                              </Row>
                            }
                          />
                        </List.Item>
                      )}
                      size="small"
                    />
                  </LabeledContent>
                </Col>

                <Col span={24} style={{ paddingBottom: "0" }}>
                  <Row justify="space-between">
                    <Text strong>Valor total do projeto:</Text>

                    {totalCost}
                  </Row>
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </Col>

        <Col span={21}>
          <Timeline
            mode="left"
            style={{
              maxHeight: "160px",
              overflowX: "hidden",
              overflowY: "auto",
              paddingTop: "8px",
            }}
          >
            {props.log?.registers
              .sort(compareRegistersDate)
              .map((r: Register) => (
                <Timeline.Item
                  label={formatTimelineMessage(
                    r.typeFeedback,
                    new Date(r.date)
                  )}
                >
                  {r.text}
                </Timeline.Item>
              )) ?? []}
          </Timeline>
        </Col>
        <Col span={21}>
          <Button
            type="default"
            shape="round"
            target="blank"
            href={`${baseUrl}/project/generateAndDownloadProject/${props.project?._id}`}
          >
            <DownloadOutlined /> Exportar projeto
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};
