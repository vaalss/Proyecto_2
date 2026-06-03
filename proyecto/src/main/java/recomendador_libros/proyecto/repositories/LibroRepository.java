package recomendador_libros.proyecto.repositories;

import java.util.List;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

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

    @Query("MATCH (u:Usuario {email: $email})-[:LE_GUSTA]->(l:Libro) RETURN l")
    List<Libro> findFavoritosByEmail(@Param("email") String email);

    @Query("MATCH (u:Usuario) WHERE id(u) = $usuarioId " +
            "OPTIONAL MATCH (u)-[:LE_GUSTA|HA_LEIDO]->(:Libro)-[:PERTENECE_A|TIENE_ESTILO|ES_ESCRITO_POR|TRATA_SOBRE]->(attr) "
            +
            "WITH u, collect(DISTINCT id(attr)) AS userAttrs " +
            "MATCH (b:Libro) WHERE id(b) = $libroId " +
            "OPTIONAL MATCH (b)-[:PERTENECE_A|TIENE_ESTILO|ES_ESCRITO_POR|TRATA_SOBRE]->(bAttr) " +
            "WITH userAttrs, collect(DISTINCT id(bAttr)) AS bookAttrs " +
            "WITH [a IN bookAttrs WHERE a IN userAttrs] AS intersection, bookAttrs " +
            "RETURN CASE WHEN size(bookAttrs) = 0 THEN 50 " +
            "ELSE toInteger((toFloat(size(intersection)) / size(bookAttrs)) * 100) END AS matchPercentage")
    Integer calcularPorcentajeMatch(@Param("usuarioId") Long usuarioId, @Param("libroId") Long libroId);

    @Query("MATCH (u:Usuario) WHERE id(u) = $userId " +
            "OPTIONAL MATCH (u)-[:LE_GUSTA|HA_LEIDO]->(:Libro)-[:PERTENECE_A|TIENE_ESTILO|ES_ESCRITO_POR|TRATA_SOBRE]->(attr) "
            +
            "WITH u, collect(DISTINCT id(attr)) AS userAttrs " +
            "MATCH (b:Libro) " +
            "OPTIONAL MATCH (b)-[:PERTENECE_A|TIENE_ESTILO|ES_ESCRITO_POR|TRATA_SOBRE]->(bAttr) " +
            "WITH b, userAttrs, collect(DISTINCT id(bAttr)) AS bookAttrs " +
            "WITH b, [a IN bookAttrs WHERE a IN userAttrs] AS intersection, userAttrs, bookAttrs " +
            "WITH b, " +
            "     CASE WHEN size(userAttrs) = 0 THEN 50 " +
            "     WHEN size(bookAttrs) = 0 THEN 50 " +
            "     ELSE toInteger((toFloat(size(intersection)) / size(bookAttrs)) * 100) END AS score " +
            "RETURN toString(id(b)) + '_' + toString(score) ORDER BY score DESC, rand() LIMIT 10")
    List<String> obtenerIdsRecomendadosStr(@Param("userId") Long userId);

    @Query("MATCH (u:Usuario)-[:LE_GUSTA]->(l:Libro) WHERE id(u) = $usuarioId RETURN l")
    List<Libro> findFavoritosByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("MATCH (u:Usuario)-[:HA_LEIDO]->(l:Libro) WHERE id(u) = $usuarioId RETURN l")
    List<Libro> findLeidosByUsuarioId(@Param("usuarioId") Long usuarioId);
}