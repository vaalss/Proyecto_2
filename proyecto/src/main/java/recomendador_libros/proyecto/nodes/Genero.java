package recomendador_libros.proyecto.nodes;

import java.util.Set;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Node("Genero")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Genero {

    @Id
    @GeneratedValue
    private Long id;

    private String nombre;

    @Relationship(type = "RELACIONADO_CON", direction = Relationship.Direction.OUTGOING)
    private Set<Genero> generosRelacionados;
}