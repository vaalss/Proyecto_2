package recomendador_libros.proyecto.repositories;

import org.springframework.data.neo4j.repository.Neo4jRepository;

import recomendador_libros.proyecto.nodes.Tematica;

public interface TematicaRepository extends Neo4jRepository<Tematica, Long> {
    // No requiere código extra para esta fase
}