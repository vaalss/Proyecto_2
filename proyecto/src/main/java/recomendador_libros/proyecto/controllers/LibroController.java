package recomendador_libros.proyecto.controllers;

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
}