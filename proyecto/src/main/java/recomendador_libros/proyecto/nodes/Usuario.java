package recomendador_libros.proyecto.nodes;

import java.util.Set;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Node("Usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue
    private Long id;

    private String nombre;

    private String email; // Se usa el email para identificar al usuario sin tener que usar el ID interno.

    // Relaciones que pueda tener un usuario. Esta será la base del filtrado.
    @Relationship(type = "LE_GUSTA", direction = Relationship.Direction.OUTGOING)
    private Set<Libro> librosFavoritos;

    @Relationship(type = "HA_LEIDO", direction = Relationship.Direction.OUTGOING)
    private Set<Libro> librosLeidos;

    @Relationship(type = "SIGUE_A", direction = Relationship.Direction.OUTGOING)
    private Set<Autor> autoresSeguidos;
}
