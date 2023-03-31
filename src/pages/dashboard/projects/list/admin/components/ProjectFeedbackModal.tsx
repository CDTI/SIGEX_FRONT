import React, { useCallback, useEffect, useState } from "react";
import { Col, Form, Input, Modal, Row } from "antd";

import { useHttpClient } from "../../../../../../hooks/useHttpClient";
import { Register } from "../../../../../../interfaces/feedback";
import { createFeedbackEndpoint } from "../../../../../../services/endpoints/feedbacks";

interface Props {
  isVisible: boolean;
  projectStatus: "reproved" | "notSelected" | "selected" | undefined;
  projectRef?: string;
  onCancel(): void;
  onError(message: string): void;
  onSuccess(): void;
}

enum StatusTypes {
  notSelected = "Professor, seu projeto atende os requisitos da extensão, entretanto não foi possível alocá-lo nas turmas disponíveis.",
  selected = "Parabéns, seu projeto foi selecionado. Por favor, confira as turmas para as quais foi alocado no edital de resultados.",
}

export const ProjectFeedbackModal: React.FC<Props> = (props) => {
  const [formController] = Form.useForm();
  const formFeedbacksRequester = useHttpClient();

  const cancelSubmition = useCallback(() => {
    props.onCancel();

    if (formFeedbacksRequester.inProgress) formFeedbacksRequester.cancel();

    formController.resetFields();
  }, [
    formController,
    formFeedbacksRequester.inProgress,
    formFeedbacksRequester.cancel,
    props.onCancel,
  ]);

  const saveFeedback = useCallback(
    async (values: Register) => {
      if (props.projectRef != null) {
        try {
          if (!values.text) {
            switch (props.projectStatus) {
              case "selected":
                values.text = StatusTypes.selected;
                break;
              case "notSelected":
                values.text = StatusTypes.notSelected;
                break;
            }
          }
          await formFeedbacksRequester.send({
            ...createFeedbackEndpoint(props.projectRef),
            body: values,
            cancellable: true,
          });
          props.onSuccess();
          formController.resetFields();
        } catch (error) {
          if ((error as Error).message !== "")
            props.onError((error as Error).message);
        }
      }
    },
    [
      props.projectRef,
      formFeedbacksRequester.send,
      props.onError,
      props.onSuccess,
    ]
  );

  return (
    <Modal
      cancelText="Cancelar"
      centered={true}
      confirmLoading={formFeedbacksRequester.inProgress}
      okText="Enviar"
      title="Observações/Restrições"
      visible={props.isVisible}
      onCancel={() => cancelSubmition()}
      onOk={() => formController.submit()}
    >
      <Form form={formController} layout="vertical" onFinish={saveFeedback}>
        <Row>
          <Col span={24}>
            <Form.Item
              name="text"
              rules={[
                {
                  required: props.projectStatus === "reproved" ? true : false,
                  message: "Campo Obrigatório",
                },
                {
                  max: 3000,
                  message: "Número máximo de caracteres extrapolado",
                },
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
