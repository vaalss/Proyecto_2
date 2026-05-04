package recomendador_libros.proyecto.nodes;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Node("Estilo")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Estilo {

    @Id
    @GeneratedValue
    private Long id;

    private String nombre;
}