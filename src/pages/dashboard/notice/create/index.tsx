import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { CreateNotice } from "./components/CreateNotice";
import { AddCategories } from "./components/AddCategories";

import Structure from "../../../../components/layout/structure";
import { Notice } from "../../../../interfaces/notice";
import { createNotice, getNotice, updateNotice } from "../../../../services/notice_service";
import { notification } from "antd";

interface UrlParams
{
  id: string;
}

export const CreateNoticePage: React.FC = () =>
{
  const params = useParams<UrlParams>();
  const history = useHistory();

  const [content, setContent] =
    useState<"CreateNotice" | "AddCategories">("CreateNotice");

  const [notice, setNotice] = useState<Notice>();

  const { id: noticeId } = params;
  useEffect(() =>
  {
    (async () =>
    {
      if (noticeId !== undefined)
        setNotice(await getNotice(noticeId));
    })();
  }, [noticeId]);

  const handleOnBack = () =>
  {
    if (content === "CreateNotice")
      history.goBack();
    else
      setContent("CreateNotice");
  };

  const handleOnSubmit = async (values: Notice) =>
  {
    if (content === "CreateNotice")
    {
      setNotice((prevState) =>
      {
        const newState =
        {
          number: values.number,
          name: values.name,
          canAccess: values.canAccess,
          effectiveDate: values.effectiveDate,
          expirationDate: values.expirationDate,
          reportDeadline: values.reportDeadline
        };

        if (prevState !== undefined)
          return { ...prevState, ...newState };

        return (
        {
          ...newState,
          type: "common",
          timetables: [],
          isActive: true
        });
      });

      setContent("AddCategories");
    }
    else
    {
      try
      {
        await (params.id === undefined
          ? createNotice({ ...notice!, timetables: values.timetables })
          : updateNotice(params.id, { ...notice!, timetables: values.timetables }));

        history.push("/dashboard/notices");
      }
      catch (err)
      {
        notification.error({ message: err.response?.data ?? err.message });
      }
    }
  };

  const contents =
  {
    "CreateNotice":
      (<CreateNotice
        notice={notice}
        onBack={handleOnBack}
        onSubmit={handleOnSubmit} />),

    "AddCategories":
      (<AddCategories
        notice={notice}
        onBack={handleOnBack}
        onSubmit={handleOnSubmit} />)
  };

  return (
    <Structure title={`${notice === undefined ? "Cadastrar" : "Alterar"} edital`}>
      {contents[content]}
    </Structure>);
};
