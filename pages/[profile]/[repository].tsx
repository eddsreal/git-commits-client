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
      <div className="container w-1/2">
        <header>
          <h1 className="text-5xl font-[700] mt-8 text-left">
            {params?.repository}
          </h1>
        </header>
        <section>
          <h2 className="text-2xl font-[700] text-left mb-1">Commits</h2>
          <select
            name="commits"
            className="w-2/4 p-3 border-2 border-sky-500 bg-white border-dashed"
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
          <h2 className="text-2xl font-[700] text-left mb-1">Content</h2>
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
                  commits={commits}
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
                  commits={commits}
                />
              ))
          }
        </section>
      </div>
    </Layout>
  );
};

export default Repository;
