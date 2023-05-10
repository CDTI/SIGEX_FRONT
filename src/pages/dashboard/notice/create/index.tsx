import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Button, Col, Form, Result, Row, Steps } from "antd";
import { Store } from "antd/lib/form/interface";
import { useHistory, useLocation, useParams } from "react-router-dom";

import { FormSteps, useFormStateMachine } from "./hooks/useFormMachine";
import { MainDataForm } from "./components/MainForm";
import { TimetablesForm } from "./components/TimetablesForm";

import { useHttpClient } from "../../../../hooks/useHttpClient";
import Structure from "../../../../components/layout/structure";
import { Notice } from "../../../../interfaces/notice";
import {
  createNoticeEndpoint,
  updateNoticeEndpoint,
} from "../../../../services/endpoints/notices";

interface FormView {
  title: string;
  view: ReactNode;
}

interface LocationState {
  notice?: Notice;
}

interface UrlParams {
  id: string;
}

export const categoriesKey = "categories";
export const rolesKey = "roles";

export const CreateNoticePage: React.FC = () => {
  const history = useHistory();
  const params = useParams<UrlParams>();
  const location = useLocation<LocationState>();

  const [failedSubmitMessage, setFailedSubmitMessage] = useState("");
  const [formState, sendEvent] = useFormStateMachine();
  const [formController] = Form.useForm();
  const formNoticesRequester = useHttpClient();

  useEffect(() => {
    if (location.state?.notice != null)
      sendEvent({
        type: "RESTORE",
        payload: { step: 0, data: location.state.notice },
      });

    return () => {
      formNoticesRequester.halt();

      localStorage.removeItem(categoriesKey);
      localStorage.removeItem(rolesKey);
    };
  }, [location.state, sendEvent, formNoticesRequester.halt]);

  useEffect(() => {
    if (formState.value === "pending") {
      (async () => {
        try {
          await formNoticesRequester.send(
            params.id == null
              ? {
                  method: "POST",
                  url: createNoticeEndpoint(),
                  body: formState.context.data,
                  cancellable: true,
                }
              : {
                  method: "PUT",
                  url: updateNoticeEndpoint(params.id),
                  body: formState.context.data,
                  cancellable: true,
                }
          );

          sendEvent({ type: "SUCCESS" });
        } catch (error) {
          if ((error as Error).message !== "")
            setFailedSubmitMessage((error as Error).message);

          sendEvent({ type: "ERROR" });
        }
      })();
    }
  }, [
    formState.context,
    formState.value,
    params.id,
    sendEvent,
    formNoticesRequester.send,
  ]);

  const goBack = useCallback(() => {
    if (formState.value === "main" || formState.value === "succeeded")
      // history.goBack();
      history.push("/editais");
    else
      sendEvent(
        formState.value === "failed" ? { type: "REVIEW" } : { type: "PREVIOUS" }
      );
  }, [history, formState.value, sendEvent]);

  const handleFormFinished = useCallback(
    (formName: string, values: Store) => {
      switch (formName) {
        case "main":
          sendEvent({
            type: "NEXT",
            payload: values as Notice,
          });

          break;

        case "timetables":
          sendEvent({
            type: "SAVE",
            payload: values,
          });

          break;
      }
    },
    [sendEvent]
  );

  const forms = useMemo(
    () =>
      new Map<string, FormView>([
        [
          "main",
          {
            title: "Informações básicas",
            view: (
              <MainDataForm
                formController={formController}
                initialValues={formState.context.data}
              />
            ),
          },
        ],

        [
          "timetables",
          {
            title: "Categorias e horários",
            view: (
              <TimetablesForm
                formController={formController}
                initialValues={formState.context.data}
              />
            ),
          },
        ],
      ]),
    [formController, formState.context]
  );

  if (formState.value === "failed")
    return (
      <Result
        status="error"
        title="Ops! Algo deu errado!"
        subTitle={failedSubmitMessage}
        extra={[
          <Button type="primary" onClick={() => goBack()}>
            Voltar
          </Button>,
        ]}
      />
    );

  if (formState.value === "succeeded")
    return (
      <Result
        status="success"
        title="Edital salvo com sucesso!"
        extra={[
          <Button type="primary" onClick={() => goBack()}>
            Continuar
          </Button>,
        ]}
      />
    );

  return (
    <Structure title={`${params.id == null ? "Cadastrar" : "Alterar"} edital`}>
      <Form.Provider
        onFormFinish={(name, { values }) => handleFormFinished(name, values)}
      >
        <Row justify="center" gutter={[0, 24]}>
          <Col xs={24} xl={21} xxl={18}>
            <Steps type="navigation" current={formState.context.step}>
              {FormSteps.map((k: string) => (
                <Steps.Step key={k} title={forms.get(k)!.title} />
              ))}
            </Steps>
          </Col>

          <Col xs={24} xl={21} xxl={18}>
            {forms.get(FormSteps[formState.context.step])!.view}
          </Col>

          <Col xs={24} xl={21} xxl={18}>
            <Row justify="space-between">
              <Button
                type="default"
                disabled={formNoticesRequester.inProgress}
                onClick={() => goBack()}
              >
                Voltar
              </Button>

              <Button
                type="primary"
                loading={formNoticesRequester.inProgress}
                onClick={() => formController.submit()}
              >
                {FormSteps[formState.context.step] === "timetables"
                  ? "Salvar"
                  : "Próximo"}
              </Button>
            </Row>
          </Col>
        </Row>
      </Form.Provider>
    </Structure>
  );
};
