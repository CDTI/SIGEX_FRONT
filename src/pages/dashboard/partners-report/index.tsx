import React from "react";
import Structure from "../../../components/layout/structure";
import { Button, Form, Select, notification } from "antd";
import { httpClient } from "../../../services/httpClient";
import { DownloadOutlined } from "@ant-design/icons";

type NotificationType = "success" | "info" | "warning" | "error";

export const PartnersReportPage: React.FC = () => {
  const years: number[] = [];
  const nowDate = new Date();
  for (let i = 2021; i <= nowDate.getFullYear(); i++) {
    years.push(i);
  }

  const [form] = Form.useForm();

  const [api, contextHolder] = notification.useNotification();

  const openNotification = (
    type: NotificationType,
    message: string,
    description: string,
    duration?: number
  ) => {
    api[type]({
      message: message,
      description: description,
      duration: duration,
    });
  };

  const downloadPartnersReport = (data: { year: any; semester: any }) => {
    httpClient
      .request({
        url: "/project/generatePartnersReport",
        method: "post",
        responseType: "blob",
        data: { year: data.year, semester: data.semester },
      })
      .then((res) => {
        const href = URL.createObjectURL(res.data);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute(
          "download",
          `Relatório de parceiros ${data.year} - ${data.semester}.xlsx`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
        openNotification(
          "success",
          "Relatório gerado",
          "Realizando download do relatório"
        );
      })
      .catch((err) => {
        console.log(err);
        openNotification(
          "error",
          "Erro!",
          "Algo deu errado. Tente novamente mais tarde ou contate o administrador."
        );
      });
  };

  return (
    <>
      {contextHolder}
      <Structure title="Relatório de parceiros">
        <Form
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "20px",
            width: "100%",
          }}
          onFinish={(e) => {
            downloadPartnersReport(e);
            return;
          }}
          form={form}
        >
          <Form.Item
            name="year"
            label="Ano"
            rules={[{ required: true, message: "Selecione um ano" }]}
            style={{ width: "60%" }}
          >
            <Select
              style={{ width: "100%" }}
              placeholder="Selecione um ano"
              options={years.map((year: number) => ({
                label: year,
                key: year,
                value: year,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="semester"
            label="Semestre"
            rules={[{ required: true, message: "Campo obrigatório" }]}
            style={{ width: "60%" }}
          >
            <Select
              style={{ width: "100%" }}
              placeholder="Selecione um semestre"
              options={[
                {
                  label: "1° Semestre",
                  key: "1° Semestre",
                  value: "1° Semestre",
                },
                {
                  label: "2° Semestre",
                  key: "2° Semestre",
                  value: "2° Semestre",
                },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              shape="round"
              icon={<DownloadOutlined />}
            >
              Baixar Relatório
            </Button>
          </Form.Item>
        </Form>
      </Structure>
    </>
  );
};
