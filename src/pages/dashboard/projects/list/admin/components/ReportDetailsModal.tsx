import React, { useContext, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Collapse,
  Form,
  Input,
  List,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Typography,
} from "antd";

import { DownloadOutlined } from "@ant-design/icons";

import { LabeledContent } from "../../../../../../components/LabeledContent";
import { formatDate } from "../../../../../../utils/dateFormatter";
import { Category } from "../../../../../../interfaces/category";
import { Campus, Course } from "../../../../../../interfaces/course";
import { Program } from "../../../../../../interfaces/program";
import { Notice } from "../../../../../../interfaces/notice";
import { Contact, Project } from "../../../../../../interfaces/project";
import { Role, User } from "../../../../../../interfaces/user";
import { baseUrl } from "../../../../../../services/httpClient";
import { AuthContext } from "../../../../../../context/auth";
import { Restricted } from "../../../../../../components/Restricted";
import { useForm } from "antd/lib/form/Form";
import { CoordinatorModal } from "./CoordinatorModal";
import { SupervisorModal } from "./SupervisorModal";

interface Props {
  isVisible: boolean;
  project?: Project;
  onClose(): void;
}

const { Panel } = Collapse;
const { Text, Title, Paragraph } = Typography;

function formatLateSubmitMessage(date: Date): string {
  return `Relatório entregue com ataso no dia ${formatDate(date)}.`;
}

