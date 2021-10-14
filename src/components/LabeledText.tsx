import React, { ReactNode } from "react";
import { Typography } from "antd";

interface Props
{
  label: string;
  text: string;
}

export const LabeledText: React.FC<Props> = (props) =>
{
  return (
    <Typography.Text>
      <Typography.Text strong>{props.label}:</Typography.Text>
      &nbsp;
      {props.text}
    </Typography.Text>
  );
};