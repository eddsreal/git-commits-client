import React from "react";
import Head from "next/head";

type Props = {
  title: string;
  children: JSX.Element;
};

const Layout: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="mt-1 lg:mt-20">
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {children}
      <p className="w-full text-center my-10 text-primary">Made with 💙 by <a className="font-[700]" href="https://www.linkedin.com/in/eddsreal/" target="_blank" rel="noopener noreferrer">Edwin Mendoza</a></p>
    </div>
  );
};

export default Layout;
