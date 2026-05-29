package recomendador_libros.proyecto.repositories;

import java.util.List;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import recomendador_libros.proyecto.nodes.Genero;

public interface GeneroRepository extends Neo4jRepository<Genero, Long> {
    List<Genero> findByNombre(String nombre);
}