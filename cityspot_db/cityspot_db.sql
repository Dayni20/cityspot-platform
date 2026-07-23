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
-- TABLA: consultas_actividad
-- Permite que un usuario pregunte al propietario sobre una actividad.
-- =====================================================

CREATE TABLE IF NOT EXISTS consultas_actividad (
    id_consulta SERIAL PRIMARY KEY,
    id_actividad INT NOT NULL,
    id_usuario INT NOT NULL,
    id_propietario INT NOT NULL,
    pregunta VARCHAR(500) NOT NULL,
    respuesta VARCHAR(500),
    respuesta_leida BOOLEAN NOT NULL DEFAULT FALSE,
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE'
        CHECK (estado IN ('PENDIENTE', 'RESPONDIDA')),
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_respuesta TIMESTAMP,

    CONSTRAINT fk_consulta_actividad
        FOREIGN KEY (id_actividad)
        REFERENCES actividades(id_actividad)
        ON DELETE CASCADE,

    CONSTRAINT fk_consulta_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT fk_consulta_propietario
        FOREIGN KEY (id_propietario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
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

CREATE INDEX IF NOT EXISTS idx_consultas_usuario
    ON consultas_actividad(id_usuario);

CREATE INDEX IF NOT EXISTS idx_consultas_propietario
    ON consultas_actividad(id_propietario);

CREATE INDEX IF NOT EXISTS idx_consultas_actividad
    ON consultas_actividad(id_actividad);







---AÑADIR ADMIN
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



SELECT * FROM usuarios

---------------------------------------------------------------------------
INSERT INTO actividades (
    id_propietario,
    id_categoria,
    nombre,
    descripcion,
    ciudad,
    direccion,
    latitud,
    longitud,
    precio_referencial,
    horario,
    telefono_contacto,
    correo_contacto,
    estado,
    fecha_creacion,
    fecha_actualizacion
)
SELECT
    3,
    c.id_categoria,
    v.nombre,
    v.descripcion,
    v.ciudad,
    v.direccion,
    v.latitud,
    v.longitud,
    v.precio_referencial,
    v.horario,
    v.telefono_contacto,
    v.correo_contacto,
    'ACTIVA',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM categorias c
CROSS JOIN (
    VALUES
    (
        'Ruta de comida tradicional quiteña',
        'Recorrido gastronómico para probar platos típicos como locro de papa, empanadas de viento y canelazo en locales tradicionales.',
        'Quito',
        'Centro Historico de Quito',
        -0.220164,
        -78.512327,
        18.00,
        'Lunes a sabado de 10:00 a 18:00',
        '0987654321',
        'owner.gastronomia@cityspot.com'
    ),
    (
        'Experiencia de chocolate artesanal',
        'Actividad guiada para conocer el proceso del cacao ecuatoriano y preparar una degustación de chocolate artesanal.',
        'Quito',
        'La Floresta, Quito',
        -0.199910,
        -78.484650,
        22.50,
        'Martes a domingo de 09:00 a 17:00',
        '0987654322',
        'owner.gastronomia@cityspot.com'
    ),
    (
        'Cena típica en Guayaquil',
        'Experiencia gastronómica con platos costeños como encebollado, bolón, seco de chivo y jugos naturales.',
        'Guayaquil',
        'Malecón 2000, Guayaquil',
        -2.189412,
        -79.889066,
        25.00,
        'Viernes a domingo de 17:00 a 22:00',
        '0987654323',
        'owner.gastronomia@cityspot.com'
    ),
    (
        'Tour de café ecuatoriano',
        'Visita a una cafetería especializada para aprender métodos de filtrado, origen del grano y degustación de café nacional.',
        'Cuenca',
        'Centro Historico de Cuenca',
        -2.900128,
        -79.005896,
        16.00,
        'Lunes a viernes de 08:00 a 16:00',
        '0987654324',
        'owner.gastronomia@cityspot.com'
    )
) AS v(
    nombre,
    descripcion,
    ciudad,
    direccion,
    latitud,
    longitud,
    precio_referencial,
    horario,
    telefono_contacto,
    correo_contacto
)
WHERE LOWER(c.nombre) = LOWER('Gastronomia');

---------------------------------------------------


DROP TABLE IF EXISTS favoritos CASCADE;
DROP TABLE IF EXISTS imagenes_actividad CASCADE;
DROP TABLE IF EXISTS consultas_actividad CASCADE;
DROP TABLE IF EXISTS actividades CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;