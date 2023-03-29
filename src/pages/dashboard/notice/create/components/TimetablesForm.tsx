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
import { Discipline } from "../../../../../interfaces/discipline";
import { getDisciplinesByCategory } from "../../../../../services/discipline_service";

interface Props {
  formController: FormInstance;
  initialValues?: Timetable[];
}

const { Option } = Select;

export const TimetablesForm: React.FC<Props> = (props) => {
  const [shouldDisableButton, setShouldDisableButton] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);
  const [categories, setCategories] = useState<Category[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
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

      setCategories(categories?.slice(-3) ?? []);

      localStorage.setItem(categoriesKey, JSON.stringify(categories));
    })();

    return () => {
      selectCategoriesRequester.halt();
    };
  }, [selectCategoriesRequester.halt, selectCategoriesRequester.send]);

  useEffect(() => {
    if (props.initialValues != null)
      props.formController.setFieldsValue({ timetables: props.initialValues });
    console.log(props.initialValues);
  }, [props.formController, props.initialValues]);

  const addDiscipline = useCallback(
    (addFn: (v?: any, i?: number | undefined) => void) => {
      const disciplineId: string =
        props.formController.getFieldValue("disciplineSelector");
      const categoryId: string = props.formController.getFieldValue("category");
      const timetables: Timetable[] =
        props.formController.getFieldValue("timetables");
      if (
        !(
          timetables?.some((tt: Timetable) => tt.discipline === disciplineId) ??
          false
        )
      )
        addFn({
          category: categoryId,
          discipline: disciplineId,
          schedules: [
            { location: undefined, period: undefined, day: undefined },
          ],
        });
      props.formController.setFieldsValue({ disciplineSelector: undefined });
      setShouldDisableButton(true);
    },
    [props.formController]
  );

  const getDisciplines = async (categoryId: string) => {
    const disciplines = await getDisciplinesByCategory(categoryId)
      .then((res) => {
        setDisciplines(res);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        const category = categories.find((c: Category) => c._id === categoryId);
        setSelectedCategory(category);
      });
  };

  // const getCategoryName = (id: string) => {
  //   const categoryName = categories.find((category) => category._id === id);
  //   return categoryName?.name;
  // };

  const getDisciplineName = useCallback(
    (index: number) => {
      const timetables: Timetable[] =
        props.formController.getFieldValue("timetables")!;
      const disciplineId = timetables[index]?.discipline;
      return disciplines.find((c) => c._id === disciplineId)?.name ?? "";
    },
    [disciplines, props.formController]
  );

  return (
    <Form name="timetables" layout="vertical" form={props.formController}>
      <Row justify="center">
        <Col span={24}>
          <Form.Item
            name="category"
            label="Categoria"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Select
              options={categories.map((c) => ({
                key: c._id,
                label: c.name,
                value: c._id!,
              }))}
              onChange={(e) => {
                getDisciplines(String(e));
              }}
              style={{ width: "100%" }}
            />
          </Form.Item>
          {selectedCategory?.name === "Curricular institucional" && (
            <Form.Item
              name="disciplineSelector"
              label="Disciplina"
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!getFieldValue("timetables")?.length)
                      return Promise.reject(
                        new Error("Adicione ao menos uma disciplina")
                      );

                    if (
                      getFieldValue("timetables").find(
                        (v: any) => v.discipline === value
                      )
                    )
                      return Promise.reject(
                        new Error("Disciplina já adicionada")
                      );

                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Select
                options={disciplines.map((d) => ({
                  key: d._id,
                  label: d.name,
                  value: d._id!,
                }))}
                onChange={() => setShouldDisableButton(false)}
                style={{ width: "100%" }}
              />
            </Form.Item>
          )}
        </Col>

        {selectedCategory?.name === "Curricular institucional" && (
          <Col span={24}>
            <Form.List name="timetables">
              {(disciplineFields, { add, remove }) => (
                <>
                  <Row>
                    <Col span={24}>
                      <Form.Item>
                        <Button
                          block
                          type="dashed"
                          disabled={shouldDisableButton}
                          onClick={() => addDiscipline(add)}
                        >
                          <PlusOutlined /> Confirmar disciplina
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row>
                    {disciplineFields.map((disciplineField, index) => (
                      <>
                        <Form.Item
                          {...disciplineField}
                          name={[disciplineField.name, "discipline"]}
                          fieldKey={[disciplineField.fieldKey, "discipline"]}
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
                                onClick={() => remove(disciplineField.name)}
                                style={{ verticalAlign: "baseline" }}
                              />

                              <Typography.Title
                                level={3}
                                style={{
                                  display: "inline-block",
                                  marginBottom: "0",
                                }}
                              >
                                {getDisciplineName(index)}
                              </Typography.Title>
                            </Space>
                          </Divider>
                        </Col>

                        <Col span={24}>
                          <Form.List name={[disciplineField.name, "schedules"]}>
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
                                          name={[
                                            scheduleField.name,
                                            "location",
                                          ]}
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
        )}
      </Row>
    </Form>
  );
};
