import React, { useState, useEffect, useContext } from "react";
import {
  Form,
  Input,
  Select,
  Checkbox,
  InputNumber,
  Row,
  Col,
  Divider,
  Space,
  Button,
  Typography,
} from "antd";
import { FormInstance } from "antd/lib/form";
import { MaskedInput } from "antd-mask-input";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

import { coursesKey, noticesKey, programsKey, usersKey } from "..";

import { useHttpClient } from "../../../../../../hooks/useHttpClient";
import { Campus, Course } from "../../../../../../interfaces/course";
import { Category } from "../../../../../../interfaces/category";
import {
  getNoticeId,
  isNotice,
  Notice,
  Schedule,
  Timetable,
} from "../../../../../../interfaces/notice";
import { Program } from "../../../../../../interfaces/program";
import { Project } from "../../../../../../interfaces/project";
import { User } from "../../../../../../interfaces/user";
import { getAllProgramsEndpoint } from "../../../../../../services/endpoints/programs";
import {
  getActiveNoticesEndpoint,
  getAllUsersEndpoint,
} from "../../../../../../services/endpoints/users";
import { Restricted } from "../../../../../../components/Restricted";
import { getAllCoursesEndpoint } from "../../../../../../services/endpoints/courses";
import { getAllCategories } from "../../../../../../services/category_service";
import { Discipline } from "../../../../../../interfaces/discipline";
import {
  getAllDisciplines,
  getDisciplinesByCourses,
} from "../../../../../../services/discipline_service";
import { AuthContext } from "../../../../../../context/auth";
import { DefaultLoading } from "../../../../../../components/defaultLoading";

interface Props {
  context: "admin" | "user";
  formController: FormInstance;
  initialValues?: Project;
}

function scheduleAsValue(s: Schedule) {
  if (s._id != null) delete s._id;

  return JSON.stringify(s);
}

