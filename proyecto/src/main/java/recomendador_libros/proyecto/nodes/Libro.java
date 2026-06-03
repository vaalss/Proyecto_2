package recomendador_libros.proyecto.nodes;

import java.util.Set;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Node("Libro")
// Generación de Getters y Setters y otros métodos usando Lombok
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Libro {

    // Se genera un ID automáticamente para cada libro
    @Id
    @GeneratedValue
    private Long id;
    private String titulo;
    private String sinopsis;
    private String urlPortada;
    private Integer año;

    // Relaciones que pueda tener el libro con demás nodos
    @Relationship(type = "ES_ESCRITO_POR", direction = Relationship.Direction.OUTGOING)
    private Autor autor;

    @Relationship(type = "PERTENECE_A", direction = Relationship.Direction.OUTGOING)
    private Set<Genero> generos;

    @Relationship(type = "TRATA_SOBRE", direction = Relationship.Direction.OUTGOING)
    private Set<Tematica> tematicas;

    @Relationship(type = "TIENE_ESTILO", direction = Relationship.Direction.OUTGOING)
    private Estilo estilo;

}
