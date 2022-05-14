import axios, { AxiosResponse } from "axios";
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useRouter } from "next/router";
import { useState } from "react";
const { Prism: SyntaxHighlighter } = require("react-syntax-highlighter");
import { dracula } from "../../../../utils/dracula";
import File from "../../../../components/File";
import Layout from "../../../../components/Layout";

type FolderProps = {
  params: {
    profile: string;
    repository: string;
  };
  content: string;
  activeProfile: string;
  repoName: string;
  path: string;
  errors: object[];
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const par: any | undefined = context.params;
  const [blob, path] = par.file?.split("--");
  //  Get current repo content
  const {
    data: { content },
  }: AxiosResponse<any> = await axios.get(
    `https://api.github.com/repos/${context.params?.profile}/${context.params?.repository}/git/blobs/${blob}`
  );
  const fileData = Buffer.from(content, "base64").toString();

  return {
    props: {
      params: context.params,
      content: fileData,
      path: path,
      activeProfile: context.params?.profile,
      repoName: context.params?.repository,
    },
  };
};

const Folder: NextPage<FolderProps> = ({
  activeProfile,
  repoName,
  content,
  path,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [load, setLoad] = useState(false);
  const router = useRouter();
  return (
    <Layout title={`Folder`}>
      <div className="container w-11/12 lg:w-1/2">
        <section>
          <h2 className="text-2xl font-[700] text-left mb-1">{path}</h2>
          <div onClick={() => router.back()}>
            <File
              file={{
                name: "..",
                path: "..",
                sha: "",
                type: "",
                gitUrl: "",
                size: 0,
              }}
              activeProfile={activeProfile}
              repo={repoName}
            />
          </div>
          <SyntaxHighlighter
            language="typescript"
            showLineNumbers={true}
            style={dracula}
          >
            {content}
          </SyntaxHighlighter>
        </section>
      </div>
    </Layout>
  );
};

export default Folder;
