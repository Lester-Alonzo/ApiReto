export function agregarDiasAFecha(fecha: Date, dias: number) {
  // Crea una nueva instancia de la fecha para no modificar la original
  const nuevaFecha = new Date(fecha)
  nuevaFecha.setDate(fecha.getDate() + dias)
  return nuevaFecha
}
