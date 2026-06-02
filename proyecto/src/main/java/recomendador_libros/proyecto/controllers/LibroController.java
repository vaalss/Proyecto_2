package recomendador_libros.proyecto.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import recomendador_libros.proyecto.nodes.Libro;
import recomendador_libros.proyecto.repositories.LibroRepository;

@RestController
@RequestMapping("/api/libros")
@CrossOrigin(origins = "*")
public class LibroController {

    @Autowired
    private LibroRepository libroRepository;

    @GetMapping
    public List<Libro> getAllLibros() {
        return libroRepository.findAll();
    }

    // ─── Agregar nuevo libro (Lo que quitamos del repository) ───
    @PostMapping
    public ResponseEntity<Libro> crearLibro(@RequestBody Libro nuevoLibro) {
        try {
            Libro libroGuardado = libroRepository.save(nuevoLibro);
            return ResponseEntity.ok(libroGuardado);
        } catch (Exception e) {
            System.err.println("Error al guardar el libro: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // ─── Eliminar un libro (Lo que quitamos del repository) ───
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarLibro(@PathVariable Long id) {
        try {
            libroRepository.deleteById(id);
            return ResponseEntity.ok("Libro eliminado correctamente");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al eliminar");
        }
    }
}