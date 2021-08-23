import React, { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import ReactDOM from "react-dom";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { Button, Col, Form, Modal, Result, Row, Spin, Steps, Typography } from "antd";
import { Store } from "antd/lib/form/interface";
import { StopOutlined } from "@ant-design/icons";

import { MainDataForm } from "./components/MainDataForm";
import { AssociatesForm } from "./components/AssociatesForm";
import { CommunityForm } from "./components/CommunityForm";
import { ArrangementForm } from "./components/ArrangementForm";
import { ResourcesForm } from "./components/ResourcesForm";
import { FormSteps, projectFormStateReducer } from "./helpers/stateMachine";
import { FormsMap, UrlParams } from "./helpers/types";

import { Schedule } from "../../../../../interfaces/notice";
import { Planning, Project, Community, Resource, Partnership } from "../../../../../interfaces/project";
import { hasActiveNoticesForUser } from "../../../../../services/notice_service";
import { createProject, updateProject } from "../../../../../services/project_service";
import { useAuth } from "../../../../../context/auth";
import Structure from "../../../../../components/layout/structure";

const savedStateKey = "project";
export const noticesKey = "notices";
export const programsKey = "programs";

export const ProposalForm: React.FC = () =>
{
  const { user } = useAuth();

  const { id } = useParams<UrlParams>();
  const location = useLocation();
  const history = useHistory();

  const [isFirstExeution, setIsFirstExecution] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnyActiveNotice, setHasAnyActiveNotice] = useState(true);

  const [projectFormController] = Form.useForm();
  const [submitHasFailed, setSubmitHasFailed] = useState(false);
  const [failedSubmitMessage, setFailedSubmitMessage] = useState("");
  const [projectFormState, dispatchProjectFormState] = useReducer(
    projectFormStateReducer,
    { step: "mainData" });

  const [loadSavedStateDialogIsVisible, setLoadSavedStateModalIsVisible] = useState(false);

  useEffect(() =>
  {
    (async () =>
    {
      setIsLoading(true);

      const hasAnyActiveNotice = await hasActiveNoticesForUser(user!._id!);
      setHasAnyActiveNotice(hasAnyActiveNotice);

      const project = location.state;
      if (project != null)
      {
        dispatchProjectFormState({ type: "SET_DATA", payload: project as Project });
      }
      else if (localStorage.getItem(savedStateKey) != null)
      {
        if (hasAnyActiveNotice)
          setLoadSavedStateModalIsVisible(true);
        else
          localStorage.removeItem(savedStateKey);
      }

      setIsLoading(false);
      setIsFirstExecution(false);
    })();

    return () =>
    {
      localStorage.removeItem(noticesKey);
      localStorage.removeItem(programsKey);
    }
  }, []);

  useEffect(() =>
  {
    if (!isFirstExeution)
    {
      if (projectFormState.step !== "completed")
      {
        localStorage.setItem(savedStateKey, JSON.stringify(
        {
          ...projectFormState,
          step: projectFormState.step !== "pending"
            ? projectFormState.step
            : "resources"
        }));

        if (projectFormState.step === "pending")
        {
          (async () =>
          {
            try
            {
              await (id == null
                ? createProject(projectFormState.data!)
                : updateProject(id, projectFormState.data!));
            }
            catch (error)
            {
              setSubmitHasFailed(true);

              let message = "";
              if (error.response)
                message = error.response.data;
              else if (error.request)
                message = "Não houve resposta do servidor!";

              setFailedSubmitMessage(message);
            }
            finally
            {
              dispatchProjectFormState({ type: "NEXT", payload: null });
            }
          })();
        }
      }
      else if (!submitHasFailed)
      {
        localStorage.removeItem(savedStateKey);
      }
    }
  }, [projectFormState.step]);

  const loadSavedState = useCallback((loadLocal: boolean = true) =>
  {
    if (loadLocal)
    {
      const savedState = localStorage.getItem(savedStateKey);
      if (savedState != null)
        dispatchProjectFormState({ type: "RESTORE", payload: JSON.parse(savedState) });
    }

    localStorage.removeItem(savedStateKey);

    setLoadSavedStateModalIsVisible(false);
  }, [savedStateKey]);

  const handleOnFormFinish = useCallback((formName: string, values: Store) =>
  {
    switch (formName)
    {
      case "mainData":
        const schedule = values.secondSemester?.map((s: string) =>
          JSON.parse(s) as Schedule) ?? [];

        dispatchProjectFormState(
        {
          type: "NEXT",
          payload:
          {
            ...values,
            author: user!._id!,
            firstSemester: schedule,
            secondSemester: schedule
          }
        });

        break;

      case "associates":
        dispatchProjectFormState(
        {
          type: "NEXT",
          payload: values.partnership as Partnership[]
        });

        break;

      case "community":
        dispatchProjectFormState(
        {
          type: "NEXT",
          payload: values as Community
        });

        break;

      case "arrangement":
        dispatchProjectFormState(
        {
          type: "NEXT",
          payload: values.planning as Planning[]
        });

        break;

      case "resources":
        dispatchProjectFormState(
        {
          type: "NEXT",
          payload: values as Resource
        });

        break;

      default:
        throw new Error("Invalid form name");
    }
  }, [user]);

  const goBack = useCallback(() =>
  {
    if (projectFormState.step === "mainData")
      history.goBack();
    else
      dispatchProjectFormState({ type: "PREVIOUS" });
  }, [projectFormState.step, history]);

  const loadSavedStateDialog = useMemo(() => (
    <Modal
      visible={loadSavedStateDialogIsVisible}
      centered={true}
      closable={false}
      okText="Continuar"
      cancelText="Descartar"
      onOk={() => loadSavedState()}
      onCancel={() => loadSavedState(false)}
    >
      <Typography.Paragraph>
        Existe uma proposta com o cadastro em andamento, deseja continuar de onde parou?
      </Typography.Paragraph>
    </Modal>
  ), [loadSavedStateDialogIsVisible, loadSavedState]);

  const forms: FormsMap = useMemo(() => (
  {
    mainData:
    {
      label: "Informações Básicas",
      form: (
        <MainDataForm
          formController={projectFormController}
          initialValues={projectFormState.data}
        />
      )
    },

    associates:
    {
      label: "Parcerias",
      form: (
        <AssociatesForm
          formController={projectFormController}
          initialValues={projectFormState.data?.partnership}
        />
      )
    },

    community:
    {
      label: "Comunidade",
      form: (
        <CommunityForm
          formContoller={projectFormController}
          initialValues={projectFormState.data?.specificCommunity}
        />
      )
    },

    arrangement:
    {
      label: "Planejamento",
      form: (
        <ArrangementForm
          formController={projectFormController}
          initialValues={projectFormState.data?.planning}
        />
      )
    },

    resources:
    {
      label: "Recursos",
      form: (
        <ResourcesForm
          formController={projectFormController}
          initialValues={projectFormState.data?.resources}
        />
      )
    }
  }), [projectFormState.data]);

  if (!hasAnyActiveNotice)
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
            onClick={() => history.push("/dashboard/myProjects")}
          >
            Continuar
          </Button>
        ]}
      />
    );

  if (projectFormState.step === "completed")
  {
    if (submitHasFailed)
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

    return (
      <Result
        status="success"
        title="Proposta salva com sucesso!"
        extra={
        [
          <Button
            type="primary"
            onClick={() => history.push("/dashboard/myProjects")}
          >
            Continuar
          </Button>
        ]}
      />
    );
  }

  return (
    <>
      {ReactDOM.createPortal(loadSavedStateDialog, document.getElementById("dialog-overlay")!)}

      <Spin spinning={isLoading}>
        <Structure title={`${id == null ? "Cadastrar" : "Alterar"} proposta`}>
          <Form.Provider onFormFinish={(name, { values }) => handleOnFormFinish(name, values)}>
            <Row justify="center" gutter={[0, 24]}>
              <Col xs={24} xl={21} xxl={18}>
                <Steps current={FormSteps[projectFormState.step].order}>
                  {Object.keys(FormSteps)
                    .filter((k: string) => k !== "pending" && k !== "completed")
                    .map((k: string) => <Steps.Step key={k} title={forms[k].label} />
                  )}
                </Steps>
              </Col>

              <Col xs={24} xl={21} xxl={18}>
                {forms[projectFormState.step !== "pending" ? projectFormState.step : "resources"].form}
              </Col>

              <Col xs={24} xl={21} xxl={18}>
                <Row justify="space-between">
                  <Button
                    type="default"
                    disabled={projectFormState.step === "pending"}
                    onClick={() => goBack()}
                  >
                    Voltar
                  </Button>

                  <Button
                    type="primary"
                    loading={projectFormState.step === "pending"}
                    onClick={() => projectFormController.submit()}
                  >
                    {projectFormState.step === "resources" || projectFormState.step === "pending"
                      ? "Salvar"
                      : "Próximo"}
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

// TODO: melhorar MaskedInput para telefones
