import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import { FormInstance } from "antd/lib/form";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

import { categoriesKey } from "..";

import { useHttpClient } from "../../../../../hooks/useHttpClient";
import { Category } from "../../../../../interfaces/category";
import { Timetable } from "../../../../../interfaces/notice";
import { getActiveCategoriesEndpoint } from "../../../../../services/endpoints/categories";

interface Props {
  formController: FormInstance;
  initialValues?: Timetable[];
}

const { Option } = Select;

export const TimetablesForm: React.FC<Props> = (props) => {
  const [shouldDisableButton, setShouldDisableButton] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const selectCategoriesRequester = useHttpClient();

  useEffect(() => {
    (async () => {
      const categories =
        localStorage.getItem(categoriesKey) != null
          ? (JSON.parse(localStorage.getItem(categoriesKey)!) as Category[])
          : await selectCategoriesRequester.send<Category[]>({
              method: "GET",
              url: getActiveCategoriesEndpoint(),
              cancellable: true,
            });

      setCategories(categories?.slice(0, 5) ?? []);

      localStorage.setItem(categoriesKey, JSON.stringify(categories));
    })();

    return () => {
      selectCategoriesRequester.halt();
    };
  }, [selectCategoriesRequester.halt, selectCategoriesRequester.send]);

  useEffect(() => {
    if (props.initialValues != null)
      props.formController.setFieldsValue({ timetables: props.initialValues });
  }, [props.formController, props.initialValues]);

  const addCategory = useCallback(
    (addFn: (v?: any, i?: number | undefined) => void) => {
      const categoryId: string =
        props.formController.getFieldValue("categorySelector");
      const timetables: Timetable[] =
        props.formController.getFieldValue("timetables");
      if (
        !(
          timetables?.some((tt: Timetable) => tt.category === categoryId) ??
          false
        )
      )
        addFn({
          category: categoryId,
          schedules: [
            { location: undefined, period: undefined, day: undefined },
          ],
        });

      props.formController.setFieldsValue({ categorySelector: undefined });
      setShouldDisableButton(true);
    },
    [props.formController]
  );

  const getCategoryName = useCallback(
    (index: number) => {
      const timetables: Timetable[] =
        props.formController.getFieldValue("timetables")!;
      const categoryId = timetables[index]?.category;
      return categories.find((c) => c._id === categoryId)?.name ?? "";
    },
    [categories, props.formController]
  );

  return (
    <Form name="timetables" layout="vertical" form={props.formController}>
      <Row justify="center">
        <Col span={24}>
          <Form.Item
            name="categorySelector"
            label="Categoria"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!getFieldValue("timetables")?.length)
                    return Promise.reject(
                      new Error("Adicione ao menos uma categoria")
                    );

                  if (
                    getFieldValue("timetables").find(
                      (v: any) => v.category === value
                    )
                  )
                    return Promise.reject(new Error("Categoria já adicionada"));

                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Select
              options={categories.map((c) => ({
                label: c.name,
                value: c._id!,
              }))}
              onChange={() => setShouldDisableButton(false)}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
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
                        onClick={() => addCategory(add)}
                      >
                        <PlusOutlined /> Confirmar categoria
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
                              style={{
                                display: "inline-block",
                                marginBottom: "0",
                              }}
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
                              <Row gutter={[8, 8]}>
                                {scheduleFields.map((scheduleField) => (
                                  <>
                                    <Col xs={24} md={3} xl={2}>
                                      <Form.Item label={<label></label>}>
                                        <Button
                                          danger
                                          block
                                          type="primary"
                                          icon={<MinusCircleOutlined />}
                                          onClick={() =>
                                            remove(scheduleField.name)
                                          }
                                        />
                                      </Form.Item>
                                    </Col>

                                    <Col xs={24} md={7}>
                                      <Form.Item
                                        {...scheduleField}
                                        label="Campus"
                                        name={[scheduleField.name, "location"]}
                                        fieldKey={[
                                          scheduleField.fieldKey,
                                          "location",
                                        ]}
                                        rules={[
                                          {
                                            required: true,
                                            message: "Campo obrigatório",
                                          },
                                        ]}
                                      >
                                        <Select>
                                          <Option value="Campus Ecoville">
                                            Campus Ecoville
                                          </Option>
                                          <Option value="Unidade Santos Andrade">
                                            Unidade Santos Andrade
                                          </Option>
                                          <Option value="Unidade Praça Osório">
                                            Unidade Praça Osório
                                          </Option>
                                          <Option value="Faculdade Positivo Londrina">
                                            Faculdade Positivo Londrina
                                          </Option>
                                          <Option value="Ponta Grossa">
                                            Ponta Grossa
                                          </Option>
                                        </Select>
                                      </Form.Item>
                                    </Col>

                                    <Col xs={24} md={7} xl={8}>
                                      <Form.Item
                                        {...scheduleField}
                                        label="Período do dia"
                                        name={[scheduleField.name, "period"]}
                                        fieldKey={[
                                          scheduleField.fieldKey,
                                          "period",
                                        ]}
                                        rules={[
                                          {
                                            required: true,
                                            message: "Campo obrigatório",
                                          },
                                        ]}
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
                                        fieldKey={[
                                          scheduleField.fieldKey,
                                          "day",
                                        ]}
                                        rules={[
                                          {
                                            required: true,
                                            message: "Campo obrigatório",
                                          },
                                        ]}
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
                                    <Button
                                      type="dashed"
                                      block
                                      onClick={() => add()}
                                    >
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
      </Row>
    </Form>
  );
};
