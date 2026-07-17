CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(30) NOT NULL
        CHECK (
            tipo_usuario IN (
                'USUARIO',
                'PROPIETARIO',
                'ADMINISTRADOR'
            )
        ),

    telefono VARCHAR(20),

    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO'
        CHECK (
            estado IN (
                'ACTIVO',
                'INACTIVO',
                'BLOQUEADO'
            )
        ),

    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =====================================================
-- TABLA: categorias
-- Clasifica las actividades por su tipo.
-- Ejemplos: aventura, gastronomia, cultura, naturaleza.
-- =====================================================

CREATE TABLE IF NOT EXISTS categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT
);


-- =====================================================
-- TABLA: actividades
-- Almacena lugares, negocios y experiencias turisticas.
-- =====================================================

CREATE TABLE IF NOT EXISTS actividades (
    id_actividad SERIAL PRIMARY KEY,
    id_propietario INT NOT NULL,
    id_categoria INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    direccion VARCHAR(200),
    latitud DECIMAL(10,8),
    longitud DECIMAL(11,8),
    precio_referencial DECIMAL(10,2),
    horario VARCHAR(150),
    telefono_contacto VARCHAR(20),
    correo_contacto VARCHAR(150),
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE'
        CHECK (
            estado IN (
                'PENDIENTE',
                'ACTIVA',
                'INACTIVA'
            )
        ),

    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_precio_referencial
        CHECK (
            precio_referencial IS NULL
            OR precio_referencial >= 0
        ),

    CONSTRAINT chk_latitud
        CHECK (
            latitud IS NULL
            OR latitud BETWEEN -90 AND 90
        ),

    CONSTRAINT chk_longitud
        CHECK (
            longitud IS NULL
            OR longitud BETWEEN -180 AND 180
        ),

    CONSTRAINT fk_actividad_propietario
        FOREIGN KEY (id_propietario)
        REFERENCES usuarios(id_usuario)
        ON DELETE RESTRICT,

    CONSTRAINT fk_actividad_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categorias(id_categoria)
        ON DELETE RESTRICT
);


-- =====================================================
-- TABLA: imagenes_actividad
-- Guarda las URL de las imagenes almacenadas,
-- por ejemplo, en Supabase Storage.
-- =====================================================

CREATE TABLE IF NOT EXISTS imagenes_actividad (
    id_imagen SERIAL PRIMARY KEY,
    id_actividad INT NOT NULL,
    url_imagen TEXT NOT NULL,
    descripcion VARCHAR(150),
    es_principal BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_imagen_actividad
        FOREIGN KEY (id_actividad)
        REFERENCES actividades(id_actividad)
        ON DELETE CASCADE
);


-- =====================================================
-- TABLA: favoritos
-- Relaciona usuarios con las actividades que guardan.
-- =====================================================

CREATE TABLE IF NOT EXISTS favoritos (
    id_favorito SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_actividad INT NOT NULL,
    fecha_guardado TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_favorito_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT fk_favorito_actividad
        FOREIGN KEY (id_actividad)
        REFERENCES actividades(id_actividad)
        ON DELETE CASCADE,

    CONSTRAINT uq_usuario_actividad
        UNIQUE (id_usuario, id_actividad)
);


-- =====================================================
-- INDICES
-- Mejoran la velocidad de las consultas frecuentes.
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_actividades_propietario
    ON actividades(id_propietario);

CREATE INDEX IF NOT EXISTS idx_actividades_categoria
    ON actividades(id_categoria);

CREATE INDEX IF NOT EXISTS idx_actividades_ciudad
    ON actividades(ciudad);

CREATE INDEX IF NOT EXISTS idx_actividades_estado
    ON actividades(estado);

CREATE UNIQUE INDEX IF NOT EXISTS uq_categorias_nombre_lower
    ON categorias (LOWER(nombre));

CREATE INDEX IF NOT EXISTS idx_imagenes_actividad
    ON imagenes_actividad(id_actividad);

CREATE UNIQUE INDEX IF NOT EXISTS uq_imagen_principal_por_actividad
    ON imagenes_actividad(id_actividad)
    WHERE es_principal = TRUE;

CREATE INDEX IF NOT EXISTS idx_favoritos_actividad
    ON favoritos(id_actividad);



---AÑADIR ADMINISTRADOR MANUAL
INSERT INTO usuarios (
  nombre,
  correo,
  contrasena,
  tipo_usuario,
  telefono,
  estado
) VALUES (
  'Admin CitySpot',
  'admin.tourism_ecuador@cityspot.com',
  '$2b$10$IF8128pXMy9dRmLUMjkVMel6P8ip3NB2U60D4b6Un3wHaXlZUkI2m',
  'ADMINISTRADOR',
  '0981716781',
  'ACTIVO'
);

--INSERTAR CATEGORIAS 
INSERT INTO categorias (nombre, descripcion)
VALUES
  ('Aventura', 'Actividades al aire libre, deportes extremos y experiencias de adrenalina.'),
  ('Gastronomia', 'Restaurantes, comida local, cafeterias y experiencias culinarias.'),
  ('Cultura', 'Museos, historia, arte, patrimonio y eventos culturales.'),
  ('Naturaleza', 'Parques, reservas, senderos, cascadas y espacios naturales.'),
  ('Relax', 'Spas, termas, descanso y bienestar.'),
  ('Entretenimiento', 'Eventos, bares, conciertos, shows y actividades recreativas.')
ON CONFLICT (nombre) DO NOTHING;
