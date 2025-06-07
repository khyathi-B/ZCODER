import scrapy
from pymongo import MongoClient
#import logging
#import re

class FastwebSpider(scrapy.Spider):
    name = "fastweb"
    allowed_domains = ["fastweb.com"]
    start_urls = [
        "https://www.fastweb.com/college-scholarships"
        
    ]

    

    def parse(self, response):
        # Extract all text from the page
        client = MongoClient("mongodb://localhost:27017/")
        db = client.scholarshipDB
        collection = db.scholarshipsavail

        scholarships = response.css("div#featured-scholarships div.grid-x.featured-scholarship-row")

        if not scholarships:
            self.logger.info(f"No scholarships found on {response.url}")

        for scholarship in scholarships:
            try:
                name_tag=scholarship.css("div.cell.large-6.scholarship-name h3 a")
                name=name_tag.css("::text").get(default="N/A").strip()
                
                link=name_tag.attrib.get("href","")
                if link and not link.startswith("http"):
                    link=response.urljoin(link)
                amount=scholarship.css("div.cell.large-2.medium-4.small-12.award-amount::text").get(default="N/A").strip()
                deadline=scholarship.css("div.cell.large-2.medium-4.small-12.award-deadline::text").get(default="N/A").strip()
                scholarship_doc={
                    "name": name,
                    "link": link,
                    "amount":amount,
                    "deadline": deadline,
                    "source": "Fast-web",
                    "location": "USA"
                }
                collection.insert_one(scholarship_doc)
                self.logger.info(f"Inserted: {name}")
            except Exception as e:
                self.logger.error(f"Error processing scholarship:{e}")
        self.logger.info("Finished scraping Fastweb")

        


    # def closed(self, reason):
    #     # Close MongoDB connection
    #     self.client.close()







