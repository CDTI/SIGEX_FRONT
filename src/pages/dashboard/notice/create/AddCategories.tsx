import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { ICategory } from "../../../../interfaces/category";
import { getActiveCategories } from "../../../../services/category_service";
import { ContainerFlex } from "../../../../global/styles";
import { INotice, ITimetable } from "../../../../interfaces/notice";

interface Props
{
  notice: INotice;
  onBack(): void;
  onSubmit(notice: INotice): void;
}

const { Option } = Select;

const AddCategories: React.FC<Props> = ({ notice, onBack, onSubmit }) =>
{
  const [shouldDisableButton, setShouldDisableButton] = useState(true);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const [form] = Form.useForm();

  useEffect(() =>
  {
    (async () => setCategories(await getActiveCategories()))();
    form.setFieldsValue(notice);
  }, [form, notice]);

  const handleOnFinish = async (values: INotice) => onSubmit(values);

  const handleOnClick = (add: (v?: any, i?: number | undefined) => void) =>
  {
    let categoryId: string = form.getFieldValue("categorySelector");
    if (!form.getFieldValue("timetables")?.find((tt: ITimetable)=> tt.category === categoryId))
      add({ category: categoryId });

    form.setFieldsValue({ categorySelector: undefined });
    setShouldDisableButton(true);
  };

  const getCategoryName = (index: number) =>
  {
    let categoryId = form.getFieldValue("timetables")[index]?.category;
    return categories.find((c) => c._id === categoryId)?.name ?? "";
  };

  return (
    <ContainerFlex>
      <Form
        form={form}
        layout="vertical"
        style={{ width: "100%", maxWidth: "768px" }}
        onFinish={handleOnFinish}
      >
        <Form.Item
          name="categorySelector"
          label="Categoria"
          rules={[({ getFieldValue }) =>
          ({
            validator(_, value)
            {
              if (!getFieldValue("timetables")?.length)
                return Promise.reject(new Error("Adicione ao menos uma categoria"));

              if (getFieldValue("timetables").find((v: any) => v.category === value))
                return Promise.reject(new Error("Categoria já adicionada"));

              return Promise.resolve();
            }
          })]}
        >
          <Select
            options={categories.map((c) => ({ label: c.name, value: c._id }))}
            onChange={() => setShouldDisableButton(false)}/>
        </Form.Item>

        <Form.List name="timetables">
          {(categoryFields, { add, remove }) =>
            (<>
              <Form.Item>
                <Button
                  type="dashed"
                  block
                  disabled={shouldDisableButton}
                  onClick={() => handleOnClick(add)}
                >
                  <PlusOutlined /> Adicionar categoria
                </Button>
              </Form.Item>

              {categoryFields.map((categoryField, index) =>
                (<>
                  <Form.Item>
                    <Space style={{ width: "100%" }}>
                      <Button
                        type="link"
                        style={{ margin: "8px 0", padding: "0" }}
                        onClick={() => remove(categoryField.name)}
                      >
                        <MinusCircleOutlined />
                      </Button>

                      <h2 style={{ margin: "8px 0", padding: "0" }}>
                        {getCategoryName(index)}
                      </h2>
                    </Space>
                  </Form.Item>

                  <Form.Item
                    {...categoryField}
                    name={[categoryField.name, "category"]}
                    fieldKey={[categoryField.fieldKey, "category"]}
                    style={{ display: "none" }}
                  >
                    <Input type="hidden" />
                  </Form.Item>

                  <Form.List name={[categoryField.name, "schedules"]}>
                    {(scheduleFields, { add, remove }) =>
                    (<>
                      {scheduleFields.map((scheduleField) =>
                      (<>
                        <Space
                          align="start"
                          style={{ display: "flex", marginBottom: 8 }}
                          key={scheduleField.key}
                        >
                          <Button
                            type="link"
                            style={{ margin: "8px 0", padding: "0" }}
                            onClick={() => remove(scheduleField.name)}
                          >
                            <MinusCircleOutlined />
                          </Button>

                          <Form.Item
                            {...scheduleField}
                            label="Campus"
                            name={[scheduleField.name, "location"]}
                            fieldKey={[scheduleField.fieldKey, "location"]}
                            rules={[{ required: true, message: "Campo obrigatório" }]}
                          >
                            <Select>
                              <Option value="Campus Ecoville">Campus Ecoville</Option>
                              <Option value="Unidade Sants Andrade">Unidade Santo Andrade</Option>
                            </Select>
                          </Form.Item>

                          <Form.Item
                            {...scheduleField}
                            label="Período do dia"
                            name={[scheduleField.name, "period"]}
                            fieldKey={[scheduleField.fieldKey, "period"]}
                            rules={[{ required: true, message: "Campo obrigatório" }]}
                          >
                            <Select>
                              <Option value="Manhã">Manhã</Option>
                              <Option value="Tarde">Tarde</Option>
                              <Option value="Noite">Noite</Option>
                            </Select>
                          </Form.Item>

                          <Form.Item
                            {...scheduleField}
                            label="Dia da semana"
                            name={[scheduleField.name, "day"]}
                            fieldKey={[scheduleField.fieldKey, "day"]}
                            rules={[{ required: true, message: "Campo obrigatório" }]}
                          >
                            <Select>
                              <Option value="2">2ª feira</Option>
                              <Option value="3">3ª feira</Option>
                              <Option value="4">4ª feira</Option>
                              <Option value="5">5ª feira</Option>
                              <Option value="6">6ª feira</Option>
                            </Select>
                          </Form.Item>
                        </Space>
                      </>))}

                      <Form.Item>
                        <Button type="dashed" block onClick={() => add()}>
                          <PlusOutlined /> Adicionar agenda
                        </Button>
                      </Form.Item>
                    </>)}
                  </Form.List>
                </>))}
            </>)}
        </Form.List>

        <Form.Item>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button type="default" onClick={onBack}>
              Voltar
            </Button>

            <Button type="primary" htmlType="submit">
              Salvar
            </Button>
          </div>
        </Form.Item>
      </Form>
    </ContainerFlex>);
};

export default AddCategories;