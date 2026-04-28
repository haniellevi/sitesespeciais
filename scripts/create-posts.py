import json, urllib.request

TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3NzczMTk0ODQsImF1ZCI6WyJodHRwczovL2FwaS11cy13ZXN0LTIuaHlncmFwaC5jb20vdjIvY21vaGx2OXB1MTQ3OTA2cGsxYXpkMG1ucC9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC11cy13ZXN0LTIuaHlncmFwaC5jb20vIiwic3ViIjoiMGJhYTM0NzctYjc3OC00NTZkLTkzYzAtNDhjNDA2YTZlZTM2IiwianRpIjoiY21vaG00cXVkMTZ2ZzA4bG4zbGY2ZmFpbSJ9.CfVUO6vQpBkwL6CD-J1uItCmjTPurVKGupAzvT63B90su_Qz8RfvAIaT-BIQjRmY_7B8GPsMBO2J633np9GvEaAPCpBoH5aIq8CINPJDP96zGlDm6NB3XpE7NouUS9Ka0R8Eqr55cebJFROHAlosOlWjKrmhqUi4TMk-H3lt7U4YUfeTFI6xEoSZCFHPyODBdxSmbr6r8VNoPVbAsO8zIB0YQgpMjTi8J0fSeb_4_ku6ISbcJw5xajimUdKQbwC9-BFKKf4Og5PqUQ4DNkD1f5U-RsEIGULcuOY1LoKwpFyIUc4Nq8f4NU18AFRxBwEwbnrymt7mZl6akgkEugwc9XaWLCBy36IZLrtm5_HJwB-aUtJLtQ32Y3_tJxw0Ca-dmZ14UrQxta05DGMVL_W805BabjODS03rbAf2F1-hZB3tdM3F01SilYBE9A6en5i_PRcqZBYg1cVD0yf5XDvy3L8sgZj6CDB_WG06CgFKlBkbFi18KoKaLPMtKGNKV7r7E1tY1sxhDJqN2PgWNC_50AB7otwuXUYQVn4p02gg4E3zuyIVlxSnMVRVLeLXC4oN4t9I8RhIPJjpj36WdEngiKcr64jFaD-Pi-0aSwzNrOwWpH1cjGt5eszve1pnir63Cu2A_ILIBpVWO1hXpzsS2g4K_KMMuOKomyf4xRt_7aA"
ENDPOINT = "https://api-us-west-2.hygraph.com/v2/cmohlv9pu147906pk1azd0mnp/master"
ASSET_ID = "cmnf1yny56bxr07pbd8dh8z1z"
AUTHOR_ID = "cmnf1u3r46bhw07pbrjorhefy"
CAT_SITES = "cmoiogtwu37z807mtnwojx7oj"
CAT_SEO   = "cmoiogtww37zb07mt4vmjbpr8"
CAT_NEG   = "cmoiogtwx37ze07mtahkr4ufp"

def p(text): return {"type": "paragraph", "children": [{"text": text}]}
def h2(text): return {"type": "heading-two", "children": [{"text": text}]}
def h3(text): return {"type": "heading-three", "children": [{"text": text}]}
def li(text): return {"type": "list-item", "children": [{"type": "list-item-child", "children": [{"text": text}]}]}
def ul(*items): return {"type": "bulleted-list", "children": [li(i) for i in items]}

