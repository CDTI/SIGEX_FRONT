import { Space, Spin } from "antd";
import React from "react";

export const DefaultLoading = () => {
  return (
    <>
      <Space
        style={{
          width: "100%",
          height: "100%",
          minHeight: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" tip="Carregando"></Spin>
      </Space>
    </>
  );
};
