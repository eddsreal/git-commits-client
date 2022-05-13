import FolderIcon from "../assets/FolderIcon";
import { ICommit, IFile, IRepository } from "../interfaces";
import Link from "next/link";
import FileIcon from "../assets/FileIcon";

type Props = {
  file: IFile;
  activeProfile: string | string[] | undefined;
  repo: string | string[] | undefined;
  commits: ICommit[];
};

const File: React.FC<Props> = ({ file, activeProfile, repo, commits }) => {
  return (
    <Link
      key={file.sha}
      href={
        file.type === "file" || file.type === "blob"
          ? `/${activeProfile}/${repo}/file/${file.sha}`
          : `/${activeProfile}/${repo}/${file.sha}`
      }
    >
      <div className="group cursor-pointer w-full flex flex-row place-content-around bg-white mb-2 p-2 rounded-lg hover:bg-primary-100 hover:border-primary border border-primary-100">
        <div className="w-1/12 flex flex-col items-center justify-center bg-primary-100 rounded-lg p-3.5 group-hover:bg-white">
          {file.type === "file" || file.type === "blob" ? (
            <FileIcon color="fill-primary" className="w-8" />
          ) : (
            <FolderIcon color="fill-primary" className="w-8" />
          )}
        </div>
        <div className="w-11/12 p-3 flex items-center group-hover:text-primary">
          {file.name ? file.name : file.path}
        </div>
      </div>
    </Link>
  );
};

export default File;
