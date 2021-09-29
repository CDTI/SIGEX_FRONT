import React, { ReactNode, useCallback, useMemo } from 'react'
import { Divider, PageHeader, Typography } from 'antd'
import { useHistory } from 'react-router';

interface Props
{
  title: string;
  backIcon?: ReactNode | boolean;
  onBack?(): void;
}

const Structure: React.FC<Props> = (props) =>
{
  const history = useHistory();

  const defaultOnBackBehaviour = useCallback(() => history.goBack(), []);

  const title = useMemo(() => (
    <Typography.Title level={2} style={{ margin: 0 }}>
      {props.title.toLocaleUpperCase()}
    </Typography.Title>
  ), [props.title]);

  return (
    <>
      <PageHeader
        title={title}
        backIcon={props.backIcon ?? false}
        style={{ padding: 0 }}
        onBack={props.onBack ?? defaultOnBackBehaviour}
      />

      <Divider />

      {props.children}
    </>
  );
};

export default Structure