import React from "react";
import { Alert, Col, Collapse, List, Row, Space, Typography } from "antd";

import { Contact, Project } from "../../../../../interfaces/project";
import { User } from "../../../../../interfaces/user";
import { Category } from "../../../../../interfaces/category";
import { Program } from "../../../../../interfaces/program";

const { Title, Text, Paragraph } = Typography;

interface Props
{
  project: Project;
}

function formatDate(date: Date): string
{
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().padStart(4, '0');

  return `${day}/${month}/${year}`;
}

export const ReportDetails: React.FC<Props> = (props) =>
{
  return (
    <Row justify="center" gutter={[0, 24]}>
      <Col span={21}>
        <Collapse accordion>
          <Collapse.Panel key="introduction" header="Introdução">
            <Paragraph>{props.project.report!.introduction}</Paragraph>

            <Text strong>Autor: </Text>
            <Text>{(props.project.author as User).name}</Text>

            <br/>

            <Text strong>Categoria: </Text>
            <Text>{(props.project.category as Category).name}</Text>

            <br/>

            <Text strong>Programa: </Text>
            <Text>{(props.project.program as Program).name}</Text>
          </Collapse.Panel>

          <Collapse.Panel key="methodology" header="Procedimentos Metodológicos">
            <Paragraph>{props.project.report!.methodology}</Paragraph>
          </Collapse.Panel>

          <Collapse.Panel key="results" header="Resultados">
            <Paragraph>{props.project.report!.results}</Paragraph>

            <Text strong>Número de alunos: </Text>
            <Text>{props.project.report!.students}</Text>

            <br/>

            <Text strong>Número de equipes: </Text>
            <Text>{props.project.report!.teams}</Text>

            <br/>

            <Text strong>Número de pessoas da comunidade com interação direta: </Text>
            <Text>{props.project.report!.communityPeople}</Text>

            <br/>

            <Text strong>Número aproximado de pessoas impactadas: </Text>
            <Text>{props.project.report!.affectedPeople}</Text>
          </Collapse.Panel>

          <Collapse.Panel key="discussion" header="Discussão">
            <Paragraph>{props.project.report!.discussion}</Paragraph>
          </Collapse.Panel>

          <Collapse.Panel key="community" header="Comunidades">
            <List
              dataSource={props.project.report!.communityContacts}
              renderItem={(c: Contact) => (
                <List.Item>
                  <Title level={5}>{c.name}</Title>
                  <Text>{c.phone}</Text>
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
            message={`Relatório entregue dia ${formatDate(new Date(props.project.report!.createdAt))}, com atraso`}
            showIcon />
        </Col>
      )}
    </Row>
  );
};
