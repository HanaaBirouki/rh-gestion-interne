// frontend/src/components/auth/ResetPassword.jsx
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useParams, useNavigate, Link } from "react-router-dom"
import api from "../../services/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import logo from "../../assets/screen.png"

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Mot de passe doit contenir au moins 8 caractères"),
    password_confirm: z.string(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Les mots de passe ne correspondent pas",
    path: ["password_confirm"],
  })

const ResetPassword = () => {
  const { uidb64, token } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      password_confirm: "",
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    setError("")
    try {
      await api.post(`/auth/password-reset/${uidb64}/${token}/`, {
        password: data.password,
        password_confirm: data.password_confirm,
      })
      setSuccess(true)
      setTimeout(() => navigate("/login"), 3000)
    } catch (err) {
      setError(err.response?.data?.error || "Lien de réinitialisation invalide ou expiré")
    } finally {
      setLoading(false)
    }
  }

  const togglePassword = () => setShowPassword(!showPassword)

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center opacity-40 grayscale-[0.5]"
          style={{
            backgroundImage:
              'url("https://png.pngtree.com/thumb_back/fw800/background/20230512/pngtree-blue-sky-building-business-background-image_2414713.jpg")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-surface-container via-transparent to-surface-bright/50" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header avec Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/login" className="flex flex-col items-center">
            <div className="w-24 h-24 mb-4">
              <img
                src={logo}
                alt="WAMA RH Logo"
                className="w-full h-full rounded-xl shadow-lg object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold text-primary tracking-tight">
              WAMA RH
            </h1>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Set New Password</CardTitle>
            <CardDescription>
              Enter your new password below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
                  <p className="text-sm">
                    Password reset successfully! Redirecting to login...
                  </p>
                </div>
                <Link to="/login">
                  <Button className="w-full">Go to Login</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                      <span className="material-symbols-outlined text-[20px]">lock</span>
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("password")}
                      className={errors.password ? "border-error" : ""}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-on-surface transition-colors"
                      onClick={togglePassword}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-error">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password_confirm">Confirm Password</Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                      <span className="material-symbols-outlined text-[20px]">lock</span>
                    </div>
                    <Input
                      id="password_confirm"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("password_confirm")}
                      className={errors.password_confirm ? "border-error" : ""}
                    />
                  </div>
                  {errors.password_confirm && (
                    <p className="mt-1 text-sm text-error">
                      {errors.password_confirm.message}
                    </p>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-error bg-error-container/20 p-2 rounded-lg">
                    {error}
                  </p>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-secondary text-sm font-medium hover:underline decoration-secondary/30"
                  >
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ResetPassword