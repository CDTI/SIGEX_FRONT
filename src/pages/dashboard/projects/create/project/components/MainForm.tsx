import React, { useState, useEffect, useCallback } from "react";
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
import { RadioChangeEvent } from "antd/lib/radio";
import { SelectValue } from "antd/lib/select";
import { MaskedInput } from "antd-mask-input";
import { MinusCircleOutlined, PlusOutlined, PlusCircleOutlined } from "@ant-design/icons";

import { coursesKey, noticesKey, programsKey, usersKey } from "..";

import { useHttpClient } from "../../../../../../hooks/useHttpClient";
import { Campus, Course, getCourseId } from "../../../../../../interfaces/course";
import { Category, getCategoryId, isCategory } from "../../../../../../interfaces/category";
import { getNoticeId, isNotice, Notice, Schedule, Timetable } from "../../../../../../interfaces/notice";
import { getProgramId, Program } from "../../../../../../interfaces/program";
import { Project } from "../../../../../../interfaces/project";
import { getUserId, User } from "../../../../../../interfaces/user";
import { getAllProgramsEndpoint } from "../../../../../../services/endpoints/programs";
import
{
  getActiveNoticesEndpoint,
  getAllUsersEndpoint,
  getAssociatedCoursesEndpoint
} from "../../../../../../services/endpoints/users";
import { Restricted } from "../../../../../../components/Restricted";
import Paragraph from "antd/lib/typography/Paragraph";

const { Link } = Typography;

interface Props
{
  context: "admin" | "user";
  formController: FormInstance;
  initialValues?: Project;
}

function scheduleAsValue(s: Schedule)
{
  if (s._id != null)
    delete s._id;

  return JSON.stringify(s);
}

