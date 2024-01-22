import { Modal, Form, Radio, Input, notification } from "antd";

import { useForm } from "antd/lib/form/Form";
import React, { useContext } from "react";
import { Project } from "../../../../../../interfaces/project";
import { httpClient } from "../../../../../../services/httpClient";
import { ProjectsFilterContext } from "../../../../../../context/projects";

interface Props {
  isSupervisorModalOpen: boolean;
  setIsSupervisorModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  project?: Project;
  onCloseReportModal(): void;
}

interface SupervisorFormData {
  status: string;
  supervisorFeedback: string;
}

export const SupervisorModal: React.FC<Props> = ({
  isSupervisorModalOpen,
  setIsSupervisorModalOpen,
  project,
  onCloseReportModal,
}: Props) => {
  const [form] = useForm();
  const { setShouldReload, shouldReload } = useContext(ProjectsFilterContext);

  const submit = (data: SupervisorFormData) => {
    Promise.all([
      httpClient.put(`/project/${project?._id}`, {
        ...project,
        status: data.status === "approved" ? "finished" : "selected",
      }),
      httpClient.put(`/project/report/${project?.report?._id}`, {
        ...project?.report,
        ...data,
        // coordinatorFeedback: project?.report?.coordinatorFeedback,
      }),
    ])
      .then((res) => {
        form.resetFields();
        setIsSupervisorModalOpen(false);
        notification.success({
          message: "Avaliação de relatório feita com sucesso!",
        });
        setShouldReload(shouldReload + 1);
        onCloseReportModal();
      })
      .catch((err) => {
        console.log(err);
        form.resetFields();
        setIsSupervisorModalOpen(false);
        notification.error({
          message:
            "Ocorreu um erro ao salvar a avaliação. Tente novamente mais tarde.",
        });
      });
  };

  return (
    <Modal
      title="Avaliação de relatório do supervisor"
      centered
      visible={isSupervisorModalOpen}
      onCancel={() => {
        setIsSupervisorModalOpen(false);
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
          <Radio.Group
            // options={[
            //   { label: "Aprovado", value: "approved" },
            //   {
            //     label: "Enviar para correção",
            //     value: "waitingCorrections",
            //   },
            // ]}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button
              value={"approved"}
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
          name={"supervisorFeedback"}
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
