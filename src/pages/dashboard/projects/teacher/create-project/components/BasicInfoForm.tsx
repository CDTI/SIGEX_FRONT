import React, { useState, useEffect } from "react";
import
{
  Form,
  Input,
  Button,
  Select,
  Checkbox,
  Typography,
  InputNumber,
  Space,
  Radio,
  Divider,
  notification,
} from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";

import { DisciplinesFormList } from "./DisciplinesFormList";
import { TeachersFormList } from "./TeachersFormList";

import { Program } from "../../../../../../interfaces/program";
import { Category } from "../../../../../../interfaces/category";
import { Notice, Schedule, Timetable } from "../../../../../../interfaces/notice";
import { Discipline, Project, Teacher } from "../../../../../../interfaces/project";
import
{
  getCategoriesByNotice,
  getActiveCategories
} from "../../../../../../services/category_service";
import { getActiveNoticesForUser } from "../../../../../../services/notice_service";
import { listPrograms } from "../../../../../../services/program_service";
import { ContainerFlex } from "../../../../../../global/styles";
import { useAuth } from "../../../../../../context/auth";

export interface IBasicInfo
{
  name: string;
  description: string;
  firstSemester: Schedule[];
  secondSemester: Schedule[];
  totalCH: number;
  program: string;
  category: string;
  notice: string;
  typeProject: "common" | "extraCurricular" | "curricularComponent";
  disciplines: Discipline[];
  teachers: Teacher[];
  maxClasses: number;
}

export interface ICal
{
  location: string;
  period: string;
  day: number;
  checked?: boolean;
}

export interface Props
{
  changeBasicInfo(values: IBasicInfo, firstSemester: Schedule[], secondSemester: Schedule[]): void;
  removeLocal(index: number, name: "firstSemester" | "secondSemester"): void;
  project: Project;
  preSelectedNotice?: Notice;
}

const { TextArea } = Input;

