import React, { useCallback } from "react";
import { Col, Form, Input, Modal, Row } from "antd";

import { useHttpClient } from "../../../../../../hooks/useHttpClient";
import { Register } from "../../../../../../interfaces/feedback";
import { createFeedbackEndpoint } from "../../../../../../services/endpoints/feedbacks";

interface Props
{
  isVisible: boolean;
  projectRef?: string;
  onCancel(): void;
  onError(message: string): void;
  onSuccess(): void;
}

export const ProjectFeedbackModal: React.FC<Props> = (props) =>
{
  const [formController] = Form.useForm();
  const formFeedbacksRequester = useHttpClient();

  const cancelSubmition = useCallback(() =>
  {
    props.onCancel();

    if (formFeedbacksRequester.inProgress)
      formFeedbacksRequester.cancel();

    formController.resetFields();
  },
  [
    formController,
    formFeedbacksRequester.inProgress,
    formFeedbacksRequester.cancel,
    props.onCancel
  ]);

  const saveFeedback = useCallback(async (values: Register) =>
  {
    if (props.projectRef != null)
    {
      try
      {
        await formFeedbacksRequester.send(
        {
          ...createFeedbackEndpoint(props.projectRef),
          body: values,
          cancellable: true
        });

        props.onSuccess();
      }
      catch (error)
      {
        if ((error as Error).message !== "")
          props.onError((error as Error).message);
      }
    }
  },
  [
    props.projectRef,
    formFeedbacksRequester.send,
    props.onError,
    props.onSuccess
  ]);

  return (
    <Modal
      cancelText="Cancelar"
      centered={true}
      confirmLoading={formFeedbacksRequester.inProgress}
      okText="Enviar"
      title="Justificativa"
      visible={props.isVisible}
      onCancel={() => cancelSubmition()}
      onOk={() => formController.submit()}
    >
      <Form
        form={formController}
        layout="vertical"
        onFinish={saveFeedback}
      >
        <Row>
          <Col span={24}>
            <Form.Item
              name="text"
              rules={
              [
                { required: true, message: "Campo obrigatório" },
                { max: 3000, message: "Número máximo de caracteres extrapolado" }
              ]}
            >
              <Input.TextArea
                autoSize={{ minRows: 3, maxRows: 5 }}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};