import axios, { AxiosResponse } from "axios";
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useState } from "react";
import File from "../../../components/File";
import Layout from "../../../components/Layout";
import { IFile } from "../../../interfaces";
import { dynamicSort } from "../../../utils";

type FolderProps = {
  params: {
    profile: string;
    repository: string;
  };
  contents: IFile[];
  activeProfile: string;
  repoName: string;
  errors: object[];
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  //  Get current repo content
  const { data: contents }: AxiosResponse<IFile[]> = await axios.get(
    `${process.env.API_ENDPOINT}/repositories/${context.params?.profile}/${context.params?.repository}/contents/${context.params?.folder}`
  );
  return {
    props: {
      params: context.params,
      contents,
      activeProfile: context.params?.profile,
      repoName: context.params?.repository,
    },
  };
};

const Folder: NextPage<FolderProps> = ({
  activeProfile,
  repoName,
  contents,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [load, setLoad] = useState(false);
  return (
    <Layout title={`Folder`}>
      <div className="container w-1/2">
        <section>
          <h2 className="text-2xl font-[700] text-left mb-1">Content</h2>
          {load && <p>Loading...</p>}
          {!load &&
            contents
              .sort(dynamicSort("type", 1))
              .map((file: IFile) => (
                <File
                  key={file.sha}
                  file={file}
                  activeProfile={activeProfile}
                  repo={repoName}
                />
              ))}
        </section>
      </div>
    </Layout>
  );
};

export default Folder;
