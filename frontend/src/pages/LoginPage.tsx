import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import api from "../services/api"

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe obligatoire"),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true)
      setServerError("")

      const response = await api.post("/auth/login/", data)

      localStorage.setItem("access", response.data.access)
      localStorage.setItem("refresh", response.data.refresh)
      localStorage.setItem("user", JSON.stringify(response.data.user))

      navigate("/profil")
    } catch (error: any) {
      console.error("Erreur de connexion :", error)

      const apiError =
        error.response?.data?.non_field_errors?.[0] ||
        error.response?.data?.detail ||
        error.response?.data?.error ||
        "Email ou mot de passe incorrect"

      setServerError(apiError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F1EA] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-[#8B5E3C] mb-2">
          Gestion RH
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Connectez-vous à votre compte
        </p>

        {serverError && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium">Email</label>

            <input
              type="email"
              placeholder="email@entreprise.com"
              {...register("email")}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Mot de passe
            </label>

            <input
              type="password"
              placeholder="********"
              {...register("password")}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8B5E3C] text-white py-3 rounded-lg font-semibold hover:bg-[#6E472C] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          © 2026 RH Gestion
        </p>
      </div>
    </div>
  )
}