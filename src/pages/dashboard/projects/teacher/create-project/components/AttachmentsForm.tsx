import React from "react";
import { Button, Form, Upload, Space } from "antd";
import { InboxOutlined } from "@ant-design/icons";

import { Project } from "../../../../../../interfaces/project";
import { ContainerFlex } from "../../../../../../global/styles";

interface Props
{
  changeAttachement(value: any): void;
  previous(): void;
  project: Project;
}

export const AttachementsForm: React.FC<Props> = (props) =>
{
  return (
    <ContainerFlex>
      <Form
        onFinish={props.changeAttachement}
        initialValues={props.project.resources}
      >
        <Form.Item label="Dragger">
          <Form.Item
            name="attachments"
            valuePropName="fileList"
            noStyle
          >
            <Upload.Dragger name="files">
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>

              <p className="ant-upload-text">
                Anexe aqui documentos que ache importante para o seu projeto
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form.Item>

        <Form.Item>
          <Space style={{ display: "flex", justifyContent: "space-between" }}>
            <Button type="primary" onClick={props.previous}>Anterior</Button>
            <Button type="primary" htmlType="submit">Finalizar</Button>
          </Space>
        </Form.Item>
      </Form>
    </ContainerFlex>
  );
};
