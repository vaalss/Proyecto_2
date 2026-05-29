package recomendador_libros.proyecto.repositories;

import org.springframework.data.neo4j.repository.Neo4jRepository;

import recomendador_libros.proyecto.nodes.Tematica;

import java.util.List;

public interface TematicaRepository extends Neo4jRepository<Tematica, Long> {
    List<Tematica> findByNombre(String nombre);
}