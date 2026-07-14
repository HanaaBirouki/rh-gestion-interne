import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import Button from "../ui/button";
import Input from "../ui/input";
import Label from "../ui/label";
import screen from "../../assets/screen.png";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
});

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await api.post("/auth/password-reset/", data);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8f9ff]">
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

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header avec Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/login" className="flex flex-col items-center">
            {/* Logo Image - AJOUTÉ ICI */}
            <div className="w-24 h-24 mb-4">
              <img
                src={screen}
                alt="WAMA RH Logo"
                className="w-full h-full rounded-xl shadow-lg object-cover"
              />
            </div>
            
            {/* Brand Name */}
            <h1 className="text-3xl font-bold text-[#00236f] tracking-tight">
              WAMA RH
            </h1>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
                  <p className="text-sm">
                    A password reset link has been sent to your email address.
                    Please check your inbox.
                  </p>
                </div>
                <Link to="/login">
                  <Button className="w-full">Back to Login</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#444651]">
                      <span className="material-symbols-outlined text-[20px]">mail</span>
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@wamainvest.com"
                      {...register("email")}
                      className={errors.email ? "border-[#ba1a1a]" : ""}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-[#ba1a1a]">{errors.email.message}</p>
                  )}
                  {error && (
                    <p className="mt-2 text-sm text-[#ba1a1a] bg-[#ffdad6]/20 p-2 rounded-lg">
                      {error}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-[#0051d5] text-sm font-medium hover:underline decoration-[#0051d5]/30"
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
  );
};

export default ForgotPassword;