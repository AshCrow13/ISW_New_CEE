import { useForm } from 'react-hook-form';
import { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    IconButton,
    InputAdornment
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Form = ({ title, fields, buttonText, onSubmit, footerContent, backgroundColor }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Funciones para alternar visibilidad de contraseñas
    const handleTogglePassword = () => setShowPassword((v) => !v);
    const handleToggleNewPassword = () => setShowNewPassword((v) => !v);

    const onFormSubmit = (data) => {
        onSubmit(data);
    };

    return (
        <Box
        component="form"
        sx={{
            backgroundColor: backgroundColor || '#fff',
            p: 4,
            borderRadius: 2,
            boxShadow: 2,
            maxWidth: 500,
            margin: '0 auto',
            mt: 5
        }}
        onSubmit={handleSubmit(onFormSubmit)}
        autoComplete="off"
        >
        <Typography variant="h5" mb={3} align="center">{title}</Typography>
        {fields.map((field, index) => (
            <Box key={index} sx={{ mb: 2 }}>
            {/* INPUT NORMAL */}
            {field.fieldType === 'input' && field.type !== 'password' && (
                <TextField
                label={field.label}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                fullWidth
                defaultValue={field.defaultValue || ''}
                disabled={field.disabled}
                error={!!errors[field.name] || !!field.errorMessageData}
                helperText={
                    errors[field.name]?.message || field.errorMessageData || field.helperText
                }
                {...register(field.name, {
                    required: field.required ? 'Este campo es obligatorio' : false,
                    minLength: field.minLength
                    ? { value: field.minLength, message: `Debe tener al menos ${field.minLength} caracteres` }
                    : false,
                    maxLength: field.maxLength
                    ? { value: field.maxLength, message: `Debe tener máximo ${field.maxLength} caracteres` }
                    : false,
                    pattern: field.pattern
                    ? { value: field.pattern, message: field.patternMessage || 'Formato no válido' }
                    : false,
                    validate: field.validate || {},
                })}
                onChange={field.onChange}
                />
            )}

            {/* INPUT PASSWORD */}
            {field.fieldType === 'input' && field.type === 'password' && (
                <TextField
                label={field.label}
                name={field.name}
                type={
                    field.name === 'password'
                    ? (showPassword ? 'text' : 'password')
                    : (showNewPassword ? 'text' : 'password')
                }
                placeholder={field.placeholder}
                fullWidth
                defaultValue={field.defaultValue || ''}
                disabled={field.disabled}
                error={!!errors[field.name] || !!field.errorMessageData}
                helperText={
                    errors[field.name]?.message || field.errorMessageData || field.helperText
                }
                {...register(field.name, {
                    required: field.required ? 'Este campo es obligatorio' : false,
                    minLength: field.minLength
                    ? { value: field.minLength, message: `Debe tener al menos ${field.minLength} caracteres` }
                    : false,
                    maxLength: field.maxLength
                    ? { value: field.maxLength, message: `Debe tener máximo ${field.maxLength} caracteres` }
                    : false,
                    pattern: field.pattern
                    ? { value: field.pattern, message: field.patternMessage || 'Formato no válido' }
                    : false,
                    validate: field.validate || {},
                })}
                onChange={field.onChange}
                InputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                        aria-label="Mostrar/Ocultar contraseña"
                        onClick={
                            field.name === 'password'
                            ? handleTogglePassword
                            : handleToggleNewPassword
                        }
                        edge="end"
                        >
                        {(field.name === 'password' && showPassword) ||
                        (field.name === 'newPassword' && showNewPassword)
                            ? <VisibilityOff />
                            : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                    )
                }}
                />
            )}

            {/* TEXTAREA */}
            {field.fieldType === 'textarea' && (
                <TextField
                label={field.label}
                name={field.name}
                placeholder={field.placeholder}
                fullWidth
                multiline
                rows={field.rows || 4}
                defaultValue={field.defaultValue || ''}
                disabled={field.disabled}
                error={!!errors[field.name] || !!field.errorMessageData}
                helperText={
                    errors[field.name]?.message || field.errorMessageData || field.helperText
                }
                {...register(field.name, {
                    required: field.required ? 'Este campo es obligatorio' : false,
                    minLength: field.minLength
                    ? { value: field.minLength, message: `Debe tener al menos ${field.minLength} caracteres` }
                    : false,
                    maxLength: field.maxLength
                    ? { value: field.maxLength, message: `Debe tener máximo ${field.maxLength} caracteres` }
                    : false,
                    validate: field.validate || {},
                })}
                onChange={field.onChange}
                />
            )}

            {/* SELECT */}
            {field.fieldType === 'select' && (
                <FormControl fullWidth error={!!errors[field.name]} sx={{ mt: 2 }}>
                <InputLabel>{field.label}</InputLabel>
                <Select
                    label={field.label}
                    name={field.name}
                    defaultValue={field.defaultValue || ''}
                    disabled={field.disabled}
                    {...register(field.name, {
                    required: field.required ? 'Este campo es obligatorio' : false,
                    validate: field.validate || {},
                    })}
                    onChange={field.onChange}
                >
                    <MenuItem value="">
                    <em>Seleccionar opción</em>
                    </MenuItem>
                    {field.options &&
                    field.options.map((option, optIndex) => (
                        <MenuItem key={optIndex} value={option.value}>
                        {option.label}
                        </MenuItem>
                    ))}
                </Select>
                {(errors[field.name]?.message || field.errorMessageData) && (
                    <Typography variant="caption" color="error">
                    {errors[field.name]?.message || field.errorMessageData}
                    </Typography>
                )}
                </FormControl>
            )}
            </Box>
        ))}
        {buttonText && (
            <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            >
            {buttonText}
            </Button>
        )}
        {footerContent && (
            <Box sx={{ mt: 2 }}>{footerContent}</Box>
        )}
        </Box>
    );
};

export default Form;
