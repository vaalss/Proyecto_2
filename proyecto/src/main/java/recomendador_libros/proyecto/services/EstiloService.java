package recomendador_libros.proyecto.services;

import java.util.List;

import org.springframework.stereotype.Service;

import recomendador_libros.proyecto.nodes.Estilo;
import recomendador_libros.proyecto.repositories.EstiloRepository;

@Service
public class EstiloService {

    private final EstiloRepository estiloRepo;

    public EstiloService(EstiloRepository estiloRepo) {
        this.estiloRepo = estiloRepo;
    }

    public Estilo guardarEstilo(Estilo estilo) {
        List<Estilo> existentes = estiloRepo.findByNombre(estilo.getNombre());
        if (!existentes.isEmpty()) {
            return existentes.get(0);
        }

        return estiloRepo.save(estilo);
    }
}