import { ComponentType } from "react";
import AppLayout, { AppLayoutProps } from "./AppLayout";

const withAppLayout = <P extends Object>(
  Component: ComponentType<P>,
  appLayoutProps?: AppLayoutProps,
) => {
  const Enhanced = (props: P) => {
    return (
      <AppLayout {...appLayoutProps}>
        <Component {...(props as P)} />
      </AppLayout>
    );
  };

  return Enhanced;
};

export default withAppLayout;
