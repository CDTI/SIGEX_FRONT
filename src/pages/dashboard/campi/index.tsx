/* eslint-disable react-hooks/exhaustive-deps */
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
  Divider,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Campus } from "../../../interfaces/course";
import {
  createCampus,
  changeCampusStatus,
  updateCampus,
  getAllCampi,
  deleteCampus,
} from "../../../services/campi_service";
import Structure from "../../../components/layout/structure";
import { UnitPage } from "./unit";

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
  const [campusToDelete, setCampusToDelete] = useState<Campus | undefined>(
    undefined
  );
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

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

  const submitDelete = async (campus: Campus) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = await deleteCampus(campus._id!)
      .then((res) => {
        setDeleteModalVisible(false);
        notification.success({ message: "Campus deletado com sucesso" });
        setInitialState(initialState + 1);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 403) {
          notification.error({
            message: err.response.data.message,
            duration: 15,
          });
        } else {
          notification.error({
            message:
              "Ocorreu um erro ao tentar deletar o campus. Por favor tente mais tarde",
            duration: 15,
          });
        }
        setDeleteModalVisible(false);
      });
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

      <Modal
        title="Deletar Campus?"
        visible={deleteModalVisible}
        centered
        onOk={() => {
          submitDelete(campusToDelete!);
        }}
        okButtonProps={{ style: { backgroundColor: "#ff4d4f" } }}
        okText={"Deletar"}
        onCancel={() => {
          setDeleteModalVisible(false);
        }}
      >
        <Typography>Deseja deletar o campus {campusToDelete?.name}?</Typography>
      </Modal>

      <Form
        form={form}
        layout="vertical"
        style={{
          maxWidth: "500px",
          width: "100%",
        }}
        onFinish={submitCampus}
      >
        <Form.Item
          name="name"
          label="Nome do campus"
          rules={[{ required: true, message: "Campo Obrigatório" }]}
          style={{ marginBottom: 10 }}
        >
          <Input placeholder="Insira o nome do campus" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Cadastrar
          </Button>
        </Form.Item>
      </Form>

      <Divider style={{ margin: 0 }}></Divider>

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
              <Button
                onClick={() => {
                  setCampusToDelete(item);
                  setDeleteModalVisible(true);
                }}
                style={{ color: "#333" }}
              >
                Excluir <DeleteOutlined />
              </Button>,
            ]}
          >
            <Typography>{item.name}</Typography>
          </List.Item>
        )}
      />
      <UnitPage
        initialState={initialState}
        setInitialState={setInitialState}
        campi={campi}
      ></UnitPage>
    </Structure>
  );
};
