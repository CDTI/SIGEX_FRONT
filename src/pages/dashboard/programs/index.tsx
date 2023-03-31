import React, { useEffect, useState } from "react";
import { List, Button, Typography } from "antd";

import { Program } from "../../../interfaces/program";
import {
  listActivePrograms,
  listPrograms,
} from "../../../services/program_service";
import Structure from "../../../components/layout/structure";

export const Programs: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>();

  useEffect(() => {
    (async () => {
      const response = await listActivePrograms();
      console.log(response);
      setPrograms(response);
    })();
  }, []);

  return (
    <Structure title="Lista de Programas">
      <List
        itemLayout="horizontal"
        dataSource={programs}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Typography
                  style={{
                    color: "#1890ff",
                    fontSize: "16px",
                    textDecoration: "underline",
                  }}
                >
                  {item.name}
                </Typography>
              }
              description={<Typography>{item.description}</Typography>}
            />
          </List.Item>
        )}
      />
    </Structure>
  );
};
