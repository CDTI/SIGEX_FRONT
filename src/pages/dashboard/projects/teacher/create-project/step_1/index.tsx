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

import { IBasicInfo } from "..";
import DynamicDisciplinesFieldStep1 from "./dynamicDisciplinesFieldStep1";
import DynamicTechersFieldStep1 from "./dynamicTechersFieldStep1";

import { ContainerFlex } from "../../../../../../global/styles";
import { useAuth } from "../../../../../../context/auth";
import { IPrograms } from "../../../../../../interfaces/programs";
import { ICategory } from "../../../../../../interfaces/category";
import { INotice, ISchedule } from "../../../../../../interfaces/notice";
import { IProject } from "../../../../../../interfaces/project";
import { listPrograms } from "../../../../../../services/program_service";
import
{
  getCategoriesByNotice,
  getActiveCategories
} from "../../../../../../services/category_service";
import { getActiveNoticesForUser } from "../../../../../../services/notice_service";


const { Option } = Select;
const { TextArea } = Input;

export interface Props
{
  changeBasicInfo(values: IBasicInfo, firstSemester: ISchedule[], secondSemester: ISchedule[]): void;
  removeLocal(index: number, name: "firstSemester" | "secondSemester"): void;
  specific: boolean;
  commom: boolean;
  project: IProject;
}

export interface ICal
{
  location: string;
  period: string;
  day: number;
  checked?: boolean;
}

