import { Compass, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";

function RegisterPage() {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "USUARIO",
    password: "",
    confirm: ""
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value
    }));

    if (error) {
      setError("");
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const registerData = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      role: form.role,
      password: form.password
    };

    try {
      setLoading(true);

      await register(registerData);

      navigate("/login", {
        replace: true,
        state: {
          message: "Registro completado. Ya puedes iniciar sesión."
        }
      });
    } catch (error) {
      console.error("Error al registrar usuario:", error);

      if (error.status === 409) {
        setError("El correo ingresado ya se encuentra registrado.");
        return;
      }

      if (error.status === 400) {
        setError(
          error.message ||
            "Los datos ingresados no son válidos. Revisa el formulario."
        );
        return;
      }

      setError(
        error.message ||
          "No se pudo completar el registro. Inténtalo nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-2">
      <section className="hidden bg-gradient-to-br from-brand-900 to-cyan-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-black"
        >
          <Compass />
          CitySpot
        </Link>

        <div>
          <h1 className="text-5xl font-black">
            Comienza a explorar Ecuador
          </h1>

          <p className="mt-4 text-lg text-teal-50">
            Crea tu cuenta para guardar favoritos e historial.
          </p>
        </div>

        <p className="text-sm text-teal-100">
          CitySpot · Experiencias locales
        </p>
      </section>

      <section className="flex items-center justify-center px-4 py-10">
        <form
          onSubmit={submit}
          className="w-full max-w-lg rounded-2xl border bg-white p-7 shadow-sm"
        >
          <h2 className="text-3xl font-black">Crear cuenta</h2>

          <p className="mt-2 text-sm text-slate-500">
            Completa tus datos personales.
          </p>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Nombre completo">
              <input
                name="name"
                type="text"
                required
                disabled={loading}
                value={form.name}
                onChange={handleChange}
                className="field"
                autoComplete="name"
              />
            </Field>

            <Field label="Teléfono">
              <input
                name="phone"
                type="tel"
                required
                disabled={loading}
                value={form.phone}
                onChange={handleChange}
                className="field"
                autoComplete="tel"
              />
            </Field>

            <Field label="Correo" wide>
              <input
                name="email"
                type="email"
                required
                disabled={loading}
                value={form.email}
                onChange={handleChange}
                className="field"
                autoComplete="email"
              />
            </Field>

            <Field label="Tipo de cuenta" wide>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                disabled={loading}
                className="field"
              >
                <option value="USUARIO">Usuario</option>
                <option value="PROPIETARIO">Propietario</option>
              </select>
            </Field>

            <Field label="Contraseña">
              <div className="relative">
                <input
                  name="password"
                  type={show ? "text" : "password"}
                  required
                  minLength={6}
                  disabled={loading}
                  value={form.password}
                  onChange={handleChange}
                  className="field pr-10"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() => setShow((current) => !current)}
                  className="absolute right-3 top-3 text-slate-400"
                  aria-label={
                    show ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Field>

            <Field label="Confirmar contraseña">
              <input
                name="confirm"
                type={show ? "text" : "password"}
                required
                minLength={6}
                disabled={loading}
                value={form.confirm}
                onChange={handleChange}
                className="field"
                autoComplete="new-password"
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-brand-600 py-3 font-bold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Registrando..." : "Registrarme"}
          </button>

          <p className="mt-5 text-center text-sm text-slate-500">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="font-semibold text-brand-700"
            >
              Inicia sesión
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

function Field({ label, wide = false, children }) {
  return (
    <label className={wide ? "sm:col-span-2" : ""}>
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      {children}
    </label>
  );
}

export default RegisterPage;