import React from "react";

type Props = React.PropsWithChildren<{}>;

const SidebarWrapper = ({ children }: Props) => {
  return (
    <div className="h-full w-full flex flex-col lg:flex-row gap-4">
      <main className="h-full w-full flex gap-4">{children}</main>
    </div>
  );
};

export default SidebarWrapper;