const BasicInfo: React.FC<Props> = ({ changeBasicInfo, project, removeLocal, specific, commom }) =>
{
  const compareChecked = (s: ISchedule, nameArray: "firstSemester" | "secondSemester") =>
  {
    const filterLocal = project[nameArray].find((e) => e.day === s.day && e.location === s.location && e.period === s.period) as
      | ICal
      | undefined;

    if (filterLocal === undefined)
      return false;

    delete filterLocal.checked;
    const compareA = Object.keys(s);
    const compareB = Object.keys(filterLocal);

    if (compareA.length !== compareB.length)
      return false;

    return compareA.some((key, index) => compareA[index] === compareB[index]);
  };

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [firstCalendar, setFirstCalendar] = useState<ICal[]>([]);
  const [secondCalendar, setSecondCalendar] = useState<ICal[]>([]);
  const [categoryId, setCategoryId] = useState(project.category);
  const [category, setCategory] = useState<ICategory | null>(null);
  const [programs, setPrograms] = useState<IPrograms[]>([]);
  const [notices, setNotices] = useState<INotice[]>([]);
  const [typeProject, setTypeProject] = useState<"extraCurricular" | "curricularComponent" | "common">("common");
  let firstSemester: ICal[] = [];
  const secondSemester: ICal[] = [];
  const { user } = useAuth();
  const [form] = Form.useForm();

  useEffect(() =>
  {
    (async () =>
    {
      const response = await listPrograms();
      setPrograms(response.programs);
      setNotices(await getActiveNoticesForUser(user?._id));
      setCategories(await getActiveCategories());
      if (categoryId)
        setCategory(categories.find((c) => c._id === categoryId) as ICategory);

      setTypeProject(project.typeProject);
      setSecondCalendar(project.secondSemester.map((s: ISchedule) =>
      ({
        ...s,
        checked: compareChecked(s, "secondSemester")
      })));
    })();
  }, []);

  const changeCalendar = (id: string) =>
  {
    setCategoryId(id);

    const cat = categories.find((e) => e._id === id);
    if (cat !== undefined)
      setCategory(cat);

    if (cat?.name !== "Extensão específica do curso")
      setTypeProject("common");

    firstCalendar.splice(0, firstCalendar.length);
    secondCalendar.splice(0, secondCalendar.length);
    const filterCalendar = notices
      .find((n: INotice) => n._id === form.getFieldValue("noticeId"))?.timetables
      .find((e) => e.category === id);

    if (filterCalendar !== undefined)
    {
      const first: ICal[] = [];
      const second: ICal[] = [];
      for (let e of filterCalendar.schedules)
      {
        const calendar = { day: e.day, period: e.period, location: e.location };

        first.push({ ...calendar, checked: compareChecked(calendar, "firstSemester") });
        second.push({ ...calendar, checked: compareChecked(calendar, "secondSemester") });
      }

      setFirstCalendar(first);
      setSecondCalendar(second);
    }
  };

  const submit = async (value: IBasicInfo) =>
  {
    console.log(value);
    value.typeProject = typeProject;
    const filterFirst = firstCalendar.filter((e) => e.checked);
    if (filterFirst !== undefined)
      for (let e of filterFirst)
        if (!compareChecked(e, "firstSemester"))
          firstSemester.push(e);

    const filterSecond = secondCalendar.filter((e) => e.checked);
    if (filterSecond !== undefined)
      for (let e of filterSecond)
        if (!compareChecked(e, "secondSemester"))
          secondSemester.push(e);

    if (category?.name === "Extensão específica do curso" && typeProject === "common")
      notification.open({ message: "Por favor, selecione a opção Componente Curricular ou Extra-Curricular!" });
    else
      changeBasicInfo(value, firstSemester, secondSemester);
  };

  const changeDaysFirst = async (e: CheckboxChangeEvent) =>
  {
    if (e.target.checked)
    {
      if (!compareChecked(e.target.value, "firstSemester"))
        if (firstSemester.findIndex((local) =>
            local.day === e.target.value.day &&
            local.location === e.target.value.location &&
            local.period === e.target.value.period) === -1)
          firstSemester.push(e.target.value);
    }
    else
    {
      const exist = firstSemester.findIndex((local) =>
        local.day === e.target.value.day &&
        local.location === e.target.value.location &&
        local.period === e.target.value.period);

      if (exist !== -1)
      {
        firstSemester.splice(exist, 1);
      }
      else
      {
        const exist2 = project.firstSemester.findIndex((local) =>
          local.day === e.target.value.day &&
          local.location === e.target.value.location &&
          local.period === e.target.value.period);

        if (exist2 !== -1)
        {
          removeLocal(exist2, "firstSemester");
          const indexCalendar = firstCalendar.findIndex((local) =>
            local.day === e.target.value.day &&
            local.location === e.target.value.location &&
            local.period === e.target.value.period);

          if (indexCalendar !== -1)
          {
            firstCalendar[indexCalendar].checked = false;
            setFirstCalendar(firstCalendar);
          }
        }
      }
    }
  };

  const changeDaysSecond = async (e: CheckboxChangeEvent) =>
  {
    if (e.target.checked)
    {
      if (!compareChecked(e.target.value, "secondSemester"))
        if (secondSemester.findIndex((local) =>
            local.day === e.target.value.day &&
            local.location === e.target.value.location &&
            local.period === e.target.value.period) === -1)
          secondSemester.push(e.target.value);
    }
    else
    {
      const exist = secondSemester.findIndex((local) =>
        local.day === e.target.value.day &&
        local.location === e.target.value.locaion &&
        local.period === e.target.value.period);

      if (exist !== -1)
      {
        secondSemester.splice(exist, 1);
      }
      else
      {
        const exist2 = project.secondSemester.findIndex((local) =>
          local.day === e.target.value.day &&
          local.location === e.target.value.location &&
          local.period === e.target.value.period);

        if (exist2 !== -1)
        {
          removeLocal(exist2, "secondSemester");
          const indexCalendar = secondCalendar.findIndex((local) =>
            local.day === e.target.value.day &&
            local.location === e.target.value.location &&
            local.period === e.target.value.period);

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
    // const value = e.target.value as "extraCurricular" | "curricularComponent";
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
        initialValues={project}
      >
        <Form.Item
          label="Edital"
          name="noticeId"
          rules={[{ required: true, message: "Campo Obrigatório" }]}
        >
          <Select onChange={changeNotice} placeholder="Selecione um edital">
            {notices?.map((e) =>
            {
              if (e._id !== undefined)
                return (<Option key={e._id} value={e._id}>{e.name}</Option>);
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label="Nome do projeto"
          name="name"
          rules={
          [
            { required: true, message: "Campo Obrigatório" },
            { max: 200, message: "Número de caracteres excedido" },
          ]}
        >
          <Input placeholder="Nome do projeto" />
        </Form.Item>

        <Form.Item label="Programa" name="programId" rules={[{ required: true, message: "Campo Obrigatório" }]}>
          <Select placeholder="Selecione um programa">
            {programs?.map((e) =>
            {
              if (e._id !== undefined)
                return (<Option key={e._id} value={e._id}>{e.name}</Option>);
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label="Descrição"
          name="description"
          rules={
          [
            { required: true, message: "Campo Obrigatório" },
            { max: 3000, message: "Número de caracteres excedido" },
          ]}
        >
          <TextArea placeholder="Descrição do projeto" />
        </Form.Item>

        <Form.Item label="Categoria" name="category" rules={[{ required: true, message: "Campo Obrigatório" }]}>
          <Select
            placeholder="Selecione uma categoria"
            onChange={changeCalendar}
          >
            {categories.map((e) => (<Option key={e._id} value={e._id}>{e.name}</Option>))}
          </Select>
        </Form.Item>

        {category?.name !== "Extensão específica do curso" && category !== null && (
          <>
            <Space style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {/*
                firstCalendar.length > 0 && (
                  <Form.Item label="Horários disponíveis 1º Semestre" name="firstSemester">
                    {firstCalendar.map((local, index) => (
                      <Checkbox key={index} value={local} onChange={changeDaysFirst} defaultChecked={local.checked}>
                        {local.name} - {local.turn} - {local.day}
                      </Checkbox>))}

                    {firstCalendar === null && <Typography>Selecione uma categoria</Typography>}
                  </Form.Item>
                )}
              */}

              {secondCalendar.length > 0 && (
                // <Form.Item label="Horários disponíveis 2º Semestre" name="secondSemester">

                <Form.Item label="Horários disponíveis" name="secondSemester">
                  {secondCalendar.map((local, index) => (
                    <Checkbox
                      style={{ display: "block" }}
                      key={index}
                      value={local}
                      onChange={changeDaysSecond}
                      defaultChecked={local.checked}
                    >
                      {local.location} - {local.period} - {`${local.day}ª feira`}
                    </Checkbox>))}

                  {secondCalendar === null && <Typography>Selecione uma categoria</Typography>}
                </Form.Item>)}
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
              </>)}
            </>)}

        {category?.name === "Extensão específica do curso" && (
          <>
            <Divider style={{ backgroundColor: "#333" }} />

            <Form.Item
              label="Tipo de Projeto"
              name="typeProject"
              rules={[{ required: true, message: "Campo Obrigatório" }]}
            >
              <Radio.Group onChange={changeTypeProject}>
                <Radio value="curricularComponent">Componente Curricular</Radio>
                <Radio value="extraCurricular">Extra Curricular</Radio>
              </Radio.Group>
            </Form.Item>
          </>)}

        {typeProject === "curricularComponent" && (
          <>
            <DynamicDisciplinesFieldStep1 />
            <DynamicTechersFieldStep1 typeProject={typeProject} />
            <Divider style={{ backgroundColor: "#333" }} />
          </>
        )}

        {typeProject === "extraCurricular" && (
          <>
            <DynamicTechersFieldStep1 typeProject={typeProject} />
          </>)}

        <Form.Item>
          <Button htmlType="submit" type="primary">
            Próximo
          </Button>
        </Form.Item>
      </Form>
    </ContainerFlex>
  );
};

export default BasicInfo;
