import { useState } from 'react';
import { postVotacion } from '@services/votacion.service.js';

// Hook para manejar la lógica del formulario de creación de votación
export function useVotacionFormularioCrear({ onSubmit, onSuccess }) {
    const [formData, setFormData] = useState({
        titulo: '',
        fechaInicio: '',
        fechaFin: '',
        opciones: ['', '']
    });
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleOpcionChange = (index, value) => {
        const nuevasOpciones = [...formData.opciones];
        nuevasOpciones[index] = value;
        setFormData(prev => ({
            ...prev,
            opciones: nuevasOpciones
        }));
    };

    const agregarOpcion = () => {
        setFormData(prev => ({
            ...prev,
            opciones: [...prev.opciones, '']
        }));
    };

    const eliminarOpcion = (index) => {
        if (formData.opciones.length > 2) {
            const nuevasOpciones = formData.opciones.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                opciones: nuevasOpciones
            }));
        }
    };

    const validarFormulario = () => {
        const newErrors = {};
        if (!formData.titulo.trim()) {
            newErrors.titulo = 'El título es obligatorio';
        }
        if (!formData.fechaInicio) {
            newErrors.fechaInicio = 'La fecha de inicio es obligatoria';
        } else {
            const fechaInicio = new Date(formData.fechaInicio);
            if (isNaN(fechaInicio.getTime())) {
                newErrors.fechaInicio = 'La fecha de inicio no es válida';
            } else if (fechaInicio < new Date()) {
                newErrors.fechaInicio = 'La fecha de inicio debe ser futura';
            }
        }
        if (!formData.fechaFin) {
            newErrors.fechaFin = 'La fecha de fin es obligatoria';
        } else {
            const fechaFin = new Date(formData.fechaFin);
            if (isNaN(fechaFin.getTime())) {
                newErrors.fechaFin = 'La fecha de fin no es válida';
            }
        }
        if (formData.fechaInicio && formData.fechaFin) {
            const fechaInicio = new Date(formData.fechaInicio);
            const fechaFin = new Date(formData.fechaFin);
            if (!isNaN(fechaInicio.getTime()) && !isNaN(fechaFin.getTime())) {
                if (fechaInicio >= fechaFin) {
                    newErrors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio';
                }
                const duracionHoras = (fechaFin - fechaInicio) / (1000 * 60);
                if (duracionHoras < 10) {
                    newErrors.fechaFin = 'La votación debe durar al menos 10';
                }
            }
        }
        const opcionesValidas = formData.opciones.filter(opcion => opcion.trim() !== '');
        if (opcionesValidas.length < 2) {
            newErrors.opciones = 'Debe tener al menos 2 opciones válidas';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;
        setSubmitting(true);
        try {
            const inicioDate = new Date(formData.fechaInicio);
            const finDate = new Date(formData.fechaFin);
            console.log("Inicio:", inicioDate, "Fin:", finDate);
            const duracionMinutos = Math.floor((finDate - inicioDate) / (1000 * 60));
            const datosVotacion = {
                nombre: formData.titulo.trim(),
                duracion: duracionMinutos,
                opciones: formData.opciones.filter(opcion => opcion.trim() !== ''),
                estado: true
            };
            let resultado;
            if (onSubmit) {
                resultado = await onSubmit(datosVotacion);
                if (resultado.success) return;
            } else {
                resultado = await postVotacion(datosVotacion);
                if (resultado.status === 'Success') {
                    if (onSuccess) onSuccess();
                    return;
                }
            }
        } catch (error) {
            // Manejo de error opcional
        } finally {
            setSubmitting(false);
        }
    };

    return {
        formData,
        setFormData,
        submitting,
        errors,
        handleInputChange,
        handleOpcionChange,
        agregarOpcion,
        eliminarOpcion,
        handleSubmit
    };
}
