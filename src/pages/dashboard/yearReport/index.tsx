import React, { useState } from "react";
import Structure from "../../../components/layout/structure";
import { Button, Form, Input, Select, notification } from "antd";
import { generateReport } from "../../../services/yearReport_service";
import { baseUrl, httpClient } from "../../../services/httpClient";
import { DownloadOutlined, FileWordOutlined } from "@ant-design/icons";

export const YearReportPage: React.FC = () => {
  const years: number[] = [];
  const nowDate = new Date();
  for (let i = 2021; i <= nowDate.getFullYear(); i++) {
    years.push(i);
  }

  const [btnLoading, setBtnLoading] = useState(false);
  const [downloadBtnDisabled, setDownloadBtnDisabled] = useState(true);

  const submitGenerateReport = async (city: string, year: number) => {
    setBtnLoading(true);
    notification.info({
      message: "Gerando relatório",
      duration: 15,
      description:
        "O relatório pode demorar até 10 minutos para ficar pronto. Por favor aguarde...",
      placement: "topRight",
    });
    const response = await generateReport(city, year)
      .then((res) => {
        setBtnLoading(false);
        setDownloadBtnDisabled(false);
        notification.success({
          message: res,
          description: "Você já pode fazer o download do relatório.",
        });
      })
      .catch((err) => {
        notification.error({
          message: "Erro!",
          description: "Por favor, tente novamente mais tarde.",
        });
        console.log(err);
        setBtnLoading(false);
      });
  };

  const downloadYearReport = async () => {
    const report = await httpClient.get("/project/downloadYearReport");
  };

  return (
    <Structure title="Relatório Anual">
      <Form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "20px",
          width: "100%",
        }}
        onFinish={(e) => submitGenerateReport(e.city, e.year)}
      >
        <Form.Item
          name="city"
          label="Cidade"
          rules={[{ required: true, message: "Campo obrigatório" }]}
          style={{ width: "60%" }}
        >
          <Input style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="year"
          label="Ano"
          rules={[{ required: true, message: "Selecione um ano" }]}
          style={{ width: "60%" }}
        >
          <Select
            style={{ width: "100%" }}
            options={years.map((year: number) => ({
              label: year,
              key: year,
              value: year,
            }))}
          />
        </Form.Item>
        <Form.Item style={{ marginBottom: "10px" }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={btnLoading}
            icon={<FileWordOutlined />}
          >
            Gerar relatório
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="button"
            disabled={downloadBtnDisabled}
            shape="round"
            icon={<DownloadOutlined />}
            href={`${baseUrl}/project/downloadYearReport/`}
            target="blank"
          >
            Baixar Relatório
          </Button>
        </Form.Item>
      </Form>
    </Structure>
  );
};
