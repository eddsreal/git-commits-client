import FolderIcon from "../assets/FolderIcon";
import { IRepository } from "../interfaces";
import Link from "next/link";

type Props = {
  repositories: IRepository[];
  activeProfile: string;
};

const Repositories: React.FC<Props> = ({ repositories, activeProfile }) => {
  if (repositories.length === 0) {
    return <p>No repositories available</p>;
  }
  return (
    <div className="w-full flex flex-col items-center">
      {repositories.map((repo: IRepository) => (
        <Link key={repo.name} href={`/${activeProfile}/${repo.name}`}>
          <div className="group cursor-pointer w-full flex flex-row place-content-around bg-white mb-2 p-2 rounded-lg hover:bg-primary-100 hover:border-primary border border-primary-100">
            <div className="w-1/12 flex flex-col items-center justify-center bg-primary-100 rounded-lg p-3.5 group-hover:bg-white">
              <FolderIcon color="fill-primary" className="w-8" />
            </div>
            <div className="w-9/12 p-3 flex flex-col items-left group-hover:text-primary">
              <p>{repo.name}</p>
              <p className="text-xs text-slate-500 italic">{repo.description}</p>
            </div>
            <div className="w-2/12 p-3 flex items-center group-hover:text-primary">
              {repo.language}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Repositories;
