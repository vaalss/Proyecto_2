package recomendador_libros.proyecto.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import recomendador_libros.proyecto.repositories.LibroRepository;
import recomendador_libros.proyecto.repositories.UsuarioRepository;

@Service
public class RecomendacionService {

    @Autowired
    private LibroRepository libroRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;
    
}

