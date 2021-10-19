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
} from "../../../services/endpoints/courses";

export const CoursesPage: React.FC = () =>
{
  const [campi, setCampi] = useState<Campus[]>([]);
  const dropDownListCampiRequester = useHttpClient();

  const [courses, setCourses] = useState<Course[]>([]);
  const [shouldReloadCourses, setShouldReloadCourses] = useState(true);
  const tableCoursesRequester = useHttpClient();
  const switchCoursesRequester = useHttpClient();

  const [saverModalIsVisible, setSaverModalIsVisible] = useState(false);
  const [saverModalForm] = Form.useForm();
  const saverModalCoursesRequester = useHttpClient();

  const [removerModalIsVisible, setRemoverModalIsVisible] = useState(false);
  const [course, setCourse] = useState<Course>();
  const removerModalCoursesRequester = useHttpClient();

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
      switchCoursesRequester.halt();
      saverModalCoursesRequester.halt();
      removerModalCoursesRequester.halt();
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
          if ((error as Error).message !== "")
            notification.error({ message: (error as Error).message });
        }
      })();
    }
  }, [shouldReloadCourses]);

  const openSaveModal = useCallback((course?: Course) =>
  {
    if (course != null)
      saverModalForm.setFieldsValue(
      {
        ...course,
        campus: (course.campus as Campus)._id!
      });

    setSaverModalIsVisible(true);
  }, [saverModalForm]);

  const closeSaveModal = useCallback(() =>
  {
    setSaverModalIsVisible(false);

    if (saverModalCoursesRequester.inProgress)
      saverModalCoursesRequester.cancel();

    saverModalForm.resetFields();
  },
  [
    saverModalCoursesRequester.inProgress,
    saverModalCoursesRequester.cancel,
    saverModalForm.resetFields
  ]);

  const saveCourse = useCallback(async (course: Course) =>
  {
    try
    {
      await saverModalCoursesRequester.send(course._id == null
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
      if ((error as Error).message !== "")
        notification.error({ message: (error as Error).message });
    }
    finally
    {
      closeSaveModal();
    }
  },
  [
    saverModalCoursesRequester.send,
    closeSaveModal
  ]);

  const saveModal = useMemo(() =>
  {
    const operation = saverModalForm.getFieldValue("_id") == null
      ? "Cadastrar"
      : "Alterar";

    return (
      <Modal
        visible={saverModalIsVisible}
        centered={true}
        confirmLoading={saverModalCoursesRequester.inProgress}
        title={`${operation} curso`}
        okText="Salvar"
        cancelText="Cancelar"
        onOk={() => saverModalForm.submit()}
        onCancel={() => closeSaveModal()}
      >
        <Form
          layout="vertical"
          form={saverModalForm}
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
    saverModalForm,
    saverModalIsVisible,
    dropDownListCampiRequester.inProgress,
    saverModalCoursesRequester.inProgress,
    closeSaveModal,
    saveCourse
  ]);

  const openRemoveModal = useCallback((course: Course) =>
  {
    setCourse(course);
    setRemoverModalIsVisible(true);
  }, []);

  const closeRemoveModal = useCallback(() =>
  {
    setRemoverModalIsVisible(false);
  }, []);

  const removeCourse = useCallback(async (id: string) =>
  {
    try
    {
      await removerModalCoursesRequester.send(
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
      if ((error as Error).message !== "")
        notification.error({ message: (error as Error).message });
    }
    finally
    {
      closeRemoveModal();
    }
  },
  [
    removerModalCoursesRequester.send,
    closeRemoveModal
  ]);

  const removeModal = useMemo(() => (
    <Modal
      visible={removerModalIsVisible}
      centered={true}
      confirmLoading={removerModalCoursesRequester.inProgress}
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
    removerModalIsVisible,
    removerModalCoursesRequester.inProgress,
    closeRemoveModal,
    removeCourse
  ]);

  const toggleCourseStatus = useCallback(async (id: string, isActive: boolean) =>
  {
    try
    {
      await switchCoursesRequester.send(
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
      if ((error as Error).message !== "")
        notification.error({ message: (error as Error).message });
    }
  }, [switchCoursesRequester.send]);

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
        loading={switchCoursesRequester.inProgress}
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
    switchCoursesRequester.inProgress,
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