package recomendador_libros.proyecto.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
import recomendador_libros.proyecto.nodes.Usuario;
import recomendador_libros.proyecto.repositories.LibroRepository;
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

    @Autowired
    private LibroRepository libroRepository;

    @GetMapping("/{usuarioId}/perfil")
    public ResponseEntity<Map<String, Object>> obtenerPerfilUsuario(@PathVariable Long usuarioId) {
        try {
            List<Libro> favoritos = libroRepository.findFavoritosByUsuarioId(usuarioId);
            List<Libro> leidos = libroRepository.findLeidosByUsuarioId(usuarioId);

            Map<String, Object> perfil = new HashMap<>();
            perfil.put("favoritos", favoritos);
            perfil.put("leidos", leidos);
            perfil.put("totalFavoritos", favoritos.size());
            perfil.put("totalLeidos", leidos.size());

            // Fórmula simple de afinidad
            int afinidad = Math.min(100, 50 + (favoritos.size() * 5) + (leidos.size() * 2));
            perfil.put("afinidadPromedio", afinidad);

            return ResponseEntity.ok(perfil);
        } catch (Exception e) {
            System.err.println("Error al cargar perfil: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{usuarioId}/preferencias/{genero}")
    public ResponseEntity<String> agregarPreferencia(@PathVariable Long usuarioId, @PathVariable String genero) {
        usuarioRepository.agregarPreferencia(usuarioId, genero);
        return ResponseEntity.ok("Preferencia guardada");
    }

    @DeleteMapping("/{usuarioId}/preferencias/{genero}")
    public ResponseEntity<String> eliminarPreferencia(@PathVariable Long usuarioId, @PathVariable String genero) {
        usuarioRepository.eliminarPreferencia(usuarioId, genero);
        return ResponseEntity.ok("Preferencia eliminada");
    }

    @GetMapping("/{usuarioId}/preferencias")
    public ResponseEntity<List<String>> obtenerPreferencias(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(usuarioRepository.obtenerPreferencias(usuarioId));
    }

}