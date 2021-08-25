import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { Button, Col, Form, Input, Modal, notification, Row, Select, Space, Table, Typography } from "antd";

import { Campus, Course } from "../../../interfaces/course";
import { createCourse, deleteCourse, getAllCampi, getAllCourses, updateCourse } from "../../../services/course";
import Structure from "../../../components/layout/structure";

export const Courses: React.FC = () =>
{
  const [shouldReloadCourses, setShouldReloadCourses] = useState(true);
  const [coursesAreLoading, setCoursesAreLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  const [campiAreLoading, setCampiAreLoading] = useState(false);
  const [campi, setCampi] = useState<Campus[]>([]);

  const [saveOrUpdateDialogIsVisible, setSaveOrUpdateDialogIsVisible] = useState(false);
  const [saveOrUpdateDialogIsWorking, setSaveOrUpdateDialogIsWorking] = useState(false);
  const [saveOrUpdateForm] = Form.useForm();

  const [removeDialogIsVisible, setRemoveDialogIsVisible] = useState(false);
  const [removeDialogIsWorking, setRemoveDialogIsWorking] = useState(false);
  const [removeData, setRemoveData] = useState<Course>();

  useEffect(() =>
  {
    (async () =>
    {
      setCampiAreLoading(true);

      const campi = await getAllCampi();
      setCampi(campi);

      setCampiAreLoading(false);
    })();
  }, []);

  useEffect(() =>
  {
    if (shouldReloadCourses)
    {
      (async () =>
      {
        try
        {
          setCoursesAreLoading(true);

          const courses = await getAllCourses();
          setCourses(courses.map((c: Course) => ({ ...c, key: c._id! })));

          setShouldReloadCourses(false);
          setCoursesAreLoading(false);
        }
        catch (error)
        {
          if (error.response)
            notification.error({ message: error.response.data });
          else if (error.request)
            notification.error({ message: "Nenhuma resposta do servidor!" });
        }
      })();
    }
  }, [shouldReloadCourses]);

  const closeSaveOrUpdateDialog = useCallback(() =>
  {
    setSaveOrUpdateDialogIsWorking(false);
    setSaveOrUpdateDialogIsVisible(false);
    saveOrUpdateForm.resetFields();
  }, [saveOrUpdateForm]);

  const saveOrUpdate = useCallback(async (course: Course) =>
  {
    try
    {
      setSaveOrUpdateDialogIsWorking(true);

      await (course._id == null
        ? createCourse(course)
        : updateCourse(course._id, course));

      notification.success({ message: "Curso salvo com sucesso!" });

      setShouldReloadCourses(true);
    }
    catch (error)
    {
      let message = "Houve um erro inesperado durante a requisição ao servidor!";
      if (error.response)
        message = error.response.data;
      else if (error.request)
        message = "Nenhuma resposta do servidor!"

      notification.error({ message });
    }
    finally
    {
      closeSaveOrUpdateDialog();
    }
  }, [closeSaveOrUpdateDialog]);

  const saveOrUpdateDialog = useMemo(() => (
    <Modal
      visible={saveOrUpdateDialogIsVisible}
      centered={true}
      confirmLoading={saveOrUpdateDialogIsWorking}
      title={`${saveOrUpdateForm.getFieldValue("_id") == null ? "Cadastrar" : "Alterar"} curso`}
      okText="Salvar"
      cancelText="Cancelar"
      onOk={() => saveOrUpdateForm.submit()}
      onCancel={() => closeSaveOrUpdateDialog()}
    >
      <Form
        layout="vertical"
        form={saveOrUpdateForm}
        onFinish={saveOrUpdate}
      >
        <Row gutter={[0, 8]}>
          <Form.Item name="_id">
            <Input type="hidden" />
          </Form.Item>

          <Col span={24}>
            <Form.Item
              name="name"
              label="Nome"
              rules={[{ required: true, message: "Campo obrigatório" }]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="campus"
              label="Campus"
              rules={[{ required: true, message: "Campo obrigatório" }]}
            >
              <Select
                loading={campiAreLoading}
                options={campi.map((c: Campus) => ({ label: c.name, value: c._id! }))}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  ),
  [
    saveOrUpdateDialogIsVisible,
    saveOrUpdateDialogIsWorking,
    saveOrUpdateForm,
    closeSaveOrUpdateDialog,
    saveOrUpdate
  ]);

  const closeRemoveDialog = useCallback(() =>
  {
    setRemoveDialogIsWorking(false);
    setRemoveDialogIsVisible(false);
  }, []);

  const remove = useCallback(async (id: string) =>
  {
    try
    {
      setRemoveDialogIsWorking(true);

      await deleteCourse(id);

      notification.success({ message: "Curso removido com sucesso!" });

      setShouldReloadCourses(true);
    }
    catch (error)
    {
      let message = "Houve um erro inesperado durante a requisição ao servidor!";
      if (error.response)
        message = error.response.data;
      else if (error.request)
        message = "Nenhuma resposta do servidor!"

      notification.error({ message });
    }
    finally
    {
      closeRemoveDialog();
    }
  }, [closeRemoveDialog]);

  const removeDialog = useMemo(() => (
    <Modal
      visible={removeDialogIsVisible}
      centered={true}
      confirmLoading={removeDialogIsWorking}
      title="Remover curso"
      okText="Remover"
      cancelText="Cancelar"
      onOk={() => remove(removeData!._id!)}
      onCancel={() => closeRemoveDialog()}
    >
      <Typography.Paragraph>
        {`Tem certeza que deseja remover o curso ${removeData?.name}?`}
      </Typography.Paragraph>
    </Modal>
  ),
  [
    removeDialogIsVisible,
    removeDialogIsWorking,
    removeData,
    remove,
    closeRemoveDialog
  ]);

  const openSaveOrUpdateDialog = useCallback((course?: Course) =>
  {
    if (course != null)
      saveOrUpdateForm.setFieldsValue(
      {
        ...course,
        campus: (course.campus as Campus)._id!
      });

    setSaveOrUpdateDialogIsVisible(true);
  }, [saveOrUpdateForm]);

  const openRemoveDialog = useCallback((course: Course) =>
  {
    setRemoveData(course);
    setRemoveDialogIsVisible(true);
  }, []);

  const tableColumns = useMemo(() =>
  [{
    key: "name",
    title: "Nome",
    dataIndex: "name"
  },
  {
    key: "campus",
    title: "Campus",
    dataIndex: "campus",
    render: (text: string, record: Course) =>
      (record.campus as Campus).name
  },
  {
    key: "actions",
    title: "Ações",
    render: (text: string, record: Course) => (
      <Space size="middle">
        <Button onClick={() => openSaveOrUpdateDialog(record)}>
          Editar
        </Button>

        <Button onClick={() => openRemoveDialog(record)}>
          Remover
        </Button>
      </Space>
    )
  }], []);

  return (
    <>
      {ReactDOM.createPortal(saveOrUpdateDialog, document.getElementById("dialog-overlay")!)}
      {ReactDOM.createPortal(removeDialog, document.getElementById("dialog-overlay")!)}

      <Structure title="Cursos">
        <Row gutter={[0, 8]} justify="center">
          <Col span={24}>
            <Button onClick={() => openSaveOrUpdateDialog()}>
              Adicionar
            </Button>
          </Col>

          <Col span={24}>
            <Table
              loading={coursesAreLoading}
              dataSource={courses}
              columns={tableColumns}
              />
          </Col>
        </Row>
      </Structure>
    </>
  );
};