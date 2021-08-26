import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { Button, Col, Form, Input, Modal, notification, Row, Select, Space, Table, Typography } from "antd";

import { Campus, Course } from "../../../interfaces/course";
import { createCourse, deleteCourse, updateCourse } from "../../../services/course";
import Structure from "../../../components/layout/structure";
import { HALT, useHttpRequest } from "../../../hooks/useHttpRequest";
import { getAllCampiEndpoint, getAllCoursesEndpoint } from "../../../services/endpoints/course";

function getValueOrDefaultArray(c?: any)
{
  if (c == null || typeof c !== "object" || !Array.isArray(c))
    return [];

  return c;
}

const campiGetRequestParams =
{
  method: "GET",
  url: getAllCampiEndpoint,
  cancellable: true
} as const;

const coursesGetRequestParams =
{
  method: "GET",
  url: getAllCoursesEndpoint,
  queryParams: { withPopulatedRefs: true },
  cancellable: true
} as const;

export const Courses: React.FC = () =>
{
  const [saveOrUpdateDialogIsVisible, setSaveOrUpdateDialogIsVisible] = useState(false);
  const [saveOrUpdateDialogIsWorking, setSaveOrUpdateDialogIsWorking] = useState(false);
  const [saveOrUpdateForm] = Form.useForm();

  const [removeDialogIsVisible, setRemoveDialogIsVisible] = useState(false);
  const [removeDialogIsWorking, setRemoveDialogIsWorking] = useState(false);
  const [removeData, setRemoveData] = useState<Course>();

  const
  {
    isWorking: campiRequestInProgress,
    data: campiResponseData,
    hasThrownError: campiRequestHasFailed,
    errorMessage: campiRequestFailedMessage,
    send: sendCampiRequest,
    cancel: cancelCampiRequests
  } = useHttpRequest<Campus[]>();

  const [shouldLoadCourses, setShouldLoadCourses] = useState(true);
  const
  {
    isWorking: coursesRequestInProgress,
    data: coursesResponseData,
    hasThrownError: coursesRequestHasFailed,
    errorMessage: coursesRequestFailedMessage,
    send: sendCoursesRequest,
    cancel: cancelCoursesRequests,
    clearState: clearCoursesState
  } = useHttpRequest<string | Course[]>();

  useEffect(() =>
  {
    sendCampiRequest(campiGetRequestParams);

    return () =>
    {
      cancelCampiRequests(HALT);
      cancelCoursesRequests(HALT);
    }
  }, []);

  useEffect(() =>
  {
    if (shouldLoadCourses)
    {
      if (coursesRequestInProgress)
      {
        cancelCoursesRequests();
        clearCoursesState();
      }

      sendCoursesRequest(coursesGetRequestParams);

      setShouldLoadCourses(false);
    }
  }, [shouldLoadCourses]);

  useEffect(() =>
  {
    if (campiRequestHasFailed && campiRequestFailedMessage !== "")
      notification.error({ message: campiRequestFailedMessage });

    if (coursesRequestHasFailed && coursesRequestFailedMessage !== "")
      notification.error({ message: coursesRequestFailedMessage });
  },
  [
    campiRequestHasFailed,
    campiRequestFailedMessage,
    coursesRequestHasFailed,
    coursesRequestFailedMessage
  ]);

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

      setShouldLoadCourses(true);
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
                loading={campiRequestInProgress}
                options={campiResponseData?.map((c: Campus) => ({ label: c.name, value: c._id! })) ?? []}
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

      setShouldLoadCourses(true);
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
              loading={coursesRequestInProgress}
              dataSource={getValueOrDefaultArray(coursesResponseData)}
              columns={tableColumns}
              />
          </Col>
        </Row>
      </Structure>
    </>
  );
};