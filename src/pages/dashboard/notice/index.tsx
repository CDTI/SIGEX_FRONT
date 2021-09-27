import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import
{
  Button,
  List,
  notification,
  Switch,
  Typography
} from "antd";
import { CopyOutlined, EditOutlined } from "@ant-design/icons";

import { useHttpClient } from "../../../hooks/useHttpClient";
import Structure from "../../../components/layout/structure";
import { Notice } from "../../../interfaces/notice";
import
{
  changeNoticeStatusEndpoint,
  getAllNoticesEndpoint
} from "../../../services/endpoints/notices";

export const Notices: React.FC = () =>
{
  const [notices, setNotices] = useState<Notice[]>([]);
  const [shouldReloadNotices, setShouldReloadNotices] = useState(true);

  const listNoticesRequester = useHttpClient();
  const switchNoticesRequester = useHttpClient();

  useEffect(() =>
  {
    return () =>
    {
      listNoticesRequester.halt();
      switchNoticesRequester.halt();
    }
  }, []);

  useEffect(() =>
  {
    if (shouldReloadNotices)
    {
      (async () =>
      {
        try
        {
          const notices = await listNoticesRequester.send<Notice[]>(
          {
            method: "GET",
            url: getAllNoticesEndpoint(),
            cancellable: true
          });

          setNotices(notices?.map((n: Notice) => ({ ...n, key: n._id! })) ?? []);

          setShouldReloadNotices(false);
        }
        catch (error)
        {
          if ((error as Error).message !== "")
            notification.error({ message: (error as Error).message });
        }
      })();
    }
  }, [shouldReloadNotices]);

  const toggleNoticeStatus = useCallback(async (id: string, isActive: boolean) =>
  {
    try
    {
      await switchNoticesRequester.send(
      {
        method: "PUT",
        url: changeNoticeStatusEndpoint(id),
        cancellable: true
      });

      setNotices((prevState) =>
      {
        const index = prevState.findIndex((n: Notice) => n._id === id)!;
        return (
        [
          ...prevState.slice(0, index),
          { ...prevState[index], isActive },
          ...prevState.slice(index + 1)
        ]);
      });

      const status = isActive ? "habilitado" : "desabilitado";

      notification.success({ message: `O edital foi ${status} com sucesso!` });

      setShouldReloadNotices(true);
    }
    catch (error)
    {
      if ((error as Error).message !== "")
        notification.error({ message: (error as Error).message });
    }
  }, [switchNoticesRequester.send]);

  return (
    <Structure title="Editais">
      <Link to="/dashboard/editais/criar">Cadastrar edital</Link>

      <List
        itemLayout="horizontal"
        dataSource={notices}
        renderItem={(item) => (
          <List.Item
            actions={
            [
              <Switch
                checked={item.isActive}
                loading={switchNoticesRequester.inProgress}
                onChange={(isChecked: boolean) => toggleNoticeStatus(item._id!, isChecked)}
              />,

              <Button>
                <Link
                  to={
                  {
                    pathname: `/dashboard/editais/editar/${item._id}`,
                    state: { notice: item }
                  }}
                >
                  <EditOutlined /> Editar
                </Link>
              </Button>,

              <Button>
                <Link
                  to={
                  {
                    pathname: "/dashboard/editais/criar",
                    state: { notice: item }
                  }}
                >
                  <CopyOutlined /> Duplicar
                </Link>
              </Button>
            ]}
          >
            <Typography>{item.name}</Typography>
          </List.Item>)}
      />
    </Structure>
  );
};