export const MainForm: React.FC<Props> = (props) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const selectCoursesRequester = useHttpClient();
  const selectNoticesRequester = useHttpClient();
  const selectUsersRequester = useHttpClient();
  const selectProgramsRequester = useHttpClient();

  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState<User[]>([]);
  const [userCourses, setUserCourses] = useState<Course[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [courseDisciplines, setCourseDisciplines] = useState<Discipline[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<Notice>();
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline>();
  const [loading, setLoading] = useState<boolean>(true);

  const [currentProjectType, setCurrentProjectType] = useState<
    "extraCurricular" | "curricularComponent" | "common"
  >("common");

  useEffect(() => {
    (async () => {
      const courses = await selectCoursesRequester.send({
        method: "GET",
        url: getAllCoursesEndpoint(),
        cancellable: true,
      });
      setCourses(courses ?? []);
      const userCourses = courses.filter((course: Course) => {
        return user?.courses.some((c) => course._id === c);
      });
      setUserCourses(userCourses);

      let notices =
        localStorage.getItem(noticesKey) != null
          ? (JSON.parse(localStorage.getItem(noticesKey)!) as Notice[])
          : await selectNoticesRequester.send({
              method: "GET",
              url: getActiveNoticesEndpoint(),
              queryParams: new Map([["withPopulatedRefs", "true"]]),
              cancellable: true,
            });

      setNotices(notices ?? []);

      const programs =
        localStorage.getItem(programsKey) != null
          ? (JSON.parse(localStorage.getItem(programsKey)!) as Program[])
          : (
              await selectProgramsRequester.send({
                ...getAllProgramsEndpoint(),
                cancellable: true,
              })
            ).programs;

      setPrograms(programs ?? []);

      const users =
        localStorage.getItem(usersKey) != null
          ? (JSON.parse(localStorage.getItem(usersKey)!) as User[])
          : (
              await selectUsersRequester.send({
                method: "GET",
                url: getAllUsersEndpoint(),
                cancellable: true,
              })
            ).user;

      setUsers(users ?? []);

      const categories = await getAllCategories();
      setCategories(categories);

      const disciplines = await getAllDisciplines();
      setDisciplines(disciplines);

      if (props.initialValues != null) {
        delete props.initialValues._id;
        const projectNotice = isNotice(props.initialValues.notice)
          ? props.initialValues.notice
          : notices.find(
              (n: Notice) => n._id === getNoticeId(props.initialValues!.notice)
            )!;

        if (
          !notices.some((n: Notice) => n._id === getNoticeId(projectNotice))
        ) {
          notices = [...notices, projectNotice as Notice];
          setNotices(notices);
        }
        setSelectedNotice(projectNotice);

        const foundCategory = categories.find(
          (c: Category) => c._id === projectNotice.category
        );
        setSelectedCategory(foundCategory);

        const foundDiscipline = disciplines.find(
          (d: Discipline) => d._id === projectNotice.discipline
        );
        setSelectedDiscipline(foundDiscipline);

        if (projectNotice.timables) {
          setSchedule(
            projectNotice.timetables.find(
              (t: Timetable) =>
                (t.discipline as unknown as Discipline)._id ===
                projectNotice.discipline
            )!.schedules
          );
        }
        setCurrentProjectType(props.initialValues.typeProject);
        if (props.initialValues.course) {
          if (typeof props.initialValues.course === "string") {
            const disciplines = await getDisciplinesByCourses([
              props.initialValues.course,
            ]);
            setCourseDisciplines(disciplines);
          } else {
            const disciplines = await getDisciplinesByCourses(
              props.initialValues.course as unknown as Array<string>
            );
            setCourseDisciplines(disciplines);
          }
        }
        props.formController.setFieldsValue({
          ...props.initialValues,
          program: (props.initialValues.program as Program)._id,
          notice: (props.initialValues.notice as Notice)._id,
          author: (props.initialValues.author as User)._id,
          category: (props.initialValues.category as Category)._id,
          discipline: props.initialValues.discipline,
          firstSemester: [],
          secondSemester: [],
        });
      }
      localStorage.setItem(coursesKey, JSON.stringify(courses));
      localStorage.setItem(usersKey, JSON.stringify(users));
      localStorage.setItem(noticesKey, JSON.stringify(notices));
      localStorage.setItem(programsKey, JSON.stringify(programs));
      setLoading(false);
    })();
  }, [props.initialValues]);

  const populateCategory = () => {
    const foundNotice = notices.find(
      (notice: Notice) =>
        notice._id === props.formController.getFieldValue("notice")
    );
    const foundCategory = categories.find(
      (category: Category) => category._id === foundNotice?.category
    );
    setSelectedNotice(foundNotice);
    setSelectedCategory(foundCategory);
    props.formController.resetFields([
      "discipline",
      "secondSemester",
      "course",
      "teachers",
      "category",
    ]);
  };

  const getDisciplineName = (id: string) => {
    const discipline = disciplines.find((d: Discipline) => d._id === id);
    return discipline?.name!;
  };

  const selectDiscipline = (itemId: string) => {
    const foundDiscipline = disciplines.find(
      (discipline: Discipline) => discipline._id === itemId
    );
    const foundTimetable = selectedNotice?.timetables.find(
      (timetable: Timetable) => timetable.discipline === itemId
    );
    setSelectedDiscipline(foundDiscipline);
    setSchedule(foundTimetable?.schedules!);
  };

  const populateDisciplineByCourses = async (courses: Array<string>) => {
    const disciplines = await getDisciplinesByCourses(courses)
      .then((res) => {
        setCourseDisciplines(res);
        if (res.length < 1) {
          props.formController.resetFields(["discipline"]);
        }
      })
      .catch((error) => {
        console.log(error);
        setCourseDisciplines([]);
      });
  };

  return loading ? (
    <DefaultLoading></DefaultLoading>
  ) : (
    <Form
      name="main"
      layout="vertical"
      form={props.formController}
      initialValues={{ teachers: [undefined] }}
    >
      <Row gutter={[8, 0]}>
        {props.context === "admin" && (
          <Restricted allow="Administrador">
            <Col span={24}>
              <Form.Item name="author" label="Autor">
                <Select
                  showSearch
                  optionFilterProp="label"
                  loading={selectUsersRequester.inProgress}
                  options={users.map((u: User) => ({
                    label: u.name,
                    value: u._id!,
                  }))}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Restricted>
        )}

        <Col span={24}>
          <Form.Item
            name="name"
            label="Nome do projeto"
            rules={[
              { required: true, message: "Campo Obrigatório" },
              {
                type: "string",
                max: 200,
                message: "O número máximo de caracteres foi extrapolado!",
              },
            ]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="description"
            label="Descrição"
            rules={[
              { required: true, message: "Campo Obrigatório" },
              {
                type: "string",
                max: 3000,
                message: "O número máximo de caracteres foi extrapolado!",
              },
            ]}
          >
            <Input.TextArea
              autoSize={{ minRows: 3, maxRows: 7 }}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="program"
            label="Programa"
            rules={[{ required: true, message: "Campo Obrigatório" }]}
          >
            <Select
              loading={selectProgramsRequester.inProgress}
              options={programs.map((p: Program) => ({
                label: p.name,
                value: p._id!,
              }))}
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
              loading={selectNoticesRequester.inProgress}
              options={notices.map((n: Notice) => ({
                label: n.name,
                value: n._id!,
              }))}
              style={{ width: "100%" }}
              onChange={populateCategory}
            />
          </Form.Item>
        </Col>

        {selectedCategory != null && (
          <Col span={24}>
            <Form.Item
              name="category"
              label="Categoria"
              rules={[{ required: true }]}
            >
              <Select
                loading={selectNoticesRequester.inProgress}
                style={{ width: "100%" }}
                disabled={Boolean(!selectedCategory)}
                defaultActiveFirstOption
              >
                <Select.Option value={selectedCategory?._id!}>
                  {selectedCategory
                    ? selectedCategory.name
                    : "Escolha um edital"}
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
        )}

        {selectedCategory != null &&
          selectedCategory.name === "Curricular institucional" && (
            <>
              <Form.Item
                name="discipline"
                label="Disciplina"
                style={{ width: "100%" }}
                rules={[{ required: true, message: "Escolha uma disciplina" }]}
              >
                <Select
                  loading={selectNoticesRequester.inProgress}
                  style={{ width: "100%" }}
                  options={selectedNotice!.timetables.map((timetable) => ({
                    value: timetable.discipline,
                    key: timetable.discipline,
                    label: getDisciplineName(timetable.discipline),
                  }))}
                  onChange={(itemId) => {
                    selectDiscipline(String(itemId));
                  }}
                />
              </Form.Item>
            </>
          )}

        {selectedCategory?.name === "Curricular institucional" && (
          <>
            <Col span={24}>
              <Form.Item
                name="secondSemester"
                label="Horários disponíveis"
                rules={[{ required: true }]}
              >
                <Checkbox.Group style={{ width: "100%" }}>
                  <Row>
                    {schedule.map((s: Schedule) => (
                      <Col
                        key={`${s.location} - ${s.period} - ${s.day}ª feira`}
                        span={24}
                      >
                        <Checkbox value={scheduleAsValue(s)}>
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
                name="totalCHManha"
                label="Carga horária máxima que o professor pode assumir no periódo da manhã"
                rules={[{ required: true, message: "Campo obrigatório" }]}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="totalCHTarde"
                label="Carga horária máxima que o professor pode assumir no periódo da tarde"
                rules={[{ required: true, message: "Campo obrigatório" }]}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="totalCHNoite"
                label="Carga horária máxima que o professor pode assumir no periódo da noite"
                rules={[{ required: true, message: "Campo obrigatório" }]}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="totalCHManha"
                label="Carga horária máxima que o professor pode assumir no periódo da manhã"
                rules={[{ required: true, message: "Campo obrigatório" }]}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="totalCHTarde"
                label="Carga horária máxima que o professor pode assumir no periódo da tarde"
                rules={[{ required: true, message: "Campo obrigatório" }]}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="totalCHNoite"
                label="Carga horária máxima que o professor pode assumir no periódo da noite"
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

        {selectedCategory != null &&
          selectedCategory.name === "Curricular específica de curso" && (
            <>
              <Col span={24}>
                <Form.Item
                  name="course"
                  label="Cursos"
                  rules={[{ required: true, message: "Campo obrigatório" }]}
                >
                  <Select
                    mode="multiple"
                    loading={selectCoursesRequester.inProgress}
                    options={userCourses.map((c: Course) => ({
                      label: `${c.name} - ${(c.campus as Campus).name}`,
                      value: c._id!,
                    }))}
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      populateDisciplineByCourses(e as Array<string>);
                    }}
                  />
                </Form.Item>
              </Col>

              {courseDisciplines.length > 0 && (
                <Col span={24}>
                  <Form.Item
                    name="discipline"
                    label="Disciplina"
                    rules={[{ required: true, message: "Campo obrigatório" }]}
                  >
                    <Select
                      options={courseDisciplines.map((d: Discipline) => ({
                        label: d.name,
                        value: d._id!,
                      }))}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                  {courseDisciplines.length === 0 && (
                    <Typography style={{ color: "#ff4d4f" }}>
                      Os cursos selecionados não possuem uma ou mais disciplinas
                      em comum!
                    </Typography>
                  )}
                </Col>
              )}

              {(selectedCategory.name === "Curricular específica de curso" ||
                selectedCategory.name === "Extracurricular") && (
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
                                      style={{
                                        display: "inline-block",
                                        marginBottom: "0",
                                      }}
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
                                  rules={[
                                    {
                                      required: true,
                                      message: "Campo Obrigatório",
                                    },
                                  ]}
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
                                  rules={[
                                    {
                                      required: true,
                                      message: "Campo Obrigatório",
                                    },
                                  ]}
                                >
                                  <MaskedInput
                                    mask="111.111.111-11"
                                    style={{ width: "100%" }}
                                  />
                                </Form.Item>
                              </Col>

                              <Col xs={24} xl={8}>
                                <Form.Item
                                  {...teacherField}
                                  fieldKey={[
                                    teacherField.fieldKey,
                                    "registration",
                                  ]}
                                  name={[teacherField.name, "registration"]}
                                  label="Matrícula"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Campo Obrigatório",
                                    },
                                  ]}
                                >
                                  <Input style={{ width: "100%" }} />
                                </Form.Item>
                              </Col>

                              <Col
                                xs={24}
                                xl={
                                  currentProjectType === "extraCurricular"
                                    ? 8
                                    : 12
                                }
                              >
                                <Form.Item
                                  {...teacherField}
                                  fieldKey={[teacherField.fieldKey, "email"]}
                                  name={[teacherField.name, "email"]}
                                  label="E-mail"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Campo Obrigatório",
                                    },
                                  ]}
                                >
                                  <Input
                                    type="email"
                                    style={{ width: "100%" }}
                                  />
                                </Form.Item>
                              </Col>

                              <Col
                                xs={24}
                                xl={
                                  currentProjectType === "extraCurricular"
                                    ? 8
                                    : 12
                                }
                              >
                                <Form.Item
                                  {...teacherField}
                                  fieldKey={[teacherField.fieldKey, "phone"]}
                                  name={[teacherField.name, "phone"]}
                                  label="Telefone"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Campo Obrigatório",
                                    },
                                  ]}
                                >
                                  <MaskedInput
                                    mask="(11)11111-1111"
                                    style={{ width: "100%" }}
                                  />
                                </Form.Item>
                              </Col>

                              {currentProjectType === "extraCurricular" && (
                                <Col xs={24} xl={8}>
                                  <Form.Item
                                    {...teacherField}
                                    fieldKey={[
                                      teacherField.fieldKey,
                                      "totalCH",
                                    ]}
                                    name={[teacherField.name, "totalCH"]}
                                    label="Carga horária fora de sala"
                                    rules={[
                                      {
                                        required: true,
                                        message: "Campo Obrigatório",
                                      },
                                    ]}
                                  >
                                    <Input style={{ width: "100%" }} />
                                  </Form.Item>
                                </Col>
                              )}
                            </>
                          ))}
                        </Row>

                        <Row
                          gutter={[
                            0,
                            currentProjectType === "curricularComponent"
                              ? 16
                              : 0,
                          ]}
                        >
                          <Col span={24}>
                            <Button block type="dashed" onClick={() => add()}>
                              <PlusOutlined /> Adicionar professor
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
        {selectedCategory?.name === "Extracurricular" && (
          <>
            <Col span={24}>
              <Form.Item
                name="course"
                label="Cursos"
                rules={[{ required: true, message: "Campo obrigatório" }]}
              >
                <Select
                  mode="multiple"
                  loading={selectCoursesRequester.inProgress}
                  options={courses.map((c: Course) => ({
                    label: `${c.name} - ${(c.campus as Campus).name}`,
                    value: c._id!,
                  }))}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
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
                                  style={{
                                    display: "inline-block",
                                    marginBottom: "0",
                                  }}
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
                              rules={[
                                {
                                  required: true,
                                  message: "Campo Obrigatório",
                                },
                              ]}
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
                              rules={[
                                {
                                  required: true,
                                  message: "Campo Obrigatório",
                                },
                              ]}
                            >
                              <MaskedInput
                                mask="111.111.111-11"
                                style={{ width: "100%" }}
                              />
                            </Form.Item>
                          </Col>

                          <Col xs={24} xl={8}>
                            <Form.Item
                              {...teacherField}
                              fieldKey={[teacherField.fieldKey, "registration"]}
                              name={[teacherField.name, "registration"]}
                              label="Matrícula"
                              rules={[
                                {
                                  required: true,
                                  message: "Campo Obrigatório",
                                },
                              ]}
                            >
                              <Input style={{ width: "100%" }} />
                            </Form.Item>
                          </Col>

                          <Col
                            xs={24}
                            xl={
                              currentProjectType === "extraCurricular" ? 8 : 12
                            }
                          >
                            <Form.Item
                              {...teacherField}
                              fieldKey={[teacherField.fieldKey, "email"]}
                              name={[teacherField.name, "email"]}
                              label="E-mail"
                              rules={[
                                {
                                  required: true,
                                  message: "Campo Obrigatório",
                                },
                              ]}
                            >
                              <Input type="email" style={{ width: "100%" }} />
                            </Form.Item>
                          </Col>

                          <Col
                            xs={24}
                            xl={
                              currentProjectType === "extraCurricular" ? 8 : 12
                            }
                          >
                            <Form.Item
                              {...teacherField}
                              fieldKey={[teacherField.fieldKey, "phone"]}
                              name={[teacherField.name, "phone"]}
                              label="Telefone"
                              rules={[
                                {
                                  required: true,
                                  message: "Campo Obrigatório",
                                },
                              ]}
                            >
                              <MaskedInput
                                mask="(11)11111-1111"
                                style={{ width: "100%" }}
                              />
                            </Form.Item>
                          </Col>

                          {currentProjectType === "extraCurricular" && (
                            <Col xs={24} xl={8}>
                              <Form.Item
                                {...teacherField}
                                fieldKey={[teacherField.fieldKey, "totalCH"]}
                                name={[teacherField.name, "totalCH"]}
                                label="Carga horária fora de sala"
                                rules={[
                                  {
                                    required: true,
                                    message: "Campo Obrigatório",
                                  },
                                ]}
                              >
                                <Input style={{ width: "100%" }} />
                              </Form.Item>
                            </Col>
                          )}
                        </>
                      ))}
                    </Row>

                    <Row
                      gutter={[
                        0,
                        currentProjectType === "curricularComponent" ? 16 : 0,
                      ]}
                    >
                      <Col span={24}>
                        <Button block type="dashed" onClick={() => add()}>
                          <PlusOutlined /> Adicionar professor
                        </Button>
                      </Col>
                    </Row>
                  </>
                )}
              </Form.List>
            </Col>
          </>
        )}
      </Row>
    </Form>
  );
};
