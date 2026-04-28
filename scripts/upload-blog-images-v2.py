"""
Upload das imagens para assets JÁ CRIADOS no Hygraph (IDs da tentativa anterior)
e atualiza os posts.
"""
import json, urllib.request, urllib.error, os

TOKEN    = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3NzczMTk0ODQsImF1ZCI6WyJodHRwczovL2FwaS11cy13ZXN0LTIuaHlncmFwaC5jb20vdjIvY21vaGx2OXB1MTQ3OTA2cGsxYXpkMG1ucC9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC11cy13ZXN0LTIuaHlncmFwaC5jb20vIiwic3ViIjoiMGJhYTM0NzctYjc3OC00NTZkLTkzYzAtNDhjNDA2YTZlZTM2IiwianRpIjoiY21vaG00cXVkMTZ2ZzA4bG4zbGY2ZmFpbSJ9.CfVUO6vQpBkwL6CD-J1uItCmjTPurVKGupAzvT63B90su_Qz8RfvAIaT-BIQjRmY_7B8GPsMBO2J633np9GvEaAPCpBoH5aIq8CINPJDP96zGlDm6NB3XpE7NouUS9Ka0R8Eqr55cebJFROHAlosOlWjKrmhqUi4TMk-H3lt7U4YUfeTFI6xEoSZCFHPyODBdxSmbr6r8VNoPVbAsO8zIB0YQgpMjTi8J0fSeb_4_ku6ISbcJw5xajimUdKQbwC9-BFKKf4Og5PqUQ4DNkD1f5U-RsEIGULcuOY1LoKwpFyIUc4Nq8f4NU18AFRxBwEwbnrymt7mZl6akgkEugwc9XaWLCBy36IZLrtm5_HJwB-aUtJLtQ32Y3_tJxw0Ca-dmZ14UrQxta05DGMVL_W805BabjODS03rbAf2F1-hZB3tdM3F01SilYBE9A6en5i_PRcqZBYg1cVD0yf5XDvy3L8sgZj6CDB_WG06CgFKlBkbFi18KoKaLPMtKGNKV7r7E1tY1sxhDJqN2PgWNC_50AB7otwuXUYQVn4p02gg4E3zuyIVlxSnMVRVLeLXC4oN4t9I8RhIPJjpj36WdEngiKcr64jFaD-Pi-0aSwzNrOwWpH1cjGt5eszve1pnir63Cu2A_ILIBpVWO1hXpzsS2g4K_KMMuOKomyf4xRt_7aA"
ENDPOINT = "https://api-us-west-2.hygraph.com/v2/cmohlv9pu147906pk1azd0mnp/master"
IMG_DIR  = os.path.join(os.path.dirname(__file__), '..', 'blog-images')

# Assets criados na tentativa anterior + posts correspondentes
ITEMS = [
    {
        "asset_id": "cmoiq7oc33yem07n2k1cvkq36",
        "post_id":  "cmoip2v683gfm07mtuqbvsiot",
        "slug":     "site-invisivel-ias-chatgpt-gemini",
        "img":      os.path.join(IMG_DIR, "blog-cover-ias.jpg"),
        "filename": "blog-cover-ias.jpg",
    },
    {
        "asset_id": "cmoiq7pwv3ydf07mtbblm4nj2",
        "post_id":  "cmoip2x0g3ggi07mt11hq1ebl",
        "slug":     "cliente-entra-no-site-e-some",
        "img":      os.path.join(IMG_DIR, "blog-cover-cliente.jpg"),
        "filename": "blog-cover-cliente.jpg",
    },
    {
        "asset_id": "cmoiq7s073yfi07n2j4zifn0e",
        "post_id":  "cmoip2ytx3ghk07mt4gal6xl2",
        "slug":     "reforma-de-site-vs-site-novo",
        "img":      os.path.join(IMG_DIR, "blog-cover-reforma.jpg"),
        "filename": "blog-cover-reforma.jpg",
    },
]

