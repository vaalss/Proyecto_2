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

    public List <Libro> generarSugerencias(String tituloLibro) {
        return libroRepository.findSimilarByAttributes(tituloLibro);
    }

    public List<Libro> obtenerRecomendacionesParaUsuario(String email) {
        List<String> titulos = libroRepository.recomendarTitulos(email);
        List<Libro> libros = new ArrayList<>();

        for (String titulo : titulos) {
            List<Libro> encontrados = libroRepository.findByTitulo(titulo);

            if (!encontrados.isEmpty()) {
                libros.add(encontrados.get(0));
            }
        }

        return libros;
    }
}
    

