package recomendador_libros.proyecto.controllers;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import recomendador_libros.proyecto.nodes.Usuario;
import recomendador_libros.proyecto.repositories.UsuarioRepository;
import recomendador_libros.proyecto.services.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioService usuarioService, UsuarioRepository usuarioRepository) {
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        return usuarioService.loginPorEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }

    @PostMapping("/registro")
    public ResponseEntity<Usuario> registro(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String nombre = body.get("nombre");

        if (usuarioRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(400).build();
        }

        Usuario nuevo = new Usuario();
        nuevo.setNombre(nombre);
        nuevo.setEmail(email);
        Usuario guardado = usuarioRepository.save(nuevo);
        return ResponseEntity.ok(guardado);
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
    public ResponseEntity<String> agregarFavorito(@PathVariable Long usuarioId, @PathVariable Long libroId) {
        usuarioRepository.hacerFavorito(usuarioId, libroId);
        return ResponseEntity.ok("Favorito guardado");
    }

    @DeleteMapping("/{usuarioId}/favoritos/{libroId}")
    public ResponseEntity<String> eliminarFavorito(@PathVariable Long usuarioId, @PathVariable Long libroId) {
        usuarioRepository.quitarFavorito(usuarioId, libroId);
        return ResponseEntity.ok("Favorito eliminado");
    }

    @PostMapping("/{usuarioId}/leidos/{libroId}")
    public ResponseEntity<String> agregarLeido(@PathVariable Long usuarioId, @PathVariable Long libroId) {
        usuarioRepository.hacerLeido(usuarioId, libroId);
        return ResponseEntity.ok("Leído guardado");
    }

    @DeleteMapping("/{usuarioId}/leidos/{libroId}")
    public ResponseEntity<String> eliminarLeido(@PathVariable Long usuarioId, @PathVariable Long libroId) {
        usuarioRepository.quitarLeido(usuarioId, libroId);
        return ResponseEntity.ok("Leído eliminado");
    }

    @PostMapping("/{usuarioId}/autores/{autorId}")
    public Usuario seguirAutor(@PathVariable Long usuarioId, @PathVariable Long autorId) {

        return usuarioService.seguirAutor(usuarioId, autorId);
    }

    @DeleteMapping("/{usuarioId}/autores/{autorId}")
    public Usuario dejarDeSeguirAutor(@PathVariable Long usuarioId, @PathVariable Long autorId) {

        return usuarioService.dejarDeSeguirAutor(usuarioId, autorId);
    }

    @GetMapping("/{usuarioId}/estado/{libroId}")
    public ResponseEntity<Map<String, Object>> obtenerEstadoInteraccion(@PathVariable Long usuarioId,
            @PathVariable Long libroId) {
        // Consultamos a Neo4j usando booleanos puros
        boolean esFavorito = usuarioRepository.isFavorito(usuarioId, libroId);
        boolean esLeido = usuarioRepository.isLeido(usuarioId, libroId);

        // Armamos el objeto en Java para que Spring no se confunda
        return ResponseEntity.ok(Map.of(
                "esFavorito", esFavorito,
                "esLeido", esLeido));
    }

}