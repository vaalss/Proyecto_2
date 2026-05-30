package recomendador_libros.proyecto.nodes;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
@EqualsAndHashCode(exclude = "padre")
@ToString(exclude = "padre")

@Node("Tematica")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tematica {

    @Id
    @GeneratedValue
    private Long id;

    private String nombre;

    @JsonIgnore
    @Relationship(type = "ES_SUBTIPO_DE", direction = Relationship.Direction.OUTGOING)
    private Tematica padre;
}