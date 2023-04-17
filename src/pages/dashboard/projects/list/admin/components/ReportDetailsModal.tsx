import React from "react";
import {
  Alert,
  Button,
  Col,
  Collapse,
  List,
  Modal,
  Row,
  Typography,
} from "antd";

import { LabeledContent } from "../../../../../../components/LabeledContent";
import { formatDate } from "../../../../../../utils/dateFormatter";
import { Category } from "../../../../../../interfaces/category";
import { Campus, Course } from "../../../../../../interfaces/course";
import { Program } from "../../../../../../interfaces/program";
import { Notice } from "../../../../../../interfaces/notice";
import { Contact, Project } from "../../../../../../interfaces/project";
import { User } from "../../../../../../interfaces/user";

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
                    (props.project.category as Category).name ===
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
                            if (isLastElement) return eachOds + ".";
                            else return eachOds + ", ";
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
                            >
                              {link}
                            </a>
                          </Paragraph>
                        ))}
                      </LabeledContent>
                    </Col>
                  )}

                {props.project != null &&
                  (props.project.category as Category).name ===
                    "Curricular específica de curso" && (
                    <Col span={24} style={{ paddingBottom: "0" }}>
                      {/* <LabeledContent label="Curso(s)">
                        <Paragraph>
                          {props.project.course
                            ? (props.project.course as Course).name
                            : ""}{" "}
                          -
                          {props.project.course
                            ? (
                                (props.project.course as Course)
                                  .campus as Campus
                              ).name
                            : ""}
                        </Paragraph>
                      </LabeledContent> */}
                    </Col>
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
      </Row>
    </Modal>
  );
};
