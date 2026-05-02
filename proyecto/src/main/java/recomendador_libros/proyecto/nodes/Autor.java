package recomendador_libros.proyecto.nodes;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Node("Autor")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Autor {

    @Id
    @GeneratedValue
    private Long id;

    private String nombre;

    // Relaciones que pueda tener un autor.
    @Relationship(type = "INFLUENCIADO_POR", direction = Relationship.Direction.OUTGOING)
    private Autor autor;
}
