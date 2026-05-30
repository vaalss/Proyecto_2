package recomendador_libros.proyecto.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import recomendador_libros.proyecto.repositories.LibroRepository;
import recomendador_libros.proyecto.repositories.UsuarioRepository;

import recomendador_libros.proyecto.nodes.Libro;
import recomendador_libros.proyecto.nodes.Usuario;
import java.util.Optional;
import java.util.Set;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;

@Service
public class RecomendacionService {

    @Autowired
    private LibroRepository libroRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

   public Set<Libro> obtenerPreferenciasUsuario(String email) {
        Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
        return usuario.map(Usuario::getLibrosFavoritos).orElse(Set.of());
    }

    public List<Libro> generarSugerencias(String tituloLibro) {
        List<String> titulos = libroRepository.findSimilarTitles(tituloLibro);
        List<Libro> libros = new ArrayList<>();

        for (String titulo : titulos) {
            List<Libro> encontrados = libroRepository.findByTitulo(titulo);
            if (!encontrados.isEmpty()) {
                libros.add(encontrados.get(0));
            }
        }

        return libros;
    }

    public List<Libro> obtenerRecomendacionesParaUsuario(String email) {
        List<String> directas = libroRepository.recomendarTitulos(email);
        List<String> influencias = libroRepository.recomendarPorInfluencia(email);

        LinkedHashSet<String> titulos = new LinkedHashSet<>();

        titulos.addAll(directas);
        titulos.addAll(influencias);

        List<Libro> libros = new ArrayList<>();

        for (String titulo : titulos) {
            List<Libro> encontrados = libroRepository.findByTitulo(titulo);

            if (!encontrados.isEmpty()) {
                libros.add(encontrados.get(0));
            }
        }

        return libros.stream().limit(10).toList();
    }
}
    

