// frontend/src/components/auth/Login.jsx
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import logo from "../../assets/screen.png"

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe doit contenir au moins 6 caractères"),
  remember: z.boolean().optional(),
})

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    setError("")
    try {
      const response = await login(data.email, data.password)
      const userRole = response?.user?.role
      if (userRole === "ADMIN") {
        navigate("/admin/dashboard")
      } else if (userRole === "EMPLOYE") {
        navigate("/employee/dashboard")
      } else {
        navigate("/dashboard")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Email ou mot de passe incorrect")
    } finally {
      setLoading(false)
    }
  }

  const togglePassword = () => setShowPassword(!showPassword)

  return (
    <div className="min-h-screen flex bg-background">
      {/* ==========================================
          LEFT SIDE - IMAGE PANEL
          ========================================== */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-10000 hover:scale-105"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC8VTk9Cdhy3k0Yg80jlvRqJ_3zr9K3zWd1EWBrqDpr7hm3gr4dnRhb3QIX8VU5UK1xq8K1p5HYtgNgxwE3HQalDVeckUyXWOiIxkvObTkdp5lMGXamHBnp9uDYg_FUe0w_z-qutPBZ-85n7sm2_Qv4zOPeOvhckoDbKxMMHyAauZPxX4NXBH64DHv2VQkhRis8g-FXUyFkKlDDvng4f2aBy2GrZQkWa-qOEW3xv3ZaW3bIj4t8LYUz")',
          }}
        >
          <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent" />

          {/* Floating Brand Elements */}
          <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-outline-variant/30 shadow-xl max-w-lg">
            <h2 className="text-2xl font-bold text-primary mb-2">
              Empowering Your Workforce
            </h2>
            <p className="text-sm text-on-surface-variant">
              Manage HR operations, employee relations, and talent development with WAMA RH's unified professional suite.
            </p>
          </div>
        </div>
      </div>

      {/* ==========================================
          RIGHT SIDE - LOGIN FORM
          ========================================== */}
      <div className="w-full lg:w-1/2 flex flex-col relative bg-surface-container-lowest">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="WAMA RH" className="h-10 w-10 rounded-xl object-contain" />
            <span className="text-2xl font-bold text-primary tracking-tight">WAMA RH</span>
          </div>
        </header>

        {/* Login Content */}
        <main className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-[440px]">
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-3xl font-bold text-on-surface mb-1">Welcome back</h1>
              <p className="text-base text-on-surface-variant">
                Please enter your details to access your employee portal.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium text-on-surface">
                  Work Email
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-[20px]">
                    mail
                  </span>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@gmail.com"
                    className={`w-full pl-10 pr-3 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm ${
                      errors.email ? "border-error" : ""
                    }`}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-error">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-sm font-medium text-on-surface">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-primary hover:underline transition-all"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-[20px]">
                    lock
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm ${
                      errors.password ? "border-error" : ""
                    }`}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                    onClick={togglePassword}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-error">{errors.password.message}</p>
                )}
                {error && (
                  <p className="text-sm text-error bg-error-container/20 p-2 rounded-lg">
                    {error}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 py-1">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20 cursor-pointer"
                  {...register("remember")}
                />
                <label htmlFor="remember" className="text-sm text-on-surface-variant cursor-pointer select-none">
                  Remember this device for 30 days
                </label>
              </div>

              {/* Sign In Button - Sans flèche */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-primary text-on-primary font-medium text-base rounded-lg shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-t border-outline-variant gap-2">
          <div className="text-xs text-on-secondary-fixed-variant order-2 md:order-1">
            © 2026 WAMA INVEST Group. All rights reserved.
          </div>
          <div className="flex gap-4 text-xs order-1 md:order-2">
            <a href="#" className="text-on-secondary-fixed-variant hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-on-secondary-fixed-variant hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-on-secondary-fixed-variant hover:text-primary transition-colors">
              Contact Support
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Login