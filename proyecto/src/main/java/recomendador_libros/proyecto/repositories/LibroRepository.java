package recomendador_libros.proyecto.repositories;

import java.util.List;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;

import recomendador_libros.proyecto.nodes.Libro;

public interface LibroRepository extends Neo4jRepository<Libro, Long> {

    List<Libro> findByTitulo(String titulo);
    
    @Query("""
    MATCH (u:Usuario {email: $email})-[:LE_GUSTA]->(favorito:Libro)

    MATCH (favorito)-[relacion:ES_ESCRITO_POR|PERTENECE_A|TRATA_SOBRE|TIENE_ESTILO]->(atributo)<-[:ES_ESCRITO_POR|PERTENECE_A|TRATA_SOBRE|TIENE_ESTILO]-(candidato:Libro)
    
    WHERE candidato IS NOT NULL
        AND candidato <> favorito
        AND NOT (u)-[:HA_LEIDO]->(candidato)
        AND NOT (u)-[:LE_GUSTA]->(candidato)
    

    WITH candidato, type(relacion) AS tipoRelacion
    WITH candidato,
        CASE tipoRelacion
            WHEN 'ES_ESCRITO_POR' THEN 2
            ELSE 1
        END AS puntos

    RETURN candidato, sum(puntos) AS score
    ORDER BY score DESC
    LIMIT 10
    """)
    List<Libro> recomendar(String email);

    @Query("""
    MATCH (libroBase:Libro {titulo: $tituloLibro})-[:ES_ESCRITO_POR|:PERTENECE_A|:TRATA_SOBRE|:TIENE_ESTILO]->(atributo)<-[:ES_ESCRITO_POR|:PERTENECE_A|:TRATA_SOBRE|:TIENE_ESTILO]-(libroRecomendado:Libro)
    WITH libroRecomendado, count(atributo) AS coincidencias
    ORDER BY coincidencias DESC
    RETURN libroRecomendado
    LIMIT 5
    """)
    List<Libro> findSimilarByAttributes(String tituloLibro);
    
}