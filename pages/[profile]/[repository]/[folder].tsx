import axios, { AxiosResponse } from "axios";
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useRouter } from "next/router";
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
  path: string;
  repoName: string;
  errors: object[];
};


export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const par: any | undefined = context.params;
  const [folderName, path] = par.folder?.split("--");

  //  Get current repo content
  const { data: contents }: AxiosResponse<IFile[]> = await axios.get(
    `${process.env.API_ENDPOINT}/repositories/${context.params?.profile}/${context.params?.repository}/contents/${folderName}`
  );
  return {
    props: {
      params: context.params,
      contents,
      path,
      activeProfile: context.params?.profile,
      repoName: context.params?.repository,
    },
  };
};

const Folder: NextPage<FolderProps> = ({
  activeProfile,
  repoName,
  contents,
  path,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [load, setLoad] = useState(false);
  const router = useRouter();
  return (
    <Layout title={`Folder ${path}`}>
      <div className="container w-11/12 lg:w-1/2">
        <section>
          <h2 className="text-2xl font-[700] text-left mb-1 text-primary">{`Folder: ${path}`}</h2>
          <p className="text-2 text-left mb-1 italic">You can click on all folders/files to get in to them.</p>
          {load && <p>Loading...</p>}
          {!load && (
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
          )}
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
