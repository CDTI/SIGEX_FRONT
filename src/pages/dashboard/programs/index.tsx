import React, { useEffect, useState } from "react";
import { List, Button } from "antd";

import { Program } from "../../../interfaces/program";
import { listPrograms } from "../../../services/program_service";
import Structure from "../../../components/layout/structure";

export const Programs: React.FC = () =>
{
  const [programs, setPrograms] = useState<Program[]>();

  useEffect(() =>
  {
    (async () =>
    {
      const response = await listPrograms()
      setPrograms(response.programs)
    })();
  }, []);

  return (
    <Structure title="Lista de Programas">
      <List
        itemLayout="horizontal"
        dataSource={programs}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={<Button type="link">{item.name}</Button>}
              description={item.description}
            />
          </List.Item>
        )}
      />
    </Structure>
  );
};
