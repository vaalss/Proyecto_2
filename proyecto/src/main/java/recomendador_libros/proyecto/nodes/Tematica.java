package recomendador_libros.proyecto.nodes;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Node("Tematica")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tematica {

    @Id
    @GeneratedValue
    private Long id;

    private String nombre;

    @Relationship(type = "ES_SUBTIPO_DE", direction = Relationship.Direction.OUTGOING)
    private Tematica padre;
}