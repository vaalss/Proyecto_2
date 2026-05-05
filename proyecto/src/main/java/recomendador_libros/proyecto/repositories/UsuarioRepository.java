package recomendador_libros.proyecto.repositories;

import recomendador_libros.proyecto.nodes.Usuario;
import recomendador_libros.proyecto.nodes.Libro;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import java.util.List;

public interface UsuarioRepository extends Neo4jRepository<Usuario, Long> {

    @Query("MATCH (u:Usuario {nombre: $nombre})-[:LE_GUSTA]->(l:Libro) RETURN l")
    List<Libro> encontrarLibrosQueLeGustan(String nombre);

    @Query("MATCH (u:Usuario {nombre: $nombre})-[:HA_LEIDO]->(l:Libro) RETURN l")
    List<Libro> encontrarLibrosLeidos(String nombre);
}