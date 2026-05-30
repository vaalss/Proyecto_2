package recomendador_libros.proyecto.nodes;

import java.util.Set;

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

@Node("Autor")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = "autores")
@ToString(exclude = "autores")

public class Autor {

    @Id
    @GeneratedValue
    private Long id;

    private String nombre;

    // Relaciones que pueda tener un autor.
    @JsonIgnore
    @Relationship(type = "INFLUENCIADO_POR", direction = Relationship.Direction.OUTGOING)
    private Set<Autor> autores;
}