posts = [
    {
        "title": "Seu site esta invisivel para o ChatGPT e o Gemini — e isso esta custando clientes",
        "slug": "site-invisivel-ias-chatgpt-gemini",
        "date": "2026-04-15",
        "excerpt": "Em 2026, seu cliente pesquisa no Google E no ChatGPT. Sites antigos nao aparecem em nenhum dos dois. Veja quanto isso esta custando ao seu negocio.",
        "catId": CAT_SEO,
        "content": [
            p("Pensa comigo: quando voce quer saber qual e o melhor restaurante da cidade, o que voce faz?"),
            p("Em 2020, voce abria o Google e olhava os primeiros resultados."),
            p("Em 2026, metade das pessoas digita essa mesma pergunta no ChatGPT, no Gemini ou no Perplexity — e espera uma resposta direta, sem precisar clicar em dez sites."),
            h2("O problema que ninguem esta te contando"),
            p("Essas IAs nao inventam os negocios que recomendam. Elas leram a internet toda. E o que elas recomendam depende de um criterio simples: qual site tem informacoes claras, atualizadas e organizadas o suficiente para a IA entender e confiar."),
            p("Site velho, com estrutura quebrada, sem descricoes de servico, sem localizacao clara, sem avaliacoes visiveis — a IA simplesmente ignora. E como se voce nao existisse."),
            h2("O que acontece na pratica"),
            ul(
                "Alguem pesquisa 'melhor clinica em [sua cidade]' no ChatGPT — e o concorrente aparece, voce nao",
                "Alguem pergunta 'onde reformar site no Piaui' no Gemini — e quem tem site atualizado responde por voce",
                "Um cliente em potencial usa o Perplexity para comparar fornecedores — e voce esta fora da lista"
            ),
            p("Isso nao e teoria. E o que ja esta acontecendo enquanto voce le isso."),
            h2("A diferenca entre um site de 2020 e um de 2026"),
            p("Nao e so sobre visual. E sobre estrutura. Um site feito para 2026 tem:"),
            ul(
                "Informacoes de localizacao, horario e servicos que as IAs conseguem ler facilmente",
                "Conteudo em linguagem natural que responde as perguntas que os seus clientes fazem",
                "Velocidade: a IA prioriza fontes que carregam rapido",
                "Consistencia: mesmo nome, endereco e telefone em todo lugar"
            ),
            h2("O custo silencioso de nao fazer nada"),
            p("Cada semana que seu site fica parado e uma semana que alguem pesquisa pelo seu servico — e encontra o concorrente."),
            p("Nao precisa ser dramatico: basta calcular. Se seu ticket medio e R$ 500 e voce poderia receber 2 clientes a mais por mes pelo digital, sao R$ 12.000 por ano. Jogados fora por um site que ninguem ve."),
            h3("Quer saber quanto voce esta perdendo?"),
            p("Fazemos um diagnostico gratuito do seu site. Em menos de 30 minutos, voce sabe exatamente onde estao os vazamentos — e quanto cada um deles esta custando.")
        ]
    },
    {
        "title": "Por que seu cliente entra no site e nao entra em contato (e como resolver)",
        "slug": "cliente-entra-no-site-e-some",
        "date": "2026-04-22",
        "excerpt": "95% das visitas ao seu site saem sem fazer nada. Nao e azar — e problema de design. E tem solucao em menos de 14 dias.",
        "catId": CAT_SITES,
        "content": [
            p("Voce tem visitas. As vezes bastante. Mas quando voce olha os contatos recebidos pelo site... silencio."),
            p("Isso tem nome: e problema de conversao. E ele e mais comum do que parece."),
            h2("O que acontece na cabeca do cliente"),
            p("Um cliente potencial chega no seu site. Ele tem 3 segundos para decidir se fica ou vai embora. Nesse tempo, ele faz uma pergunta inconsciente:"),
            p('"Esse negocio resolve meu problema?"'),
            p("Se a resposta nao aparecer imediatamente — no titulo, no design, na primeira tela que ele ve — ele fecha. Vai para o Google. Clica no proximo resultado. Que provavelmente e o seu concorrente."),
            h2("Os 5 erros que fazem o cliente ir embora"),
            ul(
                "Titulo generico: 'Bem-vindo ao nosso site' nao diz nada a ninguem",
                "WhatsApp escondido: se precisa rolar a pagina para achar, voce ja perdeu",
                "Fotos ruins ou de banco de imagens: cliente percebe e desconfia",
                "Carrega devagar: acima de 3 segundos, 50% ja foram embora",
                "Mobile quebrado: 7 em cada 10 clientes estao no celular"
            ),
            h2("Quanto isso custa na pratica"),
            p("Se 100 pessoas visitam seu site por mes e apenas 2% entram em contato, voce tem 2 leads. Se consertar os problemas e ir para 5%, voce triplicou seus leads — sem gastar um centavo a mais em anuncios."),
            p("Para uma empresa com ticket de R$ 2.000, isso vale R$ 6.000+ por mes. Todo mes que o problema fica sem ser resolvido, esse dinheiro vai para o bolso do concorrente."),
            h2("A diferenca que um site de verdade faz"),
            p("Um site feito para converter nao e so bonito. E estrategico: cada elemento esta la por um motivo. O titulo resolve uma dor. O WhatsApp aparece tres vezes. As fotos sao reais. O carregamento e instantaneo."),
            p("E a diferenca entre um vendedor que fica calado e um que sabe exatamente o que dizer."),
            h3("Quer ver como o seu site esta hoje?"),
            p("Diagnostico gratuito. A gente analisa seu site e te mostra, em 30 minutos, os 3 maiores pontos de vazamento — e o que fazer em cada um deles.")
        ]
    },
    {
        "title": "Reforma de site ou site novo: quando vale cada um (e quanto custa cada opcao)",
        "slug": "reforma-de-site-vs-site-novo",
        "date": "2026-04-28",
        "excerpt": "Seu site esta ruim mas voce nao sabe se precisa reformar ou recomec ar do zero. Essa decisao pode economizar (ou desperdicar) R$ 3.000+. Veja os criterios.",
        "catId": CAT_SITES,
        "content": [
            p("'Meu site precisa de uma reforma. Mas falam que talvez seja melhor comecar do zero. O que e melhor?'"),
            p("E a pergunta que mais recebemos. E a resposta honesta e: depende. Mas nao de coisas complicadas — depende de 3 perguntas simples."),
            h2("Pergunta 1: O site esta no caminho certo ou na direcao errada?"),
            p("Se o problema e visual (esta feio, parece velho, design ultrapassado) — reforma resolve."),
            p("Se o problema e estrutural (nao aparece no Google, nao funciona no celular, nao foi pensado para converter) — reforma de cosmetico nao adianta. Voce precisa reconstruir a base."),
            h2("Pergunta 2: Qual e a base do site?"),
            ul(
                "WordPress com muitos plugins lentos e tema pago de terceiro — geralmente mais facil fazer novo do que limpar o existente",
                "Site em sistema proprio de agencia antiga onde voce nao tem acesso — praticamente obrigatorio recomec ar",
                "WordPress limpo, bem estruturado — reforma pode funcionar",
                "Site estatico antigo sem gerenciador de conteudo — analise caso a caso"
            ),
            h2("Pergunta 3: Quanto do conteudo e reaproveitavel?"),
            p("Fotos boas, textos que funcionam, depoimentos, portfolio — se isso existe, vale preservar. Se nao existe ou esta ultrapassado, voce vai reescrever tudo de qualquer forma. Ai a reforma vira um site novo com casca velha."),
            h2("Os precos na pratica"),
            p("Na Sites Especiais:"),
            ul(
                "Reforma de site: a partir de R$ 1.997 — estrutura preservada, visual novo, otimizacao para celular e Google",
                "Site novo premium: a partir de R$ 2.997 — do zero, com identidade visual, estrutura pensada para converter"
            ),
            p("A diferenca de R$ 1.000 entre os dois quase sempre se paga no primeiro mes — seja pelo lead que nao sairia de um site reformado corretamente, seja pelo cliente que voltaria de um site novo com qualidade visual."),
            h2("Como escolher sem errar"),
            p("Se voce ainda tem duvida, a resposta mais segura e: agende o diagnostico gratuito. Em 30 minutos, a gente olha seu site atual e te diz, com honestidade, qual opcao faz mais sentido para o seu caso — e por que."),
            p("Nenhum compromisso. Sem pressao de vendas. So o diagnostico.")
        ]
    }
]

