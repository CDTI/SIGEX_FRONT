import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import CreateNotice from "./CreateNotice";
import AddCategories from "./AddCategories";

import Structure from "../../../../components/layout/structure";
import { INotice } from "../../../../interfaces/notice";
import { createNotice, getNotice, updateNotice } from "../../../../services/notice_service";

interface UrlParams
{
  id: string;
}

const CreateNoticeController: React.FC = () =>
{
  const params = useParams<UrlParams>();
  const history = useHistory();

  const [content, setContent] =
    useState<"CreateNotice" | "AddCategories">("CreateNotice");

  const [notice, setNotice] = useState<INotice>(
  {
    number: 0,
    name: "",
    type: "common",
    canAccess: [],
    timetables: [],
    isActive: false,
    createdAt: new Date(),
    updateAt: new Date()
  });

  const { id: noticeId } = params;
  useEffect(() =>
  {
    if (noticeId !== undefined)
      (async () => setNotice(await getNotice(noticeId)))();
  }, [noticeId]);

  const handleOnBack = () =>
  {
    if (content === "CreateNotice")
      history.goBack();
    else
      setContent("CreateNotice");
  };

  const handleOnSubmit = async (values: INotice) =>
  {
    if (content === "CreateNotice")
    {
      setNotice(
      {
        ...notice,
        number: values.number,
        name: values.name,
        canAccess: values.canAccess
      });

      setContent("AddCategories");
    }
    else
    {
      await (params.id === undefined
        ? createNotice({
          ...notice,
          timetables: values.timetables,
          isActive: true
        })
        : updateNotice(params.id , {
          ...notice,
          timetables: values.timetables,
          isActive: true
        }));

      history.push("/dashboard/notices");
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
    <Structure title={`${notice._id === "" ? "Criar" : "Alterar"} edital`}>
      {contents[content]}
    </Structure>);
};

export default CreateNoticeController;