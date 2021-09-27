import React from "react";
import { Alert, Col, Collapse, List, Row, Typography } from "antd";

import { Contact, Project } from "../../../../../../interfaces/project";
import { User } from "../../../../../../interfaces/user";
import { Category } from "../../../../../../interfaces/category";
import { Program } from "../../../../../../interfaces/program";
import { formatDate } from "../../../../../../utils/dateFormatter";
import { Notice } from "../../../../../../interfaces/notice";

interface Props
{
  project: Project;
}

const { Text, Paragraph } = Typography;

function toSemester(date: Date): string
{
  return `${date.getMonth() < 6 ? 1 : 2}º semestre de ${date.getFullYear()}`;
}

export const ReportDetails: React.FC<Props> = (props) =>
{
  return (
    <Row justify="center" gutter={[0, 24]}>
      <Col span={21}>
        <Collapse accordion>
          <Collapse.Panel key="introduction" header="Introdução">
            <Text strong>Título</Text>
            <Paragraph>{props.project.report!.projectTitle}</Paragraph>

            <Text strong>Introdução</Text>
            <Paragraph>{props.project.report!.introduction}</Paragraph>

            <Text strong>Autor</Text>
            <Paragraph>{(props.project.author as User).name}</Paragraph>

            <Text strong>Categoria</Text>
            <Paragraph>{(props.project.category as Category).name}</Paragraph>

            <Text strong>Programa</Text>
            <Paragraph>{(props.project.program as Program).name}</Paragraph>

            <Text strong>Data do relatório</Text>
            <Paragraph>{toSemester(new Date((props.project.notice as Notice).effectiveDate))}</Paragraph>
          </Collapse.Panel>

          <Collapse.Panel key="methodology" header="Procedimentos Metodológicos">
            <Paragraph>{props.project.report!.methodology}</Paragraph>
          </Collapse.Panel>

          <Collapse.Panel key="results" header="Resultados">
            <Text strong>Relato da experiência</Text>
            <Paragraph>{props.project.report!.results}</Paragraph>

            <Text strong>Número de alunos</Text>
            <Paragraph>{props.project.report!.students}</Paragraph>

            <Text strong>Número de equipes</Text>
            <Paragraph>{props.project.report!.teams}</Paragraph>

            <Text strong>Número de pessoas da comunidade com interação direta</Text>
            <Paragraph>{props.project.report!.communityPeople}</Paragraph>

            <Text strong>Número aproximado de pessoas impactadas</Text>
            <Paragraph>{props.project.report!.affectedPeople}</Paragraph>
          </Collapse.Panel>

          <Collapse.Panel key="discussion" header="Discussão">
            <Paragraph>{props.project.report!.discussion}</Paragraph>
          </Collapse.Panel>

          <Collapse.Panel key="community" header="Comunidades">
            <Text strong>Nome da comunidade</Text>
            <Paragraph>{props.project.report!.communityName}</Paragraph>

            <List
              dataSource={props.project.report!.communityContacts}
              renderItem={(c: Contact) => (
                <List.Item>
                  <Text>
                    <Row justify="start">
                      <Text strong>
                        Informações de contato
                      </Text>
                    </Row>

                    {c.name}
                  </Text>

                  <Text>
                    <Row justify="end">
                      <Text strong>
                        Telefone
                      </Text>
                    </Row>

                    {c.phone != null && c.phone !== ""
                      ? c.phone
                      : "Nenhum telefone cadastrado!"}
                  </Text>
                </List.Item>
              )}
            />
          </Collapse.Panel>
        </Collapse>
      </Col>

      {props.project.report!.isLate && (
        <Col span={21}>
          <Alert
            type="warning"
            message={`Relatório entregue dia ${formatDate(new Date(props.project.report!.createdAt!))}, com atraso`}
            showIcon />
        </Col>
      )}
    </Row>
  );
};
