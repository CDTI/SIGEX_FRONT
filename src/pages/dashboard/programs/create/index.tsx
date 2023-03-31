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
} from "antd";
import { EditOutlined } from "@ant-design/icons";

import { Program } from "../../../../interfaces/program";
import {
  changeProgramStatus,
  createProgram,
  listPrograms,
  updateProgram,
} from "../../../../services/program_service";
import Structure from "../../../../components/layout/structure";

interface State {
  visible: boolean;
  program?: Program;
}

export const CreateProgram: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [initialState, setInitialState] = useState(0);
  const [form] = Form.useForm();
  const formModal = Form.useForm()[0];
  const [state, setState] = useState<State>({
    visible: false,
    program: undefined,
  });

  useEffect(() => {
    (async () => {
      const programs = await listPrograms();
      setPrograms(programs);
    })();
  }, [initialState]);

  const submitProgram = async (program: Program) => {
    program.isActive = true;
    const newProgram = await createProgram(program);
    notification.open({ message: newProgram.message });
    form.resetFields();
    setInitialState(initialState + 1);
  };

  const changeStatus = async (id: string) => {
    const program = await changeProgramStatus(id);
    notification.open({ message: program.message });
    setInitialState(initialState + 1);
  };

  const changeEdit = (program: Program) => {
    formModal.setFieldsValue(program);
    setState({ visible: true, program: program });
  };

  const submitEdit = async (item: any) => {
    const programEdit = await updateProgram(item._id, item);
    formModal.resetFields();
    notification[programEdit.status]({ message: programEdit.message });
    setState({ visible: false, program: undefined });
    setInitialState(initialState + 1);
  };

  const onCancel = () => {
    formModal.resetFields();
    setState({ visible: false, program: undefined });
  };

  const modal = useMemo(
    () => (
      <Modal
        visible={state.visible}
        title="Editar programa"
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

          <Form.Item name="description" label="Descrição">
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
    <Structure title="Programas">
      {ReactDOM.createPortal(modal, document.getElementById("dialog-overlay")!)}

      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: "500px", width: "100%" }}
        onFinish={submitProgram}
      >
        <Form.Item
          name="name"
          label="Nome do programa"
          rules={[{ required: true, message: "Campo Obrigatório" }]}
        >
          <Input
            placeholder="Insira o nome do programa"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Descrição do programa"
          rules={[{ required: true, message: "Campo Obrigatório" }]}
        >
          <Input
            placeholder="Insira a descrição do programa"
            style={{ width: "100%" }}
          />
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
        dataSource={programs}
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
            <Space
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography
                style={{
                  color: "#1890ff",
                  fontSize: "16px",
                  textDecoration: "underline",
                }}
              >
                {item.name}
              </Typography>
              <Typography>{item.description}</Typography>
            </Space>
          </List.Item>
        )}
      />
    </Structure>
  );
};