export const BasicInfoForm: React.FC<Props> = (props) =>
{
  const [programs, setPrograms] = useState<Program[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState(props.project.category);
  const [category, setCategory] = useState<Category | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [firstCalendar, setFirstCalendar] = useState<ICal[]>([]);
  const [secondCalendar, setSecondCalendar] = useState<ICal[]>([]);
  const [typeProject, setTypeProject] = useState<"extraCurricular" | "curricularComponent" | "common">("common");
  const firstSemester: ICal[] = [];
  const secondSemester: ICal[] = [];
  const { user } = useAuth();
  const [form] = Form.useForm();

  const compareChecked = (s: Schedule, nameArray: "firstSemester" | "secondSemester") =>
  {
    const filterLocal = props.project[nameArray].find((ps: Schedule) =>
      ps.day === s.day
      && ps.location === s.location
      && ps.period === s.period);

    if (filterLocal === undefined)
      return false;

    const compareA = Object.keys(s);
    const compareB = Object.keys(filterLocal);

    if (compareA.length !== compareB.length)
      return false;

    return compareA.some((key, index) => compareA[index] === compareB[index]);
  };

  useEffect(() =>
  {
    (async () =>
    {
      const response = await listPrograms();
      setPrograms(response.programs);

      const notices = await getActiveNoticesForUser(user?._id);
      if (props.preSelectedNotice !== undefined
          && !notices.find((n: Notice) => n._id === props.preSelectedNotice?._id))
        notices.push(props.preSelectedNotice);
      setNotices(notices);

      setCategories(await getActiveCategories());
      if (categoryId)
        setCategory(categories.find((c) => c._id === categoryId) as Category);

      setTypeProject(props.project.typeProject);
      setSecondCalendar(props.project.secondSemester.map((s: Schedule) => (
      {
        ...s,
        checked: compareChecked(s, "secondSemester")
      })));
    })();
  }, []);

  const changeCalendar = (id: string) =>
  {
    setCategoryId(id);

    const cat = categories.find((c: Category) => c._id === id);
    if (cat !== undefined)
      setCategory(cat);

    if (cat?.name !== "Extensão específica do curso")
      setTypeProject("common");

    firstCalendar.splice(0, firstCalendar.length);
    secondCalendar.splice(0, secondCalendar.length);
    const filterCalendar = notices
      .find((n: Notice) => n._id === form.getFieldValue("notice"))?.timetables
      .find((t: Timetable) => t.category === id);

    if (filterCalendar !== undefined)
    {
      const first: ICal[] = [];
      const second: ICal[] = [];
      for (let s of filterCalendar.schedules)
      {
        const calendar = { day: s.day, period: s.period, location: s.location };

        first.push({ ...calendar, checked: compareChecked(calendar, "firstSemester") });
        second.push({ ...calendar, checked: compareChecked(calendar, "secondSemester") });
      }

      setFirstCalendar(first);
      setSecondCalendar(second);
    }
  };

  const submit = async (value: IBasicInfo) =>
  {
    value.typeProject = typeProject;
    const filterFirst = firstCalendar.filter((c: ICal) => c.checked);
    if (filterFirst !== undefined)
      for (let c of filterFirst)
        if (!compareChecked(c, "firstSemester"))
          firstSemester.push(c);

    const filterSecond = secondCalendar.filter((c: ICal) => c.checked);
    if (filterSecond !== undefined)
      for (let c of filterSecond)
        if (!compareChecked(c, "secondSemester"))
          secondSemester.push(c);

    if (category?.name === "Extensão específica do curso" && typeProject === "common")
      notification.open({ message: "Por favor, selecione a opção Componente Curricular ou Extra-Curricular!" });
    else
      props.changeBasicInfo(value, firstSemester, secondSemester);
  };

  // const changeDaysFirst = async (e: CheckboxChangeEvent) =>
  // {
  //   if (e.target.checked)
  //   {
  //     if (!compareChecked(e.target.value, "firstSemester"))
  //       if (firstSemester.findIndex((local) =>
  //           local.day === e.target.value.day &&
  //           local.location === e.target.value.location &&
  //           local.period === e.target.value.period) === -1)
  //         firstSemester.push(e.target.value);
  //   }
  //   else
  //   {
  //     const exist = firstSemester.findIndex((local) =>
  //       local.day === e.target.value.day &&
  //       local.location === e.target.value.location &&
  //       local.period === e.target.value.period);

  //     if (exist !== -1)
  //     {
  //       firstSemester.splice(exist, 1);
  //     }
  //     else
  //     {
  //       const exist2 = project.firstSemester.findIndex((local) =>
  //         local.day === e.target.value.day &&
  //         local.location === e.target.value.location &&
  //         local.period === e.target.value.period);

  //       if (exist2 !== -1)
  //       {
  //         removeLocal(exist2, "firstSemester");
  //         const indexCalendar = firstCalendar.findIndex((local) =>
  //           local.day === e.target.value.day &&
  //           local.location === e.target.value.location &&
  //           local.period === e.target.value.period);

  //         if (indexCalendar !== -1)
  //         {
  //           firstCalendar[indexCalendar].checked = false;
  //           setFirstCalendar(firstCalendar);
  //         }
  //       }
  //     }
  //   }
  // };

  const changeDaysSecond = async (ev: CheckboxChangeEvent) =>
  {
    if (ev.target.checked)
    {
      if (!compareChecked(ev.target.value, "secondSemester"))
        if (secondSemester.findIndex((local) =>
            local.day === ev.target.value.day &&
            local.location === ev.target.value.location &&
            local.period === ev.target.value.period) === -1)
          secondSemester.push(ev.target.value);
    }
    else
    {
      const exist = secondSemester.findIndex((local) =>
        local.day === ev.target.value.day &&
        local.location === ev.target.value.locaion &&
        local.period === ev.target.value.period);

      if (exist !== -1)
      {
        secondSemester.splice(exist, 1);
      }
      else
      {
        const exist2 = props.project.secondSemester.findIndex((local) =>
          local.day === ev.target.value.day &&
          local.location === ev.target.value.location &&
          local.period === ev.target.value.period);

        if (exist2 !== -1)
        {
          props.removeLocal(exist2, "secondSemester");
          const indexCalendar = secondCalendar.findIndex((local) =>
            local.day === ev.target.value.day &&
            local.location === ev.target.value.location &&
            local.period === ev.target.value.period);

          if (indexCalendar !== -1)
          {
            secondCalendar[indexCalendar].checked = false;
            setSecondCalendar(secondCalendar);
          }
        }
      }
    }
  };

  const changeTypeProject = (e: any) =>
  {
    setTypeProject(e.target.value);
  };

  const changeNotice = async (id: any) =>
  {
    setFirstCalendar([]);
    setSecondCalendar([]);
    setTypeProject("common");
    setCategories(await getCategoriesByNotice(id));
  };

  return (
    <ContainerFlex>
      <Form
        form={form}
        onFinish={submit}
        layout="vertical"
        style={{ width: "100%", maxWidth: "768px" }}
        initialValues={props.project}
      >
        <Form.Item
          name="notice"
          label="Edital"
          rules={[{ required: true, message: "Campo Obrigatório" }]}
        >
          <Select
            placeholder="Selecione um edital"
            options={notices?.map((n: Notice) => (
            {
              label: n.name,
              value: n._id!
            })) || []}
            onChange={changeNotice}
          />
        </Form.Item>

        <Form.Item
          name="name"
          label="Nome do projeto"
          rules={
          [
            { required: true, message: "Campo Obrigatório" },
            { max: 200, message: "Número de caracteres excedido" },
          ]}
        >
          <Input placeholder="Nome do projeto" />
        </Form.Item>

        <Form.Item
          name="program"
          label="Programa"
          rules={[{ required: true, message: "Campo Obrigatório" }]}
        >
          <Select
            placeholder="Selecione um programa"
            options={programs?.map((p: Program) => (
            {
              label: p.name,
              value: p._id!
            })) || []}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Descrição"
          rules={
          [
            { required: true, message: "Campo Obrigatório" },
            { max: 3000, message: "Número de caracteres excedido" },
          ]}
        >
          <TextArea placeholder="Descrição do projeto" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Categoria"
          rules={[{ required: true, message: "Campo Obrigatório" }]}
        >
          <Select
            placeholder="Selecione uma categoria"
            options={categories.map((c: Category) => (
            {
              label: c.name,
              value: c._id!
            })) || []}
            onChange={changeCalendar}
          />
        </Form.Item>

        {category !== null && category?.name !== "Extensão específica do curso" && (
          <>
            <Space style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {
                // firstCalendar.length > 0 && (
                //   <Form.Item label="Horários disponíveis 1º Semestre" name="firstSemester">
                //     {firstCalendar.map((local, index) => (
                //       <Checkbox key={index} value={local} onChange={changeDaysFirst} defaultChecked={local.checked}>
                //         {local.name} - {local.turn} - {local.day}
                //       </Checkbox>))}

                //     {firstCalendar === null && <Typography>Selecione uma categoria</Typography>}
                //   </Form.Item>
                // )}
              }

              {secondCalendar.length > 0 && (
                <Form.Item
                  name="secondSemester"
                  label="Horários disponíveis"
                >
                  {secondCalendar.map((local, index) => (
                    <Checkbox
                      style={{ display: "block" }}
                      key={index}
                      value={local}
                      onChange={changeDaysSecond}
                      defaultChecked={local.checked}
                    >
                      {local.location} - {local.period} - {`${local.day}ª feira`}
                    </Checkbox>
                  ))}

                  {secondCalendar === null && <Typography>Selecione uma categoria</Typography>}
                </Form.Item>
              )}
            </Space>

            {secondCalendar.length > 0 && (
              <>
                <Form.Item
                  label="Carga horária máxima que o professor pode assumir na extensão institucional"
                  name="totalCH"
                  rules={[{ required: true, message: "Campo obrigatório" }]}
                >
                  <InputNumber />
                </Form.Item>

                <Form.Item
                  label="Número máximo de turmas para este projeto"
                  name="maxClasses"
                  rules={[{ required: true, message: "Campo obrigatório" }]}
                >
                  <InputNumber min={1} max={5} defaultValue={1} />
                </Form.Item>
              </>
            )}
          </>
        )}

        {category?.name === "Extensão específica do curso" && (
          <>
            <Divider style={{ backgroundColor: "#333" }} />

            <Form.Item
              name="typeProject"
              label="Tipo de Projeto"
              rules={[{ required: true, message: "Campo Obrigatório" }]}
            >
              <Radio.Group onChange={changeTypeProject}>
                <Radio value="curricularComponent">Componente Curricular</Radio>
                <Radio value="extraCurricular">Extra Curricular</Radio>
              </Radio.Group>
            </Form.Item>
          </>
        )}

        {typeProject === "curricularComponent" && (
          <>
            <DisciplinesFormList />
            <TeachersFormList typeProject={typeProject} />
            <Divider style={{ backgroundColor: "#333" }} />
          </>
        )}

        {typeProject === "extraCurricular" && (
          <>
            <TeachersFormList typeProject={typeProject} />
          </>
        )}

        <Form.Item>
          <Button htmlType="submit" type="primary">
            Próximo
          </Button>
        </Form.Item>
      </Form>
    </ContainerFlex>
  );
};
