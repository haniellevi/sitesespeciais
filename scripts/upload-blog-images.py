"""
Upload das imagens de cover para o Hygraph e atualiza os posts
"""
import json, urllib.request, urllib.parse, os, mimetypes

TOKEN    = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3NzczMTk0ODQsImF1ZCI6WyJodHRwczovL2FwaS11cy13ZXN0LTIuaHlncmFwaC5jb20vdjIvY21vaGx2OXB1MTQ3OTA2cGsxYXpkMG1ucC9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC11cy13ZXN0LTIuaHlncmFwaC5jb20vIiwic3ViIjoiMGJhYTM0NzctYjc3OC00NTZkLTkzYzAtNDhjNDA2YTZlZTM2IiwianRpIjoiY21vaG00cXVkMTZ2ZzA4bG4zbGY2ZmFpbSJ9.CfVUO6vQpBkwL6CD-J1uItCmjTPurVKGupAzvT63B90su_Qz8RfvAIaT-BIQjRmY_7B8GPsMBO2J633np9GvEaAPCpBoH5aIq8CINPJDP96zGlDm6NB3XpE7NouUS9Ka0R8Eqr55cebJFROHAlosOlWjKrmhqUi4TMk-H3lt7U4YUfeTFI6xEoSZCFHPyODBdxSmbr6r8VNoPVbAsO8zIB0YQgpMjTi8J0fSeb_4_ku6ISbcJw5xajimUdKQbwC9-BFKKf4Og5PqUQ4DNkD1f5U-RsEIGULcuOY1LoKwpFyIUc4Nq8f4NU18AFRxBwEwbnrymt7mZl6akgkEugwc9XaWLCBy36IZLrtm5_HJwB-aUtJLtQ32Y3_tJxw0Ca-dmZ14UrQxta05DGMVL_W805BabjODS03rbAf2F1-hZB3tdM3F01SilYBE9A6en5i_PRcqZBYg1cVD0yf5XDvy3L8sgZj6CDB_WG06CgFKlBkbFi18KoKaLPMtKGNKV7r7E1tY1sxhDJqN2PgWNC_50AB7otwuXUYQVn4p02gg4E3zuyIVlxSnMVRVLeLXC4oN4t9I8RhIPJjpj36WdEngiKcr64jFaD-Pi-0aSwzNrOwWpH1cjGt5eszve1pnir63Cu2A_ILIBpVWO1hXpzsS2g4K_KMMuOKomyf4xRt_7aA"
ENDPOINT = "https://api-us-west-2.hygraph.com/v2/cmohlv9pu147906pk1azd0mnp/master"

IMG_DIR = os.path.join(os.path.dirname(__file__), '..', 'blog-images')

# post_id => imagem correspondente
POSTS = [
    {"id": "cmoip2v683gfm07mtuqbvsiot", "slug": "site-invisivel-ias-chatgpt-gemini",
     "img": os.path.join(IMG_DIR, "blog-cover-ias.jpg"),
     "filename": "blog-cover-ias.jpg"},
    {"id": "cmoip2x0g3ggi07mt11hq1ebl", "slug": "cliente-entra-no-site-e-some",
     "img": os.path.join(IMG_DIR, "blog-cover-cliente.jpg"),
     "filename": "blog-cover-cliente.jpg"},
    {"id": "cmoip2ytx3ghk07mt4gal6xl2", "slug": "reforma-de-site-vs-site-novo",
     "img": os.path.join(IMG_DIR, "blog-cover-reforma.jpg"),
     "filename": "blog-cover-reforma.jpg"},
]

