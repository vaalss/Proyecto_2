package recomendador_libros.proyecto.services;

import java.util.List;

import org.springframework.stereotype.Service;

import recomendador_libros.proyecto.nodes.Tematica;
import recomendador_libros.proyecto.repositories.TematicaRepository;

@Service
public class TematicaService {

    private final TematicaRepository tematicaRepo;

    public TematicaService(TematicaRepository tematicaRepo) {
        this.tematicaRepo = tematicaRepo;
    }

    public Tematica guardarTematica(Tematica tematica) {
        List<Tematica> existentes = tematicaRepo.findByNombre(tematica.getNombre());
        if (!existentes.isEmpty()) {
            return existentes.get(0);
        }

        return tematicaRepo.save(tematica);
    }
}