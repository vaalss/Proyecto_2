package recomendador_libros.proyecto.controllers;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import recomendador_libros.proyecto.nodes.Usuario;
import recomendador_libros.proyecto.services.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        return usuarioService.loginPorEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
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

    @PostMapping("/{usuarioId}/leidos/{libroId}")
    public Usuario agregarLeido(@PathVariable Long usuarioId, @PathVariable Long libroId) {
        return usuarioService.agregarLibroLeido(usuarioId, libroId);
    }

    @PostMapping("/{usuarioId}/autores/{autorId}")
    public Usuario seguirAutor(@PathVariable Long usuarioId, @PathVariable Long autorId) {

        return usuarioService.seguirAutor(usuarioId, autorId);
    }

    @DeleteMapping("/{usuarioId}/favoritos/{libroId}")
    public Usuario eliminarFavorito(@PathVariable Long usuarioId, @PathVariable Long libroId) {
        return usuarioService.eliminarLibroFavorito(usuarioId, libroId);
    }

    @DeleteMapping("/{usuarioId}/leidos/{libroId}")
    public Usuario eliminarLeido(@PathVariable Long usuarioId, @PathVariable Long libroId) {

        return usuarioService.eliminarLibroLeido(usuarioId, libroId);
    }

    @DeleteMapping("/{usuarioId}/autores/{autorId}")
    public Usuario dejarDeSeguirAutor(@PathVariable Long usuarioId, @PathVariable Long autorId) {

        return usuarioService.dejarDeSeguirAutor(usuarioId, autorId);
    }
}