package recomendador_libros.proyecto;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ProyectoApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProyectoApplication.class, args);
	}

	// Código utilizado para verificar la conexión con la base de datos
	/*
	 * @Bean
	 * CommandLineRunner demo(Neo4jClient client) {
	 * return args -> {
	 * var result = client.query("RETURN 'Conexión Exitosa' as msg").fetch().one();
	 * 
	 * // 3. Verificamos si hay datos y extraemos el valor
	 * if (result.isPresent()) {
	 * // Sacamos el Map con .get() y luego buscamos la llave "msg"
	 * String mensaje = (String) result.get().get("msg");
	 * System.out.println(">>> RESULTADO DE NEO4J: " + mensaje);
	 * } else {
	 * System.out.println(">>> ERROR: No se recibió respuesta de Neo4j.");
	 * }
	 * };
	 * }
	 */
}
