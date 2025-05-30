// Configuración global de Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis'
  }
})

// Integración con tu función existente
async function buscar() {
  const searchTerm = document.getElementById('search-input').value.trim();
  const response = await fetch(`https://miguel45.github.io/blog-recetas-guadalajara/pages/list.json`)
  if (!response.ok) throw new Error('Página no encontrada')
  const data = await response.json()
  const filteredItems = data.filter(e => e.name.trim().indexOf(searchTerm) !== -1)
  console.log(filteredItems)
}

// Opcional: Búsqueda al presionar Enter
document.getElementById('search-input').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    buscar();
  }
});


async function loadPage(pageName) {
  try {
    const response = await fetch(`https://miguel45.github.io/blog-recetas-guadalajara/pages/${pageName}.md`)
    if (!response.ok) throw new Error('Página no encontrada')

    const markdown = await response.text()
    await renderMarkdown(markdown)

    // Actualizar navbar
    document.querySelectorAll('.navbar-nav a').forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('data-page') === pageName
      )
    })
  } catch (error) {
    console.error('Error loading page:', error)
    window.location.href = '/404.html'
  }
}

async function renderMarkdown(markdown) {
  const contentDiv = document.getElementById('content')

  // Primero renderizamos el Markdown
  contentDiv.innerHTML = marked.parse(markdown, {
    breaks: true,
    gfm: true
  })

  // Luego procesamos los diagramas Mermaid
  await processMermaidDiagrams()

  // Configurar imágenes y videos
  contentDiv.querySelectorAll('img').forEach(img => {
    img.style.maxWidth = '100%'
    img.style.height = 'auto'
  })

  contentDiv.querySelectorAll('video').forEach(video => {
    video.style.maxWidth = '100%'
    video.controls = true
  })
}

function processMermaidDiagrams() {
  return new Promise(resolve => {
    // Seleccionar todos los bloques de código con clase mermaid
    const mermaidElements = document.querySelectorAll(
      'pre code.language-mermaid'
    )

    if (mermaidElements.length === 0) {
      resolve()
      return
    }

    // Transformar cada bloque
    mermaidElements.forEach(async element => {
      const container = document.createElement('div')
      container.className = 'mermaid'
      container.textContent = element.textContent
      element.parentElement.replaceWith(container)
    })

    // Pequeño delay para asegurar que el DOM está listo
    setTimeout(() => {
      try {
        mermaid.init(undefined, '.mermaid')
      } catch (e) {
        console.error('Error rendering Mermaid:', e)
      }
      resolve()
    }, 100)
  })
}