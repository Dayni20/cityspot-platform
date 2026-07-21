import { Compass, Eye, EyeOff, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../services/authService";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const user = await login(
        email.trim().toLowerCase(),
        password
      );

      if (!user) {
        throw new Error("El servidor no devolvió la información del usuario.");
      }

      const role = user.role?.toUpperCase();

      if (role === "ADMINISTRADOR") {
        navigate("/admin", { replace: true });
        return;
      }

      if (role === "PROPIETARIO") {
        navigate("/owner", { replace: true });
        return;
      }

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      if (error.status === 401) {
        setError("Correo o contraseña incorrectos.");
      } else if (error.status === 404) {
        setError("No existe un usuario registrado con ese correo.");
      } else if (error.status === 400) {
        setError(
          error.message ||
            "Debes ingresar un correo y una contraseña válidos."
        );
      } else {
        setError(
          error.message ||
            "No fue posible iniciar sesión. Verifica que el backend esté ejecutándose."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-slate-100 to-brand-50 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-xl"
      >
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-black"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white">
            <Compass />
          </span>

          CitySpot
        </Link>

        <h1 className="mt-8 text-3xl font-black">
          Bienvenido
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Ingresa para continuar.
        </p>

        {location.state?.message && (
          <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
            {location.state.message}
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <label className="mt-6 block text-sm font-semibold">
          Correo

          <input
            type="email"
            required
            disabled={loading}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);

              if (error) {
                setError("");
              }
            }}
            className="field mt-1.5"
            placeholder="usuario@correo.com"
            autoComplete="email"
          />
        </label>

        <label className="mt-4 block text-sm font-semibold">
          Contraseña

          <div className="relative mt-1.5">
            <input
              type={show ? "text" : "password"}
              required
              disabled={loading}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);

                if (error) {
                  setError("");
                }
              }}
              className="field pr-10"
              autoComplete="current-password"
            />

            <button
              type="button"
              onClick={() => setShow((current) => !current)}
              className="absolute right-3 top-3 text-slate-400"
              aria-label={
                show ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {show ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 font-bold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogIn size={18} />

          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-500">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="font-semibold text-brand-700"
          >
            Regístrate
          </Link>
        </p>
      </form>
    </main>
  );
}

export default LoginPage;