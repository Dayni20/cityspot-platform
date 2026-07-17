const crypto = require("crypto");
const path = require("path");
const env = require("../../../../shared/config/env");
const createSupabaseClient = require("../../../../shared/config/supabase");

const EXTENSION_BY_MIME_TYPE = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp"
};

class SupabaseStorageService {
  constructor() {
    this.bucket = env.supabase.bucket;
  }

  async uploadActivityImage(activityId, file) {
    const supabase = createSupabaseClient();
    const extension = EXTENSION_BY_MIME_TYPE[file.mimetype] || path.extname(file.originalname);
    const fileName = `${crypto.randomUUID()}${extension}`;
    const filePath = `activities/${activityId}/${fileName}`;

    const { error } = await supabase.storage.from(this.bucket).upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`);
    }

    const { data } = supabase.storage.from(this.bucket).getPublicUrl(filePath);

    return {
      path: filePath,
      publicUrl: data.publicUrl
    };
  }

  async deletePublicImage(publicUrl) {
    const supabase = createSupabaseClient();
    const marker = `/storage/v1/object/public/${this.bucket}/`;
    const markerIndex = publicUrl.indexOf(marker);

    if (markerIndex === -1) {
      return;
    }

    const filePath = publicUrl.slice(markerIndex + marker.length);
    const { error } = await supabase.storage.from(this.bucket).remove([filePath]);

    if (error) {
      throw new Error(`Supabase delete failed: ${error.message}`);
    }
  }
}

module.exports = SupabaseStorageService;
