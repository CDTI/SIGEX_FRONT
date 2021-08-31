import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import
{
  Button,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Typography
} from "antd";

import { useHttpClient } from "../../../hooks/useHttpClient";
import Structure from "../../../components/layout/structure";

import { Campus, Course } from "../../../interfaces/course";
import
{
  createCourseEndpoint,
  deleteCourseEndpoint,
  getAllCampiEndpoint,
  getAllCoursesEndpoint,
  toggleCourseEndpoint,
  updateCourseEndpoint
} from "../../../services/courses";

export const Courses: React.FC = () =>
{
  const [campi, setCampi] = useState<Campus[]>([]);
  const dropDownListCampiRequester = useHttpClient();

  const [courses, setCourses] = useState<Course[]>([]);
  const [shouldReloadCourses, setShouldReloadCourses] = useState(true);
  const tableCoursesRequester = useHttpClient();
  const switchCourseRequester = useHttpClient();

  const [saveModalIsVisible, setSaveModalIsVisible] = useState(false);
  const [saveModalForm] = Form.useForm();
  const saveModalCourseRequester = useHttpClient();

  const [removeModalIsVisible, setRemoveModalIsVisible] = useState(false);
  const [course, setCourse] = useState<Course>();
  const removeModalCourseRequester = useHttpClient();

  useEffect(() =>
  {
    (async () =>
    {
      const campi = await dropDownListCampiRequester.send<Campus[]>(
      {
        method: "GET",
        url: getAllCampiEndpoint(),
        cancellable: true
      });

      setCampi(campi ?? []);
    })();

    return () =>
    {
      dropDownListCampiRequester.halt();
      tableCoursesRequester.halt();
      switchCourseRequester.halt();
      saveModalCourseRequester.halt();
      removeModalCourseRequester.halt();
    }
  }, []);

  useEffect(() =>
  {
    if (shouldReloadCourses)
    {
      (async () =>
      {
        try
        {
          const courses = await tableCoursesRequester.send(
          {
            method: "GET",
            url: getAllCoursesEndpoint(),
            queryParams: new Map([["withPopulatedRefs", "true"]]),
            cancellable: true
          });

          setCourses(courses?.map((c: Course) => ({ ...c, key: c._id! })) ?? []);

          setShouldReloadCourses(false);
        }
        catch (error)
        {
          if (error.message !== "")
            notification.error({ message: error.message });
        }
      })();
    }
  }, [shouldReloadCourses]);

  const openSaveModal = useCallback((course?: Course) =>
  {
    if (course != null)
      saveModalForm.setFieldsValue(
      {
        ...course,
        campus: (course.campus as Campus)._id!
      });

    setSaveModalIsVisible(true);
  }, [saveModalForm]);

  const closeSaveModal = useCallback(() =>
  {
    setSaveModalIsVisible(false);

    if (saveModalCourseRequester.inProgress)
      saveModalCourseRequester.cancel();

    saveModalForm.resetFields();
  },
  [
    saveModalCourseRequester.inProgress,
    saveModalCourseRequester.cancel,
    saveModalForm.resetFields
  ]);

  const saveCourse = useCallback(async (course: Course) =>
  {
    try
    {
      await saveModalCourseRequester.send(course._id == null
        ? {
          method: "POST",
          url: createCourseEndpoint(),
          body: course,
          cancellable: true
        }
        : {
          method: "PUT",
          url: updateCourseEndpoint(course._id!),
          body: course,
          cancellable: true
        });

      notification.success({ message: "Curso salvo com sucesso!" });

      setShouldReloadCourses(true);
    }
    catch (error)
    {
      if (error.message !== "")
        notification.error({ message: error.message });
    }
    finally
    {
      closeSaveModal();
    }
  },
  [
    saveModalCourseRequester.send,
    closeSaveModal
  ]);

  const saveModal = useMemo(() =>
  {
    const operation = saveModalForm.getFieldValue("_id") == null
      ? "Cadastrar"
      : "Alterar";

    return (
      <Modal
        visible={saveModalIsVisible}
        centered={true}
        confirmLoading={saveModalCourseRequester.inProgress}
        title={`${operation} curso`}
        okText="Salvar"
        cancelText="Cancelar"
        onOk={() => saveModalForm.submit()}
        onCancel={() => closeSaveModal()}
      >
        <Form
          layout="vertical"
          form={saveModalForm}
          onFinish={saveCourse}
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
                  loading={dropDownListCampiRequester.inProgress}
                  options={campi.map((c: Campus) => ({ label: c.name, value: c._id! }))}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  },
  [
    campi,
    saveModalForm,
    saveModalIsVisible,
    dropDownListCampiRequester.inProgress,
    saveModalCourseRequester.inProgress,
    closeSaveModal,
    saveCourse
  ]);

  const openRemoveModal = useCallback((course: Course) =>
  {
    setCourse(course);
    setRemoveModalIsVisible(true);
  }, []);

  const closeRemoveModal = useCallback(() =>
  {
    setRemoveModalIsVisible(false);
  }, []);

  const removeCourse = useCallback(async (id: string) =>
  {
    try
    {
      await removeModalCourseRequester.send(
      {
        method: "DELETE",
        url: deleteCourseEndpoint(id),
        cancellable: true
      });

      notification.success({ message: "Curso removido com sucesso!" });

      setShouldReloadCourses(true);
    }
    catch (error)
    {
      if (error.message !== "")
        notification.error({ message: error.message });
    }
    finally
    {
      closeRemoveModal();
    }
  },
  [
    removeModalCourseRequester.send,
    closeRemoveModal
  ]);

  const removeModal = useMemo(() => (
    <Modal
      visible={removeModalIsVisible}
      centered={true}
      confirmLoading={removeModalCourseRequester.inProgress}
      title="Remover curso"
      okText="Remover"
      cancelText="Cancelar"
      onOk={() => removeCourse(course!._id!)}
      onCancel={() => closeRemoveModal()}
    >
      <Typography.Paragraph>
        {`Tem certeza que deseja remover o curso ${course?.name}?`}
      </Typography.Paragraph>
    </Modal>
  ),
  [
    course,
    removeModalIsVisible,
    removeModalCourseRequester.inProgress,
    closeRemoveModal,
    removeCourse
  ]);

  const toggleCourseStatus = useCallback(async (id: string, isActive: boolean) =>
  {
    try
    {
      await switchCourseRequester.send(
      {
        method: "PUT",
        url: toggleCourseEndpoint(id),
        cancellable: true
      });

      setCourses((prevState) =>
      {
        const index = prevState.findIndex((c: Course) => c._id === id)!;
        return (
        [
          ...prevState.slice(0, index),
          { ...prevState[index], isActive },
          ...prevState.slice(index + 1)
        ]);
      });

      const status = isActive ? "habilitado" : "desabilitado";
      notification.success({ message: `O curso foi ${status} com sucesso!` });
    }
    catch (error)
    {
      if (error.message !== "")
        notification.error({ message: error.message });
    }
  }, [switchCourseRequester.send]);

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
    key: "isActive",
    title: "Ativo?",
    dataIndex: "isActive",
    render: (text: string, record: Course) => (
      <Switch
        checked={record.isActive}
        loading={switchCourseRequester.inProgress}
        onChange={(isChecked: boolean) => toggleCourseStatus(record._id!, isChecked)}
      />
    )
  },
  {
    key: "actions",
    title: "Ações",
    render: (text: string, record: Course) => (
      <Space size="middle">
        <Button onClick={() => openSaveModal(record)}>
          Editar
        </Button>

        <Button onClick={() => openRemoveModal(record)}>
          Remover
        </Button>
      </Space>
    )
  }],
  [
    switchCourseRequester.inProgress,
    openRemoveModal,
    openSaveModal,
    toggleCourseStatus
  ]);

  return (
    <>
      {ReactDOM.createPortal(saveModal, document.getElementById("dialog-overlay")!)}
      {ReactDOM.createPortal(removeModal, document.getElementById("dialog-overlay")!)}

      <Structure title="Cursos">
        <Row gutter={[0, 8]} justify="center">
          <Col span={24}>
            <Button onClick={() => openSaveModal()}>
              Adicionar
            </Button>
          </Col>

          <Col span={24}>
            <Table
              loading={tableCoursesRequester.inProgress}
              dataSource={courses}
              columns={tableColumns}
              />
          </Col>
        </Row>
      </Structure>
    </>
  );
};