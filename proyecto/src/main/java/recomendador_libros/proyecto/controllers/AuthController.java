package recomendador_libros.proyecto.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import recomendador_libros.proyecto.nodes.Usuario;
import recomendador_libros.proyecto.repositories.UsuarioRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UsuarioRepository usuarioRepository;

    public AuthController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    record LoginRequest(String email, String nombre) {}

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody LoginRequest request) {
        return usuarioRepository.findByEmail(request.email())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
