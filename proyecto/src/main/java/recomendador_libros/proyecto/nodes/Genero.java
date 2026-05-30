package recomendador_libros.proyecto.nodes;

import java.util.Set;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import lombok.EqualsAndHashCode;
import lombok.ToString;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Node("Genero")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = "generosRelacionados")
@ToString(exclude = "generosRelacionados")

public class Genero {

    @Id
    @GeneratedValue
    private Long id;

    private String nombre;

    @JsonIgnore
    @Relationship(type = "RELACIONADO_CON", direction = Relationship.Direction.OUTGOING)
    private Set<Genero> generosRelacionados;
}