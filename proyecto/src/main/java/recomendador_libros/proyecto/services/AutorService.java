package recomendador_libros.proyecto.services;

import java.util.List;

import org.springframework.stereotype.Service;

import recomendador_libros.proyecto.nodes.Autor;
import recomendador_libros.proyecto.repositories.AutorRepository;

@Service
public class AutorService {

    private final AutorRepository autorRepo;

    public AutorService(AutorRepository autorRepo) {
        this.autorRepo = autorRepo;
    }

    public Autor guardarAutor(Autor autor) {
        List<Autor> existentes = autorRepo.findByNombre(autor.getNombre());
        if (!existentes.isEmpty()) {
            return existentes.get(0);
        }

        return autorRepo.save(autor);
    }
}