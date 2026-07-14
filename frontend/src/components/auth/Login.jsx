import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import Input from "../ui/input";
import Label from "../ui/label";
import screen from "../../assets/screen.png";


const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe doit contenir au moins 6 caractères"),
  remember: z.boolean().optional(),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8f9ff]">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center opacity-40 grayscale-[0.5]"
          style={{
            backgroundImage:
              'url("https://png.pngtree.com/thumb_back/fw800/background/20230512/pngtree-blue-sky-building-business-background-image_2414713.jpg")',
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#e5eeff] via-transparent to-[#f8f9ff]/50"></div>
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header avec Logo */}
        <div className="flex flex-col items-center mb-8">
          {/* Logo Image */}
          <div className="w-24 h-24 mb-4">
            <img
              src={screen}
              alt="WAMA GESTION Logo"
              className="w-full h-full rounded-xl shadow-lg object-cover"
            />
          </div>
          
          {/* Brand Name */}
          <h1 className="text-3xl font-bold text-[#00236f] tracking-tight">
            WAMA RH
          </h1>
          <p className="text-sm text-[#444651] mt-1">
            Employee Portal
          </p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Please enter your credentials to access the employee portal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#444651] group-focus-within:text-[#0051d5]">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@gmail.com"
                    {...register("email")}
                    className={errors.email ? "border-[#ba1a1a]" : ""}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-[#ba1a1a]">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-[#0051d5] text-sm font-medium hover:underline decoration-[#0051d5]/30"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#444651] group-focus-within:text-[#0051d5]">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className={errors.password ? "border-[#ba1a1a]" : ""}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#444651] hover:text-[#0b1c30] transition-colors"
                    onClick={togglePassword}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-[#ba1a1a]">{errors.password.message}</p>
                )}
                {error && (
                  <p className="mt-2 text-sm text-[#ba1a1a] bg-[#ffdad6]/20 p-2 rounded-lg">
                    {error}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-[#0051d5] border-[#c5c5d3] rounded focus:ring-[#0051d5] cursor-pointer"
                  {...register("remember")}
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-[#444651] cursor-pointer select-none"
                >
                  Remember this device for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#1e3a8a] text-white py-3.5 rounded-lg font-medium hover:bg-[#00236f] transition-all duration-200 active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
                <span className="material-symbols-outlined text-[18px]">login</span>
              </button>
            </form>

            {/* Footer */}
            <footer className="mt-8 text-center space-y-2">
              <p className="text-xs text-[#444651]">
                © 2026 WAMA INVEST Group. All rights reserved.
              </p>
            </footer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;