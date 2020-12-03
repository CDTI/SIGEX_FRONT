import React, { useEffect, useMemo, useState } from "react";
import Structure from "../../../components/layout/structure";
import { IRegistrationPeriod } from "../../../interfaces/registrationPeriod";
import {
  getAllPeriods,
  createRegistrationPeriod,
  changeStatusRegistrationPeriod,
  updatePeriod,
} from "../../../services/registrationPeriod_service";
import { Button, Form, Input, List, Modal, notification, Space, Switch, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";

interface State {
  visible: boolean;
  period: IRegistrationPeriod | undefined;
}

const RegistrationPeriod: React.FC = () => {
  const [periods, setPeriods] = useState<IRegistrationPeriod[]>([]);
  const [form] = Form.useForm();
  const [initialState, setInitialState] = useState(0);
  const formModal = Form.useForm()[0];
  const [state, setState] = useState<State>({
    visible: false,
    period: undefined,
  });

  useEffect(() => {
    getAllPeriods().then((allPeriods) => {
      setPeriods(allPeriods);
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
    formModal.setFieldsValue(period);
    setState({ visible: true, period: period });
    console.log(state.period);
  };

  const submitEdit = async (item: any) => {
    const periodEdit = await updatePeriod(item);
    formModal.resetFields();
    notification[periodEdit.status]({ message: periodEdit.message });
    setState({ visible: false, period: undefined });
    setInitialState(initialState + 1);
  };

  const onCancel = () => {
    formModal.resetFields();
    setState({ visible: false, period: undefined });
  };

  const modal = useMemo(
    () => (
      <Modal visible={state.visible} onCancel={onCancel} title="Editar categoria" footer={[]}>
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
              <Switch onChange={(event) => changeStatus(item._id)} defaultChecked={item.isActive} />,
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
