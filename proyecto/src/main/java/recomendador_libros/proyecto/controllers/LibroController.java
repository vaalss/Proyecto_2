package recomendador_libros.proyecto.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.*;

import recomendador_libros.proyecto.nodes.Libro;
import recomendador_libros.proyecto.services.LibroService;

@RestController
@RequestMapping("/libros")
public class LibroController {

    private final LibroService libroService;

    public LibroController(LibroService libroService) {
        this.libroService = libroService;
    }

    @PostMapping
    public Libro guardarLibro(@RequestBody Libro libro) {

        return libroService.guardarLibro(libro);
    }

    @GetMapping
    public List<Libro> obtenerTodos() {
        return libroService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public Optional<Libro> obtenerPorId(@PathVariable Long id) {
        return libroService.obtenerPorId(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        libroService.eliminar(id);
    }
}