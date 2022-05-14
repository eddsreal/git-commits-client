import type { GetStaticPathsContext, GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import Layout from "../components/Layout";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import Repositories from "../components/RepositoriesContainer";
import { IRepository } from "../interfaces";

//  Props before rendering
export const getStaticProps: GetStaticProps = async (context: GetStaticPathsContext) => {
  return {
    props: {
      profiles: process.env.PROFILES?.split(","),
      apiEndpoint: process.env.API_ENDPOINT,
    },
  };
};

//  Page
const Home: NextPage = ({
  profiles,
  apiEndpoint,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  //  State
  const [activeProfile, setActiveProfile] = useState("");
  const [repos, setRepos] = useState([]);
  const [load, setLoad] = useState(false);

  //  Handlers
  const handleSelectChange = (event: React.FormEvent<HTMLSelectElement>) => {
    setActiveProfile(event.currentTarget.value);
  };

  //  Helper functions
  const getRepos = async () => {
    try {
      setLoad(true);
      setRepos([]);
      const { data: repositories }: AxiosResponse = await axios.get(
        `${apiEndpoint}/repositories/${activeProfile}`
      );
      setRepos(repositories);
      setLoad(false);
    } catch (error) {
      console.log(error);
    }
  };

  //  Renders
  const renderRepos = (): JSX.Element => {
    return (
      <div>
        {repos.map((repo: IRepository, index: number) => (
          <div key={repo.name + index}>
            <h3>{repo.name}</h3>
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (activeProfile !== "") {
      getRepos();
    }
  }, [activeProfile]);

  return (
    <Layout title="Git Commits">
      <section className="container max-w-11/12 lg:max-w-2/4 flex flex-col items-center">
        <header className="w-11/12 lg:w-6/12 flex flex-col justify-center items-center">
          <h1 className="text-3xl lg:text-5xl font-[700] mt-3 lg:mt-8 text-center text-primary">
            Welcome to Github public repositories
          </h1>
          <p className="text-center">You can navigate through all the available profiles.</p>
        </header>
        <section className="w-11/12 lg:w-2/4 mb-5 flex flex-col items-center">
          <h2 className="text-2xl font-[700] mt-4 lg:mt-5 text-center text-primary">
            Available profiles
          </h2>
          <p className="mb-1 lg:mb-2">Please, select a profile to start</p>
          <select
            name="Profiles"
            className="w-11/12 lg:w-2/4 p-3 border-2 border-primary-100 active:border-primary focus:border-primary bg-white border-dashed"
            onChange={handleSelectChange}
          >
            <option value="" className="text-gray-600">
              No profile selected
            </option>
            {profiles &&
              profiles.map((profile: string, index: number) => (
                <option key={profile + index} value={profile}>
                  {profile}
                </option>
              ))}
          </select>
        </section>
        <section className="w-11/12 lg:w-2/4 flex flex-col items-center">
          <h2 className="text-2xl font-[700] text-left mb-3 text-primary">
            Repositories
          </h2>
          {load && <p>Loading..</p>}
          {
            !load && <Repositories repositories={repos} activeProfile={activeProfile}/>
          }
        </section>
      </section>
    </Layout>
  );
};

export default Home;
