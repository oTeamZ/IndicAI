import os
import random
import requests

BASE_URL = "https://api.themoviedb.org/3"

# lê suas variáveis de ambiente (exporte antes: export TMDB_API_KEY=... ou TMDB_TOKEN=...)
API_KEY = "1e6189fc9aa3a94fff0fc7073ffea01a"
TOKEN = "eyJhdWQiOiIxZTYxODlmYzlhYTNhOTRmZmYwZmM3MDczZmZlYTAxYSIsIm5iZiI6MTY1MTQ3MzU2MS4yODgsInN1YiI6IjYyNmY3Yzk5ZDEzMzI0MDA5ZTRjYWZmMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ"

def get_random_title(content_type="random"):
    """
    Retorna um filme ou série aleatório do TMDb.
    :param content_type: "movie", "tv" ou "random"
    """
    # sorteia tipo se for "random"
    if content_type == "random":
        content_type = random.choice(["movie", "tv"])

    url = f"{BASE_URL}/discover/{content_type}"

    # monta autenticação flexível
    headers = {"Authorization": f"Bearer {TOKEN}"} if TOKEN else {}
    params = {"api_key": API_KEY} if API_KEY else {}
    params["sort_by"] = "popularity.desc"

    # 1️⃣ obtém número total de páginas
    r = requests.get(url, headers=headers, params=params)
    r.raise_for_status()
    data = r.json()
    total_pages = min(data.get("total_pages", 1), 1000)  # máximo 1000 por limitação da API

    # 2️⃣ sorteia página e busca resultados
    params["page"] = random.randint(1, total_pages)
    r = requests.get(url, headers=headers, params=params)
    r.raise_for_status()
    results = r.json().get("results", [])

    if not results:
        return None

    # 3️⃣ sorteia item da lista
    choice = random.choice(results)
    item_id = choice["id"]

    # 4️⃣ obtém detalhes completos
    details_url = f"{BASE_URL}/{content_type}/{item_id}"
    r = requests.get(details_url, headers=headers, params=params)
    r.raise_for_status()
    details = r.json()

    # formata resposta
    return {
        "tipo": "Filme" if content_type == "movie" else "Série",
        "titulo": details.get("title") or details.get("name"),
        "sinopse": details.get("overview"),
        "data_lancamento": details.get("release_date") or details.get("first_air_date"),
        "poster": f"https://image.tmdb.org/t/p/w500{details.get('poster_path')}" if details.get("poster_path") else None,
        "id": details.get("id")
    }

# 🧠 Exemplo de uso:
if __name__ == "__main__":
    item = get_random_title("random")
    if item:
        print(f"🎬 {item['tipo']}: {item['titulo']}")
        print(f"📅 Lançamento: {item['data_lancamento']}")
        print(f"📝 Sinopse: {item['sinopse']}")
        print(f"🖼 Poster: {item['poster']}")
    else:
        print("Nenhum resultado encontrado.")