def gql(query, variables=None):
    body = json.dumps({"query": query, "variables": variables or {}}).encode()
    req = urllib.request.Request(
        ENDPOINT, data=body,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {TOKEN}"}
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

GET_UPLOAD_URL = """
query GetAssetUpload($id: ID!) {
  asset(where: { id: $id }, stage: DRAFT) {
    id
    upload {
      status
      requestPostData {
        url date key signature algorithm policy credential securityToken
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

UPDATE_POST_COVER = """
mutation UpdatePostCover($postId: ID!, $assetId: ID!) {
  updatePost(
    where: { id: $postId }
    data: { coverImage: { connect: { id: $assetId } } }
  ) { id slug }
}
"""

PUBLISH_POST = """
mutation PublishPost($id: ID!) {
  publishPost(where: { id: $id }, to: PUBLISHED) { id }
}
"""

def s3_upload(url, fields, img_path, filename):
    boundary = "HygraphUpload7743"
    parts = []

    # Campos do form (sem Content-Type)
    for k, v in fields.items():
        if v is None:
            continue
        part = (
            f"--{boundary}\r\n"
            f"Content-Disposition: form-data; name=\"{k}\"\r\n\r\n"
            f"{v}\r\n"
        ).encode("utf-8")
        parts.append(part)

    # Arquivo
    with open(img_path, "rb") as f:
        file_bytes = f.read()

    file_part = (
        f"--{boundary}\r\n"
        f"Content-Disposition: form-data; name=\"file\"; filename=\"{filename}\"\r\n"
        f"\r\n"
    ).encode("utf-8") + file_bytes + b"\r\n"
    parts.append(file_part)

    parts.append(f"--{boundary}--\r\n".encode("utf-8"))
    body = b"".join(parts)

    req = urllib.request.Request(url, data=body, method="POST")
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
    req.add_header("Content-Length", str(len(body)))

    try:
        with urllib.request.urlopen(req) as r:
            return r.status, b""
    except urllib.error.HTTPError as e:
        return e.code, e.read()

for item in ITEMS:
    print(f"\n─── {item['slug']} ───")

    # 1. Busca URL de upload do asset já criado
    res = gql(GET_UPLOAD_URL, {"id": item["asset_id"]})
    if "errors" in res:
        print(f"  ERRO query: {res['errors']}")
        continue

    asset_data = res["data"]["asset"]
    if not asset_data:
        print(f"  Asset {item['asset_id']} não encontrado")
        continue

    upload = asset_data.get("upload")
    if not upload:
        print(f"  Asset sem upload pendente — pode já estar processado")
        # Tenta publicar diretamente e atualizar o post
    else:
        status = upload.get("status")
        rpd    = upload.get("requestPostData")
        print(f"  Status upload: {status}")

        if rpd and status in ("ASSET_CREATE_PENDING", None):
            fields = {
                "key":                  rpd["key"],
                "X-Amz-Algorithm":      rpd["algorithm"],
                "X-Amz-Credential":     rpd["credential"],
                "X-Amz-Date":           rpd["date"],
                "X-Amz-Security-Token": rpd.get("securityToken"),
                "Policy":               rpd["policy"],
                "X-Amz-Signature":      rpd["signature"],
            }
            code, body = s3_upload(rpd["url"], fields, item["img"], item["filename"])
            print(f"  S3 upload: HTTP {code}")
            if code not in (200, 201, 204):
                print(f"  Erro S3: {body[:400]}")
                continue
        else:
            print(f"  Pulando upload (status={status})")

    # 2. Publica asset
    pub = gql(PUBLISH_ASSET, {"id": item["asset_id"]})
    if "errors" in pub:
        print(f"  ERRO publishAsset: {pub['errors']}")
    else:
        print(f"  Asset publicado: {pub['data']['publishAsset'].get('url','?')}")

    # 3. Atualiza post
    upd = gql(UPDATE_POST_COVER, {"postId": item["post_id"], "assetId": item["asset_id"]})
    if "errors" in upd:
        print(f"  ERRO updatePost: {upd['errors']}")
        continue
    print(f"  Post atualizado: {upd['data']['updatePost']['slug']}")

    # 4. Republica post
    rpub = gql(PUBLISH_POST, {"id": item["post_id"]})
    if "errors" in rpub:
        print(f"  ERRO publishPost: {rpub['errors']}")
    else:
        print(f"  Post republicado OK")

print("\n✓ Concluído!")
