-- ==========================================================
-- SCRIPT DE ACTUALIZACIÓN DE BASE DE DATOS (AÑADIR PRECIO)
-- ==========================================================
-- Copia y pega este script en el SQL Editor de tu proyecto de Supabase
-- para añadir el campo de precio a tu catálogo existente.

-- 1. Añadir la columna de precio a la tabla de productos
ALTER TABLE products ADD COLUMN IF NOT EXISTS price TEXT;

-- 2. Recrear la función RPC para soportar el parámetro de precio
CREATE OR REPLACE FUNCTION add_product_secure(
    p_password_hash TEXT,
    p_title TEXT,
    p_description TEXT,
    p_image TEXT,
    p_icon TEXT,
    p_price TEXT DEFAULT NULL
) RETURNS VOID SECURITY DEFINER AS $$
BEGIN
    -- Compara el hash enviado con el hash maestro de 'geekhaus2026'
    IF p_password_hash = 'bb6478238080e4322cccf4a6f501bccf48564adb54aa1ec8a073411ad9807329' THEN
        INSERT INTO products (title, description, image, icon, price)
        VALUES (p_title, p_description, p_image, p_icon, p_price);
    ELSE
        RAISE EXCEPTION 'No autorizado: Hash de contraseña incorrecto';
    END IF;
END;
$$ LANGUAGE plpgsql;
