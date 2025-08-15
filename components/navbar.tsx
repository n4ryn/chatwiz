import Link from "next/link";
import { BsGithub } from "react-icons/bs";

const Navbar = () => {
  return (
    <nav className="fixed z-50 px-5 w-full select-none lg:top-5 lg:px-0">
      <div className="px-2.5 mx-auto mt-5 max-w-2xl rounded-full shadow-lg backdrop-blur-sm bg-white/20">
        <div className="flex justify-between items-center h-14">
          <Link href="/" className="flex items-center pl-3.5">
            <span className="font-bold text-3xl bg-gradient-to-r from-[#ec90c5] to-pink-600 bg-clip-text text-transparent">
              ChatWiz
            </span>
          </Link>
          <Link
            href="https://github.com/n4ryn/chatwiz"
            target="_blank"
            className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-black rounded-full transition-colors cursor-pointer"
          >
            <BsGithub /> Github
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
