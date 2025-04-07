"use client"

import Image from "next/image";
import LoginForm from "../../components/login-form";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Login</h1>
      <LoginForm />
    </div>
  );
}
