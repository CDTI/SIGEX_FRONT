import React, { useState, useEffect, useCallback, useMemo } from "react";
import
{
  Form,
  Input,
  Select,
  Checkbox,
  InputNumber,
  Radio,
  Row,
  Col,
  Divider,
  Space,
  Button,
  Typography,
} from "antd";
import { FormInstance } from "antd/lib/form";
import { SelectValue } from "antd/lib/select";
import { RadioChangeEvent } from "antd/lib/radio";
import { MaskedInput } from "antd-mask-input";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

import { noticesKey, programsKey } from "..";

import { getProgramId, Program } from "../../../../../../interfaces/program";
import { Category, getCategoryId, isCategory } from "../../../../../../interfaces/category";
import { getNoticeId, isNotice, Notice, Schedule, Timetable } from "../../../../../../interfaces/notice";
import { Project } from "../../../../../../interfaces/project";
import { getActiveNoticesForUser } from "../../../../../../services/notice_service";
import { listPrograms } from "../../../../../../services/program_service";
import { useAuth } from "../../../../../../context/auth";

interface Props
{
  formController: FormInstance;
  initialValues?: Project;
}

export const MainDataForm: React.FC<Props> = (props) =>
{
  const { user } = useAuth();

  const [isProgramsLoading, setIsProgramsLoading] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);

  const [isNoticesLoading, setIsNoticesLoading] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [currentProjectType, setCurrentProjectType] = useState<
    | "extraCurricular"
    | "curricularComponent"
    | "common">("common");

  useEffect(() =>
  {
    (async () =>
    {
      setIsProgramsLoading(true);
      const programs = localStorage.getItem(programsKey) != null
        ? JSON.parse(localStorage.getItem(programsKey)!) as Program[]
        : (await listPrograms()).programs;
      setPrograms(programs);
      setIsProgramsLoading(false);

      setIsNoticesLoading(true);
      let notices = localStorage.getItem(noticesKey) != null
        ? JSON.parse(localStorage.getItem(noticesKey)!) as Notice[]
        : await getActiveNoticesForUser(user!._id!, true);
      setNotices(notices);
      setIsNoticesLoading(false);

      if (props.initialValues != null)
      {
        const projectNotice = isNotice(props.initialValues.notice)
          ? props.initialValues.notice
          : notices.find((n: Notice) => n._id === getNoticeId(props.initialValues!.notice))!;

        if (!notices.some((n: Notice) => n._id === getNoticeId(projectNotice)))
        {
          setIsNoticesLoading(true);
          notices = [...notices, projectNotice as Notice];
          setNotices(notices);
          setIsNoticesLoading(false);
        }

        const categories = projectNotice.timetables.map((t: Timetable) => t.category as Category);
        setCategories(categories);

        const projectCategory = isCategory(props.initialValues.category)
          ? props.initialValues.category
          : categories.find((c : Category) => c._id === getCategoryId(props.initialValues!.category))!;
        setSelectedCategory(projectCategory);

        setSchedule(projectNotice.timetables.find((t: Timetable) =>
          (t.category as Category)._id === getCategoryId(projectCategory))!.schedules);

        setCurrentProjectType(props.initialValues.typeProject);

        props.formController.setFieldsValue(
        {
          ...props.initialValues,
          category: projectCategory._id!,
          notice: projectNotice._id!,
          program: getProgramId(props.initialValues.program),
          secondSemester: props.initialValues.secondSemester.map((s: Schedule) => JSON.stringify(s))
        });
      }

      localStorage.setItem(noticesKey, JSON.stringify(notices));
      localStorage.setItem(programsKey, JSON.stringify(programs));
    })();
  }, [props.initialValues]);

  const populateCategories = useCallback((value: SelectValue) =>
  {
    setCategories(notices
      .find((n: Notice) => n._id === value)!.timetables
      .map((t: Timetable) => t.category as Category));
  }, [notices]);

  const changeSchedule = useCallback((value: SelectValue) =>
  {
    const timetables = notices.find((n: Notice) =>
      n._id === props.formController.getFieldValue("notice"))!.timetables;

    setSchedule(timetables.find((t: Timetable) => (t.category as Category)._id === value)!.schedules);
    setSelectedCategory(categories.find((c: Category) => c._id === value));
  }, [props.formController, categories, notices]);

  const toggleDisciplines = useCallback((ev: RadioChangeEvent) =>
  {
    const value = ev.target.value;
    setCurrentProjectType(value);
  }, []);

  return (
    <Form
      name="mainData"
      layout="vertical"
      form={props.formController}
    >
      <Row gutter={[8, 0]}>
        <Col span={24}>
          <Form.Item
            name="name"
            label="Nome do projeto"
            rules={
            [
              { required: true, message: "Campo Obrigatório" },
              { type: "string", max: 200, message: "O número máximo de caracteres foi extrapolado!" }
            ]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="description"
            label="Descrição"
            rules={
            [
              { required: true, message: "Campo Obrigatório" },
              { type: "string", max: 3000, message: "O número máximo de caracteres foi extrapolado!" }
            ]}
          >
            <Input.TextArea autoSize={{ minRows: 3, maxRows: 7 }} style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="program"
            label="Programa"
            rules={[{ required: true, message: "Campo Obrigatório" }]}
          >
            <Select
              loading={isProgramsLoading}
              options={programs.map((p: Program) => ({ label: p.name, value: p._id! }))}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="notice"
            label="Edital"
            rules={[{ required: true, message: "Campo Obrigatório" }]}
          >
            <Select
              loading={isNoticesLoading}
              options={notices.map((n: Notice) => ({ label: n.name, value: n._id! }))}
              style={{ width: "100%" }}
              onChange={populateCategories}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="category"
            label="Categoria"
            rules={[{ required: true, message: "Campo Obrigatório" }]}
          >
            <Select
              loading={isNoticesLoading}
              placeholder={categories.length === 0 ? "Selecione um edital" : ""}
              options={categories.map((c: Category) => ({ label: c.name, value: c._id! }))}
              disabled={categories.length === 0}
              style={{ width: "100%" }}
              onChange={changeSchedule}
            />
          </Form.Item>
        </Col>

        {selectedCategory != null && selectedCategory.name !== "Extensão específica do curso" && (
          <>
            <Col span={24}>
              <Form.Item
                name="secondSemester"
                label="Horários disponíveis"
              >
                <Checkbox.Group style={{ width: "100%" }}>
                  <Row>
                    {schedule.map((s: Schedule) => (
                      <Col key={`${s.location} - ${s.period} - ${s.day}ª feira`} span={24}>
                        <Checkbox value={JSON.stringify(s)}>
                          {s.location} - {s.period} - {`${s.day}ª feira`}
                        </Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="totalCH"
                label="Carga horária máxima que o professor pode assumir na extensão institucional"
                rules={[{ required: true, message: "Campo obrigatório" }]}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="maxClasses"
                label="Número máximo de turmas para este projeto"
                rules={[{ required: true, message: "Campo obrigatório" }]}
              >
                <InputNumber min={1} max={5} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </>
        )}

        {selectedCategory != null && selectedCategory.name === "Extensão específica do curso" && (
          <>
            <Col span={24}>
              <Form.Item
                name="typeProject"
                label="Tipo de Projeto"
                rules={[{ required: true, message: "Campo Obrigatório" }]}
              >
                <Radio.Group
                  buttonStyle="solid"
                  style={{ width: "100%" }}
                  onChange={toggleDisciplines}
                >
                  <Radio.Button value="curricularComponent">
                    Componente Curricular
                  </Radio.Button>

                  <Radio.Button value="extraCurricular">
                    Extra Curricular
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>

            {currentProjectType !== "common" && (
              <Col span={24}>
                <Form.List name="teachers">
                  {(teacherFields, { add, remove }) => (
                    <>
                      <Row gutter={[8, 0]}>
                        {teacherFields.map((teacherField, index) => (
                          <>
                            <Col span={24}>
                              <Divider>
                                <Space>
                                  <Button
                                    type="link"
                                    shape="circle"
                                    size="small"
                                    icon={<MinusCircleOutlined />}
                                    onClick={() => remove(teacherField.name)}
                                    style={{ verticalAlign: "baseline" }}
                                  />

                                  <Typography.Title
                                    level={3}
                                    style={{ display: "inline-block", marginBottom: "0" }}
                                  >
                                    {`Professor ${index + 1}`}
                                  </Typography.Title>
                                </Space>
                              </Divider>
                            </Col>

                            <Col xs={24} xl={8}>
                              <Form.Item
                                {...teacherField}
                                fieldKey={[teacherField.fieldKey, "name"]}
                                name={[teacherField.name, "name"]}
                                label="Nome"
                                rules={[{ required: true, message: "Campo Obrigatório"  }]}
                              >
                                <Input style={{ width: "100%" }} />
                              </Form.Item>
                            </Col>

                            <Col xs={24} xl={8}>
                              <Form.Item
                                {...teacherField}
                                fieldKey={[teacherField.fieldKey, "cpf"]}
                                name={[teacherField.name, "cpf"]}
                                label="CPF"
                                rules={[{ required: true, message: "Campo Obrigatório"  }]}
                              >
                                <MaskedInput mask="111.111.111-11" style={{ width: "100%" }} />
                              </Form.Item>
                            </Col>

                            <Col xs={24} xl={8}>
                              <Form.Item
                                {...teacherField}
                                fieldKey={[teacherField.fieldKey, "registration"]}
                                name={[teacherField.name, "registration"]}
                                label="Matrícula"
                                rules={[{ required: true, message: "Campo Obrigatório"  }]}
                              >
                                <Input style={{ width: "100%" }} />
                              </Form.Item>
                            </Col>

                            <Col xs={24} xl={currentProjectType === "extraCurricular" ? 8 : 12}>
                              <Form.Item
                                {...teacherField}
                                fieldKey={[teacherField.fieldKey, "email"]}
                                name={[teacherField.name, "email"]}
                                label="E-mail"
                                rules={[{ required: true, message: "Campo Obrigatório"  }]}
                              >
                                <Input type="email" style={{ width: "100%" }} />
                              </Form.Item>
                            </Col>

                            <Col xs={24} xl={currentProjectType === "extraCurricular" ? 8 : 12}>
                              <Form.Item
                                {...teacherField}
                                fieldKey={[teacherField.fieldKey, "phone"]}
                                name={[teacherField.name, "phone"]}
                                label="Telefone"
                                rules={[{ required: true, message: "Campo Obrigatório"  }]}
                              >
                                <MaskedInput mask="(11)11111-1111" style={{ width: "100%" }} />
                              </Form.Item>
                            </Col>

                            {currentProjectType === "extraCurricular" && (
                              <Col xs={24} xl={8}>
                                <Form.Item
                                  {...teacherField}
                                  fieldKey={[teacherField.fieldKey, "totalCH"]}
                                  name={[teacherField.name, "totalCH"]}
                                  label="Carga horária fora de sala"
                                  rules={[{ required: true, message: "Campo Obrigatório"  }]}
                                >
                                  <Input style={{ width: "100%" }} />
                                </Form.Item>
                              </Col>
                            )}
                          </>
                        ))}
                      </Row>

                      <Row gutter={[0, currentProjectType === "curricularComponent" ? 40 : 0]}>
                        <Col span={24}>
                          <Button
                            block
                            type="dashed"
                            onClick={() => add()}
                          >
                            <PlusOutlined /> Adicionar professor
                          </Button>
                        </Col>
                      </Row>
                    </>
                  )}
                </Form.List>
              </Col>
            )}

            {currentProjectType === "curricularComponent" && (
              <Col span={24}>
                <Form.List name="disciplines">
                  {(disciplineFields, { add, remove }) => (
                    <>
                      <Row gutter={[8, 0]}>
                        {disciplineFields.map((disciplineField) => (
                          <>
                            <Col xs={24} md={4} xl={2}>
                              <Form.Item label={<label></label>}>
                                <Button
                                  danger
                                  block
                                  type="primary"
                                  icon={<MinusCircleOutlined />}
                                  onClick={() => remove(disciplineField.name)}
                                />
                              </Form.Item>
                            </Col>

                            <Col xs={24} md={20} xl={22}>
                              <Form.Item
                                {...disciplineField}
                                fieldKey={[disciplineField.fieldKey, "name"]}
                                name={[disciplineField.name, "name"]}
                                label="Nome da disciplina"
                                rules={[{ required: true, message: "Campo Obrigatório" }]}
                              >
                                <Input style={{ width: "100%" }} />
                              </Form.Item>
                            </Col>
                          </>
                        ))}
                      </Row>

                      <Row>
                        <Col span={24}>
                          <Button
                            block
                            type="dashed"
                            onClick={() => add()}
                          >
                            <PlusOutlined /> Adicionar disciplina
                          </Button>
                        </Col>
                      </Row>
                    </>
                  )}
                </Form.List>
              </Col>
            )}
          </>
        )}
      </Row>
    </Form>
  );
};
