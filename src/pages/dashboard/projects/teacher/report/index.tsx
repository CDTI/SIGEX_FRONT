import React, { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import ReactDOM from "react-dom";
import { useHistory, useLocation, useParams } from "react-router-dom";

import
{
  Button,
  Col,
  Modal,
  Result,
  Row,
  Steps,
  notification,
  Form
} from "antd";

import { ICommunityContact, IReport } from "../../../../../interfaces/report";

import Structure from "../../../../../components/layout/structure";

import Introduction from "./components/Introduction";
import Methodology from "./components/Methodology";
import Results from "./components/Results";
import Discussion from "./components/Discussion";
import Community from "./components/Community";

import { FormSteps, reportFormStateReducer } from "./helpers/stateMachine";
import { ContentMap, UrlParams } from "./helpers/types";
import { createReport, updateReport } from "../../../../../services/project_service";
import { useUrlQuery } from "../../../../../util";

const ReportForm: React.FC = () =>
{
  const [firstExecution, setFirstExecution] = useState(true);
  const [showDialog, setShowDialog] = useState(false);

  const [reportForm] = Form.useForm();
  const [reportFormState, dispatchReportFormState] = useReducer(
    reportFormStateReducer,
    { step: "introduction" });

  const { id } = useParams<UrlParams>();
  const urlQuery = useUrlQuery();
  const location = useLocation();
  const history = useHistory();

  const projectId = urlQuery.get("project");
  const savedStateKey = useMemo(() => `reportFormState_${projectId}`, []);

  useEffect(() =>
  {
    const report = location.state;
    if (report !== undefined)
      dispatchReportFormState({ type: "SET_DATA", payload: report as IReport });
    else if (localStorage.getItem(savedStateKey) !== null)
      setShowDialog(true);

    setFirstExecution(false);
  }, []);

  useEffect(() =>
  {
    if (reportFormState.step === "completed")
    {
      (async () =>
      {
        try
        {
          await (id !== undefined
            ? updateReport(id.split("?")[0], reportFormState.data!)
            : createReport(projectId!, reportFormState.data!));

          localStorage.removeItem(savedStateKey);
        }
        catch (err)
        {
          notification.error({ message: "Ops! Ocorreu um erro." });
        }
      })();
    }
    else if (!firstExecution)
    {
      localStorage.setItem(savedStateKey, JSON.stringify(reportFormState));
    }
  }, [reportFormState.step]);

  const loadSavedState = useCallback((loadLocal: boolean) =>
  {
    if (loadLocal)
    {
      const savedState = localStorage.getItem(savedStateKey);
      if (savedState !== null)
        dispatchReportFormState({ type: "RESTORE", payload: JSON.parse(savedState) });
    }

    localStorage.removeItem(savedStateKey);

    setShowDialog(false);
  }, []);

  const dialog = useMemo(() => (
    <Modal
      visible={showDialog}
      title="Existe um cadastro em andamento, deseja carregar?"
      footer={
      [
        (<Button
          type="primary"
          style={{ backgroundColor: "#439A86" }}
          onClick={() => loadSavedState(true)}
        >
          Sim
        </Button>),

        (<Button
          type="primary"
          style={{ backgroundColor: "#a31621" }}
          onClick={() => loadSavedState(false)}
        >
          Não
        </Button>)
      ]}
    />
  ), [showDialog]);

  const handleOnBack = useCallback(() =>
  {
    if (reportFormState.step === "introduction")
      history.goBack();
    else
      dispatchReportFormState({ type: "PREVIOUS" });
  }, [reportFormState.step]);

  const handleOnFormFinish = useCallback((values: IReport) =>
  {
    dispatchReportFormState({ type: "NEXT", payload: { ...values } });
  }, [reportFormState.step]);

  const contents: ContentMap = useMemo(() => (
  {
    "introduction":
    {
      title: "Introdução",
      content: (
        <Introduction
          formController={reportForm}
          initialValues={reportFormState.data}
        />
      )
    },

    "methodology":
    {
      title: "Procedimentos metodológicos",
      content: (
        <Methodology
          formController={reportForm}
          initialValues={reportFormState.data}
        />
      )
    },

    "results":
    {
      title: "Resultados",
      content: (
        <Results
          formController={reportForm}
          initialValues={reportFormState.data}
        />
      )
    },

    "discussion":
    {
      title: "Discussão",
      content: (
        <Discussion
          formController={reportForm}
          initialValues={reportFormState.data}
        />
      )
    },

    "community":
    {
      title: "Comunidades",
      content: (
        <Community
          formController={reportForm}
          initialValues={reportFormState.data?.communityContacts}
        />
      )
    }
  }), [reportFormState.data]);

  if (reportFormState.step === "completed")
    return (
      <Result
        status="success"
        title="Relatório salvo com sucesso!"
        extra={(
          <Button
            type="primary"
            onClick={() => history.goBack()}
          >
            Voltar
          </Button>
        )}
      />
    );

  return (
    <>
      {ReactDOM.createPortal(dialog, document.getElementById("dialog-overlay")!)}

      <Structure title={`${id === undefined ? "Cadastrar" : "Alterar"} relatório`}>
        <Form.Provider
          onFormFinish={(name, { values, forms }) =>
            handleOnFormFinish(values as IReport)
          }
        >
          <Row gutter={[8, 8]} justify="center">
            <Col xs={24} xl={21} xxl={18}>
              <Steps current={FormSteps[reportFormState.step].order}>
                {Object.keys(FormSteps)
                  .filter((k: string) => k !== "completed")
                  .map((k: string) => <Steps.Step key={k} title={contents[k].title} />
                )}
              </Steps>
            </Col>

            <Col xs={24} xl={21} xxl={18}>
              {contents[reportFormState.step].content}
            </Col>

            <Col xs={24} xl={21} xxl={18}>
              <Row justify="space-between">
                <Button type="default" onClick={() => handleOnBack()}>
                  Voltar
                </Button>

                <Button type="primary" onClick={() => reportForm.submit()}>
                  {reportFormState.step === "community" ? "Salvar" : "Próximo"}
                </Button>
              </Row>
            </Col>
          </Row>
        </Form.Provider>
      </Structure>
    </>
  );
};

export default ReportForm;