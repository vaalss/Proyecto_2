package recomendador_libros.proyecto.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import recomendador_libros.proyecto.nodes.Usuario;
import recomendador_libros.proyecto.repositories.UsuarioRepository;
import recomendador_libros.proyecto.nodes.Libro;
import recomendador_libros.proyecto.repositories.LibroRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepo;
    private final LibroRepository libroRepo;

    public UsuarioService(UsuarioRepository usuarioRepo, LibroRepository libroRepo) {
        this.usuarioRepo = usuarioRepo;
        this.libroRepo = libroRepo;
    }

    public Usuario guardarUsuario(Usuario usuario) {
        Optional<Usuario> existente = usuarioRepo.findByEmail(usuario.getEmail());
        if (existente.isPresent()) {
            return existente.get();
        }
        return usuarioRepo.save(usuario);
    }

    public List<Usuario> obtenerTodos() {
        return usuarioRepo.findAll();
    }

    public Optional<Usuario> obtenerPorId(Long id) {
        return usuarioRepo.findById(id);
    }

    public void eliminar(Long id) {
        usuarioRepo.deleteById(id);
    }

    public Usuario agregarLibroFavorito(Long usuarioId, Long libroId) {

        Usuario usuario = usuarioRepo.findById(usuarioId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Libro libro = libroRepo.findById(libroId).orElseThrow(() -> new RuntimeException("Libro no encontrado"));

        usuario.getLibrosFavoritos().add(libro);
        return usuarioRepo.save(usuario);
    }
}