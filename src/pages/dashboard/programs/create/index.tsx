import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Input, Result } from "antd";

import { Program } from "../../../../interfaces/program";
import { createProgram, ReturnResponsePost } from "../../../../services/program_service";
import Structure from "../../../../components/layout/structure";
import { ContainerFlex } from "../../../../global/styles";

const tailLayout =
{
  wrapperCol: { offset: 8, span: 16 },
};

interface ProgramForm
{
  name: string,
  description: string,
}

export const CreateProgram: React.FC = () =>
{
  const [state, setstate] = useState<ReturnResponsePost | null>(null)
  const [form] = Form.useForm()

  const onFinish = async (values: ProgramForm) =>
  {
    const program: Program =
    {
      name: values.name,
      description: values.description,
      isActive: true,
    };

    const response = await createProgram(program)
    setstate(
    {
      message: response.message,
      result: response.result,
      program: response.program,
      created: response.created
    });
  };

  const resetForm = () =>
  {
    form.resetFields();
    setstate(null);
  };

  return (
    <Structure title="Criar campanha">
      {state !== null && (
        <Result
          status={state.result}
          title={state.message}
          subTitle={state.program?.name}
          extra={
          [
            <Button
              type="primary"
              key="/dashboard/programs"
              onClick={resetForm}
            >
              <Link to="/dashboard/programs">Ok</Link>
            </Button>,
          ]}
        />
      )}

      {state === null && (
        <ContainerFlex>
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            style={{ width: "100%", maxWidth: "500px" }}
          >
            <Form.Item
              name="name"
              label="Nome"
              rules={[{ required: true, message: "Campo obrigatório" }]}
            >
              <Input placeholder="Nome do programa" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Descrição"
              rules={[{ required: true, message: "Campo Obrigatório" }]}
            >
              <Input placeholder="Descrição do programa" />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button htmlType="submit" type="primary">Cadastrar</Button>
            </Form.Item>
          </Form>
        </ContainerFlex>
      )}
    </Structure >
  );
};