export const MainForm: React.FC<Props> = (props) =>
{
  const [courses, setCourses] = useState<Course[]>([]);
  const selectCoursesRequester = useHttpClient();

  const [users, setUsers] = useState<User[]>([]);
  const selectUsersRequester = useHttpClient();

  const [programs, setPrograms] = useState<Program[]>([]);
  const selectProgramsRequester = useHttpClient();
  const [ midiaLink , setMidiaLink ] = useState<string>('');
  const [ midiaLinks, setMidiaLinks ] = useState<Array<string>>([]);
  const [selectedOds, setSelectedOds] = useState<Array<string>>([])
  const [notices, setNotices] = useState<Notice[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const selectNoticesRequester = useHttpClient();

  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [currentProjectType, setCurrentProjectType] = useState<
    | "extraCurricular"
    | "curricularComponent"
    | "common">("common");

  useEffect(() =>
  {
    (async () =>
    {
      const courses = localStorage.getItem(coursesKey) != null
        ? JSON.parse(localStorage.getItem(coursesKey)!) as Course[]
        : await selectCoursesRequester.send(
          {
            method: "GET",
            url: getAssociatedCoursesEndpoint(),
            queryParams: new Map([["withPopulatedRefs", "true"]]),
            cancellable: true
          });

      setCourses(courses ?? []);

      let notices = localStorage.getItem(noticesKey) != null
        ? JSON.parse(localStorage.getItem(noticesKey)!) as Notice[]
        : await selectNoticesRequester.send(
          {
            method: "GET",
            url: getActiveNoticesEndpoint(),
            queryParams: new Map([["withPopulatedRefs", "true"]]),
            cancellable: true
          });

      setNotices(notices ?? []);

      const programs = localStorage.getItem(programsKey) != null
        ? JSON.parse(localStorage.getItem(programsKey)!) as Program[]
        : (await selectProgramsRequester.send(
          {
            ...getAllProgramsEndpoint(),
            cancellable: true
          })).programs;

      setPrograms(programs ?? []);

      const users = localStorage.getItem(usersKey) != null
        ? JSON.parse(localStorage.getItem(usersKey)!) as User[]
        : (await selectUsersRequester.send(
          {
            method: "GET",
            url: getAllUsersEndpoint(),
            cancellable: true
          })).user;

      setUsers(users ?? []);

      if (props.initialValues != null)
      {
        const projectNotice = isNotice(props.initialValues.notice)
          ? props.initialValues.notice
          : notices.find((n: Notice) => n._id === getNoticeId(props.initialValues!.notice))!;

        if (!notices.some((n: Notice) => n._id === getNoticeId(projectNotice)))
        {
          notices = [...notices, projectNotice as Notice];
          setNotices(notices);
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
          author: getUserId(props.initialValues.author),
          course: getCourseId(props.initialValues.course),
          category: projectCategory._id!,
          notice: projectNotice._id!,
          ods: selectedOds,
          midiaLinks: midiaLinks,
          program: getProgramId(props.initialValues.program),
          secondSemester: props.initialValues.secondSemester.map(scheduleAsValue)
        });
      }
      localStorage.setItem(coursesKey, JSON.stringify(courses));
      localStorage.setItem(usersKey, JSON.stringify(users));
      localStorage.setItem(noticesKey, JSON.stringify(notices));
      localStorage.setItem(programsKey, JSON.stringify(programs));
    })();
  }, [props.initialValues]);

  const handleOdsSelection = (values: string[]) => {
    setSelectedOds(values);
  }

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

  const handleAddMidiaLink = () => {
    setMidiaLinks([...midiaLinks, midiaLink])
  }
  console.log(midiaLinks)

  return(
    <Form
      name="main"
      layout="vertical"
      form={props.formController}
    >
      <Row gutter={[8, 0]}>
        {props.context === "admin" && (
          <Restricted allow="Administrador">
            <Col span={24}>
              <Form.Item
                name="author"
                label="Autor"
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  loading={selectUsersRequester.inProgress}
                  options={users.map((u: User) => ({ label: u.name, value: u._id! }))}
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
              loading={selectProgramsRequester.inProgress}
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
              loading={selectNoticesRequester.inProgress}
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
              loading={selectNoticesRequester.inProgress}
              placeholder={categories.length === 0 ? "Selecione um edital" : ""}
              options={categories.map((c: Category) => ({ label: c.name, value: c._id! }))}
              disabled={categories.length === 0}
              style={{ width: "100%" }}
              onChange={changeSchedule}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="ods"
            label="Objetivos de Desenvolvimento Sustentável(ODS)"
            rules={[{ required: true, message: "Campo Obrigatório" }]}
          >
            <Select
              loading={selectNoticesRequester.inProgress}
              placeholder={categories.length === 0 ? "Selecione pelo menos um ODS" : ""}
              options={allOds.map((c: string) => ({ value: c }))}
              mode="multiple"
              style={{ width: "100%" }}
              onChange={handleOdsSelection}
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
                  label={index === 0 ? "Links" : ""}
                  required={false}
                  key={field.key}
                >
                  <Form.Item
                    {...field}
                    validateTrigger={["onChange", "onBlur"]}
                    noStyle
                  >
                    <Input
                      placeholder="Link para o post"
                      style={{
                        width: "100%"
                      }}
                    />
                  </Form.Item>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined
                      style={{paddingLeft: '12px'}}
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
                    width: "100%"
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


      {/*   <Col span={24}>
          <Form.Item
            name="midiaLinks"
            label="Deseja adicicionar links de mídias onde foram divulgados os projetos?"
            style={{marginBottom: '0px'}}
          >
            <Input
              value={midiaLinks}
              style={{ width: "80%", marginRight: '24px' }}
              onChange={(e) => setMidiaLink(e.target.value)}
            />
          </Form.Item>
          <Button
            type="link"
            size="large"
            onClick={handleAddMidiaLink}
            icon={<PlusCircleOutlined  style={{fontSize: '24px', paddingTop: '6px'}} />}
          />
          <Col style={{marginTop: '24px'}}>
            {midiaLinks.map((midiaLink, index) => {
              return (
                <Paragraph>
                  Link {index}:
                  <a style={{paddingLeft: '8px'}} target="_blank" href={midiaLink}>{midiaLink}</a>
                </Paragraph>
              )
            })}
          </Col>
        </Col> */}

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
                        <Checkbox
                          value={scheduleAsValue(s)}
                        >
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
                name="course"
                label="Curso"
                rules={[{ required: true, message: "Campo obrigatório" }]}
              >
                <Select
                  loading={selectCoursesRequester.inProgress}
                  options={courses.map((c: Course) =>
                  ({
                    label: `${c.name} - ${(c.campus as Campus).name}`,
                    value: c._id!
                  }))}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

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

                      <Row gutter={[0, currentProjectType === "curricularComponent" ? 16 : 0]}>
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
                <Row gutter={[0, 16]}>
                  <Divider />
                </Row>

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

const allOds = [
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
"Parcerias e Meios de Implementação"
]