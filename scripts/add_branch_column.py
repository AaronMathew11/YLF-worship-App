import csv
import re

def normalize_song_name(name):
    """Normalize song name for matching by removing special characters and converting to lowercase"""
    # Remove quotes, asterisks, and other special characters
    normalized = re.sub(r'[^\w\s]', '', name.lower())
    # Remove extra whitespace
    normalized = ' '.join(normalized.split())
    return normalized

def extract_youtube_id(url_or_id):
    """Extract YouTube ID from URL or return the ID if it's already in ID format"""
    if 'youtu' in url_or_id:
        # Extract from URL
        match = re.search(r'(?:youtube\.com/watch\?v=|youtu\.be/)([a-zA-Z0-9_-]+)', url_or_id)
        return match.group(1) if match else url_or_id
    return url_or_id

# Read youtube songs (south branch songs)
south_songs = set()
youtube_ids_south = set()

with open('youtubeSongs.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if row['Song Name'].strip():  # Skip empty rows
            # Normalize song name for matching
            normalized_name = normalize_song_name(row['Song Name'])
            south_songs.add(normalized_name)
            
            # Also track by YouTube ID
            youtube_id = extract_youtube_id(row['Video ID'])
            youtube_ids_south.add(youtube_id)

# Read masterlist and add branch column
updated_rows = []

with open('masterlist.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames + ['Branch']
    
    for row in reader:
        # Normalize song name for matching
        normalized_name = normalize_song_name(row['Song Name'])
        youtube_id = row['YouTube ID']
        
        # Check if song is in south branch (either by name or YouTube ID)
        if normalized_name in south_songs or youtube_id in youtube_ids_south:
            row['Branch'] = 'Central, South'
        else:
            row['Branch'] = 'Central'
        
        updated_rows.append(row)

# Write updated masterlist
with open('masterlist.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(updated_rows)

print("Branch column added to masterlist.csv successfully!")
print(f"Total songs processed: {len(updated_rows)}")
print(f"Songs in both branches: {sum(1 for row in updated_rows if 'South' in row['Branch'])}")
print(f"Songs only in Central: {sum(1 for row in updated_rows if row['Branch'] == 'Central')}")