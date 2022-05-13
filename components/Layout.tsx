import React from "react";
import Head from "next/head";

type Props = {
  title: string;
  children: JSX.Element;
};

const Layout: React.FC<Props> = ({ title, children }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {children}
    </div>
  );
};

export default Layout;
