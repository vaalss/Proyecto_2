package recomendador_libros.proyecto.repositories;

import recomendador_libros.proyecto.nodes.Autor;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface AutorRepository extends Neo4jRepository<Autor, Long> {
    // No requiere código extra para esta fase
}