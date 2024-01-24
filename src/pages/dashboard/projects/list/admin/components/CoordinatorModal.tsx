import { Modal, Form, Radio, Input, notification } from "antd";

import { useForm } from "antd/lib/form/Form";
import React, { useContext } from "react";
import { Project } from "../../../../../../interfaces/project";
import { httpClient } from "../../../../../../services/httpClient";
import { ProjectsFilterContext } from "../../../../../../context/projects";

interface Props {
  isCoordinatorModalOpen: boolean;
  setIsCoordinatorModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  project?: Project;
  onCloseReportModal(): void;
}

interface CoordinatorFormData {
  status: string;
  coordinatorFeedback: string;
}

export const CoordinatorModal: React.FC<Props> = ({
  isCoordinatorModalOpen,
  setIsCoordinatorModalOpen,
  project,
  onCloseReportModal,
}: Props) => {
  const [form] = useForm();
  const { setShouldReload, shouldReload } = useContext(ProjectsFilterContext);

  const submit = (data: CoordinatorFormData) => {
    httpClient
      .put(`/project/${project?._id}`, {
        ...project,
        status: "selected",
        report: {
          ...project?.report,
          status: data.status,
          coordinatorFeedback: data.coordinatorFeedback,
          supervisorFeedback: null,
        },
      })
      // httpClient.put(`/project/report/${project?.report?._id}`, {
      //   ...project?.report,
      //   status: data.status,
      //   coordinatorFeedback: data.coordinatorFeedback,
      //   supervisorFeedback: null,
      // }),
      .then((res) => {
        form.resetFields();
        setIsCoordinatorModalOpen(false);
        notification.success({
          message: "Avaliação de relatório feita com sucesso!",
        });
        setShouldReload(shouldReload + 1);
        onCloseReportModal();
      })
      .catch((err) => {
        console.log(err);
        form.resetFields();
        setIsCoordinatorModalOpen(false);
        notification.error({
          message:
            "Ocorreu um erro ao salvar a avaliação. Tente novamente mais tarde.",
        });
      });
  };

  return (
    <Modal
      title="Avaliação de relatório do coordenador"
      centered
      visible={isCoordinatorModalOpen}
      onCancel={() => {
        setIsCoordinatorModalOpen(false);
        form.resetFields(["status"]);
      }}
      okText="Enviar"
      onOk={() => {
        form.submit();
      }}
    >
      <Form
        form={form}
        onFinish={(data) => {
          submit(data);
        }}
      >
        <Form.Item
          name={"status"}
          label={"Status"}
          rules={[{ required: true }]}
        >
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio.Button
              value={"supervisorAnalysis"}
              style={{ backgroundColor: "#61ca6f" }}
            >
              Aprovado
            </Radio.Button>
            <Radio.Button
              value={"waitingCorrections"}
              style={{ backgroundColor: "#ff2525" }}
            >
              Enviar para correção
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name={"coordinatorFeedback"}
          label="Avaliação"
          rules={[{ required: true }]}
        >
          <Input.TextArea
            placeholder="Preencha os detalhes da avaliação"
            autoSize={{ minRows: 3, maxRows: 5 }}
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
