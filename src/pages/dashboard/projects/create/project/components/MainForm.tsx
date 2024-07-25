import React, { useState, useEffect, useContext } from "react";
import {
  Form,
  Input,
  Select,
  Checkbox,
  InputNumber,
  Row,
  Col,
  Typography,
} from "antd";
import { FormInstance } from "antd/lib/form";

import { coursesKey, noticesKey, programsKey, usersKey } from "..";

import { useHttpClient } from "../../../../../../hooks/useHttpClient";
import { Campus, Course } from "../../../../../../interfaces/course";
import { Category } from "../../../../../../interfaces/category";
import {
  Notice,
  Schedule,
  Timetable,
} from "../../../../../../interfaces/notice";
import { Program } from "../../../../../../interfaces/program";
import { Project } from "../../../../../../interfaces/project";
import { User } from "../../../../../../interfaces/user";
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
import {
  getTeachers,
  getUserCoursesAndRoles,
} from "../../../../../../services/user_service";
import { listActivePrograms } from "../../../../../../services/program_service";
import { allOds } from "../../report/components/IntroductionForm";
import { getAllNotices } from "../../../../../../services/notice_service";
import { httpClient } from "../../../../../../services/httpClient";
import { getActiveCampi } from "../../../../../../services/campi_service";

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
  const [teachers, setTeachers] = useState<User[]>([]);
  const [userCourses, setUserCourses] = useState<Course[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [campus, setCampus] = useState<Campus[]>([]);
  const [courseDisciplines, setCourseDisciplines] = useState<Discipline[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<Notice>();
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline>();
  const [loading, setLoading] = useState<boolean>(true);
  const oldProjectsDate = new Date(2023, 3, 13);
  const projectsWithoutCampusDate = new Date(2023, 4, 5);

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
      const foundUserCourses = await getUserCoursesAndRoles(user?._id!);

      if (foundUserCourses.courses) {
        const userCourses = courses.filter((course: Course) => {
          return foundUserCourses.courses.some((c) => course._id === c);
        });
        setUserCourses(userCourses);
      }

      if (props.context === "user") {
        let notices = await selectNoticesRequester.send({
          method: "GET",
          url: getActiveNoticesEndpoint(),
          queryParams: new Map([["withPopulatedRefs", "true"]]),
          cancellable: true,
        });

        setNotices(notices ?? []);
      } else {
        const notices = await getAllNotices();

        setNotices(notices ?? []);
      }

      const programs = await listActivePrograms();

      setPrograms(programs ?? []);

      const campus = await getActiveCampi();

      setCampus(campus ?? []);

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

      const teachers = await getTeachers();
      setTeachers(teachers);

      const categories = await getAllCategories();
      setCategories(categories);

      const disciplines = await getAllDisciplines();
      setDisciplines(disciplines);

      if (props.initialValues != null) {
        const projectNotice = props.initialValues.notice as Notice;
        setSelectedNotice(projectNotice);
        delete props.initialValues._id;
        const foundCategory = categories.find(
          (c: Category) => c._id === projectNotice.category
        );
        setSelectedCategory(foundCategory);

        if (props.initialValues.discipline) {
          if (props.context === "admin") {
            const foundDiscipline = disciplines.find(
              (d: Discipline) => d._id === props.initialValues?.discipline._id
            );
            setSelectedDiscipline(foundDiscipline);
            if (projectNotice.timetables) {
              const foundTimetable = projectNotice?.timetables.find(
                (timetable: Timetable) =>
                  timetable.discipline === foundDiscipline?._id
              );
              setSchedule(
                foundTimetable?.schedules ?? props.initialValues.secondSemester
              );
            }
          } else {
            const foundDiscipline = disciplines.find(
              (d: Discipline) => d._id === props.initialValues?.discipline
            );
            setSelectedDiscipline(foundDiscipline);
            if (projectNotice.timetables) {
              const foundTimetable = projectNotice?.timetables.find(
                (timetable: Timetable) =>
                  timetable.discipline === foundDiscipline?._id
              );
              setSchedule(
                foundTimetable?.schedules ?? props.initialValues.secondSemester
              );
            }
          }
        }
        if (
          props.initialValues.course &&
          props.initialValues.course.length > 0
        ) {
          if (props.context === "user") {
            if (typeof props.initialValues.course === "string") {
              const disciplines = await getDisciplinesByCourses([
                props.initialValues.course,
              ]);
              setCourseDisciplines(disciplines);
            } else {
              const coursesID = (props.initialValues.course as Course[]).map(
                (c: Course) => c._id!
              );
              const disciplines = await getDisciplinesByCourses(coursesID);
              setCourseDisciplines(disciplines);
            }
          } else {
            if (typeof props.initialValues.course[0] === "string") {
              const disciplines = await getDisciplinesByCourses(
                props.initialValues.course as unknown as Array<string>
              );
              setCourseDisciplines(disciplines);
            } else {
              const coursesID = (props.initialValues.course as Course[]).map(
                (c: Course) => c._id!
              );
              const disciplines = await getDisciplinesByCourses(coursesID);
              setCourseDisciplines(disciplines);
            }
          }
        }
        props.formController.setFieldsValue({
          ...props.initialValues,
          teachers: props.initialValues.teachers
            ? props.initialValues.teachers.map(
                (teacher: User) => teacher._id
              ) ?? []
            : [],
          course:
            (props.initialValues?.course as Course[]).map(
              (c: Course) => c._id!
            ) ?? [],
          program: props.initialValues.program
            ? (props.initialValues.program as Program)._id
            : null,
          notice: props.initialValues.notice
            ? (props.initialValues.notice as Notice)._id
            : null,
          campus: props.initialValues.campus
            ? (props.initialValues.campus as Campus)._id
            : null,
          author: props.initialValues.author
            ? (props.initialValues.author as User)._id
            : null,
          category: props.initialValues.category
            ? (props.initialValues.category as Category)._id
            : null,
          discipline:
            props.context === "user"
              ? props.initialValues.discipline
                ? props.initialValues.discipline._id
                : null
              : props.initialValues.discipline
              ? props.initialValues.discipline._id
              : null,
          firstSemester:
            props.initialValues.firstSemester.map((s: Schedule) =>
              scheduleAsValue(s)
            ) ?? [],
          secondSemester:
            props.initialValues.secondSemester.map((s: Schedule) =>
              scheduleAsValue(s)
            ) ?? [],
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
    props.formController.setFieldsValue({ category: foundCategory?._id });
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
    props.formController.resetFields(["secondSemester"]);
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
    <Form name="main" layout="vertical" form={props.formController}>
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

        {selectedCategory !== undefined && (
          <>
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

            <Col span={24}>
              <Form.Item
                name="campus"
                label="Cidade de execução do projeto"
                rules={[
                  {
                    required: Boolean(
                      new Date(
                        selectedNotice?.projectExecutionYear!
                      ).getFullYear()! >= 2023
                    ),
                    message: "Campo Obrigatório",
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  options={campus.map((c: Campus) => ({
                    label: c.name,
                    value: c._id!,
                  }))}
                ></Select>
              </Form.Item>
            </Col>
          </>
        )}

        {selectedCategory !== undefined &&
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

        {selectedCategory !== undefined && (
          <>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Descrição geral do projeto (contexto, problemática, objetivo)"
                rules={[
                  { required: true, message: "Campo Obrigatório" },
                  {
                    type: "string",
                    max: 1500,
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
                name="researchTypeDescription"
                label="Que tipo de pesquisa será desenvolvida no projeto e como será realizada?"
                rules={[
                  {
                    required:
                      !props.initialValues ||
                      Boolean(
                        new Date(props.initialValues.createdAt!) >
                          oldProjectsDate
                      ),
                    message: "Campo Obrigatório",
                  },
                  {
                    type: "string",
                    max: 1500,
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
                name="studentsLearningDescription"
                label="Com que atores o estudante irá estabelecer relação dialógica e que tipo de aprendizado pode adquirir com essa relação?"
                rules={[
                  {
                    required:
                      !props.initialValues ||
                      Boolean(
                        new Date(props.initialValues.createdAt!) >
                          oldProjectsDate
                      ),
                    message: "Campo Obrigatório",
                  },
                  {
                    type: "string",
                    max: 1500,
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
                name="transformingActionsDescription"
                label="Que tipo de ações transformadoras podem surgir deste projeto?"
                rules={[
                  {
                    required:
                      !props.initialValues ||
                      Boolean(
                        new Date(props.initialValues.createdAt!) >
                          oldProjectsDate
                      ),
                    message: "Campo Obrigatório",
                  },
                  {
                    type: "string",
                    max: 1500,
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

            {selectedCategory !== undefined &&
              selectedCategory.name !== "Extracurricular" && (
                <Col span={24}>
                  <Form.Item
                    name="disciplineLearningObjectivesDescription"
                    label="Qual a aderência deste projeto com os objetivos de aprendizagem da componente curricular?"
                    rules={[
                      {
                        required:
                          !props.initialValues ||
                          Boolean(
                            new Date(props.initialValues.createdAt!) >
                              oldProjectsDate
                          ),
                        message: "Campo Obrigatório",
                      },
                      {
                        type: "string",
                        max: 1500,
                        message:
                          "O número máximo de caracteres foi extrapolado!",
                      },
                    ]}
                  >
                    <Input.TextArea
                      autoSize={{ minRows: 3, maxRows: 7 }}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              )}

            <Col span={24}>
              <Form.Item
                name="ods"
                label="Objetivos de Desenvolvimento Sustentável(ODS)"
                rules={[
                  {
                    required:
                      !props.initialValues ||
                      Boolean(
                        new Date(props.initialValues.createdAt!) >
                          oldProjectsDate
                      ),
                    message: "Campo Obrigatório",
                  },
                ]}
              >
                <Select
                  placeholder={"Selecione pelo menos um ODS"}
                  options={allOds.map((c: string) => ({ value: c }))}
                  mode="multiple"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </>
        )}

        {selectedCategory?.name === "Curricular institucional" &&
          schedule.length > 0 && (
            <>
              <Col span={24}>
                <Form.Item
                  name="secondSemester"
                  label="Horários disponíveis"
                  rules={[{ required: true }]}
                  initialValue={
                    props.initialValues
                      ? props.initialValues.secondSemester.map((s: Schedule) =>
                          scheduleAsValue(s)
                        )
                      : []
                  }
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
                  name="maxClasses"
                  label="Número máximo de turmas para este projeto"
                  rules={[{ required: true, message: "Campo obrigatório" }]}
                >
                  <InputNumber min={1} max={5} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </>
          )}

        {selectedCategory !== undefined &&
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
                    options={
                      props.context == "admin"
                        ? courses.map((c: Course) => ({
                            label: `${c.name} - ${(c.campus as Campus).name}`,
                            value: c._id!,
                          }))
                        : userCourses.map((c: Course) => ({
                            label: `${c.name} - ${(c.campus as Campus).name}`,
                            value: c._id!,
                          }))
                    }
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      populateDisciplineByCourses(e as Array<string>);
                    }}
                  />
                </Form.Item>
                {props.context == "user" && userCourses.length === 0 && (
                  <Typography style={{ color: "#ff4d4f" }}>
                    Nenhum curso para listar. Tente atualizar a página ou
                    contate um administrador!
                  </Typography>
                )}
              </Col>

              {selectedCategory !== undefined &&
                selectedCategory.name === "Curricular específica de curso" &&
                courseDisciplines.length > 0 && (
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
                  </Col>
                )}
              {courseDisciplines.length === 0 && (
                <Typography
                  style={{
                    color: "#ff4d4f",
                    margin: "-10px 0 10px 5px",
                  }}
                >
                  Os cursos selecionados não possuem uma ou mais disciplinas em
                  comum!
                </Typography>
              )}

              <Col span={24}>
                <Form.Item
                  name="teachers"
                  label="Professores"
                  rules={[{ required: true, message: "Campo obrigatório" }]}
                >
                  <Select
                    showSearch
                    showArrow
                    placeholder="Selecione o(s) professor(es)"
                    mode="multiple"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (String(option?.label) ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={teachers.map((p: User) => ({
                      key: p._id!,
                      label: p.name,
                      value: p._id!,
                    }))}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
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
              <Form.Item
                name="teachers"
                label="Professores"
                rules={[{ required: true, message: "Campo obrigatório" }]}
              >
                <Select
                  showSearch
                  showArrow
                  placeholder="Selecione o(s) professor(es)"
                  mode="multiple"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (String(option?.label) ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={teachers.map((p: User) => ({
                    key: p._id!,
                    label: p.name,
                    value: p._id!,
                  }))}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </>
        )}
      </Row>
    </Form>
  );
};
