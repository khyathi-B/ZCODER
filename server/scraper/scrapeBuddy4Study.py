# import requests
# from bs4 import BeautifulSoup
# from pymongo import MongoClient

# def scrape_buddy4study():
#     url = "https://www.fastweb.com/college-scholarships/articles"
#     headers = {
#         "User-Agent": "Mozilla/5.0"
#     }

#     print("Fetching scholarships from Buddy4Study...")
#     response = requests.get(url, headers=headers)
#     if response.status_code != 200:
#         print(f"Failed to get page: Status code {response.status_code}")
#         return

#     soup = BeautifulSoup(response.text, "html.parser")

#     # Connect to MongoDB
#     client = MongoClient("mongodb://localhost:27017/")
#     db = client.scholarshipDB
#     collection = db.scholarships
#     collection.delete_many({})  # Clear old data

#     # Find scholarship cards
#     # Try using 'a' tags with href containing '/scholarship/'
#     scholarships = soup.find_all("a", href=True)
#     count = 0

#     for sch in scholarships:
#         if "/scholarship/" in sch['href']:
#             try:
#                 # Name
#                 name_tag = sch.find("h4")
#                 name = name_tag.text.strip() if name_tag else "N/A"

#                 # Link
#                 link = "https://www.buddy4study.com" + sch['href']

#                 # Since dynamic content isn't fully available, we may not have amount or deadline here
#                 # We'll fetch the scholarship detail page for more info
#                 detail_response = requests.get(link, headers=headers)
#                 if detail_response.status_code != 200:
#                     continue

#                 detail_soup = BeautifulSoup(detail_response.text, "html.parser")

#                 # Extract description
#                 desc_tag = detail_soup.find("div", class_="scholarship-detail__description")
#                 description = desc_tag.text.strip() if desc_tag else "N/A"

#                 # Extract award amount
#                 amount = "N/A"
#                 award_tag = detail_soup.find("div", class_="scholarship-detail__award")
#                 if award_tag:
#                     amount = award_tag.text.strip()

#                 # Extract deadline
#                 deadline = "N/A"
#                 deadline_tag = detail_soup.find("div", class_="scholarship-detail__deadline")
#                 if deadline_tag:
#                     deadline = deadline_tag.text.strip()

#                 # Save
#                 scholarship_doc = {
#                     "name": name,
#                     "amount": amount,
#                     "deadline": deadline,
#                     "description": description,
#                     "applicationLink": link,
#                     "source": "Buddy4Study"
#                 }

#                 collection.insert_one(scholarship_doc)
#                 count += 1

#             except Exception as e:
#                 print(f"Error processing one scholarship: {e}")

#     print(f"Scraped and inserted {count} scholarships into MongoDB.")

# scrape_buddy4study()
# # import requests
# # from bs4 import BeautifulSoup
# # from pymongo import MongoClient
# # import time

# # # MongoDB setup

# # client = MongoClient('mongodb://localhost:27017/')
# # db = client['scholarshipDB']
# # collection = db['scholarships']

# # # Base URL for NSP
# # base_url = 'https://scholarships.gov.in/'

# # # URL to scrape
# # url = 'https://scholarships.gov.in/All-Scholarships'
# # headers = {'User-Agent': 'Mozilla/5.0'}

# # # Fetch the main scholarship page
# # response = requests.get(url, headers=headers)
# # soup = BeautifulSoup(response.content, 'html.parser')

# # # Locate the table containing scholarships
# # table = soup.find('table', class_='table')  # Adjust the class if needed

# # if table:
# #     rows = table.find_all('tr')
# #     for row in rows[1:]:  # Skip the header row
# #         cols = row.find_all('td')
# #         if len(cols) >= 2:
# #             name_tag = cols[1].find('a')
# #             name = name_tag.get_text(strip=True)
            
# #             # Construct detail page link
# #             detail_link = base_url + name_tag['href'] if name_tag and name_tag.has_attr('href') else None

# #             # Initialize details
# #             amount = 'N/A'
# #             deadline = 'N/A'
# #             description = 'N/A'

# #             # Fetch details from the individual scholarship page if available
# #             if detail_link:
# #                 try:
# #                     detail_response = requests.get(detail_link, headers=headers)
# #                     detail_soup = BeautifulSoup(detail_response.content, 'html.parser')
                    
# #                     # For demonstration, try finding amount and deadline if available
# #                     # Adjust these selectors based on the actual page structure!
# #                     # For example, they might be in <p> or <li> or a table
# #                     amount_tag = detail_soup.find(string=lambda text: 'Amount' in text)
# #                     deadline_tag = detail_soup.find(string=lambda text: 'Deadline' in text)

# #                     if amount_tag:
# #                         amount = amount_tag.find_next().get_text(strip=True)
# #                     if deadline_tag:
# #                         deadline = deadline_tag.find_next().get_text(strip=True)

# #                 except Exception as e:
# #                     print(f"Failed to fetch details from {detail_link}: {e}")

# #                 time.sleep(1)  # Polite delay between requests

# #             scholarship = {
# #                 'name': name,
# #                 'amount': amount,
# #                 'deadline': deadline,
# #                 'description': description,
# #                 'applicationLink': detail_link if detail_link else url,
# #                 'location': 'All',
# #                 'course': 'Others',
# #                 'grade': 0,
# #                 'incomeLimit': 0,
# #                 'specialCategory': 'None',
# #                 'source': 'National Scholarship Portal'
# #             }

# #             collection.insert_one(scholarship)
# #             print(f"Inserted: {name}")

# # else:
# #     print("No table found on the page.")

# # print("Scraping complete.")