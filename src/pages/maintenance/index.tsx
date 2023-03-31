import { Space, Spin, Typography } from "antd";
import React from "react";
import logo from "../../assets/sigex.png";

export const Maintenance: React.FC = () => {
  return (
    <Space
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: "#002140",
      }}
    >
      <img src={logo} alt="SIGEX logo" height={150} />
      <Typography
        style={{
          fontSize: "32px",
          color: "white",
          marginBottom: "20px",
        }}
      >
        Estamos em manutenção. Por favor aguarde.
      </Typography>
      <Spin size="large"></Spin>
    </Space>
  );
};
