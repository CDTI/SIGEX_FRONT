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
import { Campus } from "../../../interfaces/course";
import {
  createCampus,
  changeCampusStatus,
  updateCampus,
  getAllCampi,
} from "../../../services/campi_service";
import Structure from "../../../components/layout/structure";

interface State {
  visible: boolean;
  campus?: Campus;
}

export const CreateCampi: React.FC = () => {
  const [campi, setCampi] = useState<Campus[]>([]);
  const [initialState, setInitialState] = useState(0);
  const [form] = Form.useForm();
  const formModal = Form.useForm()[0];
  const [state, setState] = useState<State>({
    visible: false,
    campus: undefined,
  });

  useEffect(() => {
    (async () => {
      const campi = await getAllCampi();
      setCampi(campi);
    })();
  }, [initialState]);

  const submitCampus = async (campus: Campus) => {
    try {
      campus.isActive = false;
      const newCampus = await createCampus(campus);
      notification.success({ message: newCampus.message });
      form.resetFields();
      setInitialState(initialState + 1);
    } catch (error) {
      console.log(error);
      form.resetFields();
      setInitialState(initialState + 1);
    }
  };

  const changeStatus = async (id: string) => {
    const campus = await changeCampusStatus(id);
    notification.info({ message: campus.message });
    setInitialState(initialState + 1);
  };

  const changeEdit = (campus: Campus) => {
    formModal.setFieldsValue(campus);
    setState({ visible: true, campus: campus });
  };

  const submitEdit = async (item: any) => {
    const campusEdit = await updateCampus(item._id, item);
    formModal.resetFields();
    notification[campusEdit.status]({ message: campusEdit.message });
    setState({ visible: false, campus: undefined });
    setInitialState(initialState + 1);
  };

  const onCancel = () => {
    formModal.resetFields();
    setState({ visible: false, campus: undefined });
  };

  const modal = useMemo(
    () => (
      <Modal
        visible={state.visible}
        title="Editar campus"
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
    <Structure title="Campus">
      {ReactDOM.createPortal(modal, document.getElementById("dialog-overlay")!)}

      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: "500px", width: "100%" }}
        onFinish={submitCampus}
      >
        <Form.Item
          name="name"
          label="Nome do campus"
          rules={[{ required: true, message: "Campo Obrigatório" }]}
        >
          <Input placeholder="Insira o nome do campus" />
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
        dataSource={campi}
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
