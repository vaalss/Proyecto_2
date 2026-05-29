package recomendador_libros.proyecto.services;

import java.util.List;

import org.springframework.stereotype.Service;

import recomendador_libros.proyecto.nodes.Genero;
import recomendador_libros.proyecto.repositories.GeneroRepository;

@Service
public class GeneroService {

    private final GeneroRepository generoRepo;

    public GeneroService(GeneroRepository generoRepo) {
        this.generoRepo = generoRepo;
    }

    public Genero guardarGenero(Genero genero) {
        List<Genero> existentes = generoRepo.findByNombre(genero.getNombre());
        if (!existentes.isEmpty()) {
            return existentes.get(0);
        }

        return generoRepo.save(genero);
    }
}