export const ReportDetailsModal: React.FC<Props> = (props) => {
  const [isCoordinatorModalOpen, setIsCoordinatorModalOpen] = useState(false);
  const [isSupervisorModalOpen, setIsSupervisorModalOpen] = useState(false);

  return (
    <Modal
      centered={true}
      closable={true}
      footer={
        <Row justify="end">
          <Button type="primary" onClick={() => props.onClose()}>
            Fechar
          </Button>
        </Row>
      }
      title={
        <Title level={5} ellipsis>
          {props.project?.report?.projectTitle}
        </Title>
      }
      visible={props.isVisible}
      onCancel={() => props.onClose()}
      width="85%"
    >
      <Row gutter={[0, 24]} justify="center">
        <Col span={21}>
          <Collapse accordion>
            <Panel header="Introdução" key="introduction">
              <Row gutter={[0, 8]}>
                <Col span={24}>
                  <LabeledContent label="Título">
                    <Paragraph>{props.project?.report?.projectTitle}</Paragraph>
                  </LabeledContent>
                </Col>

                <Col span={24}>
                  <LabeledContent label="Introdução">
                    <Paragraph>{props.project?.report?.introduction}</Paragraph>
                  </LabeledContent>
                </Col>

                <Col span={24}>
                  <LabeledContent label="Autor">
                    <Paragraph>
                      {(props.project?.author as User)?.name}
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

                <Col
                  span={24}
                  style={
                    props.project == null ||
                    (props.project.category as Category)?.name ===
                      "Curricular específica de curso"
                      ? { paddingBottom: "0" }
                      : {}
                  }
                >
                  <LabeledContent label="Programa">
                    <Paragraph>
                      {(props.project?.program as Program)?.name}
                    </Paragraph>
                  </LabeledContent>
                </Col>

                {props.project?.notice &&
                  (props.project?.notice as Notice).projectExecutionPeriod &&
                  (props.project?.notice as Notice).projectExecutionYear && (
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
                {props.project?.report &&
                  props.project?.report.ods &&
                  props.project?.report?.ods.length > 0 && (
                    <Col span={24}>
                      <LabeledContent label="ODS Selecionados">
                        <Paragraph>
                          {props.project?.report.ods.map((eachOds, index) => {
                            const isLastElement =
                              props.project?.report?.ods.length === index + 1
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
                {props.project?.report &&
                  props.project?.report.midiaLinks &&
                  props.project?.report?.midiaLinks.length > 0 && (
                    <Col span={24} style={{ marginBottom: "1em" }}>
                      <LabeledContent label="Links de divulgação">
                        {props.project?.report?.midiaLinks.map((link) => (
                          <Paragraph style={{ marginBottom: "0em" }}>
                            Link:
                            <a
                              style={{ paddingLeft: "8px" }}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {link}
                            </a>
                          </Paragraph>
                        ))}
                      </LabeledContent>
                    </Col>
                  )}

                {props.project?.report &&
                  props.project?.report.sharepointLink && (
                    <Col span={24}>
                      <LabeledContent label="Link das imagens no sharepoint">
                        <Button
                          type="link"
                          href={props.project.report.sharepointLink}
                          target="blank"
                        >
                          Ir para pasta de imagens
                        </Button>
                      </LabeledContent>
                    </Col>
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
                    </>
                  )}
              </Row>
            </Panel>

            <Panel header="Procedimentos Metodológicos" key="methodology">
              <Paragraph>{props.project?.report?.methodology}</Paragraph>
            </Panel>

            <Panel header="Resultados" key="results">
              <Row gutter={[0, 8]}>
                <Col span={24}>
                  <LabeledContent label="Relato da experiência">
                    <Paragraph>{props.project?.report?.results}</Paragraph>
                  </LabeledContent>
                </Col>

                <Col span={24}>
                  <LabeledContent label="Número de alunos">
                    <Paragraph>{props.project?.report?.students}</Paragraph>
                  </LabeledContent>
                </Col>

                <Col span={24}>
                  <LabeledContent label="Número de equipes">
                    <Paragraph>{props.project?.report?.teams}</Paragraph>
                  </LabeledContent>
                </Col>

                <Col span={24}>
                  <LabeledContent label="Número de pessoas da comunidade com interação direta">
                    <Paragraph>
                      {props.project?.report?.communityPeople}
                    </Paragraph>
                  </LabeledContent>
                </Col>

                <Col span={24} style={{ paddingBottom: "0" }}>
                  <LabeledContent label="Número aproximado de pessoas impactadas">
                    <Paragraph>
                      {props.project?.report?.affectedPeople}
                    </Paragraph>
                  </LabeledContent>
                </Col>
              </Row>
            </Panel>

            <Panel header="Discussão" key="discussion">
              <Paragraph>{props.project?.report?.discussion}</Paragraph>
            </Panel>

            <Panel header="Comunidades" key="community">
              <Row gutter={[0, 8]}>
                <Col span={24}>
                  <LabeledContent label="Nome da comunidade">
                    <Paragraph>
                      {props.project?.report?.communityName}
                    </Paragraph>
                  </LabeledContent>
                </Col>

                <Col span={24}>
                  <LabeledContent label="Contatos">
                    <List
                      dataSource={
                        props.project?.report?.communityContacts ?? []
                      }
                      renderItem={(c: Contact) => (
                        <List.Item>
                          <Text>
                            <Row justify="start">
                              <Text strong>Informações</Text>
                            </Row>

                            {c.name}
                          </Text>

                          <Text>
                            <Row justify="end">
                              <Text strong>Telefone</Text>
                            </Row>

                            {c.phone != null && c.phone !== ""
                              ? c.phone
                              : "Nenhum telefone cadastrado!"}
                          </Text>
                        </List.Item>
                      )}
                    />
                  </LabeledContent>
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </Col>

        {props.project != null &&
          props.project.report != null &&
          props.project.report.isLate && (
            <Col span={21}>
              <Alert
                message={formatLateSubmitMessage(
                  new Date(props.project.report.createdAt!)
                )}
                showIcon
                type="warning"
              />
            </Col>
          )}

        {props.project?.report !== null && (
          <Col span={21}>
            <Button
              type="default"
              shape="round"
              target="blank"
              href={`${baseUrl}/project/generateAndDownloadProjectReport/${props.project?._id}`}
            >
              <DownloadOutlined /> Exportar relatório
            </Button>
          </Col>
        )}
        <Restricted allow={["Comitê de extensão", "Administrador"]}>
          <CoordinatorModal
            isCoordinatorModalOpen={isCoordinatorModalOpen}
            project={props.project}
            setIsCoordinatorModalOpen={setIsCoordinatorModalOpen}
            onCloseReportModal={props.onClose}
          />
          <Col span={21}>
            <Space size={"large"} style={{ marginTop: "10px" }}>
              <Button
                style={{ color: "black", backgroundColor: "#4add65" }}
                onClick={() => {
                  setIsCoordinatorModalOpen(true);
                }}
              >
                Avaliação de relatório do coordenador
              </Button>
            </Space>
            {props.project?.report?.coordinatorFeedback && (
              <Collapse accordion>
                <Panel
                  header="Avaliação do coordenador"
                  key={"coordinatorFeedback"}
                >
                  <Text>{props.project.report.coordinatorFeedback}</Text>
                </Panel>
              </Collapse>
            )}
          </Col>
        </Restricted>
        {props.project?.report?.coordinatorFeedback && (
          <Restricted allow={"Administrador"}>
            <SupervisorModal
              isSupervisorModalOpen={isSupervisorModalOpen}
              project={props.project}
              setIsSupervisorModalOpen={setIsSupervisorModalOpen}
              onCloseReportModal={props.onClose}
            />
            <Col span={21}>
              <Space size={"large"} style={{ marginTop: "10px" }}>
                <Button
                  style={{ color: "black", backgroundColor: "#4add65" }}
                  onClick={() => {
                    setIsSupervisorModalOpen(true);
                  }}
                >
                  Avaliação de relatório do supervisor
                </Button>
              </Space>
              {props.project?.report?.supervisorFeedback && (
                <Collapse accordion>
                  <Panel
                    header="Avaliação do supervisor"
                    key={"supervisorFeedback"}
                  >
                    <Text>{props.project.report.supervisorFeedback}</Text>
                  </Panel>
                </Collapse>
              )}
            </Col>
          </Restricted>
        )}
      </Row>
    </Modal>
  );
};
