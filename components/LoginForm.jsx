import { loginAction } from "@/app/actions"

const LoginForm = () => {
  return (
    <form action={loginAction} className="flex flex-col items-center gap-4 p-4">
      <button
        type="submit"
        name="action"
        value="google"
        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded shadow-md transition duration-200"
      >
        Sign In With Google
      </button>

      <button
        type="submit"
        name="action"
        value="github"
        className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-200"
      >
        Sign In With GitHub
      </button>
    </form>
  )
}

export default LoginForm
