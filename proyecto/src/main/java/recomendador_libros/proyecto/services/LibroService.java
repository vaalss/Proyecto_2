package recomendador_libros.proyecto.services;

import java.util.List;

import org.springframework.stereotype.Service;

import recomendador_libros.proyecto.nodes.Libro;
import recomendador_libros.proyecto.repositories.LibroRepository;

@Service
public class LibroService {

    private final LibroRepository libroRepo;

    public LibroService(LibroRepository libroRepo) {
        this.libroRepo = libroRepo;
    }

    public Libro guardarLibro(Libro libro) {

        List<Libro> existentes = libroRepo.findByTitulo(libro.getTitulo());
        if (existentes.isEmpty()) {
            return libroRepo.save(libro);
        }

        return existentes.get(0);
    }
}