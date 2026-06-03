package recomendador_libros.proyecto.controllers;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    // ─── Endpoint para el Hero Section (Hidrata los libros completos) ───
    // ─── Endpoint para el Hero Section (Hidrata los libros completos) ───
    @GetMapping("/hero/{userId}")
    public ResponseEntity<List<Map<String, Object>>> obtenerRecomendacionesHero(@PathVariable Long userId) {
        try {
            // 1. Obtenemos el ranking desde Neo4j como Strings "ID_SCORE" para burlar el
            // mapeo estricto
            List<String> rankingStr = libroRepository.obtenerIdsRecomendadosStr(userId);
            List<Map<String, Object>> resultado = new ArrayList<>();

            // 2. Separamos el ID y el Score, y buscamos el libro COMPLETO
            for (String record : rankingStr) {
                String[] parts = record.split("_");
                Long libroId = Long.parseLong(parts[0]);
                Integer score = Integer.parseInt(parts[1]);

                libroRepository.findById(libroId).ifPresent(libro -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("b", libro);
                    item.put("score", score);
                    resultado.add(item);
                });
            }
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            System.err.println("Error al obtener recomendaciones hero: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // ─── Endpoint para generar los Carruseles Dinámicos estilo Netflix ───
    @GetMapping("/netflix/{email}")
    public ResponseEntity<List<Map<String, Object>>> obtenerCarruselesNetflix(@PathVariable String email) {
        try {
            List<Map<String, Object>> carruseles = new ArrayList<>();

            List<Libro> recomendados = recomendacionService.obtenerRecomendacionesParaUsuario(email);
            if (recomendados != null && !recomendados.isEmpty()) {
                Map<String, Object> fila1 = new HashMap<>();
                fila1.put("titulo", "Sugerencias del recomendador");
                fila1.put("libros", recomendados);
                carruseles.add(fila1);
            }

            List<Libro> favoritos = libroRepository.findFavoritosByEmail(email);
            if (favoritos != null && !favoritos.isEmpty()) {

                Collections.shuffle(favoritos);

                int maxFilas = Math.min(favoritos.size(), 3);
                for (int i = 0; i < maxFilas; i++) {
                    Libro fav = favoritos.get(i);
                    List<Libro> similares = recomendacionService.generarSugerencias(fav.getTitulo());

                    if (similares != null && !similares.isEmpty()) {
                        Map<String, Object> fila = new HashMap<>();
                        fila.put("titulo", "Porque te gustó \"" + fav.getTitulo() + "\"");
                        fila.put("libros", similares);
                        carruseles.add(fila);
                    }
                }
            }

            return ResponseEntity.ok(carruseles);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

}