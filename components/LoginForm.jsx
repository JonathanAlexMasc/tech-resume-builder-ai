import { loginAction } from "@/app/actions";
import { FaGoogle, FaGithub } from "react-icons/fa";

const LoginForm = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <form
        action={loginAction}
        className="w-full max-w-md bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg p-8 flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Sign In</h2>

        <button
          type="submit"
          name="action"
          value="google"
          className="flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-6 border border-gray-300 rounded-lg shadow transition duration-200"
        >
          <FaGoogle className="w-5 h-5" />
          Sign in with Google
        </button>

        <button
          type="submit"
          name="action"
          value="github"
          className="flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg shadow transition duration-200"
        >
          <FaGithub className="w-5 h-5" />
          Sign in with GitHub
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