def gql(query, variables=None):
    body = json.dumps({"query": query, "variables": variables or {}}).encode()
    req = urllib.request.Request(
        ENDPOINT, data=body,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {TOKEN}"}
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

CREATE_ASSET = """
mutation CreateAsset {
  createAsset(data: {}) {
    id
    upload {
      requestPostData {
        url
        date
        key
        signature
        algorithm
        policy
        credential
        securityToken
      }
    }
  }
}
"""

PUBLISH_ASSET = """
mutation PublishAsset($id: ID!) {
  publishAsset(where: { id: $id }, to: PUBLISHED) { id url }
}
"""

UPDATE_POST = """
mutation UpdatePost($postId: ID!, $assetId: ID!) {
  updatePost(
    where: { id: $postId }
    data: { coverImage: { disconnect: true, connect: { id: $assetId } } }
  ) { id slug }
}
"""

PUBLISH_POST = """
mutation PublishPost($id: ID!) {
  publishPost(where: { id: $id }, to: PUBLISHED) { id }
}
"""

def multipart_upload(url, post_data, file_path, filename):
    """Upload multipart/form-data S3-compatible"""
    import io, email.generator

    boundary = "----HygraphBoundary7743"

    parts = []
    for key, value in post_data.items():
        if value is None:
            continue
        parts.append(
            f'--{boundary}\r\n'
            f'Content-Disposition: form-data; name="{key}"\r\n\r\n'
            f'{value}\r\n'
        )

    # Adiciona o arquivo
    with open(file_path, 'rb') as f:
        file_data = f.read()

    file_header = (
        f'--{boundary}\r\n'
        f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'
        f'Content-Type: image/jpeg\r\n\r\n'
    )

    body = (''.join(parts) + file_header).encode('utf-8') + file_data + f'\r\n--{boundary}--\r\n'.encode()

    req = urllib.request.Request(url, data=body)
    req.add_header('Content-Type', f'multipart/form-data; boundary={boundary}')
    req.add_header('Content-Length', str(len(body)))

    try:
        with urllib.request.urlopen(req) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()

for post in POSTS:
    print(f"\n─── {post['slug']} ───")

    # 1. Cria asset e pega URL de upload
    res = gql(CREATE_ASSET)
    if "errors" in res:
        print(f"  ERRO createAsset: {res['errors']}")
        continue

    asset_id = res["data"]["createAsset"]["id"]
    upload   = res["data"]["createAsset"]["upload"]["requestPostData"]
    print(f"  Asset criado: {asset_id}")

    # 2. Monta form fields para S3 (sem Content-Type — não está na policy)
    post_data = {
        "key":                    upload["key"],
        "X-Amz-Algorithm":        upload["algorithm"],
        "X-Amz-Credential":       upload["credential"],
        "X-Amz-Date":             upload["date"],
        "X-Amz-Security-Token":   upload.get("securityToken"),
        "Policy":                 upload["policy"],
        "X-Amz-Signature":        upload["signature"],
    }

    # 3. Faz upload para S3
    s3_url  = upload["url"]
    status, body = multipart_upload(s3_url, post_data, post["img"], post["filename"])
    print(f"  Upload S3: HTTP {status}")
    if status not in (200, 201, 204):
        print(f"  Resposta S3: {body[:300]}")
        continue

    # 4. Publica asset
    pub = gql(PUBLISH_ASSET, {"id": asset_id})
    if "errors" in pub:
        print(f"  ERRO publishAsset: {pub['errors']}")
    else:
        asset_url = pub["data"]["publishAsset"]["url"]
        print(f"  Asset publicado: {asset_url}")

    # 5. Atualiza post com novo cover
    upd = gql(UPDATE_POST, {"postId": post["id"], "assetId": asset_id})
    if "errors" in upd:
        print(f"  ERRO updatePost: {upd['errors']}")
        continue
    print(f"  Post atualizado: {upd['data']['updatePost']['slug']}")

    # 6. Republica post
    rpub = gql(PUBLISH_POST, {"id": post["id"]})
    if "errors" in rpub:
        print(f"  ERRO publishPost: {rpub['errors']}")
    else:
        print(f"  Post republicado OK")

print("\n✓ Concluído!")
