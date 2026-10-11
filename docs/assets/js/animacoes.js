const elementos = document.querySelectorAll(".revelar");

const revelar = (elemento) => elemento.classList.add("visivel");

if ("IntersectionObserver" in window) {
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        revelar(entrada.target);
        observador.unobserve(entrada.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  elementos.forEach((elemento) => observador.observe(elemento));
} else {
  elementos.forEach(revelar);
}
