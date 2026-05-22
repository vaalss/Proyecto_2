package recomendador_libros.proyecto.repositories;

import recomendador_libros.proyecto.nodes.Tematica;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface TematicaRepository extends Neo4jRepository<Tematica, Long> {
    
}