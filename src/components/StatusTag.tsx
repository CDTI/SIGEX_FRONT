import { Tag } from "antd";
import React from "react";
import { ProjectStatus } from "../interfaces/project";

interface Props {
  color?: string;
  style?: React.CSSProperties;
  status?: ProjectStatus;
}

export const StatusTag: React.FC<Props> = (props) => {
  if (props.status != null)
    switch (props.status) {
      case "pending":
        return (
          <Tag color="#f9a03f" style={{ color: "#000", ...props.style }}>
            Pendente
          </Tag>
        );

      case "reproved":
        return (
          <Tag color="#acc5cf" style={{ color: "#000", ...props.style }}>
            Não aprovado
          </Tag>
        );

      case "notSelected":
        return (
          <Tag color="#b3afc8" style={{ color: "#000", ...props.style }}>
            Aprovado e não selecionado
          </Tag>
        );

      case "selected":
        return (
          <Tag color="#8dc898" style={{ color: "#000", ...props.style }}>
            Selecionado
          </Tag>
        );

      case "finished":
        return (
          <Tag color="teal" style={{ color: "#fff", ...props.style }}>
            Finalizado
          </Tag>
        );
    }

  return (
    <Tag color={props.color} style={props.style}>
      {props.children}
    </Tag>
  );
};
