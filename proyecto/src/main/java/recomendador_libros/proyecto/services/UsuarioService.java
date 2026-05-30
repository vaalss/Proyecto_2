package recomendador_libros.proyecto.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import recomendador_libros.proyecto.nodes.Usuario;
import recomendador_libros.proyecto.repositories.UsuarioRepository;
import recomendador_libros.proyecto.nodes.Autor;
import recomendador_libros.proyecto.nodes.Libro;
import recomendador_libros.proyecto.repositories.LibroRepository;
import recomendador_libros.proyecto.repositories.AutorRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepo;
    private final LibroRepository libroRepo;
    private final AutorRepository autorRepo;

    public UsuarioService(UsuarioRepository usuarioRepo, LibroRepository libroRepo, AutorRepository autorRepo) {
        this.usuarioRepo = usuarioRepo;
        this.libroRepo = libroRepo;
        this.autorRepo = autorRepo;
    }

    public Optional<Usuario> loginPorEmail(String email) {
        return usuarioRepo.findByEmail(email);
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

    public Usuario agregarLibroLeido(Long usuarioId, Long libroId) {

        Usuario usuario = usuarioRepo.findById(usuarioId) .orElseThrow(() -> 
        new RuntimeException("Usuario no encontrado"));

        Libro libro = libroRepo.findById(libroId).orElseThrow(() -> 
        new RuntimeException("Libro no encontrado"));

        usuario.getLibrosLeidos().add(libro);

        return usuarioRepo.save(usuario);
    }

    public Usuario seguirAutor(Long usuarioId, Long autorId) {
        Usuario usuario = usuarioRepo.findById(usuarioId).orElseThrow(() ->
        new RuntimeException("Usuario no encontrado"));
        Autor autor = autorRepo.findById(autorId).orElseThrow(() ->
        new RuntimeException("Autor no encontrado"));

        usuario.getAutoresSeguidos().add(autor);

        return usuarioRepo.save(usuario);
    }

    public Usuario eliminarLibroFavorito(Long usuarioId, Long libroId) {

        Usuario usuario = usuarioRepo.findById(usuarioId).orElseThrow(() ->
        new RuntimeException("Usuario no encontrado"));
        Libro libro = libroRepo.findById(libroId).orElseThrow(() ->
        new RuntimeException("Libro no encontrado"));

        usuario.getLibrosFavoritos().remove(libro);

        return usuarioRepo.save(usuario);
    }

    public Usuario eliminarLibroLeido(Long usuarioId, Long libroId) {

        Usuario usuario = usuarioRepo.findById(usuarioId).orElseThrow(() ->
        new RuntimeException("Usuario no encontrado"));

        Libro libro = libroRepo.findById(libroId).orElseThrow(() ->
        new RuntimeException("Libro no encontrado"));

        usuario.getLibrosLeidos().remove(libro);
        return usuarioRepo.save(usuario);
    }

    public Usuario dejarDeSeguirAutor(Long usuarioId, Long autorId) {

        Usuario usuario = usuarioRepo.findById(usuarioId).orElseThrow(() ->
        new RuntimeException("Usuario no encontrado"));

        Autor autor = autorRepo.findById(autorId).orElseThrow(() ->
        new RuntimeException("Autor no encontrado"));

        usuario.getAutoresSeguidos().remove(autor);
        return usuarioRepo.save(usuario);
    }
}