package recomendador_libros.proyecto.repositories;

import recomendador_libros.proyecto.nodes.Autor;

import java.util.List;

import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface AutorRepository extends Neo4jRepository<Autor, Long> {
    List<Autor> findByNombre(String nombre);
}