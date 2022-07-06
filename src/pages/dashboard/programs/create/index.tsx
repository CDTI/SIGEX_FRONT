import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Form, Button, Input, Result, Row, Col } from "antd";

import { Program } from "../../../../interfaces/program";
import { createProgram, ReturnResponsePost } from "../../../../services/program_service";
import Structure from "../../../../components/layout/structure";

interface ProgramForm
{
  name: string,
  description: string,
}

export const CreateProgram: React.FC = () =>
{
  const history = useHistory();
  const location = useLocation();

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
    <Structure title="Criar programa">
      {state !== null && (
        <Result
          status={state.result}
          title={state.message}
          subTitle={state.program?.name}
          extra={
          [
            <Button
              type="primary"
              onClick={resetForm}
            >
              <Link to={`${location.pathname}/programas`}>Ok</Link>
            </Button>,
          ]}
        />
      )}

      {state === null && (
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
        >
          <Row justify="center">
            <Col xs={24} xl={21} xxl={18}>
              <Form.Item
                name="name"
                label="Nome"
                rules={[{ required: true, message: "Campo obrigatório" }]}
              >
                <Input placeholder="Nome do programa" style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} xl={21} xxl={18}>
              <Form.Item
                name="description"
                label="Descrição"
                rules={[{ required: true, message: "Campo Obrigatório" }]}
              >
                <Input placeholder="Descrição do programa" style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} xl={21} xxl={18}>
              <Row justify="space-between">
                <Button onClick={() => history.goBack()}>
                  Voltar
                </Button>

                <Button htmlType="submit" type="primary">Cadastrar</Button>
              </Row>
            </Col>
          </Row>
        </Form>
      )}
    </Structure >
  );
};
