/* =====================================================================
   CONTENT.JS — O ÚNICO ARQUIVO QUE VOCÊ PRECISA EDITAR NO DIA A DIA
   Versão final (v3)
   ---------------------------------------------------------------------
   Regras simples para não quebrar nada:
   1. Edite somente o texto que está ENTRE aspas: "assim".
   2. Não apague vírgulas, chaves { } ou colchetes [ ].
   3. Onde aparecer [A CONFIRMAR], troque pela informação real.
   4. Cada texto tem uma versão "en" (inglês) e "pt" (português).
   5. *Palavras entre asteriscos* aparecem em itálico com destaque rosa.
   ===================================================================== */

window.SITE = {

  /* ---------------------------------------------------------------
     CONFIGURAÇÕES
     showPlaceholders: true  → mostra os campos [A CONFIRMAR]
                                (bom enquanto você monta o site).
     showPlaceholders: false → esconde contatos vazios e a dica de
                                vídeo (use quando for divulgar o site).
     --------------------------------------------------------------- */
  settings: {
    defaultLanguage: "en",
    showPlaceholders: true
  },

  /* ---------------------------------------------------------------
     CONTATOS
     Cole o endereço completo entre as aspas. Deixe "" se não usar.
     Exemplos de formato (não são seus dados):
       email:     "nome@exemplo.com"
       instagram: "https://www.instagram.com/seuusuario"
       tiktok:    "https://www.tiktok.com/@seuusuario"
     Contato vazio NÃO vira botão: ele aparece como [A CONFIRMAR]
     (ou some, se showPlaceholders for false).
     --------------------------------------------------------------- */
  contact: {
    email: "thatisantosjob1@gmail.com",
    instagram: "https://www.instagram.com/thatimoura.ugc/",
    tiktok: "https://www.tiktok.com/@euthatimoura",
    linkedin: "",
    other: { label: "", url: "" }
  },

  /* ---------------------------------------------------------------
     FOTO DA HOME (primeira tela, coluna direita)
     Nome do arquivo da foto, enviado junto com o site.
     Para trocar de foto: envie a nova imagem ao GitHub e escreva
     o nome dela aqui (sem acentos nem espaços), ex.: "foto-nova.jpg".
     --------------------------------------------------------------- */
  heroPhoto: "foto-thatiane.jpg",

  /* ---------------------------------------------------------------
     PROJETOS
     Para ADICIONAR um projeto: copie um bloco inteiro { ... },
     cole depois do último, coloque uma vírgula entre eles e edite.

     video: aceita 3 tipos de link
       - YouTube (inclusive Shorts e vídeos "não listados")
       - Vimeo
       - Arquivo de vídeo enviado junto com o site, ex.: "videos/miqla.mp4"
     post:   (opcional) link para assistir no TikTok/Instagram/YouTube.
             Aparece como o botão "View post" embaixo do card.
     poster: (opcional) imagem de capa para arquivos .mp4.
     --------------------------------------------------------------- */
  projects: [
    {
      name: "Miqla",
      category: { en: "Tech & AI", pt: "Tecnologia e IA" },
      description: {
        en: "Short-form UGC video featuring Miqla.",
        pt: "Vídeo UGC curto com o Miqla."
      },
      video: "miqla.mp4",
      post: "",
      poster: "miqla-capa.jpg"
    },
    {
      name: "Picsart",
      category: { en: "AI Creative App", pt: "App criativo com IA" },
      description: {
        en: "Short-form UGC video featuring Picsart.",
        pt: "Vídeo UGC curto com o Picsart."
      },
      video: "picsart.mp4",
      post: "",
      poster: "picsart-capa.jpg"
    },
    {
      name: "MPL",
      category: { en: "Mobile Gaming App", pt: "App de jogos mobile" },
      description: {
        en: "Short-form UGC video featuring MPL.",
        pt: "Vídeo UGC curto com o MPL."
      },
      video: "mpl.mp4",
      post: "",
      poster: "mpl-capa.jpg"
    },
    {
      name: "Airlearn",
      category: { en: "Language Learning App", pt: "App de idiomas" },
      description: {
        en: "Short-form UGC video featuring Airlearn.",
        pt: "Vídeo UGC curto com o Airlearn."
      },
      video: "airlearn.mp4",
      post: "",
      poster: "airlearn-capa.jpg"
    }
  ],

  /* ---------------------------------------------------------------
     SERVIÇOS
     icon: video, app, ai, tutorial, idea ou review (ícone do card).
     tags: palavras curtas que aparecem embaixo de cada serviço.
     --------------------------------------------------------------- */
  services: [
    {
      icon: "video",
      title: { en: "UGC Video Creation", pt: "Criação de vídeos UGC" },
      text: {
        en: "Authentic vertical videos that present your product from a real user's point of view.",
        pt: "Vídeos verticais autênticos que apresentam seu produto do ponto de vista de quem usa."
      },
      tags: { en: ["Vertical 9:16", "Organic style"], pt: ["Vertical 9:16", "Estilo orgânico"] }
    },
    {
      icon: "app",
      title: { en: "App Demonstrations", pt: "Demonstrações de apps" },
      text: {
        en: "Clear walkthroughs of key features, combining screen recordings with on-camera content.",
        pt: "Apresentações claras das principais funções, unindo gravação de tela e vídeo em câmera."
      },
      tags: { en: ["Screen recording", "Feature focus"], pt: ["Gravação de tela", "Foco em funções"] }
    },
    {
      icon: "ai",
      title: { en: "AI Tool Demonstrations", pt: "Demonstrações de ferramentas de IA" },
      text: {
        en: "Showing what an AI tool does in practice, from the first prompt to the final result.",
        pt: "Mostrar o que uma ferramenta de IA faz na prática, do primeiro comando ao resultado final."
      },
      tags: { en: ["Prompt to result", "Use cases"], pt: ["Do comando ao resultado", "Casos de uso"] }
    },
    {
      icon: "tutorial",
      title: { en: "Product Tutorials", pt: "Tutoriais de produto" },
      text: {
        en: "Step-by-step content that helps new users get started with confidence.",
        pt: "Conteúdo passo a passo que ajuda novos usuários a começar com segurança."
      },
      tags: { en: ["Onboarding", "Step by step"], pt: ["Primeiros passos", "Passo a passo"] }
    },
    {
      icon: "idea",
      title: { en: "Creative Concepts for Short-Form Video", pt: "Conceitos criativos para vídeos curtos" },
      text: {
        en: "Hooks, angles and scripts built around your product and the people it is made for.",
        pt: "Ganchos, abordagens e roteiros pensados para o seu produto e para o seu público."
      },
      tags: { en: ["Hooks", "Scripts"], pt: ["Ganchos", "Roteiros"] }
    },
    {
      icon: "review",
      title: { en: "Product Reviews & Lifestyle Content", pt: "Avaliações de produto e conteúdo lifestyle" },
      text: {
        en: "Your product inside everyday routines, presented in a natural and honest way.",
        pt: "Seu produto dentro da rotina, apresentado de forma natural e honesta."
      },
      tags: { en: ["Daily routine", "Reviews"], pt: ["Rotina", "Avaliações"] }
    }
  ],

  /* ---------------------------------------------------------------
     TEXTOS DO SITE (inglês e português)
     --------------------------------------------------------------- */
  text: {
    en: {
      "nav.work": "Work",
      "nav.about": "About",
      "nav.services": "Services",
      "nav.contact": "Contact",
      "nav.menu": "Menu",
      "nav.close": "Close",

      "hero.eyebrow": "Tech · AI · Apps",
      "hero.tagline": "UGC Creator | Tech, AI & Digital Experiences",
      "hero.intro": "I create short-form videos that show how apps, AI tools and digital products fit into everyday life. Clear, natural and made for mobile.",
      "hero.ctaWork": "View my work",
      "hero.ctaContact": "Get in touch",
      "hero.chipLeft": "AI · Apps · Tech",
      "hero.videoLabel": "Intro video",
      "hero.videoSoon": "Coming soon",
      "hero.videoHint": "Add the link in content.js → introVideo",
      "hero.videoTag": "Intro",

      "ticker": ["AI Tools", "Mobile Apps", "Productivity", "Digital Lifestyle", "Software", "Tech Innovation"],

      "about.label": "About",
      "about.title": "Curious about technology. *Focused on the people who use it.*",
      "about.p1": "I'm Thatiane Moura, a Brazilian creator who moved into tech and UGC after a background in the beauty world. I lived outside Brazil for three years, and connecting with people has always come naturally to me.",
      "about.p2": "Today I bring together my two passions, communication and technology. I take a digital product and show it the way a real person would discover it: simple, honest and easy to follow.",
      "about.focusLabel": "Focus",
      "about.focus": "AI tools · Apps · Tech",
      "about.formatLabel": "Format",
      "about.format": "Vertical short-form video",
      "about.langLabel": "Languages",
      "about.lang": "Portuguese (native) · English · Arabic (basic)",
      "about.baseLabel": "Based in",
      "about.base": "[A CONFIRMAR]",

      "work.label": "Work",
      "work.title": "Selected *projects*",
      "work.intro": "Content featuring apps and digital products.",
      "work.soon": "Video coming soon",
      "work.hint": "Add the video link in content.js",
      "work.watch": "Watch video",
      "work.post": "View post",
      "work.videoTitle": "{name} video",

      "services.label": "Services",
      "services.title": "What I *create*",
      "services.note": "Formats, deliverables and usage rights are defined for each project.",

      "contact.label": "Contact",
      "contact.title": "Let's create content for *your product*.",
      "contact.intro": "For collaborations, campaigns and briefs, reach out by email or social media.",
      "contact.email": "Email",
      "contact.copy": "Copy",
      "contact.copied": "Copied",
      "contact.send": "Send an email",
      "contact.missing": "[A CONFIRMAR]",

      "footer.role": "UGC Creator",
      "footer.top": "Back to top",

      "todo.label": "To confirm",
      "a11y.skip": "Skip to content",
      "a11y.home": "Thatiane Moura, home",
      "a11y.nav": "Main navigation",
      "a11y.lang": "Language"
    },

    pt: {
      "nav.work": "Trabalhos",
      "nav.about": "Sobre",
      "nav.services": "Serviços",
      "nav.contact": "Contato",
      "nav.menu": "Menu",
      "nav.close": "Fechar",

      "hero.eyebrow": "Tecnologia · IA · Apps",
      "hero.tagline": "UGC Creator | Tecnologia, IA & Experiências Digitais",
      "hero.intro": "Crio vídeos curtos que mostram como apps, ferramentas de IA e produtos digitais fazem parte do dia a dia. Claros, naturais e feitos para o celular.",
      "hero.ctaWork": "Ver meus trabalhos",
      "hero.ctaContact": "Entrar em contato",
      "hero.chipLeft": "IA · Apps · Tech",
      "hero.videoLabel": "Vídeo de apresentação",
      "hero.videoSoon": "Em breve",
      "hero.videoHint": "Adicione o link em content.js → introVideo",
      "hero.videoTag": "Apresentação",

      "ticker": ["Ferramentas de IA", "Apps", "Produtividade", "Lifestyle digital", "Software", "Inovação"],

      "about.label": "Sobre",
      "about.title": "Curiosa por tecnologia. *Atenta às pessoas que a usam.*",
      "about.p1": "Sou Thatiane Moura, brasileira, e migrei para a tecnologia e o UGC depois de uma trajetória no universo da beleza. Morei três anos fora do Brasil e sempre tive facilidade para me conectar com as pessoas.",
      "about.p2": "Hoje uno minhas duas paixões: comunicação e tecnologia. Pego um produto digital e mostro do jeito que uma pessoa real o descobriria, de forma simples, honesta e fácil de acompanhar.",
      "about.focusLabel": "Foco",
      "about.focus": "Ferramentas de IA · Apps · Tech",
      "about.formatLabel": "Formato",
      "about.format": "Vídeo vertical curto",
      "about.langLabel": "Idiomas",
      "about.lang": "Português (nativo) · Inglês · Árabe (básico)",
      "about.baseLabel": "Localização",
      "about.base": "[A CONFIRMAR]",

      "work.label": "Trabalhos",
      "work.title": "Projetos *selecionados*",
      "work.intro": "Conteúdos com apps e produtos digitais.",
      "work.soon": "Vídeo em breve",
      "work.hint": "Adicione o link do vídeo em content.js",
      "work.watch": "Assistir vídeo",
      "work.post": "Ver publicação",
      "work.videoTitle": "Vídeo {name}",

      "services.label": "Serviços",
      "services.title": "O que eu *crio*",
      "services.note": "Formatos, entregas e direitos de uso são definidos em cada projeto.",

      "contact.label": "Contato",
      "contact.title": "Vamos criar conteúdo para *o seu produto*.",
      "contact.intro": "Para parcerias, campanhas e briefings, fale comigo por e-mail ou redes sociais.",
      "contact.email": "E-mail",
      "contact.copy": "Copiar",
      "contact.copied": "Copiado",
      "contact.send": "Enviar e-mail",
      "contact.missing": "[A CONFIRMAR]",

      "footer.role": "UGC Creator",
      "footer.top": "Voltar ao topo",

      "todo.label": "A confirmar",
      "a11y.skip": "Pular para o conteúdo",
      "a11y.home": "Thatiane Moura, início",
      "a11y.nav": "Navegação principal",
      "a11y.lang": "Idioma"
    }
  }
};
