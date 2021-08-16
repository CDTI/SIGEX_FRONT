import React, { useEffect, useState } from "react";
import { Button, Col, Divider, Form, Input, Row, Select, Space, Typography } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

import { Category } from "../../../../../interfaces/category";
import { Notice, Timetable } from "../../../../../interfaces/notice";
import { getActiveCategories } from "../../../../../services/category_service";

interface Props
{
  onBack(): void;
  onSubmit(notice: Notice): void;
  notice?: Notice;
}

const { Option } = Select;

export const AddCategories: React.FC<Props> = ({ notice, onBack, onSubmit }) =>
{
  const [shouldDisableButton, setShouldDisableButton] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  const [form] = Form.useForm();

  useEffect(() =>
  {
    (async () =>
    {
      setCategories(await getActiveCategories());
      if (notice !== undefined)
        form.setFieldsValue(notice);
    })();
  }, [form, notice]);

  const handleOnFinish = async (values: Notice) => onSubmit(values);

  const handleAddCategory = (add: (v?: any, i?: number | undefined) => void) =>
  {
    let categoryId: string = form.getFieldValue("categorySelector");
    if (!form.getFieldValue("timetables")?.find((tt: Timetable)=> tt.category === categoryId))
      add(
      {
        category: categoryId,
        schedules:
        [{
          location: undefined,
          period: undefined,
          day: undefined
        }]
      });

    form.setFieldsValue({ categorySelector: undefined });
    setShouldDisableButton(true);
  };

  const getCategoryName = (index: number) =>
  {
    let categoryId = form.getFieldValue("timetables")[index]?.category;
    return categories.find((c) => c._id === categoryId)?.name ?? "";
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleOnFinish}
    >
      <Row justify="center">
        <Col xs={24} xl={21} xxl={18}>
          <Form.Item
            name="categorySelector"
            label="Categoria"
            rules={[({ getFieldValue }) =>
            ({
              validator(_, value)
              {
                if (!getFieldValue("timetables")?.length)
                  return Promise.reject(new Error("Adicione ao menos uma categoria"));

                if (getFieldValue("timetables").find((v: any) => v.category === value))
                  return Promise.reject(new Error("Categoria já adicionada"));

                return Promise.resolve();
              }
            })]}
          >
            <Select
              options={categories.map((c) => ({ label: c.name, value: c._id! }))}
              onChange={() => setShouldDisableButton(false)}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} xl={21} xxl={18}>
          <Form.List name="timetables">
            {(categoryFields, { add, remove }) => (
              <>
                <Row>
                  <Col span={24}>
                    <Form.Item>
                      <Button
                        block
                        type="dashed"
                        disabled={shouldDisableButton}
                        onClick={() => handleAddCategory(add)}
                      >
                        <PlusOutlined /> Adicionar categoria
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  {categoryFields.map((categoryField, index) => (
                    <>
                      <Form.Item
                        {...categoryField}
                        name={[categoryField.name, "category"]}
                        fieldKey={[categoryField.fieldKey, "category"]}
                        style={{ display: "none" }}
                      >
                        <Input type="hidden" />
                      </Form.Item>

                      <Col span={24}>
                        <Divider>
                          <Space>
                            <Button
                              type="link"
                              shape="circle"
                              size="small"
                              icon={<MinusCircleOutlined />}
                              onClick={() => remove(categoryField.name)}
                              style={{ verticalAlign: "baseline" }}
                            />

                            <Typography.Title
                              level={3}
                              style={{ display: "inline-block", marginBottom: "0" }}
                            >
                              {getCategoryName(index)}
                            </Typography.Title>
                          </Space>
                        </Divider>
                      </Col>

                      <Col span={24}>
                        <Form.List name={[categoryField.name, "schedules"]}>
                          {(scheduleFields, { add, remove }) => (
                            <>
                              <Row gutter={[8,8]}>
                                {scheduleFields.map((scheduleField) => (
                                  <>
                                    <Col xs={24} md={3} xl={2}>
                                      <Form.Item label={<label></label>}>
                                        <Button
                                          danger
                                          block
                                          type="primary"
                                          icon={<MinusCircleOutlined />}
                                          onClick={() => remove(scheduleField.name)}
                                        />
                                      </Form.Item>
                                    </Col>

                                    <Col xs={24} md={7}>
                                      <Form.Item
                                        {...scheduleField}
                                        label="Campus"
                                        name={[scheduleField.name, "location"]}
                                        fieldKey={[scheduleField.fieldKey, "location"]}
                                        rules={[{ required: true, message: "Campo obrigatório" }]}
                                      >
                                        <Select>
                                          <Option value="Campus Ecoville">Campus Ecoville</Option>
                                          <Option value="Unidade Santos Andrade">Unidade Santos Andrade</Option>
                                          <Option value="Unidade Praça Osório">Unidade Praça Osório</Option>
                                          <Option value="Faculdade Positivo Londrina">Faculdade Positivo Londrina</Option>
                                        </Select>
                                      </Form.Item>
                                    </Col>

                                    <Col xs={24} md={7} xl={8}>
                                      <Form.Item
                                        {...scheduleField}
                                        label="Período do dia"
                                        name={[scheduleField.name, "period"]}
                                        fieldKey={[scheduleField.fieldKey, "period"]}
                                        rules={[{ required: true, message: "Campo obrigatório" }]}
                                      >
                                        <Select>
                                          <Option value="Manhã">Manhã</Option>
                                          <Option value="Tarde">Tarde</Option>
                                          <Option value="Noite">Noite</Option>
                                        </Select>
                                      </Form.Item>
                                    </Col>

                                    <Col xs={24} md={7}>
                                      <Form.Item
                                        {...scheduleField}
                                        label="Dia da semana"
                                        name={[scheduleField.name, "day"]}
                                        fieldKey={[scheduleField.fieldKey, "day"]}
                                        rules={[{ required: true, message: "Campo obrigatório" }]}
                                      >
                                        <Select>
                                          <Option value="2">2ª feira</Option>
                                          <Option value="3">3ª feira</Option>
                                          <Option value="4">4ª feira</Option>
                                          <Option value="5">5ª feira</Option>
                                          <Option value="6">6ª feira</Option>
                                        </Select>
                                      </Form.Item>
                                    </Col>
                                  </>
                                ))}
                              </Row>

                              <Row>
                                <Col span={24}>
                                  <Form.Item>
                                    <Button type="dashed" block onClick={() => add()}>
                                      <PlusOutlined /> Adicionar agenda
                                    </Button>
                                  </Form.Item>
                                </Col>
                              </Row>
                            </>
                          )}
                        </Form.List>
                      </Col>
                    </>
                  ))}
                </Row>
              </>
            )}
          </Form.List>
        </Col>

        <Col xs={24} xl={21} xxl={18}>
          <Row justify="space-between">
            <Button type="default" onClick={onBack}>
              Voltar
            </Button>

            <Button type="primary" htmlType="submit">
              Salvar
            </Button>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};
