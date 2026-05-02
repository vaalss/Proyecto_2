package recomendador_libros.proyecto;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.neo4j.core.Neo4jClient;

@SpringBootApplication
public class ProyectoApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProyectoApplication.class, args);
	}

	// Este bloque corre código justo después de que Spring arranca
	@Bean
	CommandLineRunner demo(Neo4jClient client) {
		return args -> {
			// 1. Ejecutamos la consulta
			// 2. .fetch().one() nos devuelve un Optional<Map<String, Object>>
			var result = client.query("RETURN 'Conexión Exitosa' as msg").fetch().one();

			// 3. Verificamos si hay datos y extraemos el valor
			if (result.isPresent()) {
				// Sacamos el Map con .get() y luego buscamos la llave "msg"
				String mensaje = (String) result.get().get("msg");
				System.out.println(">>> RESULTADO DE NEO4J: " + mensaje);
			} else {
				System.out.println(">>> ERROR: No se recibió respuesta de Neo4j.");
			}
		};
	}
}
