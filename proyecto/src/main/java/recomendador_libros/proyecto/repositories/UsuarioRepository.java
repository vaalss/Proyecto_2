package recomendador_libros.proyecto.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

import recomendador_libros.proyecto.nodes.Libro;
import recomendador_libros.proyecto.nodes.Usuario;

public interface UsuarioRepository extends Neo4jRepository<Usuario, Long> {

        Optional<Usuario> findByEmail(String email);

        @Query("MATCH (u:Usuario {nombre: $nombre})-[:LE_GUSTA]->(l:Libro) RETURN l")
        List<Libro> encontrarLibrosQueLeGustan(@Param("nombre") String nombre);

        @Query("MATCH (u:Usuario {nombre: $nombre})-[:HA_LEIDO]->(l:Libro) RETURN l")
        List<Libro> encontrarLibrosLeidos(@Param("nombre") String nombre);

        // ─── 1. Consultas de Estado (Devuelven booleano para evitar errores) ───
        @Query("MATCH (u:Usuario) WHERE id(u) = $usuarioId MATCH (u)-[:LE_GUSTA]->(l:Libro) WHERE id(l) = $libroId RETURN count(l) > 0")
        boolean isFavorito(@Param("usuarioId") Long usuarioId, @Param("libroId") Long libroId);

        @Query("MATCH (u:Usuario) WHERE id(u) = $usuarioId MATCH (u)-[:HA_LEIDO]->(l:Libro) WHERE id(l) = $libroId RETURN count(l) > 0")
        boolean isLeido(@Param("usuarioId") Long usuarioId, @Param("libroId") Long libroId);

        // ─── 2. Guardado y Borrado (Optimizado sin cartesian product) ───
        @Query("MATCH (u:Usuario) WHERE id(u) = $usuarioId MATCH (l:Libro) WHERE id(l) = $libroId MERGE (u)-[:LE_GUSTA]->(l)")
        void hacerFavorito(@Param("usuarioId") Long usuarioId, @Param("libroId") Long libroId);

        @Query("MATCH (u:Usuario)-[r:LE_GUSTA]->(l:Libro) WHERE id(u) = $usuarioId AND id(l) = $libroId DELETE r")
        void quitarFavorito(@Param("usuarioId") Long usuarioId, @Param("libroId") Long libroId);

        @Query("MATCH (u:Usuario) WHERE id(u) = $usuarioId MATCH (l:Libro) WHERE id(l) = $libroId MERGE (u)-[:HA_LEIDO]->(l)")
        void hacerLeido(@Param("usuarioId") Long usuarioId, @Param("libroId") Long libroId);

        @Query("MATCH (u:Usuario)-[r:HA_LEIDO]->(l:Libro) WHERE id(u) = $usuarioId AND id(l) = $libroId DELETE r")
        void quitarLeido(@Param("usuarioId") Long usuarioId, @Param("libroId") Long libroId);
}