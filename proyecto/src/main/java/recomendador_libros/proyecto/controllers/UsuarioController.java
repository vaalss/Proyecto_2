package recomendador_libros.proyecto.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.*;

import recomendador_libros.proyecto.nodes.Usuario;
import recomendador_libros.proyecto.services.UsuarioService;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public Usuario guardarUsuario(@RequestBody Usuario usuario) {
        return usuarioService.guardarUsuario(usuario);
    }

    @GetMapping
    public List<Usuario> obtenerTodos() {
        return usuarioService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public Optional<Usuario> obtenerPorId(@PathVariable Long id) {
        return usuarioService.obtenerPorId(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
    }

    @PostMapping("/{usuarioId}/favoritos/{libroId}")
    public Usuario agregarFavorito(@PathVariable Long usuarioId, @PathVariable Long libroId) {
        return usuarioService.agregarLibroFavorito(usuarioId, libroId);
    }
}