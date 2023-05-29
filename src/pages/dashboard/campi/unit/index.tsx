/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import Structure from "../../../../components/layout/structure";
import { Campus, Unit } from "../../../../interfaces/course";
import {
  Button,
  Divider,
  Form,
  Input,
  List,
  Modal,
  Select,
  Space,
  Switch,
  Typography,
  notification,
} from "antd";
import {
  changeUnitStatus,
  createUnit,
  getAllUnits,
  updateUnit,
} from "../../../../services/campi_service";
import ReactDOM from "react-dom";
import { EditOutlined } from "@ant-design/icons";

interface Props {
  initialState: number;
  setInitialState: React.Dispatch<React.SetStateAction<number>>;
  campi: Campus[];
}

interface State {
  visible: boolean;
  unit?: Campus;
}

export const UnitPage: React.FC<Props> = ({
  initialState,
  setInitialState,
  campi,
}) => {
  const [units, setUnits] = useState<Unit[] | undefined>(undefined);
  const [form] = Form.useForm();
  const formModal = Form.useForm()[0];
  const [state, setState] = useState<State>({
    visible: false,
    unit: undefined,
  });

  const submitUnit = async (unit: Unit) => {
    try {
      unit.isActive = false;
      const newUnit = await createUnit(unit);
      notification.success({ message: newUnit.message });
      form.resetFields();
      setInitialState(initialState + 1);
    } catch (error) {
      console.log(error);
      form.resetFields();
      setInitialState(initialState + 1);
    }
  };

  const changeStatus = async (id: string) => {
    const unit = await changeUnitStatus(id);
    notification.info({ message: unit.message });
    setInitialState(initialState + 1);
  };

  const changeEdit = (unit: Unit) => {
    formModal.setFieldsValue(unit);
    setState({ visible: true, unit: unit });
  };

  const submitEdit = async (item: any) => {
    const unitEdit = await updateUnit(item._id, item);
    formModal.resetFields();
    notification[unitEdit.status]({ message: unitEdit.message });
    setState({ visible: false, unit: undefined });
    setInitialState(initialState + 1);
  };

  const onCancel = () => {
    formModal.resetFields();
    setState({ visible: false, unit: undefined });
  };

  const modal = useMemo(
    () => (
      <Modal
        visible={state.visible}
        title="Editar unidade"
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

          <Form.Item name="campus" label="campus">
            <Select
              options={campi.map((c) => ({
                label: c.name,
                value: c._id!,
                key: c._id!,
              }))}
            />
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
    [state, formModal, onCancel, submitEdit]
  );

  useEffect(() => {
    (async () => {
      const units = await getAllUnits();
      setUnits(units);
    })();
  }, [initialState]);

  return (
    <Structure title="unidades">
      {ReactDOM.createPortal(modal, document.getElementById("dialog-overlay")!)}

      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: "500px", width: "100%" }}
        onFinish={submitUnit}
      >
        <Form.Item
          name="name"
          label="Nome da unidade"
          rules={[{ required: true, message: "Campo Obrigatório" }]}
          style={{ marginBottom: 10 }}
        >
          <Input placeholder="Insira o nome da unidade" />
        </Form.Item>

        <Form.Item
          name="campus"
          label="Campus"
          rules={[{ required: true, message: "Campo Obrigatório" }]}
          style={{ marginBottom: 10 }}
        >
          <Select
            options={campi.map((c) => ({
              label: c.name,
              value: c._id!,
              key: c._id!,
            }))}
          />
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
        dataSource={units}
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