def graphql(query, variables=None):
    body = json.dumps({"query": query, "variables": variables or {}}).encode()
    req = urllib.request.Request(
        ENDPOINT, data=body,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {TOKEN}"}
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

CREATE_POST = """
mutation CreatePost($data: PostCreateInput!) {
  createPost(data: $data) { id title slug }
}
"""
PUBLISH_POST = """
mutation PublishPost($id: ID!) {
  publishPost(where: { id: $id }, to: PUBLISHED) { id }
}
"""
PUBLISH_CAT = """
mutation PublishCat($id: ID!) {
  publishCategory(where: { id: $id }, to: PUBLISHED) { id }
}
"""

print("=== Publicando categorias ===")
for cat_id in [CAT_SITES, CAT_SEO, CAT_NEG]:
    res = graphql(PUBLISH_CAT, {"id": cat_id})
    if "errors" in res:
        print(f"  ERROR {cat_id}: {res['errors']}")
    else:
        print(f"  OK: {res['data']}")

print("\n=== Criando posts ===")
for post in posts:
    data = {
        "title": post["title"],
        "slug": post["slug"],
        "date": post["date"],
        "excerpt": post["excerpt"],
        "content": {"children": post["content"]},
        "coverImage": {"connect": {"id": ASSET_ID}},
        "author": {"connect": {"id": AUTHOR_ID}},
        "category": {"connect": [{"id": post["catId"]}]}
    }
    res = graphql(CREATE_POST, {"data": data})
    if "errors" in res:
        print(f"  ERROR {post['slug']}: {res['errors']}")
        continue
    pid = res["data"]["createPost"]["id"]
    print(f"  Created: {post['slug']} (id={pid})")
    pub = graphql(PUBLISH_POST, {"id": pid})
    if "errors" in pub:
        print(f"  PUBLISH ERROR: {pub['errors']}")
    else:
        print(f"  Published OK")

print("\nDone.")
