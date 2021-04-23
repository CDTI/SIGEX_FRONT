import React, { useEffect, useMemo, useState } from "react";
import Structure from "../../../components/layout/structure";
import { IRegistrationPeriod } from "../../../interfaces/registrationPeriod";
import {
  getAllPeriods,
  createRegistrationPeriod,
  changeStatusRegistrationPeriod,
  updatePeriod,
} from "../../../services/registrationPeriod_service";
import { Button, Form, Input, List, Modal, notification, Select, Space, Switch, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { ICategory } from "../../../interfaces/category";
import { listCategoriesByPeriod, listCategoriesDashboard } from "../../../services/category_service";

const { Option } = Select;

interface State {
  visible: boolean;
  period: IRegistrationPeriod | undefined;
  category?: ICategory | undefined;
}

const RegistrationPeriod: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [periods, setPeriods] = useState<IRegistrationPeriod[]>([]);
  const [form] = Form.useForm();
  const [initialState, setInitialState] = useState(0);
  const formModal = Form.useForm()[0];
  const [state, setState] = useState<State>({
    visible: false,
    period: undefined,
    category: undefined,
  });

  useEffect(() => {
    getAllPeriods().then((allPeriods) => {
      setPeriods(allPeriods);
      listCategoriesDashboard().then((loadCategories) => {
        setCategories(loadCategories);
      });
    });
  }, [initialState]);

  const changeStatus = async (id: string) => {
    const period = await changeStatusRegistrationPeriod(id);
    notification.open({
      message: period.message,
    });
    setInitialState(initialState + 1);
  };

  const submitPeriod = async (period: IRegistrationPeriod) => {
    period.isActive = false;
    const newCategory = await createRegistrationPeriod(period);
    notification.open({
      message: newCategory.message,
    });
    form.resetFields();
    setInitialState(initialState + 1);
  };

  const changeEdit = (period: IRegistrationPeriod) => {
    listCategoriesByPeriod(period._id).then((categories) => {
      setCategories(categories);
      formModal.setFieldsValue(period);
      setState({ visible: true, period: period });
    });
  };

  const submitEdit = async (item: any) => {
    const periodEdit = await updatePeriod(item);
    formModal.resetFields();
    notification[periodEdit.status]({ message: periodEdit.message });
    setState({ visible: false, period: undefined });
    setInitialState(initialState + 1);
    console.log(item);
  };

  const onCancel = () => {
    formModal.resetFields();
    setState({ visible: false, period: undefined });
  };

  const modal = useMemo(
    () => (
      <Modal visible={state.visible} onCancel={onCancel} title="Editar edital" footer={[]}>
        <Form onFinish={submitEdit} form={formModal} layout="vertical">
          <Form.Item name="_id">
            <Input style={{ display: "none" }} />
          </Form.Item>
          <Form.Item name="name" label="Nome">
            <Input />
          </Form.Item>
          <Form.Item
            name="roles"
            label="Usuários que podem acessar o edital"
            rules={[{ required: true, message: "Campo Obrigatório" }]}
          >
            <Select placeholder="Selecione o tipo de usuário" mode="multiple" allowClear>
              <Option value="teacher">Professor</Option>
              <Option value="admin">Administrador</Option>
              <Option value="ndePresident">Presidente NDE</Option>
              <Option value="integrationCoord">Coordenador de integração</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="categories"
            label="Categorias do Edital"
          >
            <Select placeholder="Selecione a categoria" mode="multiple" allowClear>
              {categories?.map((e) => {
                if (e._id !== undefined) {
                  return (
                    <Option key={e._id} value={e._id}>
                      {e.name}
                    </Option>
                  );
                }
              })}
            </Select>
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
    ),
    [state]
  );

  return (
    <Structure title="Editais">
      {modal}
      <Form form={form} onFinish={submitPeriod} layout="vertical" style={{ maxWidth: "500px", width: "100%" }}>
        <Form.Item name="name" label="Nome do Edital" rules={[{ required: true, message: "Campo Obrigatório" }]}>
          <Input placeholder="Insira o nome do Edital" />
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
        dataSource={periods}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Switch onChange={() => changeStatus(item._id)} defaultChecked={item.isActive} />,
              <Button style={{ color: "#333" }} onClick={() => changeEdit(item)}>
                Editar
                <EditOutlined />
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

export default RegistrationPeriod;
