import React, { useEffect, useState } from "react";
import Structure from "../../../components/layout/structure";
import { Button, Form, Input, Select, notification } from "antd";
import { generateReport } from "../../../services/yearReport_service";
import { baseUrl, httpClient } from "../../../services/httpClient";
import { DownloadOutlined, FileWordOutlined } from "@ant-design/icons";
import { Campus } from "../../../interfaces/course";
import { getAllCampi } from "../../../services/campi_service";

type NotificationType = "success" | "info" | "warning" | "error";

export const YearReportPage: React.FC = () => {
  const years: number[] = [];
  const nowDate = new Date();
  for (let i = 2021; i <= nowDate.getFullYear(); i++) {
    years.push(i);
  }

  const [form] = Form.useForm();
  const [btnLoading, setBtnLoading] = useState(false);
  const [downloadBtnDisabled, setDownloadBtnDisabled] = useState(true);
  const [campus, setCampus] = useState<Campus[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined
  );

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

  const submitGenerateReport = async (city: Array<string>, year: number) => {
    setBtnLoading(true);
    setDownloadBtnDisabled(true);

    if (typeof city === "string") {
      city = [city];
    }

    const response = await generateReport(city, year)
      .then((res) => {
        setBtnLoading(false);
        setDownloadBtnDisabled(false);
        openNotification(
          "success",
          "Relatório gerado",
          "Você já pode fazer o download do relatório."
        );
      })
      .catch((err) => {
        openNotification(
          "error",
          "Erro!",
          "Algo deu errado. Tente novamente mais tarde."
        );
        console.log(err);
        setBtnLoading(false);
      });
  };

  const downloadYearReport = async () => {
    const report = await httpClient.get("/project/downloadYearReport");
  };

  useEffect(() => {
    (async () => {
      try {
        const campi = await getAllCampi();
        setCampus(campi ?? []);
      } catch (error) {
        console.log(error);
      }
    })();
  });

  return (
    <>
      {contextHolder}
      <Structure title="Relatório Anual">
        <Form
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "20px",
            width: "100%",
          }}
          onFinish={(e) => {
            submitGenerateReport(e.city, e.year);
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
              options={years.map((year: number) => ({
                label: year,
                key: year,
                value: year,
              }))}
              onChange={(e) => {
                setSelectedYear(Number(e));
                form.resetFields(["city"]);
              }}
            />
          </Form.Item>
          {selectedYear !== undefined && selectedYear < 2023 && (
            <Form.Item
              name="city"
              label="Cidade"
              rules={[{ required: true, message: "Campo obrigatório" }]}
              style={{ width: "60%" }}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>
          )}

          {selectedYear !== undefined && selectedYear >= 2023 && (
            <Form.Item
              name="city"
              label="Cidade"
              rules={[{ required: true, message: "Campo obrigatório" }]}
              style={{ width: "60%" }}
            >
              <Select
                options={campus.map((c: Campus) => ({
                  label: c.name,
                  key: c._id,
                  value: c._id!,
                }))}
                mode="multiple"
              />
            </Form.Item>
          )}

          <Form.Item style={{ marginBottom: "10px" }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={btnLoading}
              icon={<FileWordOutlined />}
              onClick={() => {
                openNotification(
                  "info",
                  "Gerando relatório",
                  "O relatório pode levar alguns minutos para ficar pronto. Por favor, aguarde...",
                  15
                );
              }}
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
    </>
  );
};
