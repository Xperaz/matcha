import SidebarWrapper from "@/components/organisms/messages/SidebarWrapper";
import React from "react";

type Props = React.PropsWithChildren<{}>;

const ConversationLayout = ({ children }: Props) => {
  return <SidebarWrapper>{children}</SidebarWrapper>;
};

export default ConversationLayout;
