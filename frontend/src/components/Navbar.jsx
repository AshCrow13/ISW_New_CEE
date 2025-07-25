import { AppBar, Toolbar, Typography, IconButton, Button, Box, Drawer, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { logout } from "@services/auth.service.js";

const Navbar = () => { // Componente de navegación
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem('usuario')) || '';
    const userRole = user?.rol;
    const [drawerOpen, setDrawerOpen] = useState(false);

    const navLinks = [ // Enlaces de navegación
        { to: "/home", label: "Inicio" },
        { to: "/actividades", label: "Actividades" },
        { to: "/asambleas", label: "Asambleas" },
        { to: "/documentos", label: "Documentos" },
        { to: "/users", label: "Estudiantes" },
        ...(userRole === 'admin' ? [{ to: "/historial", label: "Historial" }] : [])
    ];

    const handleLogout = () => { // Función para cerrar sesión
        logout();
        navigate('/auth');
    };

    // Drawer para móvil
    const drawerList = (
        <Box sx={{ width: 220 }} role="presentation" onClick={() => setDrawerOpen(false)}>
        <List>
            {navLinks.map((link) => (
            <ListItem button key={link.to} component={NavLink} to={link.to}>
                <ListItemText primary={link.label} />
            </ListItem>
            ))}
            <ListItem button onClick={handleLogout}>
            <ListItemText primary="Cerrar sesión" />
            </ListItem>
        </List>
        </Box>
    );

    return ( // Renderizado del componente
        <>
        <AppBar position="static" color="primary">
            <Toolbar>
            <IconButton
                color="inherit"
                edge="start"
                onClick={() => setDrawerOpen(true)}
                sx={{ mr: 2, display: { sm: "none" } }}
            >
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Centro de Estudiantes UBB
            </Typography>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
                {navLinks.map((link) => (
                <Button
                    key={link.to}
                    color="inherit"
                    component={NavLink}
                    to={link.to}
                    sx={{ mx: 1 }}
                    style={({ isActive }) => ({ textDecoration: isActive ? 'underline' : 'none' })}
                >
                    {link.label}
                </Button>
                ))}
                <Button color="inherit" onClick={handleLogout} sx={{ mx: 1 }}>
                Cerrar sesión
                </Button>
            </Box>
            </Toolbar>
        </AppBar>
        {/* Drawer para móvil */}
        <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            sx={{ display: { sm: "none" } }}
        >
            {drawerList}
        </Drawer>
        </>
    );
};

export default Navbar;


