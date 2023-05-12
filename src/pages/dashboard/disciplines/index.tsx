import React, { useEffect, useState, useMemo } from "react";
import ReactDOM from "react-dom";
import {
  Form,
  Input,
  Button,
  List,
  Typography,
  notification,
  Modal,
  Space,
  Switch,
  Select,
} from "antd";
import { EditOutlined } from "@ant-design/icons";

import { Category } from "../../../interfaces/category";
import { Discipline } from "../../../interfaces/discipline";

import { getAllCategories } from "../../../services/category_service";

import { getAllCoursesEndpoint } from "../../../services/endpoints/courses";

import {
  createDiscipline,
  changeDisciplineStatus,
  updateDiscipline,
  getDisciplinesByCategory,
} from "../../../services/discipline_service";
import Structure from "../../../components/layout/structure";
import { useHttpClient } from "../../../hooks/useHttpClient";
import { Course } from "../../../interfaces/course";

interface State {
  visible: boolean;
  discipline?: Discipline;
}

export const CreateDiscipline: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [initialState, setInitialState] = useState(0);
  const [form] = Form.useForm();
  const formModal = Form.useForm()[0];
  const [state, setState] = useState<State>({
    visible: false,
    discipline: undefined,
  });
  const getCoursesRequester = useHttpClient();

  useEffect(() => {
    (async () => {
      const foundCategories = await getAllCategories();
      setCategories(foundCategories);
      const courses = await getCoursesRequester.send({
        method: "GET",
        url: getAllCoursesEndpoint(),
        cancellable: true,
      });
      setCourses(courses);
    })();
    if (selectedCategory) {
      getDisciplinesCategory(selectedCategory);
    }
  }, [initialState]);

  const submitDiscipline = async (discipline: Discipline) => {
    discipline.category = selectedCategory?._id!;
    const newDiscipline = await createDiscipline(discipline)
      .then((res) => {
        notification.open({ message: "Disciplina criada com sucesso!" });
        form.resetFields();
        setInitialState(initialState + 1);
      })
      .catch((error) => {
        console.log(error);
        notification.error({
          message: "Algo deu errado, tente novamente mais tarde!",
        });
      });
  };

  const getDisciplinesById = async (category: string) => {
    const foundDisciplines = await getDisciplinesByCategory(category);
    setDisciplines(foundDisciplines);
  };

  const getDisciplinesCategory = async (category: Category) => {
    const foundDisciplines = await getDisciplinesByCategory(category._id!);
    setDisciplines(foundDisciplines);
  };

  const changeStatus = async (id: string) => {
    const discipline = await changeDisciplineStatus(id);
    notification.open({ message: discipline.message });
    setInitialState(initialState + 1);
  };

  const changeEdit = (discipline: Discipline) => {
    formModal.setFieldsValue(discipline);
    setState({ visible: true, discipline: discipline });
  };

  const submitEdit = async (item: any) => {
    const disciplineEdit = await updateDiscipline(item._id, item);
    formModal.resetFields();
    notification[disciplineEdit.status]({ message: disciplineEdit.message });
    setState({ visible: false, discipline: undefined });
    setInitialState(initialState + 1);
  };

  const getCategory = (id: string) => {
    const category = categories.find((c: Category) => c._id === id);
    return category;
  };

  const onCancel = () => {
    formModal.resetFields();
    setState({ visible: false, discipline: undefined });
  };

  const modal = useMemo(
    () => (
      <Modal
        visible={state.visible}
        title="Editar disciplina"
        footer={[]}
        onCancel={onCancel}
      >
        <Form onFinish={submitEdit} form={formModal}>
          <Form.Item name="_id">
            <Input style={{ display: "none" }} />
          </Form.Item>

          <Form.Item name="name" label="Nome">
            <Input />
          </Form.Item>

          {selectedCategory?.name === "Curricular específica de curso" && (
            <Form.Item name="courses" label="Cursos">
              <Select
                mode="multiple"
                allowClear
                placeholder="Selecione os cursos"
                options={courses.map((course: Course) => ({
                  key: course._id!,
                  value: course._id!,
                  label: `${course.name} - ${course.campus.name}`,
                }))}
              ></Select>
            </Form.Item>
          )}

          <Form.Item>
            <Space>
              <Button type="primary" onClick={onCancel}>
                Cancelar
              </Button>

              <Button htmlType="submit" type="primary">
                Atualizar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      // eslint-disable-next-line react-hooks/exhaustive-deps
    ),
    [state, formModal, submitEdit]
  );

  return (
    <Structure title="Disciplinas">
      {ReactDOM.createPortal(modal, document.getElementById("dialog-overlay")!)}

      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: "500px", width: "100%" }}
        onFinish={submitDiscipline}
      >
        <Form.Item>
          <Typography>Selecione uma categoria</Typography>
          <Select
            options={categories.map((c) => ({
              key: c._id!,
              value: c._id!,
              label: c.name,
            }))}
            onSelect={(e) => {
              setSelectedCategory(getCategory(String(e))!);
              getDisciplinesById(String(e));
            }}
          ></Select>
        </Form.Item>
        {selectedCategory && (
          <>
            {selectedCategory.name === "Curricular específica de curso" && (
              <Form.Item name="courses" label="Cursos">
                <Select
                  showSearch
                  showArrow
                  mode="multiple"
                  allowClear
                  placeholder="Selecione os cursos"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (String(option?.label) ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  style={{ width: "100%" }}
                  options={courses.map((course: Course) => ({
                    key: course._id!,
                    value: course._id!,
                    label: `${course.name} - ${course.campus.name}`,
                  }))}
                ></Select>
              </Form.Item>
            )}

            <Form.Item
              name="name"
              label="Nome da disciplina"
              rules={[{ required: true, message: "Campo Obrigatório" }]}
            >
              <Input placeholder="Insira o nome da disciplina" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Cadastrar
              </Button>
            </Form.Item>
          </>
        )}
      </Form>

      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={disciplines}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Switch
                defaultChecked={item.isActive}
                onChange={(event) => {
                  changeStatus(item._id!);
                }}
              />,

              <Button
                onClick={() => changeEdit(item)}
                style={{ color: "#333" }}
              >
                Editar <EditOutlined />
              </Button>,
            ]}
          >
            <Typography>{item.name}</Typography>
          </List.Item>
        )}
      />
    </Structure>
  );
};
