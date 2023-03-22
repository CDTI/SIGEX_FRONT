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
} from "antd";
import { EditOutlined } from "@ant-design/icons";

import { Category } from "../../../interfaces/category";
import {
  createCategory,
  changeCategoryStatus,
  updateCategory,
  getAllCategories,
} from "../../../services/category_service";
import Structure from "../../../components/layout/structure";

interface State {
  visible: boolean;
  category?: Category;
}

export const CreateCategory: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [initialState, setInitialState] = useState(0);
  const [form] = Form.useForm();
  const formModal = Form.useForm()[0];
  const [state, setState] = useState<State>({
    visible: false,
    category: undefined,
  });

  useEffect(() => {
    (async () => {
      const categories = await getAllCategories();
      setCategories(categories.slice(0, 5));
    })();
  }, [initialState]);

  const submitCategory = async (category: Category) => {
    category.isActive = false;
    const newCategory = await createCategory(category);
    notification.open({ message: newCategory.message });
    form.resetFields();
    setInitialState(initialState + 1);
  };

  const changeStatus = async (id: string) => {
    const category = await changeCategoryStatus(id);
    notification.open({ message: category.message });
    setInitialState(initialState + 1);
  };

  const changeEdit = (category: Category) => {
    formModal.setFieldsValue(category);
    setState({ visible: true, category: category });
  };

  const submitEdit = async (item: any) => {
    const categoryEdit = await updateCategory(item._id, item);
    formModal.resetFields();
    notification[categoryEdit.status]({ message: categoryEdit.message });
    setState({ visible: false, category: undefined });
    setInitialState(initialState + 1);
  };

  const onCancel = () => {
    formModal.resetFields();
    setState({ visible: false, category: undefined });
  };

  const modal = useMemo(
    () => (
      <Modal
        visible={state.visible}
        title="Editar categoria"
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
    [state, formModal, onCancel, submitEdit]
  );

  return (
    <Structure title="Categoria">
      {ReactDOM.createPortal(modal, document.getElementById("dialog-overlay")!)}

      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: "500px", width: "100%" }}
        onFinish={submitCategory}
      >
        <Form.Item
          name="name"
          label="Nome da categoria"
          rules={[{ required: true, message: "Campo Obrigatório" }]}
        >
          <Input placeholder="Insira o nome da categoria" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Cadastrar
          </Button>
        </Form.Item>
      </Form>

      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={categories}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Switch
                defaultChecked={item.isActive}
                onChange={(event) => changeStatus(item._id!)}
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
