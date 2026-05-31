package recomendador_libros.proyecto.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import recomendador_libros.proyecto.nodes.Libro;
import recomendador_libros.proyecto.repositories.LibroRepository;
import recomendador_libros.proyecto.services.RecomendacionService;

@RestController
@RequestMapping("/api/recomendaciones")
@CrossOrigin(origins = "*")
public class RecomendacionController {

    @Autowired
    private RecomendacionService recomendacionService;

    @Autowired
    private LibroRepository libroRepository;

    @GetMapping("/usuario/{email}")
    public List<Libro> obtenerRecomendacionesUsuario(@PathVariable String email) {
        return recomendacionService.obtenerRecomendacionesParaUsuario(email);
    }

    @GetMapping("/libro/{titulo}")
    public List<Libro> obtenerSugerenciasPorLibro(@PathVariable String titulo) {
        return recomendacionService.generarSugerencias(titulo);
    }

    @GetMapping("/match/{usuarioId}/{libroId}")
    public ResponseEntity<Integer> obtenerPorcentajeMatch(
            @PathVariable Long usuarioId,
            @PathVariable Long libroId) {

        try {
            Integer matchPercentage = libroRepository.calcularPorcentajeMatch(usuarioId, libroId);

            // Si es 100%, lo bajamos un poco para que no parezca falso
            if (matchPercentage != null && matchPercentage > 99) {
                matchPercentage = 98;
            }

            // Si da null, devolvemos un 50% por defecto
            return ResponseEntity.ok(matchPercentage != null ? matchPercentage : 50);
        } catch (Exception e) {
            System.err.println("Error al calcular el match: " + e.getMessage());
            return ResponseEntity.internalServerError().body(0);
        }
    }
}