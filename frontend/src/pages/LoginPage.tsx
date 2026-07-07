import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe obligatoire"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    console.log("Données envoyées :", data);
  };

  return (
    <div className="min-h-screen bg-[#F5F1EA] flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-[#8B5E3C] mb-2">
          Gestion RH
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Connectez-vous à votre compte
        </p>

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
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium">Mot de passe</label>
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
            className="w-full bg-[#8B5E3C] text-white py-3 rounded-lg font-semibold hover:bg-[#6E472C] transition"
          >
            Se connecter
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          © 2026 RH Gestion
        </p>
      </div>
    </div>
  );
}