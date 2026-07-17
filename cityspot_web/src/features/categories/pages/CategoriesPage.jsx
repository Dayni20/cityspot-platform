import { useEffect, useState } from "react";
import { Edit, Plus, Save, Trash2, X } from "lucide-react";
import PageHeader from "../../../components/ui/PageHeader";
import { categoryService } from "../services/categoryService";

const emptyForm = { name: "", description: "" };

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const response = await categoryService.list();
      setCategories(response.categories);
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await categoryService.create(form);
      setForm(emptyForm);
      await loadCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (category) => {
    setError("");
    try {
      await categoryService.update(category.id, {
        name: category.name,
        description: category.description
      });
      await loadCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemove = async (id) => {
    setError("");
    try {
      await categoryService.remove(id);
      await loadCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateLocalCategory = (id, field, value) => {
    setCategories((current) =>
      current.map((category) => (category.id === id ? { ...category, [field]: value } : category))
    );
  };

  return (
    <section>
      <PageHeader
        title="Categorías"
        description="Administra las categorías disponibles para las actividades."
      />

      {error && <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      <form
        onSubmit={handleCreate}
        className="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[1fr_2fr_auto]"
      >
        <input
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          placeholder="Nombre"
          className="rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand-600"
          required
        />
        <input
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          placeholder="Descripción"
          className="rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand-600"
        />
        <button className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          <Plus size={16} />
          Crear
        </button>
      </form>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {isLoading ? (
          <p className="p-4 text-sm text-slate-500">Cargando categorías...</p>
        ) : (
          <div className="divide-y divide-slate-200">
            {categories.map((category) => (
              <div key={category.id} className="grid gap-3 p-4 md:grid-cols-[1fr_2fr_auto_auto]">
                <input
                  value={category.name}
                  disabled={editingId !== category.id}
                  onChange={(event) => updateLocalCategory(category.id, "name", event.target.value)}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none disabled:bg-slate-50 disabled:text-slate-600 focus:border-brand-600"
                />
                <input
                  value={category.description || ""}
                  disabled={editingId !== category.id}
                  onChange={(event) =>
                    updateLocalCategory(category.id, "description", event.target.value)
                  }
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none disabled:bg-slate-50 disabled:text-slate-600 focus:border-brand-600"
                />
                {editingId === category.id ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdate(category)}
                      className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      <Save size={16} />
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={loadCategories}
                      className="inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                      aria-label="Cancelar edición"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditingId(category.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    <Edit size={16} />
                    Editar
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(category.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default CategoriesPage;
