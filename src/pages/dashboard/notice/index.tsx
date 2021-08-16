import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import
{
  Button,
  List,
  notification,
  Switch,
  Typography
} from "antd";
import { EditOutlined } from "@ant-design/icons";

import Structure from "../../../components/layout/structure";
import { Notice } from "../../../interfaces/notice";

import
{
  getAllNotices,
  changeNoticeStatus
} from "../../../services/notice_service";

export const Notices: React.FC = () =>
{
  const [periods, setPeriods] = useState<Notice[]>([]);
  const [initialState, setInitialState] = useState(0);

  useEffect(() =>
  {
    (async () => setPeriods(await getAllNotices()))();
  }, [initialState]);

  const changeStatus = async (id: string) =>
  {
    try
    {
      const message = await changeNoticeStatus(id);
      notification.success({ message });
      setInitialState(initialState + 1);
    }
    catch (err)
    {
      notification.error({ message: err.response?.data ?? err.message });
    }
  };

  return (
    <Structure title="Editais">
      <Link to="/dashboard/notices/create">Cadastrar edital</Link>

      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={periods}
        renderItem={(item) =>
          (<List.Item
            actions={
            [
              <Switch
                defaultChecked={item.isActive}
                onChange={() => changeStatus(item._id!)}
              />,

              <Link to={`/dashboard/notices/edit/${item._id}`}>
                <Button style={{ color: "#333" }}>
                  Editar <EditOutlined />
                </Button>
              </Link>,
            ]}
          >
            <Typography>{item.name}</Typography>
          </List.Item>)}
      />
    </Structure>
  );
};
