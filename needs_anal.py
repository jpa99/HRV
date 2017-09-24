from aylienapiclient import textapi
import json, math
import collections


url = "https://api.harveyneeds.org/api/v1/needs"
client = textapi.Client("781abcba", "9931de93c67949c0b5a37797b1191bea")

# Returns array of tuples containing category title and score (probability)
def extract_category(text):
	if len(text) == 0:
		return 0
	classification = client.ClassifyByTaxonomy({'text':text, 'taxonomy':'iab-qag'})['categories']
	category_list = []
	if len(classification) !=0:
		for category in classification:
		    category_list.append((category['label'], category['score']))
	return [('neutral', 1)]

# Returns array of tuples containing sentiment value (1, 0, -1) and confidence (probability)
def extract_sentiment(text):
    sentiment = client.Sentiment({'text':text})
    polarity_map = {'positive': 1, 'neutral': 0, 'negative': -1}
    return (polarity_map[sentiment['polarity']], sentiment['polarity_confidence'])

"""
jsonurl = urlopen(url)
text = json.loads(jsonurl.read())

needs_json = []
shelters_json = []
needslist = []
shelterslist = []

for entry in needs_json:
	need = [entry['id'], entry['are_volunteers_needed'], entry['tell_us_about_the_volunteer_needs'], entry['are_supplies_needed'], entry['tell_us_about_the_suppy_needs'], entry['anything_else_you_would_like_to_tell_us']]
	needslist.append(need)
	
for entry in shelters_json:
	shelter = [entry['id'], entry['accepting'], entry['notes'], entry['volunteer_needs'], entry['supply_needs']]
	shelterslist.append(need)
"""

def default():
	return 0

hierarchy = collections.defaultdict(default)
hierarchy['Health & Fitness'] = 10
hierarchy['Food & Drink'] = 10
hierarchy['Home & Garden'] = 8
hierarchy['Family & Parenting'] = 7
hierarchy['Automotive'] = 7
hierarchy['Business'] = 7
hierarchy['Education'] = 5
hierarchy['Law, Gov\'t & Politics'] = 5
hierarchy['Careers'] = 3
hierarchy['Arts & Entertainment'] = 1
hierarchy['Hobbies & Interests'] = 1
hierarchy['News'] = 1

category_weight = 0.65
sentiment_weight = 1-category_weight


def category_value(text):
	categories = extract_category(text)
	prod = 0
	for i in range(len(categories)):
		prod+=hierarchy[categories[i][0]]*categories[i][1]
	prod/=10.0*len(categories)
	return prod

# Gives value between 0 and 1 (inclusive)
def sentiment_value(text):
	sentiment = extract_sentiment(text)
	return 0.5*sentiment[0]*sentiment[1] + 0.5

def val(text):
	if text=="":
		return 0
	return sentiment_weight*sentiment_value(text) + category_weight*category_value(text)
	
strings = ["need everything -- food, shelter, water, clothes, blankets.etc.", "baby items, adult diapers, water, nonperishable food, cleaning supplies, hygiene products, anything but clothes, have enough clothes", "Cleaning supplies, gloves, bleach, mops, brooms, rakes, large trash bags; Non-perishable foods; toiletries, bath soap, shaving items, deoderant, shampoos; any kind of pet food for dogs \u0026 cats; not accepting clothes - do not need.", "do not need anything, have enough"]

for string in strings:
	print(val(string))


		
	
	
	

	


	

	
