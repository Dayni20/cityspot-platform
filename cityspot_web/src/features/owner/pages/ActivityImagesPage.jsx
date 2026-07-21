import { ImagePlus, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { imageService } from "../../images/services/imageService";

function getList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.images)) return response.images;
  return [];
}

function ActivityImagesPage() {
  const { id } = useParams();
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");
  const [isMain, setIsMain] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadImages = () => {
    imageService.list(id)
      .then((response) => setImages(getList(response)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadImages();
  }, [id]);

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Formato no permitido. Usa JPG, PNG o WEBP.");
      return;
    }

    setError("");
    try {
      await imageService.upload(id, file, isMain, description);
      setDescription("");
      setIsMain(false);
      loadImages();
    } catch (err) {
      setError(err.message);
    } finally {
      event.target.value = "";
    }
  };

  const setMain = async (imageId) => {
    setError("");
    try {
      await imageService.setMain(id, imageId);
      loadImages();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (imageId) => {
    setError("");
    try {
      await imageService.remove(id, imageId);
      setImages((current) => current.filter((image) => image.id !== imageId));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <h1 className="text-3xl font-black">Imagenes de actividad</h1>
      <p className="mt-2 text-slate-500">Sube, elimina o marca una imagen como principal.</p>

      {error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="mt-6 grid gap-3 rounded-2xl border bg-white p-5 shadow-sm md:grid-cols-[1fr_auto_auto]">
        <input value={description} onChange={(event) => setDescription(event.target.value)} className="field" placeholder="Descripcion opcional" />
        <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={isMain} onChange={(event) => setIsMain(event.target.checked)} /> Principal</label>
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 font-bold text-white"><ImagePlus size={18} /> Seleccionar imagen<input type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} className="hidden" /></label>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="text-sm text-slate-500">Cargando imagenes...</p>
        ) : images.map((image) => (
          <article key={image.id} className="overflow-hidden rounded-2xl border bg-white">
            <img src={image.url} alt={image.description || "Imagen de actividad"} className="h-48 w-full object-cover" />
            <div className="p-4">
              <p className="text-sm text-slate-600">{image.description || "Sin descripcion"}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setMain(image.id)} className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold ${image.isMain ? "bg-amber-50 text-amber-700" : ""}`}><Star size={16} /> {image.isMain ? "Principal" : "Hacer principal"}</button>
                <button onClick={() => remove(image.id)} className="rounded-xl border border-red-200 p-2 text-red-600"><Trash2 size={18} /></button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ActivityImagesPage;
