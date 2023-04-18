import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, Select } from "antd";
import { FormInstance } from "antd/lib/form";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

import { Report } from "../../../../../../interfaces/project";
import Paragraph from "antd/lib/typography/Paragraph";

interface Props {
  formController: FormInstance;
  initialValues?: Report;
}

export const IntroductionForm: React.FC<Props> = (props) => {
  const [selectedOds, setSelectedOds] = useState<Array<string>>([]);

  useEffect(() => {
    if (props.initialValues !== undefined)
      props.formController.setFieldsValue(props.initialValues);
  }, [props.initialValues]);

  const handleOdsSelection = (values: string[]) => {
    setSelectedOds(values);
  };

  return (
    <Form
      name="introduction"
      layout="vertical"
      form={props.formController}
      initialValues={props.initialValues}
    >
      <Row>
        <Col span={24}>
          <Form.Item
            name="projectTitle"
            label="Título"
            rules={[
              { required: true, message: "Campo obrigatório!" },
              {
                type: "string",
                max: 500,
                message: "O número máximo de caracteres foi extrapolado!",
              },
            ]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="introduction"
            label="Introdução"
            rules={[
              { required: true, message: "Campo obrigatório!" },
              {
                type: "string",
                max: 3000,
                message: "O número máximo de caracteres foi extrapolado!",
              },
            ]}
          >
            <Input.TextArea
              autoSize={{ minRows: 3, maxRows: 5 }}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.List name="midiaLinks">
            {(fields, { add, remove }) => (
              <>
                <Paragraph>Links de divulgação do projeto</Paragraph>
                {fields.map((field, index) => (
                  <Form.Item
                    required={false}
                    key={field.key}
                    style={{ marginBottom: "6px" }}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={["onChange", "onBlur"]}
                      noStyle
                    >
                      <Input
                        placeholder="Link para o post"
                        style={{
                          width: "90%",
                        }}
                      />
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        style={{ paddingLeft: "12px" }}
                        className="dynamic-delete-button"
                        onClick={() => remove(field.name)}
                      />
                    ) : null}
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{
                      width: "100%",
                      marginTop: "12px",
                    }}
                    icon={<PlusOutlined />}
                  >
                    Adicionar link de divulgação
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Col>

        <Col span={24}>
          <Form.Item
            name="ods"
            label="Objetivos de Desenvolvimento Sustentável(ODS)"
            rules={[{ required: true, message: "Campo Obrigatório" }]}
          >
            <Select
              placeholder={"Selecione pelo menos um ODS"}
              options={allOds.map((c: string) => ({ value: c }))}
              mode="multiple"
              style={{ width: "100%" }}
              onChange={handleOdsSelection}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export const allOds = [
  "Erradicação da Pobreza",
  "Fome Zero",
  "Saúde e Bem Estar",
  "Educação de Qualidade",
  "Igualdade de Gênero",
  "Água Potável e Saneamento",
  "Energia Limpa e Acessível",
  "Trabalho Decente e Crescimento Econômico",
  "Industria, Inovação e Infraestrutura",
  "Redução das Desigualdades",
  "Cidades e Comunidades Sustentáveis",
  "Consumo e Produção Responsáveis",
  "Ação Contra a Mudança Global do Clima",
  "Vida na Água",
  "Vida Terrestre",
  "Paz, Justiça e Instituições Eficazes",
  "Parcerias e Meios de Implementação",
];
