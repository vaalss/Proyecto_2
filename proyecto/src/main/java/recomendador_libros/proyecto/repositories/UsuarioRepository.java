package recomendador_libros.proyecto.repositories;

import java.util.List;
import java.util.Map;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

import recomendador_libros.proyecto.nodes.Libro;
import recomendador_libros.proyecto.nodes.Usuario;
import java.util.Optional;

public interface UsuarioRepository extends Neo4jRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    @Query("MATCH (u:Usuario {nombre: $nombre})-[:LE_GUSTA]->(l:Libro) RETURN l")
    List<Libro> encontrarLibrosQueLeGustan(String nombre);

    @Query("MATCH (u:Usuario {nombre: $nombre})-[:HA_LEIDO]->(l:Libro) RETURN l")
    List<Libro> encontrarLibrosLeidos(String nombre);

    @Query("MATCH (u:Usuario {email: $email}), (l:Libro) WHERE id(l) = $libroId " +
            "MERGE (u)-[:LE_GUSTA]->(l)")
    void addFavorito(@Param("email") String email, @Param("libroId") Long libroId);

    @Query("MATCH (u:Usuario {email: $email})-[r:LE_GUSTA]->(l:Libro) WHERE id(l) = $libroId DELETE r")
    void removeFavorito(@Param("email") String email, @Param("libroId") Long libroId);

    @Query("MATCH (u:Usuario {email: $email}), (l:Libro) WHERE id(l) = $libroId " +
            "MERGE (u)-[:HA_LEIDO]->(l)")
    void addLeido(@Param("email") String email, @Param("libroId") Long libroId);

    @Query("MATCH (u:Usuario {email: $email})-[r:HA_LEIDO]->(l:Libro) WHERE id(l) = $libroId DELETE r")
    void removeLeido(@Param("email") String email, @Param("libroId") Long libroId);

    @Query("MATCH (u:Usuario) WHERE id(u) = $usuarioId " +
            "OPTIONAL MATCH (u)-[:LE_GUSTA]->(l:Libro) WHERE id(l) = $libroId " +
            "OPTIONAL MATCH (u)-[:HA_LEIDO]->(l2:Libro) WHERE id(l2) = $libroId " +
            "RETURN { esFavorito: (l IS NOT NULL), esLeido: (l2 IS NOT NULL) }")
    Map<String, Object> obtenerEstadoInteraccion(@Param("usuarioId") Long usuarioId, @Param("libroId") Long libroId);

}