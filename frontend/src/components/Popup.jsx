import Form from './Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';
import QuestionIcon from '@assets/QuestionCircleIcon.svg';

export default function Popup({ show, setShow, data, action }) {
    
    console.log('🎯 Popup recibió data:', data);
    
    const userData = data && data.length > 0 ? data[0] : {};
    
    console.log('👤 userData extraído:', userData);

    const handleSubmit = (data) => {
        console.log('📤 Popup enviando datos:', data);
        action(data);
    };

    const patternRut = new RegExp(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/);
    
    return (
        <div>
            { show && (
            <div className="bg">
                <div className="popup">
                    <button className='close' onClick={() => setShow(false)}>
                        <img src={CloseIcon} />
                    </button>
                    <Form
                        title="Editar usuario"
                        fields={[
                            {
                                label: "Nombre completo",
                                name: "nombreCompleto",
                                defaultValue: userData.nombreCompleto || "",
                                placeholder: 'Diego Alexis Salazar Jara',
                                fieldType: 'input',
                                type: "text",
                                required: true,
                                minLength: 15,
                                maxLength: 50,
                                pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                                patternMessage: "Debe contener solo letras y espacios",
                            },
                            {
                                label: "Correo electrónico",
                                name: "email",
                                defaultValue: userData.email || "",
                                placeholder: 'example@gmail.cl',
                                fieldType: 'input',
                                type: "email",
                                required: true,
                                minLength: 15,
                                maxLength: 100,
                            },
                            {
                                label: "Rut",
                                name: "rut",
                                defaultValue: userData.rut || "",
                                placeholder: '21.308.770-3',
                                fieldType: 'input',
                                type: "text",
                                minLength: 9,
                                maxLength: 12,
                                pattern: patternRut,
                                patternMessage: "Debe ser xx.xxx.xxx-x o xxxxxxxx-x",
                                required: true,
                            },
                            {
                                label: "Carrera",
                                name: "carrera",
                                fieldType: 'select',
                                options: [
                                    { value: "Ingeniería Civil Informática", label: "Ingeniería Civil Informática" },
                                    { value: "Ingeniería Civil Eléctrica", label: "Ingeniería Civil Eléctrica" },
                                    { value: "Ingeniería Civil Industrial", label: "Ingeniería Civil Industrial" },
                                    { value: "Ingeniería en Computación e Informática", label: "Ingeniería en Computación e Informática" }
                                ],
                                required: true,
                                defaultValue: userData.carrera || "Ingeniería Civil Informática",
                            },
                            {
                                label: "Rol",
                                name: "rol",
                                fieldType: 'select',
                                options: [
                                    { value: "admin", label: "Administrador" },
                                    { value: "vocalia", label: "Vocalía" },
                                    { value: "estudiante", label: "Estudiante" }
                                ],
                                required: true,
                                defaultValue: userData.rol || "estudiante",
                            },
                            {
                                label: (
                                    <span>
                                        Nueva contraseña
                                        <span className='tooltip-icon'>
                                            <img src={QuestionIcon} />
                                            <span className='tooltip-text'>Este campo es opcional</span>
                                        </span>
                                    </span>
                                ),
                                name: "newPassword",
                                placeholder: "**********",
                                fieldType: 'input',
                                type: "password",
                                required: false,
                                minLength: 8,
                                maxLength: 26,
                                pattern: /^[a-zA-Z0-9]+$/,
                                patternMessage: "Debe contener solo letras y números",
                            }
                        ]}
                        onSubmit={handleSubmit}
                        buttonText="Editar usuario"
                        backgroundColor={'#fff'}
                    />
                </div>
            </div>
            )}
        </div>
    );
}