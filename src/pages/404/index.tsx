import React from "react";
import { Link } from "react-router-dom";
import { Result, Button } from "antd";

export const NotFound: React.FC = () =>
{
  return (
    <div
      style={
      {
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="Desculpe, esta página não existe."
        extra={
          <Button type="primary">
            <Link to="/dashboard">
              Voltar
            </Link>
          </Button>
        }
      />
    </div>
  );
};
