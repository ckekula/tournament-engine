import requests
from bs4 import BeautifulSoup
import json
import time
from urllib.parse import urljoin

BASE_URL = "https://www.olympiandatabase.com"
GAMES_URL = "https://www.olympiandatabase.com/index.php?id=278979&L=1"

def get_soup(url):
    """Fetch and parse a URL"""
    try:
        response = requests.get(url)
        response.raise_for_status()
        return BeautifulSoup(response.content, 'html.parser')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def scrape_games():
    """Scrape the list of Olympic games"""
    print("Fetching Olympic games list...")
    soup = get_soup(GAMES_URL)
    if not soup:
        return []
    
    games = []
    main_container = soup.find('div', class_='main_container')
    if not main_container:
        print("Main container not found")
        return []
    
    tables = main_container.find_all('table')
    if len(tables) < 2:
        print("Second table not found")
        return []
    table = tables[1]
    
    # tbody = table.find('tbody')
    # if not tbody:
    #     print("Tbody not found")
    #     return []
    
    rows = table.find_all('tr')
    for row in rows:
        tds = row.find_all('td')
        if len(tds) < 2:
            continue
        
        second_td = tds[1]
        font = second_td.find('font')
        if not font:
            continue
        
        a_tag = font.find('a')
        if not a_tag:
            continue
        
        u_tag = a_tag.find('u')
        if not u_tag:
            continue
        
        game_name = u_tag.get_text(strip=True)
        game_link = a_tag.get('href')
        
        if game_link:
            full_link = urljoin(BASE_URL, game_link)
            games.append({
                'name': game_name,
                'url': full_link
            })
            print(f"Found game: {game_name}")
    
    return games

def scrape_sports(game_url):
    """Scrape sports for a specific Olympic game"""
    print(f"Fetching sports from: {game_url}")
    soup = get_soup(game_url)
    if not soup:
        return []
    
    sports = []
    main_container = soup.find('div', class_='main_container')
    if not main_container:
        return []
    
    tables = main_container.find_all('table')
    if len(tables) < 2:
        print("Second table not found")
        return []
    table = tables[1]
    
    rows = table.find_all('tr')
    for row in rows:
        tds = row.find_all('td')
        if len(tds) < 2:
            continue
        
        second_td = tds[1]
        font = second_td.find('font')
        if not font:
            continue
        
        a_tag = font.find('a')
        if not a_tag:
            continue
        
        sport_name = a_tag.get_text(strip=True)
        sport_link = a_tag.get('href')
        
        if sport_link:
            full_link = urljoin(BASE_URL, sport_link)
            sports.append({
                'name': sport_name,
                'url': full_link
            })
            print(f"  Found sport: {sport_name}")
    
    return sports

def scrape_events(sport_url):
    """Scrape events for a specific sport"""
    print(f"    Fetching events from: {sport_url}")
    soup = get_soup(sport_url)
    if not soup:
        return []
    
    events = []
    main_container = soup.find('div', class_='main_container')
    if not main_container:
        return []
    
    frame_space = main_container.find('div', class_='frame_space_grid')
    if not frame_space:
        return []
    
    container = frame_space.find('container')
    if not container:
        return []
    
    main_div = container.find('main')
    if not main_div:
        return []
    
    champs_div = main_div.find('div', class_='champs')
    if not champs_div:
        return []
    
    grid_items = champs_div.find_all('div', class_='grid_champs_item1')
    for item in grid_items:
        p_tag = item.find('p')
        if not p_tag:
            continue
        
        u_tag = p_tag.find('u')
        if not u_tag:
            continue
        
        a_tag = u_tag.find('a')
        if not a_tag:
            continue
        
        event_name = a_tag.get_text(strip=True)
        event_link = a_tag.get('href')
        
        if event_link:
            full_link = urljoin(BASE_URL, event_link)
            events.append({
                'name': event_name,
                'url': full_link
            })
            print(f"      Found event: {event_name}")
    
    return events

def scrape_all_data():
    """Main function to scrape all Olympic data"""
    all_data = []
    
    # Get all games
    games = scrape_games()
    print(f"\nFound {len(games)} Olympic games\n")
    
    # For each game, get sports
    for game in games:
        game_data = {
            'game_name': game['name'],
            'game_url': game['url'],
            'sports': []
        }
        
        sports = scrape_sports(game['url'])
        time.sleep(1)  # Be polite to the server
        
        # For each sport, get events
        for sport in sports:
            sport_data = {
                'sport_name': sport['name'],
                'sport_url': sport['url'],
                'events': []
            }
            
            events = scrape_events(sport['url'])
            sport_data['events'] = events
            game_data['sports'].append(sport_data)
            
            time.sleep(1)  # Be polite to the server
        
        all_data.append(game_data)
    
    return all_data

if __name__ == "__main__":
    print("Starting Olympic database scraping...\n")
    
    data = scrape_all_data()
    
    # Save to JSON file
    output_file = 'olympic_data.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\nScraping complete! Data saved to {output_file}")
    print(f"Total games scraped: {len(data)}")
    
    # Print summary
    total_sports = sum(len(game['sports']) for game in data)
    total_events = sum(len(sport['events']) for game in data for sport in game['sports'])
    print(f"Total sports: {total_sports}")
    print(f"Total events: {total_events}")