package recomendador_libros.proyecto.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import recomendador_libros.proyecto.nodes.Libro;
import recomendador_libros.proyecto.services.RecomendacionService;
import java.util.List;


@RestController
@RequestMapping("/api/recomendaciones")
@CrossOrigin(origins = "*")
public class RecomendacionController {
    @Autowired
    private RecomendacionService recomendacionService;

    @GetMapping("/usuario/{userId}")
    public List<Libro> obtenerRecomendacionesUsuario(@PathVariable Long userId) {
        return recomendacionService.obtenerRecomendacionesParaUsuario(userId);
    }

    @GetMapping("/libro/{titulo}")
    public List<Libro> obtenerSugerenciasPorLibro(@PathVariable String titulo) {
        return recomendacionService.generarSugerencias(titulo);
    }
}
