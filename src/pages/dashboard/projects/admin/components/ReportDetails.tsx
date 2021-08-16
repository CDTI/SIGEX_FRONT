import React from "react";
import { Alert, Col, Collapse, List, Row, Space, Typography } from "antd";

import { Contact, Report } from "../../../../../interfaces/project";

const { Title, Text, Paragraph } = Typography;

interface Props
{
  report: Report
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
            <Title level={5}>{props.report.projectTitle}</Title>
            <Paragraph>{props.report.introduction}</Paragraph>
          </Collapse.Panel>

          <Collapse.Panel key="methodology" header="Procedimentos Metodológicos">
            <Paragraph>{props.report.methodology}</Paragraph>
          </Collapse.Panel>

          <Collapse.Panel key="results" header="Resultados">
            <Paragraph>{props.report.results}</Paragraph>

            <Text strong>Número de alunos: </Text>
            <Text>{props.report.students}</Text>

            <br/>

            <Text strong>Número de equipes: </Text>
            <Text>{props.report.teams}</Text>

            <br/>

            <Text strong>Número de pessoas da comunidade com interação direta: </Text>
            <Text>{props.report.communityPeople}</Text>

            <br/>

            <Text strong>Número aproximado de pessoas impactadas: </Text>
            <Text>{props.report.affectedPeople}</Text>
          </Collapse.Panel>

          <Collapse.Panel key="discussion" header="Discussão">
            <Paragraph>{props.report.discussion}</Paragraph>
          </Collapse.Panel>

          <Collapse.Panel key="community" header="Comunidades">
            <List
              dataSource={props.report.communityContacts}
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

      {props.report.isLate && (
        <Col span={21}>
          <Alert
            type="warning"
            message={`Relatório entregue dia ${formatDate(new Date(props.report.createdAt))}, com atraso`}
            showIcon />
        </Col>
      )}
    </Row>
  );
};
