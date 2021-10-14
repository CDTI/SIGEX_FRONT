import React from "react";
import { Typography } from "antd";

interface Props
{
  label: string;
}

export const LabeledContent: React.FC<Props> = (props) =>
{
  return (
    <>
      <Typography.Title
        level={5}
        style={{ marginBottom: "0" }}
      >
        {props.label}
      </Typography.Title>

      {props.children}
    </>
  );
};