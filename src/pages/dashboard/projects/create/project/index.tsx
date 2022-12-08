import React, { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { Button, Col, Form, Modal, Result, Row, Spin, Steps, Typography } from "antd";
import { Store } from "antd/lib/form/interface";
import { StopOutlined } from "@ant-design/icons";

import { FormSteps, useFormStateMachine } from "./hooks/useFormMachine";
import { MainForm } from "./components/MainForm";
import { AssociatesForm } from "./components/AssociatesForm";
import { CommunityForm } from "./components/CommunityForm";
import { ArrangementsForm } from "./components/ArrangementsForm";
import { ResourcesForm } from "./components/ResourcesForm";

import { useHttpClient } from "../../../../../hooks/useHttpClient";
import Structure from "../../../../../components/layout/structure";

import { Schedule } from "../../../../../interfaces/notice";
import { Planning, Project, Community, Resources, Partnership } from "../../../../../interfaces/project";
import { createProjectEndpoint, updateProjectEndpoint } from "../../../../../services/endpoints/projects";
import { hasActiveNoticesEndpoint } from "../../../../../services/endpoints/users";
import { AuthContext } from "../../../../../context/auth";

interface FormView
{
  view: ReactNode;
  title: string;
}

interface LocationState
{
  project?: Project;
  context: "admin" | "user";
}

interface UrlParams
{
  id: string;
}

const savedStateKey = "project";
export const coursesKey = "courses";
export const noticesKey = "notices";
export const programsKey = "programs";
export const usersKey = "users";

export const CreateProposalPage: React.FC = () =>
{
  const authContext = useContext(AuthContext);
  const history = useHistory();
  const params = useParams<UrlParams>();
  const location = useLocation<LocationState>();

  const [failedSubmitMessage, setFailedSubmitMessage] = useState("");
  const [formState, sendEvent] = useFormStateMachine();
  const [formController] = Form.useForm();
  const formProjectsRequester = useHttpClient();

  const [hasActiveNotices, setHasActiveNotices] = useState(true);
  const validationNoticesRequester = useHttpClient();

  const [loaderModalIsVisible, setLoaderModalIsVisible] = useState(false);

  useEffect(() =>
  {
    (async () =>
    {
      const hasActiveNotices = await validationNoticesRequester.send<boolean>(
      {
        method: "GET",
        url: hasActiveNoticesEndpoint(),
        cancellable: true
      });

      setHasActiveNotices(hasActiveNotices ?? false);

      if (location.state.project != null)
        sendEvent(
        {
          type: "RESTORE",
          payload: { step: 0, data: location.state.project }
        });
      else if (localStorage.getItem(savedStateKey) != null)
        hasActiveNotices
          ? setLoaderModalIsVisible(true)
          : localStorage.removeItem(savedStateKey);
    })();

    return () =>
    {
      formProjectsRequester.halt();
      validationNoticesRequester.halt();

      localStorage.removeItem(coursesKey);
      localStorage.removeItem(noticesKey);
      localStorage.removeItem(programsKey);
      localStorage.removeItem(usersKey);
      if (location.state.context === "admin")
        localStorage.removeItem(savedStateKey);
    }
  },
  [
    location.state,
    sendEvent,
    formProjectsRequester.halt,
    validationNoticesRequester.halt,
    validationNoticesRequester.send
  ]);

  useEffect(() =>
  {
    if (formState.value === "pending")
    {
      (async () =>
      {
        try
        {
          await formProjectsRequester.send(
          {
            ...(params.id == null
              ? createProjectEndpoint()
              : updateProjectEndpoint(params.id)),

            body: formState.context.data,
            cancellable: true
          });

          sendEvent({ type: "SUCCESS" });
        }
        catch (error)
        {
          if ((error as Error).message !== "")
            setFailedSubmitMessage((error as Error).message);

          sendEvent({ type: "ERROR" });
        }
      })();
    }
    else
    {
      formState.value === "succeeded"
        ? localStorage.removeItem(savedStateKey)
        : formState.context.data != null
          && localStorage.setItem(savedStateKey, JSON.stringify(formState.context));
    }
  },
  [
    formState.context,
    formState.value,
    params.id,
    sendEvent,
    formProjectsRequester.send
  ]);

  const removeSavedState = useCallback(() =>
  {
    localStorage.removeItem(savedStateKey);

    setLoaderModalIsVisible(false);
  }, []);

  const loadSavedState = useCallback(() =>
  {
    const savedState = localStorage.getItem(savedStateKey);
    if (savedState != null)
      sendEvent({ type: "RESTORE", payload: JSON.parse(savedState) });

    removeSavedState();
  }, [sendEvent, removeSavedState]);

  const handleFormFinished = useCallback((formName: string, values: Store) =>
  {
    switch (formName)
    {
      case "main":
        const schedule = values.secondSemester?.map((s: string) =>
          JSON.parse(s) as Schedule) ?? [];

        sendEvent(
        {
          type: "NEXT",
          payload:
          {
            ...values as Project,
            author: values.author != null ? values.author : authContext.user!._id!,
            firstSemester: schedule,
            secondSemester: schedule,
            status: formState.context.data?.status ?? "pending"
          }
        });

        break;

      case "associates":
        sendEvent(
        {
          type: "NEXT",
          payload: values.partnership as Partnership[]
        });

        break;

      case "community":
        sendEvent(
        {
          type: "NEXT",
          payload: values as Community
        });

        break;

      case "arrangements":
        sendEvent(
        {
          type: "NEXT",
          payload: values.planning as Planning[]
        });

        break;

      case "resources":
        sendEvent(
        {
          type: "SAVE",
          payload: values as Resources
        });

        break;
    }
  }, [authContext.user, formState.context, sendEvent]);

  const goBack = useCallback(() =>
  {
    if (!hasActiveNotices
        || formState.value === "main"
        || formState.value === "succeeded")
      history.goBack();
    else
      sendEvent(formState.value === "failed"
        ? { type: "REVIEW" }
        : { type: "PREVIOUS" });
  }, [hasActiveNotices, history, formState.value, sendEvent]);

  const loadSavedStateDialog = useMemo(() => (
    <Modal
      visible={loaderModalIsVisible}
      centered={true}
      closable={false}
      okText="Continuar"
      cancelText="Descartar"
      onOk={() => loadSavedState()}
      onCancel={() => removeSavedState()}
    >
      <Typography.Paragraph>
        Existe uma proposta com o cadastro em andamento, deseja continuar de onde parou?
      </Typography.Paragraph>
    </Modal>
  ), [loaderModalIsVisible, loadSavedState, removeSavedState]);

  const forms = useMemo(() => new Map<string, FormView>(
  [
    ["main",
    {
      title: "Informações Básicas",
      view: (
        <MainForm
          context={location.state.context}
          formController={formController}
          initialValues={formState.context.data}
        />
      )
    }],

    ["associates",
    {
      title: "Parcerias",
      view: (
        <AssociatesForm
          formController={formController}
          initialValues={formState.context.data?.partnership}
        />
      )
    }],

    ["community",
    {
      title: "Comunidade",
      view: (
        <CommunityForm
          formContoller={formController}
          initialValues={formState.context.data?.specificCommunity}
        />
      )
    }],

    ["arrangements",
    {
      title: "Planejamento",
      view: (
        <ArrangementsForm
          formController={formController}
          initialValues={formState.context.data?.planning}
        />
      )
    }],

    ["resources",
    {
      title: "Recursos",
      view: (
        <ResourcesForm
          formController={formController}
          initialValues={formState.context.data?.resources}
        />
      )
    }]
  ]), [formController, formState.context]);

  if (!hasActiveNotices)
    return (
      <Result
        status="error"
        icon={<StopOutlined />}
        title="Nenhum edital está ativo no momento!"
        subTitle="Tente novamente mais tarde, ou contate um administrador ou responsável."
        extra={
        [
          <Button
            type="primary"
            onClick={() => goBack()}
          >
            Continuar
          </Button>
        ]}
      />
    );

  if (formState.value === "failed")
    return (
      <Result
        status="error"
        title="Ops! Algo deu errado!"
        subTitle={failedSubmitMessage}
        extra={
        [
          <Button
            type="primary"
            onClick={() => goBack()}
            >
              Voltar
            </Button>
          ]}
        />
      );

  if (formState.value === "succeeded")
    return (
      <Result
        status="success"
        title="Proposta salva com sucesso!"
        extra={
        [
          <Button
            type="primary"
            onClick={() => goBack()}
          >
            Continuar
          </Button>
        ]}
      />
    );

  return (
    <>
      {ReactDOM.createPortal(loadSavedStateDialog, document.getElementById("dialog-overlay")!)}

      <Spin spinning={validationNoticesRequester.inProgress}>
        <Structure title={`${params.id == null ? "Cadastrar" : "Alterar"} proposta`}>
          <Form.Provider onFormFinish={(name, { values }) => handleFormFinished(name, values)}>
            <Row justify="center" gutter={[0, 24]}>
              <Col xs={24} xl={21} xxl={18}>
                <Steps type="navigation" current={formState.context.step}>
                  {FormSteps.map((k: string) =>
                    <Steps.Step key={k} title={forms.get(k)!.title} />
                  )}
                </Steps>
              </Col>

              <Col xs={24} xl={21} xxl={18}>
                {forms.get(FormSteps[formState.context.step])!.view}
              </Col>

              <Col xs={24} xl={21} xxl={18}>
                <Row justify="space-between">
                  <Button
                    type="default"
                    disabled={formProjectsRequester.inProgress}
                    onClick={() => goBack()}
                  >
                    Voltar
                  </Button>

                  <Button
                    type="primary"
                    loading={formProjectsRequester.inProgress}
                    onClick={() => formController.submit()}
                  >
                    {FormSteps[formState.context.step] === "resources"
                      ? "Salvar"
                      : "Próximo"
                    }
                  </Button>
                </Row>
              </Col>
            </Row>
          </Form.Provider>
        </Structure>
      </Spin>
    </>
  );
};
