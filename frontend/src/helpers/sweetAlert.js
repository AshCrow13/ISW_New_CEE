import Swal from 'sweetalert2';

export async function deleteDataAlert() {
  return Swal.fire({
    title: "¿Estás seguro?",
    text: "¡No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminar!"
  })
}

export const showSuccessAlert = (titleMessage, message) => {
  Swal.fire({
    title: titleMessage,
    text: message,
    icon: 'success',
    confirmButtonText: 'Aceptar',
    timer: 3000, // Auto cierre después de 3 segundos
    timerProgressBar: true
  });
};

export const showErrorAlert = (titleMessage, message) => {
  Swal.fire(
    titleMessage,
    message,
    'error'
  );
};