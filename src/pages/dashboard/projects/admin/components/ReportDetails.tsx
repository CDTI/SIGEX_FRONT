import React from "react";

import { Alert, Col, Collapse, List, Row, Space, Typography } from "antd";

import { ICommunityContact, IReport } from "../../../../../interfaces/report";

const { Title, Text, Paragraph } = Typography;

interface Props
{
  report: IReport
}

function padNumber(n: number): string
{
  return n < 10 ? `0${n}` : n.toString();
}

function formatDate(date: Date): string
{
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${padNumber(day)}/${padNumber(month)}/${year}`;
}

const ReportDetails: React.FC<Props> = (props) =>
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
              renderItem={(cc: ICommunityContact) => (
                <List.Item>
                  <Title level={5}>{cc.name}</Title>
                  <Text>{cc.contact}</Text>
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

export default ReportDetails;