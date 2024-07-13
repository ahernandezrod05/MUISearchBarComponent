import { useState, useEffect } from "react";
import { TextField, Box, Button, Autocomplete, Stack } from "@mui/material";

export default function SearchBox() {
  //Todos los post de la llamada
  const [posts, setPosts] = useState([]);
  //Post filtrados por el texto.
  const [filteredPosts, setFilteredPosts] = useState([]);
  //Estado para mostrar las opciones o no
  const [isOpen, setIsOpen] = useState(false);

  //Fetch inicial de los datos.
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  //Función para ordenar un texto del botón
  const sortPosts = (posts, sortIndex) => {
    return [...posts].sort((a, b) =>
      a[sortIndex] > b[sortIndex] ? 1 : b[sortIndex] > a[sortIndex] ? -1 : 0
    );
  };

  //Función debounce para que solo se haga la llamada cuando el usuario acabe de escribir en la búsqueda
  const debounce = (callback, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  };

  //Función que llama al debounce
  const debouncedSearch = debounce((query) => {
    if (query.length < 3) {
      setFilteredPosts([]);
    } else {
      const filtered = posts.filter((post) =>
        post.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPosts(filtered.slice(0, 10));
    }
  }, 750);

  return (
    <Box
      sx={{
        width: "50%",
        margin: "auto",
        "& > *": {
          marginBottom: 3,
        },
      }}
    >
      <Stack direction={"row"} spacing={2}>
        <Button
          variant="contained"
          onClick={() => {
            setFilteredPosts(sortPosts(filteredPosts, "userId"));
          }}
        >
          Ordenar por ID del usuario
        </Button>

        <Button
          variant="outlined"
          onClick={() => {
            setFilteredPosts(sortPosts(filteredPosts, "title"));
          }}
        >
          Ordenar por título
        </Button>
      </Stack>

      <Autocomplete
        open={isOpen}
        options={filteredPosts || []}
        clearOnBlur={false}
        noOptionsText={"No hay coincidencias"}
        getOptionLabel={(option) => option.title}
        renderInput={(params) => <TextField {...params} label="Buscar posts" />}
        onInputChange={(e, value) => {
          if (value.length < 3) {
            setIsOpen(false);
          } else {
            setIsOpen(true);
            debouncedSearch(value);
          }
        }}
        onChange={(e, option) => {
          if (option) {
            console.log(option);
            setIsOpen(false);
          }
        }}
      />
    </Box>
  );
}
