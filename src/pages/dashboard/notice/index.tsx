import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  notification,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Typography,
} from "antd";
import {
  CopyOutlined,
  EditOutlined,
  ClearOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import { useHttpClient } from "../../../hooks/useHttpClient";
import Structure from "../../../components/layout/structure";
import { Notice } from "../../../interfaces/notice";
import { changeNoticeStatusEndpoint } from "../../../services/endpoints/notices";
import { Category } from "../../../interfaces/category";
import { getAllCategories } from "../../../services/category_service";
import { getAllNoticesPaginated } from "../../../services/notice_service";

export const Notices: React.FC = () => {
  const location = useLocation();

  const [form] = Form.useForm();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [shouldReloadNotices, setShouldReloadNotices] = useState(1);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [year, setYear] = useState<number | undefined>(undefined);
  const [semester, setSemester] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [name, setName] = useState<string | undefined>(undefined);
  let query = {
    page: page,
    limit: limit,
    name: name,
    category: category,
    projectExecutionPeriod: semester,
    year: year,
  };

  const listNoticesRequester = useHttpClient();
  const switchNoticesRequester = useHttpClient();

  const submitSearch = async (data: any) => {
    console.log(data);
    const notices = await getAllNoticesPaginated(data)
      .then((res) => {
        setNotices(res.docs);
        setTotalPages(res.totalPages);
      })
      .catch((err) => {
        console.log(err);
        notification.error({
          message: "Ocorreu um erro durante a busca! Tente novamente",
        });
      });
  };

  const cleanFilters = () => {
    form.resetFields();
    setPage(1);
    setLimit(10);
    setCategory(undefined);
    setName(undefined);
    setSemester(undefined);
    setYear(undefined);
    setShouldReloadNotices(shouldReloadNotices + 1);
  };

  useEffect(() => {
    return () => {
      listNoticesRequester.halt();
      switchNoticesRequester.halt();
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        submitSearch(query);
        const categories = await getAllCategories();
        setCategories(categories);
      } catch (error) {
        if ((error as Error).message !== "")
          notification.error({ message: (error as Error).message });
      }
    })();
  }, [shouldReloadNotices, page, limit]);

  const toggleNoticeStatus = useCallback(
    async (id: string, isActive: boolean) => {
      try {
        await switchNoticesRequester.send({
          method: "PUT",
          url: changeNoticeStatusEndpoint(id),
          cancellable: true,
        });

        setNotices((prevState) => {
          const index = prevState.findIndex((n: Notice) => n._id === id)!;
          return [
            ...prevState.slice(0, index),
            { ...prevState[index], isActive },
            ...prevState.slice(index + 1),
          ];
        });

        const status = isActive ? "habilitado" : "desabilitado";

        notification.success({
          message: `O edital foi ${status} com sucesso!`,
        });

        setShouldReloadNotices(shouldReloadNotices + 1);
      } catch (error) {
        if ((error as Error).message !== "")
          notification.error({ message: (error as Error).message });
      }
    },
    [switchNoticesRequester.send]
  );

  const tableColumns = useMemo(
    () => [
      {
        key: "name",
        title: "Nome",
        dataIndex: "name",
      },
      {
        key: "category",
        title: "Categoria",
        dataIndex: "category",
        render: (text: string, record: Notice) => (
          <Typography>{(record.category as Category).name}</Typography>
        ),
      },
      {
        key: "semester",
        title: "Semestre",
        dataIndex: "projectExecutionPeriod",
      },
      {
        key: "isActive",
        title: "Ativo?",
        dataIndex: "isActive",
        render: (text: string, record: Notice) => (
          <Switch
            checked={record.isActive}
            loading={switchNoticesRequester.inProgress}
            onChange={(isChecked: boolean) =>
              toggleNoticeStatus(record._id!, isChecked)
            }
          />
        ),
      },
      {
        key: "actions",
        title: "Ações",
        render: (text: string, record: Notice) => (
          <Space size="middle">
            <Button>
              <Link
                to={{
                  pathname: `${location.pathname}/editar/${record._id}`,
                  state: { notice: record },
                }}
              >
                <EditOutlined /> Editar
              </Link>
            </Button>
            ,
            <Button>
              <Link
                to={{
                  pathname: `${location.pathname}/criar`,
                  state: { notice: record },
                }}
              >
                <CopyOutlined /> Duplicar
              </Link>
            </Button>
          </Space>
        ),
      },
    ],
    []
  );

  return (
    <Structure title="Editais">
      <Button type="primary">
        <Link to={`${location.pathname}/criar`}>Cadastrar edital</Link>
      </Button>

      <Form
        onFinish={(e) => submitSearch(query)}
        form={form}
        style={{
          marginTop: "10px",
        }}
      >
        <Row gutter={[8, 8]}>
          <Col span={12}>
            <Form.Item name="name" style={{ margin: "0" }}>
              <Input
                placeholder="Nome do projeto"
                style={{ width: "100%" }}
                onChange={(e) => setName(e.target.value)}
              ></Input>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="category" style={{ margin: "0" }}>
              <Select
                style={{ width: "100%" }}
                defaultValue=""
                onChange={(e) => setCategory(e)}
                options={[
                  { label: "Selecione uma categoria", value: "" },
                ].concat(
                  categories.map((c: Category) => ({
                    key: c._id!,
                    value: c._id!,
                    label: c.name,
                  }))
                )}
              ></Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="projectExecutionPeriod" style={{ margin: "0" }}>
              <Select
                style={{ width: "100%" }}
                defaultValue=""
                onChange={(e) => setSemester(e)}
                options={[
                  { label: "Selecione um período", value: "" },
                  { label: "1º Semestre", value: "1° Semestre" },
                  { label: "2º Semestre", value: "2° Semestre" },
                ]}
              ></Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="year" style={{ margin: "0" }}>
              <DatePicker
                placeholder="Selecione um ano"
                picker="year"
                style={{ width: "100%" }}
                onChange={(e) => setYear(e?.year())}
              />
            </Form.Item>
          </Col>
          <Col span={24} style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%", margin: "0 auto" }}
            >
              <SearchOutlined />
              Pesquisar
            </Button>
          </Col>
          <Col span={24} style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="primary"
              style={{ width: "100%", margin: "0 auto" }}
              onClick={cleanFilters}
            >
              <ClearOutlined />
              Limpar Filtros
            </Button>
          </Col>
        </Row>
      </Form>

      <Table
        columns={tableColumns}
        dataSource={notices}
        pagination={{
          current: page,
          defaultPageSize: 10,
          defaultCurrent: 1,
          pageSize: limit,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "30"],
          total: totalPages * limit,
          onChange: (actualPage, actualLimit) => {
            setPage(actualPage);
            setLimit(actualLimit!);
          },
        }}
      />
    </Structure>
  );
};
