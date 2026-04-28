"""
Upload de imagens para Hygraph — cria assets frescos e faz upload imediato
"""
import json, urllib.request, urllib.error, os, time

TOKEN    = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3NzczMTk0ODQsImF1ZCI6WyJodHRwczovL2FwaS11cy13ZXN0LTIuaHlncmFwaC5jb20vdjIvY21vaGx2OXB1MTQ3OTA2cGsxYXpkMG1ucC9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC11cy13ZXN0LTIuaHlncmFwaC5jb20vIiwic3ViIjoiMGJhYTM0NzctYjc3OC00NTZkLTkzYzAtNDhjNDA2YTZlZTM2IiwianRpIjoiY21vaG00cXVkMTZ2ZzA4bG4zbGY2ZmFpbSJ9.CfVUO6vQpBkwL6CD-J1uItCmjTPurVKGupAzvT63B90su_Qz8RfvAIaT-BIQjRmY_7B8GPsMBO2J633np9GvEaAPCpBoH5aIq8CINPJDP96zGlDm6NB3XpE7NouUS9Ka0R8Eqr55cebJFROHAlosOlWjKrmhqUi4TMk-H3lt7U4YUfeTFI6xEoSZCFHPyODBdxSmbr6r8VNoPVbAsO8zIB0YQgpMjTi8J0fSeb_4_ku6ISbcJw5xajimUdKQbwC9-BFKKf4Og5PqUQ4DNkD1f5U-RsEIGULcuOY1LoKwpFyIUc4Nq8f4NU18AFRxBwEwbnrymt7mZl6akgkEugwc9XaWLCBy36IZLrtm5_HJwB-aUtJLtQ32Y3_tJxw0Ca-dmZ14UrQxta05DGMVL_W805BabjODS03rbAf2F1-hZB3tdM3F01SilYBE9A6en5i_PRcqZBYg1cVD0yf5XDvy3L8sgZj6CDB_WG06CgFKlBkbFi18KoKaLPMtKGNKV7r7E1tY1sxhDJqN2PgWNC_50AB7otwuXUYQVn4p02gg4E3zuyIVlxSnMVRVLeLXC4oN4t9I8RhIPJjpj36WdEngiKcr64jFaD-Pi-0aSwzNrOwWpH1cjGt5eszve1pnir63Cu2A_ILIBpVWO1hXpzsS2g4K_KMMuOKomyf4xRt_7aA"
ENDPOINT = "https://api-us-west-2.hygraph.com/v2/cmohlv9pu147906pk1azd0mnp/master"
IMG_DIR  = os.path.join(os.path.dirname(__file__), '..', 'blog-images')

POSTS = [
    {"post_id": "cmoip2v683gfm07mtuqbvsiot", "slug": "site-invisivel-ias-chatgpt-gemini",
     "img": os.path.join(IMG_DIR, "blog-cover-ias.jpg"),    "fname": "blog-cover-ias.jpg"},
    {"post_id": "cmoip2x0g3ggi07mt11hq1ebl", "slug": "cliente-entra-no-site-e-some",
     "img": os.path.join(IMG_DIR, "blog-cover-cliente.jpg"), "fname": "blog-cover-cliente.jpg"},
    {"post_id": "cmoip2ytx3ghk07mt4gal6xl2", "slug": "reforma-de-site-vs-site-novo",
     "img": os.path.join(IMG_DIR, "blog-cover-reforma.jpg"), "fname": "blog-cover-reforma.jpg"},
]

def gql(query, variables=None):
    body = json.dumps({"query": query, "variables": variables or {}}).encode()
    req  = urllib.request.Request(
        ENDPOINT, data=body,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {TOKEN}"}
    )
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        return {"errors": [{"message": f"HTTP {e.code}: {e.read()[:200]}"}]}

def s3_upload(url, rpd, img_path, fname):
    """POST multipart para S3 com campos do requestPostData"""
    boundary = "HygraphBoundary9901"

    # Campos obrigatórios na ordem exata (key deve vir primeiro)
    ordered_keys = ["key", "X-Amz-Algorithm", "X-Amz-Credential", "X-Amz-Date",
                    "X-Amz-Security-Token", "Policy", "X-Amz-Signature"]
    field_map = {
        "key":                  rpd["key"],
        "X-Amz-Algorithm":      rpd["algorithm"],
        "X-Amz-Credential":     rpd["credential"],
        "X-Amz-Date":           rpd["date"],
        "X-Amz-Security-Token": rpd.get("securityToken"),
        "Policy":               rpd["policy"],
        "X-Amz-Signature":      rpd["signature"],
    }

    parts = []
    for k in ordered_keys:
        v = field_map[k]
        if v is None:
            continue
        parts.append(
            f"--{boundary}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n"
            .encode("utf-8")
        )

    with open(img_path, "rb") as f:
        file_bytes = f.read()

    parts.append(
        (f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"{fname}\"\r\n\r\n"
         .encode("utf-8")) + file_bytes + b"\r\n"
    )
    parts.append(f"--{boundary}--\r\n".encode("utf-8"))
    body = b"".join(parts)

    req = urllib.request.Request(url, data=body, method="POST")
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, b""
    except urllib.error.HTTPError as e:
        return e.code, e.read()

for post in POSTS:
    print(f"\n─── {post['slug']} ───")

    # 1. Cria asset FRESCO
    res = gql("""
        mutation { createAsset(data: {}) {
            id upload { requestPostData {
                url date key signature algorithm policy credential securityToken
            }}
        }}
    """)
    if "errors" in res:
        print(f"  ERRO createAsset: {res['errors']}"); continue

    asset_id = res["data"]["createAsset"]["id"]
    rpd      = res["data"]["createAsset"]["upload"]["requestPostData"]
    s3_url   = rpd["url"]
    print(f"  Asset ID: {asset_id}")
    print(f"  S3 URL:   {s3_url[:60]}...")

    # 2. Upload S3 imediatamente
    code, body = s3_upload(s3_url, rpd, post["img"], post["fname"])
    print(f"  S3 upload: HTTP {code}")
    if code not in (200, 201, 204):
        print(f"  Resposta: {body[:400]}"); continue

    # Aguarda Hygraph processar o arquivo antes de publicar
    print(f"  Aguardando processamento...")
    time.sleep(4)

    # 3. Publica asset
    pub = gql("mutation P($id:ID!){publishAsset(where:{id:$id},to:PUBLISHED){id url}}", {"id": asset_id})
    if "errors" in pub:
        print(f"  ERRO publishAsset: {pub['errors']}"); continue
    print(f"  Asset publicado: {pub['data']['publishAsset'].get('url','')[:70]}")

    # 4. Atualiza coverImage do post
    upd = gql("""
        mutation U($pid:ID!,$aid:ID!){updatePost(
          where:{id:$pid}
          data:{coverImage:{connect:{id:$aid}}}
        ){id slug}}
    """, {"pid": post["post_id"], "aid": asset_id})
    if "errors" in upd:
        print(f"  ERRO updatePost: {upd['errors']}"); continue
    print(f"  Post atualizado: {upd['data']['updatePost']['slug']}")

    # 5. Republica post
    rpub = gql("mutation P($id:ID!){publishPost(where:{id:$id},to:PUBLISHED){id}}", {"id": post["post_id"]})
    if "errors" in rpub:
        print(f"  ERRO publishPost: {rpub['errors']}")
    else:
        print(f"  Post republicado ✓")

print("\n✓ Todos os posts atualizados!")
