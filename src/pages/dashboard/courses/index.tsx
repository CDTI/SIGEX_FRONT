import Axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { Button, Col, Form, Input, Modal, notification, Row, Select, Space, Table } from "antd";

import { Campus, Course } from "../../../interfaces/course";
import { createCourse, getAllCampi, getAllCourses, updateCourse } from "../../../services/course";
import Structure from "../../../components/layout/structure";

export const Courses: React.FC = () =>
{
  const [cancellationToken, setCancellationToken] = useState(Axios.CancelToken.source());

  const [shouldReloadCourses, setShouldReloadCourses] = useState(true);
  const [coursesAreLoading, setCoursesAreLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  const [hasLoadedCampi, setHasLoadedCampi] = useState(false);
  const [campiAreLoading, setCampiAreLoading] = useState(false);
  const [campi, setCampi] = useState<Campus[]>([]);

  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [modalIsWorking, setModalIsWorking] = useState(false);
  const [modalForm] = Form.useForm();

  useEffect(() =>
  {
    return () => cancellationToken.cancel();
  }, []);

  useEffect(() =>
  {
    (async () =>
    {
      try
      {
        if (shouldReloadCourses)
        {
          setCoursesAreLoading(true);

          const courses = await getAllCourses(cancellationToken);
          setCourses(courses.map((c: Course) => ({ ...c, key: c._id! })));

          setShouldReloadCourses(false);
          setCoursesAreLoading(false);
        }

        if (!hasLoadedCampi)
        {
          setCampiAreLoading(true);

          const campi = await getAllCampi(cancellationToken);
          setCampi(campi);

          setHasLoadedCampi(true);
          setCampiAreLoading(false);
        }
      }
      catch (error)
      {
        if (error.response)
          notification.error({ message: error.response.data });
        else if (error.request)
          notification.error({ message: "Nenhuma resposta do servidor!" });
      }
    })();
  }, [shouldReloadCourses]);

  const cleanupModal = useCallback(() =>
  {
    setModalIsWorking(false);
    setModalIsVisible(false);
    modalForm.resetFields();
  }, [modalForm]);

  const closeModal = useCallback(() =>
  {
    cancellationToken.cancel("Operação cancelada!");
    setCancellationToken(Axios.CancelToken.source());

    cleanupModal();
  }, [cancellationToken]);

  const dispatchModalWork = useCallback(() =>
  {
    setModalIsWorking(true);
    modalForm.submit();
  }, [modalForm]);

  const saveOrUpdateCourse = useCallback(async (course: Course) =>
  {
    try
    {
      await (course._id === undefined
        ? createCourse(course, cancellationToken)
        : updateCourse(course._id, course, cancellationToken));

      cleanupModal();

      notification.success({ message: "Curso salvo com sucesso!" });

      setShouldReloadCourses(true);
    }
    catch (error)
    {
      let message = "Houve um erro inesperado durante a requisição ao servidor!";
      if (Axios.isCancel(error))
        message = error.message;
      else if (error.response)
        message = error.response.data;
      else if (error.request)
        message = "Nenhuma resposta do servidor!"

      cleanupModal();

      notification.error({ message });
    }
  }, []);

  const createModal = useMemo(() => (
    <Modal
      visible={modalIsVisible}
      centered={true}
      confirmLoading={modalIsWorking}
      title={`${modalForm.getFieldValue("_id") === undefined ? "Cadastrar" : "Alterar"} curso`}
      okText="Salvar"
      cancelText="Cancelar"
      onOk={() => dispatchModalWork()}
      onCancel={() => closeModal()}
    >
      <Form
        layout="vertical"
        form={modalForm}
        onFinish={saveOrUpdateCourse}
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
                options={campi.map((c: Campus) => ({ label: c.name, value: c._id! }))}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  ), [modalIsVisible, modalIsWorking, modalForm, dispatchModalWork, closeModal, saveOrUpdateCourse]);

  const openModal = useCallback((course?: Course) =>
  {
    if (course !== undefined)
    {
      const values: Course = { ...course, campus: (course.campus as Campus)._id! };
      modalForm.setFieldsValue(values);
    }

    setModalIsVisible(true);
  }, [modalForm]);

  const tableColumns = useMemo(() =>
  [
    {
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
          <Button onClick={() => openModal(record)}>
            Editar
          </Button>
        </Space>
      )
    }
  ], []);

  return (
    <>
      {ReactDOM.createPortal(createModal, document.getElementById("dialog-overlay")!)}

      <Structure title="Cursos">
        <Row gutter={[0, 8]} justify="center">
          <Col span={24}>
            <Button onClick={() => openModal()}>
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