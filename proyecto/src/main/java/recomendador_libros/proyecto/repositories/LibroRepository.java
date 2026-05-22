package recomendador_libros.proyecto.repositories;

import java.util.List;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;

import recomendador_libros.proyecto.nodes.Libro;

public interface LibroRepository extends Neo4jRepository<Libro, Long> {

    List<Libro> findByTitulo(String titulo);
    
    @Query("""
    MATCH (u:Usuario {id: $userId})-[:LE_GUSTA]->(l:Libro)

    OPTIONAL MATCH (l)-[:PERTENECE_A]->(g:Genero)<-[:PERTENECE_A]-(rec1:Libro)
    OPTIONAL MATCH (l)-[:TRATA_SOBRE]->(t:Tematica)<-[:TRATA_SOBRE]-(rec2:Libro)
    OPTIONAL MATCH (l)-[:ES_ESCRITO_POR]->(a:Autor)<-[:ES_ESCRITO_POR]-(rec3:Libro)

    WITH collect(rec1) + collect(rec2) + collect(rec3) AS recs

    UNWIND recs AS rec
    WITH rec, COUNT(*) AS score

    WHERE rec IS NOT NULL

    RETURN rec
    ORDER BY score DESC
    LIMIT 10
    """)
    List<Libro> recomendar(Long userId);
    
}