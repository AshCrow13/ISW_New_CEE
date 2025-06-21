// Página principal de actividades 
/*
import useActivities from '@hooks/activity/useActivities.jsx';
import ActivityTable from '@components/ActivityTable.jsx';
import ActivityForm from '@components/ActivityForm.jsx';
import { useState } from 'react';
import { createActivity, updateActivity, deleteActivity } from '@services/activity.service.js';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';

const Activities = () => {
    const { activities, fetchActivities } = useActivities();
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const handleCreate = async (data) => {
        const res = await createActivity(data);
        if (res.status === "Success") {
            showSuccessAlert("Actividad creada", "");
            setShowForm(false);
            fetchActivities();
        } else {
            showErrorAlert("Error", res.message || "No se pudo crear la actividad");
        }
    };

    const handleEdit = async (data) => {
        const res = await updateActivity(editing.id, data);
        if (res.status === "Success") {
            showSuccessAlert("Actividad actualizada", "");
            setShowForm(false);
            setEditing(null);
            fetchActivities();
        } else {
            showErrorAlert("Error", res.message || "No se pudo editar la actividad");
        }
    };

    const handleDelete = async (id) => {
        const res = await deleteActivity(id);
        if (res.status === "Success") {
            showSuccessAlert("Actividad eliminada", "");
            fetchActivities();
        } else {
            showErrorAlert("Error", res.message || "No se pudo eliminar la actividad");
        }
    };

    return (
        <div>
            <h1>Actividades</h1>
            <button onClick={() => { setShowForm(true); setEditing(null); }}>Nueva Actividad</button>
            {showForm && (
                <ActivityForm
                    onSubmit={editing ? handleEdit : handleCreate}
                    initialData={editing || {}}
                    isEdit={!!editing}
                />
            )}
            <ActivityTable
                activities={activities}
                onEdit={setEditing}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default Activities;
*/