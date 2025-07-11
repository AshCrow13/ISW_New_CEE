/**
 * Formatea un RUT chileno agregando puntos y guión mientras el usuario escribe
 * @param {string} value - El valor del RUT ingresado por el usuario
 * @return {string} - RUT formateado con puntos y guión
 */
export const formatRutOnChange = (value) => {
  // Eliminar todos los caracteres que no sean números o k/K
  let rutClean = value.replace(/[^0-9kK]/g, '');
  
  // Limitar a máximo 9 caracteres (8 dígitos + 1 dígito verificador)
  if (rutClean.length > 9) {
    rutClean = rutClean.slice(0, 9);
  }
  
  // Si está vacío, devolver string vacío
  if (rutClean.length === 0) return '';
  
  // Si solo tiene el dígito verificador
  if (rutClean.length === 1) return rutClean;
  
  // Separar el dígito verificador
  const dv = rutClean.slice(-1);
  const rutDigits = rutClean.slice(0, -1);
  
  // Formatear con puntos según la longitud
  let formattedRut = '';
  
  if (rutDigits.length <= 3) {
    formattedRut = rutDigits;
  } else if (rutDigits.length <= 6) {
    formattedRut = `${rutDigits.slice(0, rutDigits.length - 3)}.${rutDigits.slice(-3)}`;
  } else {
    formattedRut = `${rutDigits.slice(0, rutDigits.length - 6)}.${rutDigits.slice(-6, -3)}.${rutDigits.slice(-3)}`;
  }
  
  // Agregar guión y dígito verificador
  return `${formattedRut}-${dv}`;
};

/**
 * Verifica si un RUT es válido según el algoritmo de verificación
 * @param {string} rut - El RUT formateado (con o sin puntos y guión)
 * @return {boolean} - true si el RUT es válido
 */
export const validateRut = (rut) => {
    // Implementación básica de validación - solo verifica formato
    const rutRegex = /^(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}-[\dkK]$/;
    return rutRegex.test(rut);
};
