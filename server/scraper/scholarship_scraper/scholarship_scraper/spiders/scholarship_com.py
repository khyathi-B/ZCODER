# import scrapy
# from pymongo import MongoClient
# import logging

# class ScholarshipsComSpider(scrapy.Spider):
#     name = "scholarships_com"
#     allowed_domains = ["scholarships.com"]
#     start_urls = [
#         "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory"
#     ]
#     custom_settings = {
#         'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
#         'DEFAULT_REQUEST_HEADERS': {
#             'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,/;q=0.8',
#             'Accept-Language': 'en-US,en;q=0.5',
#             'Referer': 'https://www.scholarships.com/',
#             'Upgrade-Insecure-Requests': '1',
       
#         }
    
#     }

#     async def start(self):
        
#         """
#         Override start_requests to explicitly set the User-Agent header.
#         """
#         headers = {
#             'User-Agent': self.custom_settings['USER_AGENT']
#         }
#         headers = {
#                 "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
#                 "Accept-Language": "en-US,en;q=0.9",
#                 "Accept-Encoding": "gzip, deflate, br",
#                 "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,/;q=0.8",
#                 "Referer": "https://www.scholarships.com/",
#                 "Connection": "keep-alive"
#         }

#         for url in self.start_urls:
#             yield scrapy.Request(url=url, headers=headers, callback=self.parse)

#     def _init_(self, *args, **kwargs):
#         super(ScholarshipsComSpider, self)._init_(*args, **kwargs)
#         # MongoDB setup
#         self.client = MongoClient("mongodb://localhost:27017/")
#         self.db = self.client.scholarshipDB
#         self.collection = self.db.scholarships
#         logging.info("Connected to MongoDB successfully.")

#     def parse(self, response):
#         """
#         Step 1: Scrape category links from the directory page.
#         """
#         category_links = response.css("#dir-list ul li a::attr(href)").getall()
#         logging.info(f"Found {len(category_links)} categories.")
#         for link in category_links:
#             yield response.follow(link, callback=self.parse_category)

#     def parse_category(self, response):
#         """
#         Step 2: Scrape subcategory links or, if none, directly scrape scholarships.
#         """
#         subcategory_links = response.css("div.two-col-grid a.blacklink::attr(href)").getall()
        
#         if subcategory_links:
#             logging.info(f"Found {len(subcategory_links)} subcategories.")
#             for link in subcategory_links:
#                 yield response.follow(link, callback=self.parse_scholarships)
#         else:
#             # Sometimes there's no subcategory, so scrape directly.
#             yield from self.parse_scholarships(response)

#     def parse_scholarships(self, response):
#         """
#         Step 3: Scrape scholarships on the page.
#         """
#         scholarships = response.css("table#award-grid.margin-top-twenty-five tbody tr")
#         logging.info(f"Found {len(scholarships)} scholarships on page.")

#         for scholarship in scholarships:
#             name = scholarship.css("td:nth-child(1) a.blacklink::text").get()
#             amount = scholarship.css("td:nth-child(2) span::text").get()
#             deadline = scholarship.css("td:nth-child(3) ::text").get()
#             link = scholarship.css("td:nth-child(1) a.blacklink::attr(href)").get()

#             # Normalize and clean data
#             name = name.strip() if name else "N/A"
#             amount = amount.strip() if amount else "N/A"
#             deadline = deadline.strip() if deadline else "N/A"
#             application_link = link.strip() if link else "N/A"
#             if application_link and not application_link.startswith("http"):
#                 application_link = "https://www.scholarships.com" + application_link

#             # Save to MongoDB
#             scholarship_doc = {
#                 "name": name,
#                 "amount": amount,
#                 "deadline": deadline,
#                 "applicationLink": application_link,
#                 "source": "Scholarships.com"
#             }

#             self.collection.insert_one(scholarship_doc)

#             yield scholarship_doc

#     def closed(self, reason):
#         self.client.close()
#         logging.info("Closed MongoDB connection.")
