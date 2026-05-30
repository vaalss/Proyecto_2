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
            WHEN 'ES_ESCRITO_POR' THEN 4
            WHEN 'PERTENECE_A' THEN 2
            ELSE 1
        END AS puntos

    WITH candidato, sum(puntos) AS score

    RETURN candidato.titulo
    ORDER BY score DESC
    LIMIT 10
    """)
    List<String> recomendarTitulos(String email);

    @Query("""
    MATCH (u:Usuario {email: $email})-[:LE_GUSTA]->(favorito:Libro)

    MATCH (favorito)-[:ES_ESCRITO_POR]->(autorFavorito:Autor)

    MATCH (autorCandidato:Autor)-[:INFLUENCIADO_POR]->(autorFavorito)

    MATCH (candidato:Libro)-[:ES_ESCRITO_POR]->(autorCandidato)

    WHERE NOT (u)-[:LE_GUSTA]->(candidato)
    AND NOT (u)-[:HA_LEIDO]->(candidato)

    WITH candidato, count(*) AS score

    RETURN candidato.titulo
    ORDER BY score DESC
    LIMIT 10
    """)
    List<String> recomendarPorInfluencia(String email);

    @Query("""
    MATCH (libroBase:Libro {titulo: $tituloLibro})
        -[:ES_ESCRITO_POR|PERTENECE_A|TRATA_SOBRE|TIENE_ESTILO]->(atributo)
        <-[:ES_ESCRITO_POR|PERTENECE_A|TRATA_SOBRE|TIENE_ESTILO]-
        (libroRecomendado:Libro)

    WHERE libroRecomendado <> libroBase

    WITH libroRecomendado, count(atributo) AS coincidencias

    RETURN libroRecomendado.titulo
    ORDER BY coincidencias DESC
    LIMIT 5
    """)
    List<String> findSimilarTitles(String tituloLibro);
    
}