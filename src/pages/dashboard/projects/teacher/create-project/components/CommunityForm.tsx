import React from "react";
import { Form, Input, Button, InputNumber, Space } from "antd";

import { Project, Community } from "../../../../../../interfaces/project";
import { ContainerFlex } from "../../../../../../global/styles";


interface Props
{
  changeCommunitySpecific(specificCommunity: Community): void;
  previous(): void;
  project: Project;
}

const { TextArea } = Input;

export const CommunityForm: React.FC<Props> = (props) =>
{
  return (
    <ContainerFlex>
      <Form
        layout="vertical"
        initialValues={props.project.specificCommunity}
        style={{ width: "100%", maxWidth: "500px" }}
        onFinish={props.changeCommunitySpecific}
      >
        <Form.Item
          name="text"
          label="Sobre"
          rules={[{ required: true, message: "Campo Obrigatório" }]}
        >
          <TextArea placeholder="Digite sobre a comunidade" />
        </Form.Item>

        <Form.Item
          name="location"
          label="Localização"
          rules={[{ required: true, message: "Campo Obrigatório" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="peopleInvolved"
          label="N° de pessoas envolvidas"
          rules={[{ required: true, message: "Campo Obrigatório" }]}
        >
          <InputNumber
            placeholder="Ex: 120"
            defaultValue={0}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={value => `${value}`.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>

        <Form.Item>
          <Space style={{ display: "flex", justifyContent: "space-between" }}>
            <Button type="primary" onClick={props.previous}>Anterior</Button>
            <Button type="primary" htmlType="submit">Próximo</Button>
          </Space>
        </Form.Item>
      </Form>
    </ContainerFlex>
  );
};
