import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Layout from "../../components/Layout";
import axios, { AxiosResponse } from "axios";
import { ICommit, IFile } from "../../interfaces";
import { useEffect, useState } from "react";
import File from "../../components/File";
import { dynamicSort } from "../../utils";

type RepoProps = {
  params: {
    profile: string;
    repository: string;
  };
  commits: ICommit[];
  lastCommit: IFile[];
  activeProfile: string;
  repoName: string;
  errors: object[];
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  //  Get Available commits
  const { data: commits }: AxiosResponse<ICommit[]> = await axios.get(
    `${process.env.API_ENDPOINT}/repositories/${context.params?.profile}/${context.params?.repository}`
  );
  
  //  Get current repo content
  const { data: lastCommit }: AxiosResponse<IFile[]> = await axios.get(
    `${process.env.API_ENDPOINT}/repositories/${context.params?.profile}/${context.params?.repository}/contents`
  );

  return {
    props: {
      params: context.params,
      commits,
      lastCommit,
      activeProfile: context.params?.profile,
      repoName: context.params?.repository,
    },
  };
};

const Repository: NextPage<RepoProps> = ({
  params,
  commits,
  lastCommit,
  activeProfile,
  repoName,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [selectedCommit, setSelectedCommit] = useState("");
  const [currentCommit, setCurrentCommit] = useState([]);
  const [load, setLoad] = useState(false);

  //  Handlers
  const handleSelectChange = (event: React.FormEvent<HTMLSelectElement>) => {
    setSelectedCommit(event.currentTarget.value);
  };

  //  Helper functions
  const getCurrentCommit = async () => {
    try {
      setLoad(true);
      setCurrentCommit([]);
      const { data: repositories }: AxiosResponse = await axios.get(
        `${process.env.API_ENDPOINT}/repositories/${activeProfile}/${repoName}/contents/${selectedCommit}`
      );
      setCurrentCommit(repositories);
      setLoad(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedCommit !== '') {
      getCurrentCommit();
    }
  }, [selectedCommit]);

  return (
    <Layout title={`Reporsitory ${params?.repository}`}>
      <div className="container w-11/12 lg:w-1/2">
        <header>
          <h1 className="text-3xl text-center lg:text-left lg:text-5xl font-[700] mt-8 mb-4 text-primary">
            Repository: {params?.repository}
          </h1>
        </header>
        <section>
          <h2 className="text-2xl font-[700] text-left mb-1 text-primary">Commits</h2>
          <p className="text-2 text-left mb-1 italic">Navigate beetween commits to check it&apos;s progress</p>
          <select
            name="commits"
            className="w-11/12 lg:w-2/4 p-3 border-2 border-primary-100 active:border-primary focus:border-primary bg-white border-dashed"
            onChange={handleSelectChange}
          >
            <option value="">Head</option>
            {commits.map((commit: ICommit) => (
              <option
                key={commit.sha}
                value={commit.commit.tree.sha}
              >{`${commit.commit.tree.sha.substring(0, 10)} - ${
                commit.commit.message
              }`}</option>
            ))}
          </select>
        </section>
        <section>
          <h2 className="text-2xl font-[700] text-left mb-1 text-primary mt-4">Files</h2>
          <p className="text-2 text-left mb-1 italic">You can click on all folders/files to get in to them.</p>
          {load && <p>Loading...</p>}
          {!selectedCommit && !load &&
            lastCommit
              .sort(dynamicSort("type", 1))
              .map((file: IFile) => (
                <File
                  key={file.sha}
                  file={file}
                  activeProfile={activeProfile}
                  repo={repoName}
                />
              ))
          }
          {selectedCommit && !load &&
            currentCommit
              .sort(dynamicSort("type", -1))
              .map((file: IFile) => (
                <File
                  key={file.sha}
                  file={file}
                  activeProfile={activeProfile}
                  repo={repoName}
                />
              ))
          }
        </section>
      </div>
    </Layout>
  );
};

export default Repository;
