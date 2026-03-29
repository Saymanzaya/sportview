import requests

def search_team(name: str):
    url = "https://www.thesportsdb.com/api/v1/json/3/searchteams.php"
    params = {"t": name}
    r = requests.get(url, params=params)
    return r.json()
