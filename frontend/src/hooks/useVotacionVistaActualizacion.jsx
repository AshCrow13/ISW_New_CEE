import { useState } from 'react';
import { getVotacionById, updateVotacion } from '@services/votacion.service.js';

// Hook para manejar la lógica de actualización de votaciones
export function useVotacionVistaActualizacion({ user, onActualizar }) {
    const [step, setStep] = useState('buscar');
    const [searchId, setSearchId] = useState('');
    const [votacionOriginal, setVotacionOriginal] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '',
        fechaInicio: '',
        fechaFin: '',
        opciones: ['', '']
    });
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Buscar votación por ID
    const buscarVotacion = async () => {
        if (!searchId.trim()) {
            alert('Por favor ingresa un ID válido');
            return;
        }
        setLoading(true);
        try {
            const response = await getVotacionById(searchId);
            if (response.status === 'Success' && response.data) {
                setVotacionOriginal(response.data);
                // Ajuste: convertir fecha UTC/ISO a local para el input datetime-local
                function toLocalDatetimeString(dateStr) {
                    if (!dateStr) return '';
                    const d = new Date(dateStr);
                    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                    return d.toISOString().slice(0, 16);
                }
                setFormData({
                    titulo: response.data.nombre || '',
                    fechaInicio: response.data.inicio ? toLocalDatetimeString(response.data.inicio) : '',
                    fechaFin: response.data.fin ? toLocalDatetimeString(response.data.fin) : '',
                    opciones: response.data.opciones && response.data.opciones.length > 0
                        ? response.data.opciones.map(o => typeof o === 'string' ? o : o.texto)
                        : ['', '']
                });
                setStep('editar');
            } else {
                alert('No se encontró la votación');
            }
        } catch (error) {
            alert('Error al buscar la votación: ' + (error.message || 'Error desconocido'));
        } finally {
            setLoading(false);
        }
    };

    // Handlers de formulario
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };
    const handleOpcionChange = (index, value) => {
        const nuevasOpciones = [...formData.opciones];
        nuevasOpciones[index] = value;
        setFormData(prev => ({ ...prev, opciones: nuevasOpciones }));
    };
    const agregarOpcion = () => {
        setFormData(prev => ({ ...prev, opciones: [...prev.opciones, ''] }));
    };
    const eliminarOpcion = (index) => {
        if (formData.opciones.length > 2) {
            setFormData(prev => ({
                ...prev,
                opciones: prev.opciones.filter((_, i) => i !== index)
            }));
        }
    };

    // Validación
    const validarFormulario = () => {
        const newErrors = {};
        if (!formData.titulo.trim()) newErrors.titulo = 'El título es obligatorio';
        if (!formData.fechaInicio) newErrors.fechaInicio = 'La fecha de inicio es obligatoria';
        else {
            const fechaInicio = new Date(formData.fechaInicio);
            if (isNaN(fechaInicio.getTime())) newErrors.fechaInicio = 'La fecha de inicio no es válida';
        }
        if (!formData.fechaFin) newErrors.fechaFin = 'La fecha de fin es obligatoria';
        else {
            const fechaFin = new Date(formData.fechaFin);
            if (isNaN(fechaFin.getTime())) newErrors.fechaFin = 'La fecha de fin no es válida';
        }
        if (formData.fechaInicio && formData.fechaFin) {
            const fechaInicio = new Date(formData.fechaInicio);
            const fechaFin = new Date(formData.fechaFin);
            if (!isNaN(fechaInicio.getTime()) && !isNaN(fechaFin.getTime())) {
                if (fechaInicio >= fechaFin) newErrors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio';
                const duracionHoras = (fechaFin - fechaInicio) / (1000 * 60 * 60);
                if (duracionHoras < 1) newErrors.fechaFin = 'La votación debe durar al menos 1 hora';
            }
        }
        const opcionesValidas = formData.opciones.filter(opcion => opcion.trim() !== '');
        if (opcionesValidas.length < 2) newErrors.opciones = 'Debe tener al menos 2 opciones válidas';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Envío de formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;
        setSubmitting(true);
        try {
            const inicioDate = new Date(formData.fechaInicio);
            const finDate = new Date(formData.fechaFin);
            const duracionMinutos = Math.floor((finDate - inicioDate) / (1000 * 60));
            const datosActualizados = {
                nombre: formData.titulo.trim(),
                duracion: duracionMinutos,
                opciones: formData.opciones.filter(opcion => opcion.trim() !== ''),
                estado: votacionOriginal.estado
            };
            const resultado = await updateVotacion(votacionOriginal.id, datosActualizados);
            if (resultado.status === 'Success') {
                if (onActualizar) onActualizar();
                setStep('buscar');
                setVotacionOriginal(null);
                setFormData({ titulo: '', fechaInicio: '', fechaFin: '', opciones: ['', ''] });
                setErrors({});
            } else {
                alert('Error al actualizar la votación: ' + (resultado.message || 'Error desconocido'));
            }
        } catch (error) {
            alert('❌ Error al actualizar la votación: ' + (error.message || 'Error desconocido'));
        } finally {
            setSubmitting(false);
        }
    };

    // Volver a buscar
    const volverABuscar = () => {
        setStep('buscar');
        setVotacionOriginal(null);
        setFormData({ titulo: '', fechaInicio: '', fechaFin: '', opciones: ['', ''] });
        setErrors({});
    };

    return {
        step,
        searchId,
        setSearchId,
        votacionOriginal,
        formData,
        errors,
        loading,
        submitting,
        handleInputChange,
        handleOpcionChange,
        agregarOpcion,
        eliminarOpcion,
        handleSubmit,
        buscarVotacion,
        volverABuscar
    };
}
