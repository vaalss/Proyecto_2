package recomendador_libros.proyecto.repositories;

import org.springframework.data.neo4j.repository.Neo4jRepository;

import recomendador_libros.proyecto.nodes.Estilo;

public interface EstiloRepository extends Neo4jRepository<Estilo, Long> {
    // No requiere código extra para esta fase
}