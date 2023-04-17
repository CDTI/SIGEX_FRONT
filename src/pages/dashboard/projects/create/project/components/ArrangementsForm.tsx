import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Space,
  Divider,
  Row,
  Col,
  Typography,
  Modal,
  Checkbox,
} from "antd";
import { FormInstance } from "antd/lib/form";
import { MaskedInput } from "antd-mask-input";
import {
  PlusOutlined,
  MinusCircleOutlined,
  InfoCircleOutlined,
  TeamOutlined,
  ReadOutlined,
  HomeOutlined,
  CommentOutlined,
  ContainerOutlined,
  RocketOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

import { Planning } from "../../../../../../interfaces/project";

interface Props {
  formController: FormInstance;
  initialValues?: Planning[];
}

export const ArrangementsForm: React.FC<Props> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  useEffect(() => {
    if (props.initialValues != null)
      props.formController.setFieldsValue({ planning: props.initialValues });
  }, [props.initialValues]);

  return (
    <>
      <Space
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          margin: "10px 0",
        }}
      >
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Dicas para planejamento do projeto <InfoCircleOutlined />
        </Button>
      </Space>
      <Modal
        visible={isModalOpen}
        closable
        centered
        onCancel={() => setIsModalOpen(false)}
        footer={
          <Button type="primary" onClick={() => setIsModalOpen(false)}>
            Entendi
          </Button>
        }
        style={{ minWidth: "60%", borderRadius: "20px" }}
      >
        <Typography
          style={{
            fontSize: "20px",
            fontWeight: "bolder",
            color: "#1890ff",
            marginBottom: "15px",
          }}
        >
          Um projeto de extensão deve contemplar, no mínimo e não
          necessariamente nesta ordem, as seguintes etapas que deverão ser
          detalhadas e distribuídas no tempo:
        </Typography>

        <Typography style={{ fontSize: "16px", fontWeight: "bolder" }}>
          <CommentOutlined style={{ color: "#1890ff" }} /> - Preparação dos
          estudantes para estabelecer relação dialógica com a comunidade;
        </Typography>

        <Typography style={{ fontSize: "16px", fontWeight: "bolder" }}>
          <ReadOutlined style={{ color: "#1890ff" }} /> - Estudo das questões
          que envolvem o projeto proposto;
        </Typography>

        <Typography style={{ fontSize: "16px", fontWeight: "bolder" }}>
          <HomeOutlined style={{ color: "#1890ff" }} /> - Interação com a
          comunidade (deve acontecer em vários momentos);
        </Typography>

        <Typography style={{ fontSize: "16px", fontWeight: "bolder" }}>
          <ContainerOutlined style={{ color: "#1890ff" }} /> - Coleta e
          Sistematização dos dados da pesquisa;
        </Typography>

        <Typography style={{ fontSize: "16px", fontWeight: "bolder" }}>
          <TeamOutlined style={{ color: "#1890ff" }} /> - Ideação e escolha das
          ações a serem implantadas em parceria com a comunidade;
        </Typography>

        <Typography style={{ fontSize: "16px", fontWeight: "bolder" }}>
          <RocketOutlined style={{ color: "#1890ff" }} /> - Desenvolvimento das
          ações;
        </Typography>

        <Typography style={{ fontSize: "16px", fontWeight: "bolder" }}>
          <CheckCircleOutlined style={{ color: "#1890ff" }} /> - Fechamento;
        </Typography>
      </Modal>
      <Form name="arrangements" layout="vertical" form={props.formController}>
        <Row>
          <Col span={24}>
            <Form.List name="planning">
              {(phaseFields, { add, remove }) => (
                <>
                  <Row gutter={[8, 0]}>
                    {phaseFields.map((phaseField, index) => (
                      <>
                        <Col span={24}>
                          <Divider>
                            <Space>
                              <Button
                                type="link"
                                shape="circle"
                                size="small"
                                icon={<MinusCircleOutlined />}
                                onClick={() => remove(phaseField.name)}
                                style={{ verticalAlign: "baseline" }}
                              />

                              <Typography.Title
                                level={3}
                                style={{
                                  display: "inline-block",
                                  marginBottom: "0",
                                }}
                              >
                                {`Etapa ${index + 1}`}
                              </Typography.Title>
                            </Space>
                          </Divider>
                        </Col>

                        <Col span={24}>
                          <Form.Item
                            {...phaseField}
                            fieldKey={[phaseField.name, "text"]}
                            name={[phaseField.name, "text"]}
                            label="Etapa"
                            rules={[
                              { required: true, message: "Campo Obrigatório" },
                            ]}
                          >
                            <Input style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>

                        <Col span={24}>
                          <Form.Item
                            {...phaseField}
                            fieldKey={[phaseField.name, "developmentSite"]}
                            name={[phaseField.name, "developmentSite"]}
                            label="Onde será desenvolvida"
                            rules={[
                              { required: true, message: "Campo Obrigatório" },
                            ]}
                          >
                            <Input style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>

                        <Col span={24}>
                          <Form.Item
                            {...phaseField}
                            fieldKey={[phaseField.name, "developmentMode"]}
                            name={[phaseField.name, "developmentMode"]}
                            label="
                            Como será desenvolvida (indicar recursos de
                              infraestrutura necessários, tais como laboratório de
                              informática, laboratório específico, etc.)"
                            rules={[
                              { required: true, message: "Campo Obrigatório" },
                            ]}
                          >
                            <Input style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                          <Form.Item
                            {...phaseField}
                            fieldKey={[phaseField.name, "startDate"]}
                            name={[phaseField.name, "startDate"]}
                            label="Data de inicío"
                            rules={[
                              { required: true, message: "Campo Obrigatório" },
                            ]}
                          >
                            <MaskedInput
                              mask="11/11/1111"
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                          <Form.Item
                            {...phaseField}
                            fieldKey={[phaseField.name, "finalDate"]}
                            name={[phaseField.name, "finalDate"]}
                            label="Data de término"
                            rules={[
                              { required: true, message: "Campo Obrigatório" },
                            ]}
                          >
                            <MaskedInput
                              mask="11/11/1111"
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </Col>
                      </>
                    ))}
                  </Row>

                  <Row>
                    <Col span={24}>
                      <Button block type="dashed" onClick={() => add()}>
                        <PlusOutlined /> Adicionar etapa
                      </Button>
                    </Col>
                  </Row>
                </>
              )}
            </Form.List>
          </Col>
        </Row>
      </Form>
    </>
  );
};
